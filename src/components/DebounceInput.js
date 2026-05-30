globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * DebounceInput: Settings component for adjusting the debounce wait time.
 * Renders a labeled number input that controls how long the observer waits
 * after detecting a DOM change before triggering auto-read.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @returns {HTMLElement} A wrapper div containing the label and input.
 */
globalThis.GAR_Components.DebounceInput = (state, createEl) =>
	GAR_Components.NumberSetting({
		createEl,
		label: "⏱️ Wait After Response (ms):",
		value: state.debounceTime,
		min: 200,
		max: 5000,
		id: "gemini-autoread-debounce",
		name: "debounceTime",
		hint: "Delay before reading after Gemini responds. Range: 200–5,000 ms",
		onChange: (val) => {
			state.debounceTime = val;
			GAR_State.save();
		},
	});
