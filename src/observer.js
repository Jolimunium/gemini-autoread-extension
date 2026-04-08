"use strict";

/**
 * GAR_Observer: Manages the MutationObserver and the core auto-read playback logic.
 * Watches for new Gemini response volume icons and triggers audio playback automatically.
 */
const GAR_Observer = (() => {
  const state = GAR_State.data;
  const { DOM, Logger } = GAR_Utils;

  // ─── Playback Helpers ───────────────────────────────────

  /**
   * Checks if the Gemini UI is currently playing audio via a pre-queried pause icon list.
   * @param {NodeList} pauseIcons - Result of querySelectorAll(PAUSE_ICON).
   * @returns {boolean} True if audio is already playing.
   */
  const checkAlreadyReading = (pauseIcons) => {
    if (pauseIcons.length > 0) {
      Logger.log(
        state.debugMode,
        "Auto-read: Already reading (Pause icon found).",
      );
      return true;
    }
    Logger.log(
      state.debugMode,
      "Auto-read: Not reading (Pause icon not found).",
    );
    return false;
  };

  /**
   * Attempts to trigger playback using a pre-queried volume icon list.
   * Waits for the pause icon to confirm playback has started.
   * @param {NodeList} volumeIcons - Result of querySelectorAll(VOLUME_ICON).
   * @returns {Promise<boolean>} True if playback was successfully triggered.
   */
  const tryTriggerPlay = async (volumeIcons) => {
    if (volumeIcons.length === 0) {
      Logger.log(state.debugMode, "Auto-read: No volume_up icon found.");
      return false;
    }

    const vIcon = volumeIcons[volumeIcons.length - 1];
    const vBtn = vIcon.closest("button");

    if (vBtn) {
      vBtn.click();
      Logger.log(state.debugMode, "Auto-read: Clicked volume_up (vBtn).");
    } else {
      vIcon.click();
      Logger.log(state.debugMode, "Auto-read: Clicked volume_up (vIcon).");
    }

    // waitForState polls fresh queries intentionally — it must detect state change over time.
    const isPlaying = await DOM.waitForState(
      () =>
        document.querySelectorAll(GAR_Config.SELECTORS.PAUSE_ICON).length > 0,
      GAR_Config.TIMINGS.WAIT_TIMEOUT,
    );
    Logger.log(
      state.debugMode,
      `Auto-read: ${isPlaying ? "Successfully started" : "State transition timeout"}.`,
    );
    return isPlaying;
  };

  // ─── Auto-Read Process ──────────────────────────────────

  /** Guard flag to prevent multiple concurrent auto-read processes. */
  let isProcessing = false;

  /**
   * Core auto-read logic. Retries up to `maxAttempts` times to trigger playback.
   * Queries both pause and volume icons once per iteration to avoid redundant DOM lookups.
   * Updates the mic icon state to reflect working, normal (success), or error.
   * @param {HTMLElement|null} trackingNode - The DOM node to mark as processed.
   * @returns {Promise<void>}
   */
  const processAutoRead = async (trackingNode) => {
    if (!state.isAutoReadEnabled || isProcessing) return;
    isProcessing = true;

    try {
      if (trackingNode) {
        trackingNode.dataset.garProcessed = "true";
      }

      Logger.log(state.debugMode, "Process: Starting auto-read logic...");
      GAR_UI.setMicState("working");
      await DOM.sleep(GAR_Config.TIMINGS.SLEEP_INTERVAL);

      for (let i = 1; i <= state.maxAttempts; i++) {
        Logger.log(
          state.debugMode,
          `Process: Attempt ${i}/${state.maxAttempts}`,
        );

        // Query both collections once per iteration — results passed into helpers below.
        const pauseIcons = document.querySelectorAll(
          GAR_Config.SELECTORS.PAUSE_ICON,
        );
        const volumeIcons = document.querySelectorAll(
          GAR_Config.SELECTORS.VOLUME_ICON,
        );

        if (checkAlreadyReading(pauseIcons)) {
          GAR_UI.setMicState("normal");
          return;
        }
        if (await tryTriggerPlay(volumeIcons)) {
          GAR_UI.setMicState("normal");
          return;
        }
        await DOM.sleep(GAR_Config.TIMINGS.SLEEP_INTERVAL);
      }

      Logger.log(
        state.debugMode,
        `Auto-read: Failed after ${state.maxAttempts} attempts.`,
      );
      GAR_UI.setMicState("error");
    } finally {
      isProcessing = false;
    }
  };

  // ─── Mutation Observer ──────────────────────────────────

  /** The active MutationObserver instance watching for new Gemini responses. */
  let activeObserver = null;

  /**
   * Inspects DOM mutations to check whether a new volume icon was added.
   * @param {MutationRecord[]} mutations - List of DOM mutation records.
   * @returns {boolean} True if a volume icon was found in the added nodes.
   */
  const isVolumeIconAdded = (mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (
          node.matches?.(GAR_Config.SELECTORS.VOLUME_ICON) ||
          node.querySelector?.(GAR_Config.SELECTORS.VOLUME_ICON)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  /**
   * Fired after the debounce delay when a new volume icon is detected in the DOM.
   * Checks for a new, unprocessed icon and triggers auto-read if found.
   */
  const handleMutationAdded = () => {
    const volumeIcons = document.querySelectorAll(
      GAR_Config.SELECTORS.VOLUME_ICON,
    );
    if (volumeIcons.length === 0) return;

    const lastIcon = volumeIcons[volumeIcons.length - 1];
    const trackingNode =
      lastIcon.closest("button")?.parentElement || lastIcon.parentElement;

    if (trackingNode && !trackingNode.dataset.garProcessed) {
      Logger.log(
        state.debugMode,
        "Observer: New volume read icon detected, processing...",
      );
      processAutoRead(trackingNode);
    }
  };

  return {
    /**
     * Connects or disconnects the MutationObserver based on the current auto-read state.
     * Uses the narrowest available DOM container as the observation target to minimize
     * unnecessary callback invocations. Falls back to document.body if the chat area
     * is not yet in the DOM.
     * Clears any pending debounce timer when disabling.
     */
    toggle: () => {
      if (!activeObserver) return;

      // Always disconnect first to avoid stacking observations if the target changes.
      activeObserver.disconnect();

      if (!state.isAutoReadEnabled) {
        if (state.timeoutId) {
          clearTimeout(state.timeoutId);
          state.timeoutId = null;
        }
        return;
      }

      // Prefer the narrowest available container to reduce mutation noise.
      // CHAT_CONTAINER covers the main message area; fallback covers older Gemini layouts.
      const chatContainer =
        document.querySelector(GAR_Config.SELECTORS.CHAT_CONTAINER) ||
        document.querySelector(GAR_Config.SELECTORS.CHAT_CONTAINER_FALLBACK) ||
        document.body;

      Logger.log(
        state.debugMode,
        `Observer: Connecting to <${chatContainer.tagName?.toLowerCase() ?? "body"}>`,
      );

      activeObserver.observe(chatContainer, {
        childList: true,
        subtree: true,
        attributes: false,
      });
    },

    /**
     * Triggers an immediate check for an existing unprocessed volume icon on the page.
     * Used when auto-read is turned ON to catch icons that are already in the DOM.
     */
    checkExisting: handleMutationAdded,

    /**
     * Creates the MutationObserver with a debounced callback and starts observing.
     */
    setup: () => {
      const observerCallback = (mutations) => {
        if (!state.isAutoReadEnabled) return;
        if (!isVolumeIconAdded(mutations)) return;

        if (state.timeoutId) clearTimeout(state.timeoutId);
        state.timeoutId = setTimeout(handleMutationAdded, state.debounceTime);
      };

      activeObserver = new MutationObserver(observerCallback);
      GAR_Observer.toggle();
    },
  };
})();
