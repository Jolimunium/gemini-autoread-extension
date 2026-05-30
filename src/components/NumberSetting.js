globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * NumberSetting: Shared factory for a labeled number input with a hint line.
 * Used by RetryInput and DebounceInput to avoid duplicated markup.
 * @param {object} cfg - Configuration for the setting row.
 * @param {function} cfg.createEl - Utility function to create styled DOM elements.
 * @param {string} cfg.label - Text shown above the input.
 * @param {number} cfg.value - Current value of the input.
 * @param {number} cfg.min - Minimum allowed value.
 * @param {number} cfg.max - Maximum allowed value.
 * @param {string} cfg.id - DOM id used by the settings panel to refresh the value.
 * @param {string} cfg.name - Form field name.
 * @param {string} cfg.hint - Helper text shown beneath the input.
 * @param {function} cfg.onChange - Called with the parsed integer when the value changes.
 * @returns {HTMLElement} A wrapper div containing the label, input, and hint.
 */
globalThis.GAR_Components.NumberSetting = ({
	createEl,
	label,
	value,
	min,
	max,
	id,
	name,
	hint,
	onChange,
}) => {
	const wrapper = createEl("div");

	wrapper.appendChild(
		createEl(
			"label",
			{ display: "block", marginBottom: "5px" },
			{ textContent: label },
		),
	);

	const input = createEl(
		"input",
		{
			width: "100%",
			padding: "6px",
			background: GAR_Config.COLORS.INPUT_BG,
			color: GAR_Config.COLORS.TEXT,
			border: `1px solid ${GAR_Config.COLORS.BORDER}`,
			borderRadius: "4px",
		},
		{ type: "number", value, min, max, id, name },
	);
	input.onchange = (e) => onChange(Number.parseInt(e.target.value, 10));
	wrapper.appendChild(input);

	wrapper.appendChild(
		createEl(
			"div",
			{ fontSize: "11px", color: GAR_Config.COLORS.HINT, marginTop: "4px" },
			{ textContent: hint },
		),
	);

	return wrapper;
};
