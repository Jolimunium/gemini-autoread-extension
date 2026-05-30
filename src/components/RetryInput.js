globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * RetryInput: Settings component for configuring the maximum number of retry attempts.
 * Renders a labeled number input that controls how many times auto-read will
 * try to trigger playback before showing an error state.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @returns {HTMLElement} A wrapper div containing the label and input.
 */
globalThis.GAR_Components.RetryInput = (state, createEl) =>
	GAR_Components.NumberSetting({
		createEl,
		label: "🔢 Max Retry Attempts:",
		value: state.maxAttempts,
		min: 1,
		max: 10,
		id: "gemini-autoread-max-attempts",
		name: "maxAttempts",
		hint: "Range: 1 - 10 attempts",
		onChange: (val) => {
			state.maxAttempts = val;
			GAR_State.save();
		},
	});
