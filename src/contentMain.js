"use strict";

/**
 * GAR_App: The main application entry point for Gemini Auto-Read.
 * Bootstraps all modules in the correct order and exposes the top-level
 * toggleAutoRead action. All observer, shortcut, and storage logic is
 * delegated to their respective modules (GAR_Observer, GAR_Shortcuts, GAR_Storage).
 */
const GAR_App = (() => {
  const state = GAR_State.data;
  const { Logger } = GAR_Utils;

  // ─── Health Check ───────────────────────────────────────

  /**
   * Runs only in debug mode. Waits for the page to load and then verifies
   * that critical Gemini UI selectors are present on screen.
   * @returns {Promise<void>}
   */
  const performHealthCheck = async () => {
    if (!state.debugMode) return;

    await GAR_Utils.DOM.sleep(GAR_Config.TIMINGS.WAIT_TIMEOUT);

    const isChatPage = /^\/app\/.+/.test(globalThis.location.pathname);
    const containerSelector = `${GAR_Config.SELECTORS.CHAT_CONTAINER}, ${GAR_Config.SELECTORS.CHAT_CONTAINER_FALLBACK}`;
    const volumeSelector = GAR_Config.SELECTORS.VOLUME_ICON;

    if (isChatPage) {
      await GAR_Utils.DOM.waitForState(
        () =>
          document.querySelector(containerSelector) ||
          document.querySelector(volumeSelector),
        GAR_Config.TIMINGS.WAIT_TIMEOUT,
      );
    }

    const selectors = [
      { name: "Chat Container", selector: containerSelector },
      { name: "Volume Icon", selector: volumeSelector },
    ];

    const missing = selectors
      .filter((el) => !document.querySelector(el.selector))
      .map((el) => el.name);

    if (missing.length === 0) {
      Logger.log(true, "Health Check: All essential elements found.");
    } else if (isChatPage) {
      Logger.log(
        true,
        `Health Check: Note - ${missing.join(", ")} not found yet. (Normal if no chat response is visible or loading slowly)`,
      );
    }
  };

  // ─── Public API ─────────────────────────────────────────

  return {
    /**
     * Toggles the auto-read feature on/off and saves the updated state.
     * Also immediately checks for an existing volume icon if turning on.
     */
    toggleAutoRead: () => {
      state.isAutoReadEnabled = !state.isAutoReadEnabled;
      GAR_State.save();
      GAR_UI.updateToggle();
      GAR_Observer.toggle();
      Logger.log(state.debugMode, `Toggle: ${state.isAutoReadEnabled ? "ON" : "OFF"}`);

      // If turning ON, immediately process any existing volume icon on the page
      if (state.isAutoReadEnabled) {
        GAR_Observer.checkExisting();
      }
    },

    /**
     * Bootstraps the entire extension in the correct order:
     * 1. Loads state from storage.
     * 2. Sets up cross-tab sync listeners.
     * 3. Mounts the UI into the page.
     * 4. Registers shortcuts and activates the observer.
     * @returns {Promise<void>}
     */
    init: async () => {
      // 1. Initialize State
      await GAR_State.init();

      // 2. Add listener for cross-tab sync
      GAR_State.listenToChanges(() => {
        GAR_UI.updateToggle();
        GAR_Observer.toggle();
      }, GAR_UI.refreshSettings);

      // 3. Mount UI
      GAR_UI.init(GAR_App.toggleAutoRead);

      // 4. Register shortcuts and start observer
      GAR_Shortcuts.register(GAR_App.toggleAutoRead);
      GAR_Observer.setup();

      if (state.isAutoReadEnabled) {
        performHealthCheck();
        console.log("Gemini Auto-Read Started (Active).");
      } else {
        console.log("Gemini Auto-Read Inactive.");
      }
    },
  };
})();

// Start App
GAR_App.init();
