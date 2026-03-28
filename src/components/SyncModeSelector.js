"use strict";
globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * SyncModeSelector: Settings component for switching the current tab's sync mode.
 * Renders two buttons — "Local" and "Global" — that control whether the auto-read
 * enabled state is independent per tab or shared across all tabs.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @param {function} onToggleUpdate - Callback to refresh the floating toggle UI after a mode change.
 * @returns {HTMLElement} A wrapper div containing the mode buttons and a description hint.
 */
globalThis.GAR_Components.SyncModeSelector = (
  state,
  createEl,
  onToggleUpdate,
) => {
  const syncContainer = createEl("div", { display: "flex", gap: "10px" });

  const localBtn = createEl(
    "button",
    {
      flex: "1",
      padding: "8px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    { textContent: "Local" },
  );
  const globalBtn = createEl(
    "button",
    {
      flex: "1",
      padding: "8px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    { textContent: "Global" },
  );

  /** Highlights the currently active sync mode button. */
  const updateModeBtns = () => {
    localBtn.style.backgroundColor =
      state.syncMode === "local" ? GAR_Config.COLORS.GREEN : GAR_Config.COLORS.SURFACE;
    localBtn.style.color = "#FFF";
    globalBtn.style.backgroundColor =
      state.syncMode === "global" ? GAR_Config.COLORS.GREEN : GAR_Config.COLORS.SURFACE;
    globalBtn.style.color = "#FFF";
  };
  updateModeBtns();

  /**
   * Handles a sync mode change: updates session, re-reads enabled state, saves, and refreshes UI.
   * @param {string} val - The new sync mode: 'local' or 'global'.
   */
  const handleModeChange = async (val) => {
    state.syncMode = val;
    sessionStorage.setItem(GAR_Config.STORAGE_KEYS.SYNC_MODE, state.syncMode);
    state.isAutoReadEnabled = await GAR_Storage.getEnabledState(state.syncMode);

    GAR_State.save();
    updateModeBtns();
    if (onToggleUpdate) onToggleUpdate();
  };

  localBtn.onclick = () => handleModeChange("local");
  globalBtn.onclick = () => handleModeChange("global");

  syncContainer.appendChild(localBtn);
  syncContainer.appendChild(globalBtn);

  const syncWrapper = createEl("div");
  syncWrapper.appendChild(
    createEl(
      "div",
      { fontWeight: "bold", marginBottom: "5px" },
      { textContent: "🔄 Current Tab Sync Mode:" },
    ),
  );
  syncWrapper.appendChild(syncContainer);
  syncWrapper.appendChild(
    createEl(
      "div",
      { fontSize: "11px", color: "#888", marginTop: "5px" },
      {
        textContent: "Local: Tab-specific logic | Global: Sync across all tabs",
      },
    ),
  );

  return syncWrapper;
};
