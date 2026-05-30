/**
 * GAR_State: Manages the application's in-memory state object.
 * Provides the central `data` store shared across all modules.
 * Persistence (chrome.storage / sessionStorage) is handled by GAR_Storage.
 */
// biome-ignore lint/correctness/noUnusedVariables: shared globally
const GAR_State = (() => {
	/**
	 * The central in-memory state object shared across the application.
	 * Initialized with sensible defaults; overwritten by saved storage values on `init`.
	 * @type {object}
	 */
	const data = {
		defaultSyncMode: GAR_Config.DEFAULTS.SYNC_MODE,
		defaultEnabled: GAR_Config.DEFAULTS.ENABLED,
		syncMode: GAR_Config.DEFAULTS.SYNC_MODE,
		isAutoReadEnabled: GAR_Config.DEFAULTS.ENABLED,
		maxAttempts: GAR_Config.DEFAULTS.MAX_ATTEMPTS,
		debounceTime: GAR_Config.DEFAULTS.DEBOUNCE_TIME,
		debugMode: GAR_Config.DEFAULTS.DEBUG_MODE,
		shortcutToggle: GAR_Config.DEFAULTS.SHORTCUT_TOGGLE,
		shortcutSettings: GAR_Config.DEFAULTS.SHORTCUT_SETTINGS,
		timeoutId: null,
	};

	return {
		data,

		/**
		 * Loads all persisted settings from storage into the in-memory `data` object.
		 * Delegates to GAR_Storage for all chrome.storage and sessionStorage operations.
		 * @returns {Promise<void>}
		 */
		init: async () => {
			await GAR_Storage.loadAll();
		},

		/**
		 * Persists the current in-memory state to storage.
		 * Delegates to GAR_Storage.
		 */
		save: () => {
			GAR_Storage.save();
		},

		/**
		 * Subscribes to chrome.storage changes to keep state in sync across browser tabs.
		 * Delegates to GAR_Storage.
		 * @param {function} onToggleUpdate - Called when the auto-read enabled state changes.
		 * @param {function} onSettingsUpdate - Called when any other setting changes.
		 */
		listenToChanges: (onToggleUpdate, onSettingsUpdate) => {
			GAR_Storage.listenToChanges(onToggleUpdate, onSettingsUpdate);
		},
	};
})();
