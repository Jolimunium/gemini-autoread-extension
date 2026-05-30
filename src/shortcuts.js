/**
 * GAR_Shortcuts: Manages global keyboard shortcut registration for the extension.
 * Handles the toggle auto-read and toggle settings panel shortcuts.
 */
// biome-ignore lint/correctness/noUnusedVariables: shared globally
const GAR_Shortcuts = (() => {
	const state = GAR_State.data;
	const { Logger, getShortcutFromEvent } = GAR_Utils;

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
