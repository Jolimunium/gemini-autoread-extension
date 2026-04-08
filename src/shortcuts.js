"use strict";

/**
 * GAR_Shortcuts: Manages global keyboard shortcut registration for the extension.
 * Handles the toggle auto-read and toggle settings panel shortcuts.
 */
const GAR_Shortcuts = (() => {
  const state = GAR_State.data;
  const { Logger } = GAR_Utils;

  // ─── Helpers ────────────────────────────────────────────

  /**
   * Converts a keyboard event into a shortcut combo string (e.g., "Control+Shift+KeyE").
   * @param {KeyboardEvent} e - The keyboard event to interpret.
   * @returns {string} The normalized shortcut combo string.
   */
  const getShortcutFromEvent = (e) => {
    const parts = [];
    if (e.ctrlKey) parts.push("Control");
    if (e.shiftKey) parts.push("Shift");
    if (e.altKey) parts.push("Alt");
    if (e.metaKey) parts.push("Meta");
    if (!["Control", "Shift", "Alt", "Meta"].includes(e.key))
      parts.push(e.code);
    return parts.join("+");
  };

  return {
    /**
     * Registers a global keydown listener to handle all keyboard shortcuts.
     * Ignores events originating from input fields to avoid conflicts.
     * @param {function} onToggleAutoRead - Callback to toggle the auto-read enabled state.
     */
    register: (onToggleAutoRead) => {
      document.addEventListener(
        "keydown",
        (e) => {
          if (
            ["INPUT", "TEXTAREA"].includes(e.target.tagName) ||
            e.target.isContentEditable
          )
            return;

          if (e.code === "Escape") {
            GAR_UI.togglePanel(false);
            return;
          }

          const currentCombo = getShortcutFromEvent(e);

          if (currentCombo === state.shortcutToggle) {
            e.preventDefault();
            e.stopPropagation();
            onToggleAutoRead();
          } else if (currentCombo === state.shortcutSettings) {
            e.preventDefault();
            e.stopPropagation();
            GAR_UI.togglePanel();
            Logger.log(state.debugMode, "Shortcut: Toggle Settings");
          }
        },
        { capture: true },
      );
    },
  };
})();
