"use strict";
globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * RetryInput: Settings component for configuring the maximum number of retry attempts.
 * Renders a labeled number input that controls how many times auto-read will
 * try to trigger playback before showing an error state.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @returns {HTMLElement} A wrapper div containing the label and input.
 */
globalThis.GAR_Components.RetryInput = (state, createEl) => {
  const attLabel = createEl(
    "label",
    { display: "block", marginBottom: "5px" },
    { textContent: "🔢 Retry Attempts (Max):" },
  );
  const attInput = createEl(
    "input",
    {
      width: "100%",
      padding: "6px",
      background: "#333",
      color: "#fff",
      border: "1px solid #444",
      borderRadius: "4px",
    },
    {
      type: "number",
      value: state.maxAttempts,
      min: 1,
      max: 10,
      id: "gemini-autoread-max-attempts",
      name: "maxAttempts",
    },
  );

  // Save the updated retry count whenever the user changes the input value.
  attInput.onchange = (e) => {
    state.maxAttempts = Number.parseInt(e.target.value);
    GAR_State.save();
  };

  const wrapper = createEl("div");
  wrapper.appendChild(attLabel);
  wrapper.appendChild(attInput);
  // Add a small hint underneath the input to show the allowed range.
  wrapper.appendChild(
    createEl(
      "div",
      { fontSize: "10px", color: "#888", marginTop: "4px" },
      { textContent: "Range: 1 - 10 attempts" },
    ),
  );
  return wrapper;
};
