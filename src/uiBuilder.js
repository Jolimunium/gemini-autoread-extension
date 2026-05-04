"use strict";

/**
 * GAR_UI: Responsible for building and managing the Extension's User Interface.
 * Handles the floating toggle button, settings panel, and real-time UI updates.
 */
const GAR_UI = (() => {
  const { createEl } = GAR_Utils.DOM;
  const state = GAR_State.data;
  let shadowRoot = null;

  // ─── DOM State Updaters ─────────────────────────────────

  /**
   * Updates the floating toggle button UI based on current state.
   * Modifies border color and status text (ON/OFF).
   */
  const updateToggleUI = () => {
    if (!shadowRoot) return;
    const statusSpan = shadowRoot.getElementById("status-text");
    const container = shadowRoot.getElementById("gemini-autoread-toggle");
    if (statusSpan && container) {
      statusSpan.textContent = state.isAutoReadEnabled ? "ON" : "OFF";
      statusSpan.style.color = state.isAutoReadEnabled
        ? GAR_Config.COLORS.GREEN
        : GAR_Config.COLORS.RED;
      container.style.borderColor = state.isAutoReadEnabled
        ? GAR_Config.COLORS.GREEN
        : GAR_Config.COLORS.RED;
    }
  };

  /**
   * Refreshes all values in the settings panel DOM based on the current state.
   */
  const refreshSettings = () => {
    if (!shadowRoot) return;

    /**
     * Helper to set input value by ID.
     * @param {string} id - Element ID.
     * @param {any} val - Value to set.
     */
    const setVal = (id, val) => {
      const el = shadowRoot.getElementById(id);
      if (el) el.value = val;
    };

    /**
     * Helper to set checkbox state by ID.
     * @param {string} id - Element ID.
     * @param {boolean} checked - Checked state.
     */
    const setChecked = (id, checked) => {
      const el = shadowRoot.getElementById(id);
      if (el) el.checked = checked;
    };

    /**
     * Helper to set text content by ID.
     * @param {string} id - Element ID.
     * @param {string} text - Text content.
     */
    const setText = (id, text) => {
      const el = shadowRoot.getElementById(id);
      if (el) el.textContent = text;
    };

    setVal("gemini-autoread-max-attempts", state.maxAttempts);
    setVal("gemini-autoread-debounce", state.debounceTime);
    setChecked("gemini-autoread-debug-toggle", state.debugMode);
    setVal(
      "gemini-autoread-default-toggle",
      state.defaultEnabled ? "true" : "false",
    );
    setVal("gemini-autoread-default-mode", state.defaultSyncMode);
    setText("gemini-autoread-shortcut-btn-toggle", state.shortcutToggle);
    setText("gemini-autoread-shortcut-btn-settings", state.shortcutSettings);
  };

  // ─── Styles ─────────────────────────────────────────────

  /**
   * Injects the global CSS theme into the Shadow DOM.
   * Styles are defined in GAR_Theme (src/styles/theme.js).
   */
  const initGlobalStyles = () => {
    const style = document.createElement("style");
    style.textContent = GAR_Theme;
    shadowRoot.appendChild(style);
  };

  // ─── Panel Builder ──────────────────────────────────────

  /**
   * Constructs the settings panel DOM and appends it to the shadow root.
   */
  const createSettingsPanel = () => {
    if (!shadowRoot || shadowRoot.getElementById("gemini-autoread-settings"))
      return;

    // Panel is hidden by default via CSS (opacity: 0, visibility: hidden).
    // Visibility is toggled by adding/removing the .is-visible class.
    const panel = createEl("div", {}, { id: "gemini-autoread-settings" });

    const header = createEl("div", {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "15px",
      borderBottom: "1px solid #334155",
      paddingBottom: "10px",
    });
    header.appendChild(
      createEl(
        "span",
        { fontSize: "18px", fontWeight: "bold" },
        { textContent: "⚙️ Settings" },
      ),
    );
    const closeBtn = createEl(
      "span",
      {
        cursor: "pointer",
        color: GAR_Config.COLORS.RED,
        fontSize: "16px",
        fontWeight: "bold",
      },
      { textContent: "✖" },
    );
    closeBtn.onclick = GAR_UI.togglePanel;
    header.appendChild(closeBtn);
    panel.appendChild(header);

    /**
     * Helper to add a row to the settings panel.
     * @param {HTMLElement} componentElement - The component to add.
     */
    const addRow = (componentElement) => {
      const r = createEl("div", { marginBottom: "15px" });
      r.appendChild(componentElement);
      panel.appendChild(r);
    };

    // Append setting components
    addRow(GAR_Components.SyncModeSelector(state, createEl, updateToggleUI));
    addRow(GAR_Components.StartupConfig(state, createEl));
    addRow(GAR_Components.RetryInput(state, createEl));
    addRow(GAR_Components.DebounceInput(state, createEl));
    addRow(GAR_Components.DebugToggle(state, createEl));

    panel.appendChild(
      createEl(
        "div",
        {
          fontWeight: "bold",
          marginBottom: "5px",
          marginTop: "15px",
          borderTop: "1px solid #334155",
          paddingTop: "10px",
        },
        { textContent: "⌨️ Shortcuts:" },
      ),
    );
    addRow(
      GAR_Components.ShortcutKeyBind(
        state,
        createEl,
        "Toggle Auto-Read",
        "toggle",
      ),
    );
    addRow(
      GAR_Components.ShortcutKeyBind(
        state,
        createEl,
        "Toggle Settings",
        "settings",
      ),
    );

    const btns = createEl("div", {
      display: "flex",
      gap: "10px",
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: "1px solid #334155",
    });
    const exportBtn = createEl(
      "button",
      {
        flex: "1",
        padding: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
      },
      { textContent: "📥 Export Logs", className: "btn-export" },
    );
    exportBtn.onclick = () => GAR_Utils.Logger.exportLogs(state);

    const closePanelBtn = createEl(
      "button",
      {
        flex: "1",
        padding: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
      },
      { textContent: "✖ Close", className: "btn-close" },
    );
    closePanelBtn.onclick = GAR_UI.togglePanel;

    btns.appendChild(exportBtn);
    btns.appendChild(closePanelBtn);
    panel.appendChild(btns);

    // Ko-fi support button
    const kofiLink = createEl(
      "a",
      {
        display: "block",
        width: "100%",
        marginTop: "12px",
        textAlign: "center",
      },
      {
        href: "https://ko-fi.com/olipium",
        target: "_blank",
        rel: "noopener noreferrer",
        className: "kofi-button",
      },
    );

    const kofiImg = createEl(
      "img",
      { width: "70%", height: "auto", border: "0px", borderRadius: "4px" },
      {
        src: chrome.runtime.getURL("src/assets/kofi_button.svg"),
        alt: "Buy Me a Coffee at ko-fi.com",
      },
    );

    kofiLink.appendChild(kofiImg);
    panel.appendChild(kofiLink);

    shadowRoot.appendChild(panel);
  };

  // ─── Public API ─────────────────────────────────────────

  return {
    /**
     * Initializes the UI by creating the host container and shadow root.
     * @param {function} onToggle - Callback for when the auto-read state is toggled.
     */
    init: (onToggle) => {
      if (document.getElementById("gar-host-container")) return;

      const host = document.createElement("div");
      host.id = "gar-host-container";
      document.body.appendChild(host);
      shadowRoot = host.attachShadow({ mode: "open" });

      initGlobalStyles();

      const toggleComponent = GAR_Components.FloatingToggle(
        state,
        createEl,
        updateToggleUI,
        GAR_UI.togglePanel,
        onToggle,
      );
      if (toggleComponent) {
        shadowRoot.appendChild(toggleComponent);
      }

      updateToggleUI();
    },

    /**
     * Toggles the visibility of the settings panel.
     * @param {boolean} [force] - Force the panel to be open (true) or closed (false).
     */
    togglePanel: (force) => {
      if (!shadowRoot) return;
      let panel = shadowRoot.getElementById("gemini-autoread-settings");
      if (!panel) {
        createSettingsPanel();
        panel = shadowRoot.getElementById("gemini-autoread-settings");
      }
      if (panel) {
        if (typeof force === "boolean") {
          panel.classList.toggle("is-visible", force);
        } else {
          panel.classList.toggle("is-visible");
        }
      }
    },

    /** Updates the toggle border and status text. */
    updateToggle: updateToggleUI,

    /** Refreshes settings panel input values from current state. */
    refreshSettings,

    /**
     * Updates the status of the microphone icon in the UI.
     * @param {string} stateType - Valid states: 'working', 'error', 'normal'.
     */
    setMicState: (stateType) => {
      if (!shadowRoot) return;
      const mic = shadowRoot.getElementById("gemini-autoread-mic-icon");
      if (!mic) return;

      mic.dataset.state = stateType;

      switch (stateType) {
        case "working":
          mic.style.color = "transparent";
          mic.style.textShadow = `0 0 0 ${GAR_Config.COLORS.GREEN}`;
          mic.style.filter = `drop-shadow(0 0 6px ${GAR_Config.COLORS.GREEN}) drop-shadow(0 0 10px ${GAR_Config.COLORS.GREEN})`;
          break;
        case "error":
          mic.style.color = "transparent";
          mic.style.textShadow = `0 0 0 ${GAR_Config.COLORS.RED}`;
          mic.style.filter = `drop-shadow(0 0 6px ${GAR_Config.COLORS.RED}) drop-shadow(0 0 10px ${GAR_Config.COLORS.RED})`;

          setTimeout(() => {
            if (mic.dataset.state === "error") {
              mic.style.color = "";
              mic.style.textShadow = "none";
              mic.style.filter = "none";
              mic.dataset.state = "normal";
            }
          }, GAR_Config.TIMINGS.WAIT_TIMEOUT);
          break;
        case "normal":
        default:
          mic.style.color = "";
          mic.style.textShadow = "none";
          mic.style.filter = "none";
          mic.dataset.state = "normal";
          break;
      }
    },
  };
})();
