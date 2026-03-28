"use strict";
globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * DebounceInput: Settings component for adjusting the debounce wait time.
 * Renders a labeled number input that controls how long the observer waits
 * after detecting a DOM change before triggering auto-read.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @returns {HTMLElement} A wrapper div containing the label and input.
 */
globalThis.GAR_Components.DebounceInput = (state, createEl) => {
  const debLabel = createEl(
    "label",
    { display: "block", marginBottom: "5px" },
    { textContent: "⏱️ Wait Time (ms):" },
  );
  const debInput = createEl(
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
      value: state.debounceTime,
      min: 200,
      max: 5000,
      id: "gemini-autoread-debounce",
      name: "debounceTime",
    },
  );

  // Save the updated debounce time whenever the user changes the input value.
  debInput.onchange = (e) => {
    state.debounceTime = Number.parseInt(e.target.value);
    GAR_State.save();
  };

  const wrapper = createEl("div");
  wrapper.appendChild(debLabel);
  wrapper.appendChild(debInput);
  // Add a small hint underneath the input to show the allowed range.
  wrapper.appendChild(
    createEl(
      "div",
      { fontSize: "10px", color: "#888", marginTop: "4px" },
      { textContent: "Range: 200 - 5,000 ms" },
    ),
  );
  return wrapper;
};
