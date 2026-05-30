globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * ShortcutKeyBind: Settings component for recording and assigning keyboard shortcuts.
 * Renders a button that enters "recording mode" on click, captures the next key combination,
 * and saves it to the corresponding state field.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @param {string} label - The human-readable label displayed next to the shortcut button.
 * @param {string} keyName - The shortcut type: 'toggle' or 'settings'.
 * @returns {HTMLElement} A row div containing the label and the shortcut record button.
 */
globalThis.GAR_Components.ShortcutKeyBind = (
	state,
	createEl,
	label,
	keyName,
) => {
	const currentVal =
		keyName === "toggle" ? state.shortcutToggle : state.shortcutSettings;
	const row = createEl("div", {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "8px",
		fontSize: "13px",
	});

	// The button displaying the current shortcut combo; acts as the recording trigger.
	const valBtn = createEl(
		"button",
		{
			padding: "4px 8px",
			backgroundColor: GAR_Config.COLORS.INPUT_BG,
			border: `1px solid ${GAR_Config.COLORS.BORDER_LIGHT}`,
			borderRadius: "4px",
			color: GAR_Config.COLORS.TEXT,
			cursor: "pointer",
			width: "140px",
			textAlign: "center",
			fontSize: "11px",
		},
		{ textContent: currentVal, id: `gemini-autoread-shortcut-btn-${keyName}` },
	);

	/** AbortController used to clean up event listeners when recording stops. */
	let abortController = new AbortController();

	valBtn.onclick = (event) => {
		event.stopPropagation();
		if (valBtn.dataset.isRecording === "true") return;
		valBtn.dataset.isRecording = "true";

		// Cancel any previous recording session before starting a new one.
		abortController.abort();
		abortController = new AbortController();

		valBtn.textContent = "Press keys...";
		valBtn.style.backgroundColor = GAR_Config.COLORS.RECORDING_BG;
		valBtn.style.borderColor = GAR_Config.COLORS.GREEN;

		/** Reverts the button to its saved shortcut value and stops recording. */
		const cancelRecording = () => {
			valBtn.textContent =
				keyName === "toggle" ? state.shortcutToggle : state.shortcutSettings;
			valBtn.style.backgroundColor = GAR_Config.COLORS.INPUT_BG;
			valBtn.style.borderColor = GAR_Config.COLORS.BORDER_LIGHT;
			valBtn.dataset.isRecording = "false";
			abortController.abort();
		};

		/**
		 * Captures the key combo, saves it to state, and updates the button label.
		 * @param {KeyboardEvent} e - The captured keydown event.
		 */
		const recordHandler = (e) => {
			e.preventDefault();
			e.stopPropagation();
			if (e.key === "Escape") return cancelRecording();
			if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;

			const newCombo = GAR_Utils.getShortcutFromEvent(e);

			if (keyName === "toggle") state.shortcutToggle = newCombo;
			if (keyName === "settings") state.shortcutSettings = newCombo;
			GAR_State.save();

			valBtn.textContent = newCombo;
			valBtn.style.backgroundColor = GAR_Config.COLORS.INPUT_BG;
			valBtn.style.borderColor = GAR_Config.COLORS.BORDER_LIGHT;
			valBtn.dataset.isRecording = "false";
			abortController.abort();
		};

		// Listen for the next keydown to record the combo.
		// Cancel if the user clicks elsewhere or the window loses focus.
		globalThis.addEventListener("keydown", recordHandler, {
			capture: true,
			signal: abortController.signal,
		});
		globalThis.addEventListener("click", cancelRecording, {
			capture: true,
			signal: abortController.signal,
		});
		globalThis.addEventListener("blur", cancelRecording, {
			capture: true,
			signal: abortController.signal,
		});
	};

	row.appendChild(
		createEl("span", { color: GAR_Config.COLORS.TEXT_MUTED }, { textContent: label }),
	);
	row.appendChild(valBtn);
	return row;
};
