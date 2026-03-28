"use strict";
globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * DebugToggle: Settings component for enabling or disabling Debug Mode.
 * Renders a checkbox that toggles verbose console logging on/off.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @returns {HTMLElement} A flex wrapper div containing the checkbox and label.
 */
globalThis.GAR_Components.DebugToggle = (state, createEl) => {
  const debugWrapper = createEl("div", {
    display: "flex",
    alignItems: "center",
  });

  const debugCheck = createEl(
    "input",
    { marginRight: "10px" },
    {
      type: "checkbox",
      checked: state.debugMode,
      id: "gemini-autoread-debug-toggle",
    },
  );

  // Toggle debugMode in state and persist the new value.
  debugCheck.onchange = (e) => {
    state.debugMode = e.target.checked;
    GAR_State.save();
  };

  debugWrapper.appendChild(debugCheck);
  debugWrapper.appendChild(
    createEl("span", {}, { textContent: "🐛 Debug Mode " }),
  );

  return debugWrapper;
};
