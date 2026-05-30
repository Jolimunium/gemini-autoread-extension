/**
 * GAR_Storage: Handles all chrome.storage and sessionStorage persistence for the extension.
 * Responsible for reading, writing, and listening to setting changes across browser tabs.
 */
const GAR_Storage = (() => {
	const data = GAR_State.data;

	// ─── Internal Helpers ───────────────────────────────────

	/**
	 * Processes a single storage key change and updates the in-memory state object.
	 * @param {string} key - The storage key that changed.
	 * @param {any} newValue - The new value from storage.
	 * @param {object} updates - A flags object to indicate what parts of the UI need refreshing.
	 * @param {boolean} updates.shouldUpdateToggle - If true, the toggle button UI should re-render.
	 * @param {boolean} updates.shouldUpdateSettings - If true, the settings panel UI should re-render.
	 */
	const processStorageChange = (key, newValue, updates) => {
		switch (key) {
			case GAR_Config.STORAGE_KEYS.ENABLED:
				if (data.syncMode === "global") {
					const valBool = GAR_Utils.parseBool(
						newValue,
						GAR_Config.DEFAULTS.ENABLED,
					);
					if (valBool !== data.isAutoReadEnabled) {
						data.isAutoReadEnabled = valBool;
						updates.shouldUpdateToggle = true;
						GAR_Utils.Logger.log(
							data.debugMode,
							`🔄 Global Sync: ${data.isAutoReadEnabled ? "ON" : "OFF"}`,
						);
					}
				}
				break;
			case GAR_Config.STORAGE_KEYS.MAX_ATTEMPTS:
				data.maxAttempts =
					Number.parseInt(newValue, 10) || GAR_Config.DEFAULTS.MAX_ATTEMPTS;
				updates.shouldUpdateSettings = true;
				break;
			case GAR_Config.STORAGE_KEYS.DEBOUNCE_TIME:
				data.debounceTime =
					Number.parseInt(newValue, 10) || GAR_Config.DEFAULTS.DEBOUNCE_TIME;
				updates.shouldUpdateSettings = true;
				break;
			case GAR_Config.STORAGE_KEYS.DEBUG_MODE:
				data.debugMode = GAR_Utils.parseBool(
					newValue,
					GAR_Config.DEFAULTS.DEBUG_MODE,
				);
				updates.shouldUpdateSettings = true;
				break;
			case GAR_Config.STORAGE_KEYS.SHORTCUT_TOGGLE:
				data.shortcutToggle = newValue || GAR_Config.DEFAULTS.SHORTCUT_TOGGLE;
				updates.shouldUpdateSettings = true;
				break;
			case GAR_Config.STORAGE_KEYS.SHORTCUT_SETTINGS:
				data.shortcutSettings =
					newValue || GAR_Config.DEFAULTS.SHORTCUT_SETTINGS;
				updates.shouldUpdateSettings = true;
				break;
			case GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED:
				data.defaultEnabled = GAR_Utils.parseBool(
					newValue,
					GAR_Config.DEFAULTS.ENABLED,
				);
				updates.shouldUpdateSettings = true;
				break;
			case GAR_Config.STORAGE_KEYS.DEFAULT_SYNC_MODE:
				data.defaultSyncMode = newValue || GAR_Config.DEFAULTS.SYNC_MODE;
				updates.shouldUpdateSettings = true;
				break;
		}
	};

	return {
		/**
		 * Reads the enabled state from the correct storage based on sync mode.
		 * Falls back to the `defaultEnabled` setting if no value is found.
		 * @param {string} mode - Sync mode: 'local' (sessionStorage) or 'global' (chrome.storage).
		 * @returns {Promise<boolean>} Whether auto-read should be active.
		 */
		getEnabledState: async (mode) => {
			if (mode === "local") {
				const val = sessionStorage.getItem(GAR_Config.STORAGE_KEYS.ENABLED);
				if (val !== null)
					return GAR_Utils.parseBool(val, GAR_Config.DEFAULTS.ENABLED);
			} else {
				const store = await chrome.storage.local.get(
					GAR_Config.STORAGE_KEYS.ENABLED,
				);
				const val = store.gemini_autoread_enabled;
				if (val !== undefined)
					return GAR_Utils.parseBool(val, GAR_Config.DEFAULTS.ENABLED);
			}
			const defStore = await chrome.storage.local.get(
				GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED,
			);
			return GAR_Utils.parseBool(
				defStore.gemini_autoread_default_enabled,
				GAR_Config.DEFAULTS.ENABLED,
			);
		},

		/**
		 * Loads all persisted settings from chrome.storage and applies them to in-memory state.
		 * Also determines and applies the correct sync mode for this tab session.
		 * @returns {Promise<void>}
		 */
		loadAll: async () => {
			const initialStore = await chrome.storage.local.get(null);

			data.defaultSyncMode =
				initialStore.gemini_autoread_default_sync_mode ||
				GAR_Config.DEFAULTS.SYNC_MODE;
			data.defaultEnabled = GAR_Utils.parseBool(
				initialStore.gemini_autoread_default_enabled,
				GAR_Config.DEFAULTS.ENABLED,
			);

			data.syncMode = sessionStorage.getItem(GAR_Config.STORAGE_KEYS.SYNC_MODE);
			if (!data.syncMode) {
				data.syncMode = data.defaultSyncMode;
				sessionStorage.setItem(
					GAR_Config.STORAGE_KEYS.SYNC_MODE,
					data.syncMode,
				);
			}

			data.isAutoReadEnabled = await GAR_Storage.getEnabledState(data.syncMode);

			data.maxAttempts =
				Number.parseInt(initialStore.gemini_autoread_max_attempts, 10) ||
				GAR_Config.DEFAULTS.MAX_ATTEMPTS;
			data.debounceTime =
				Number.parseInt(initialStore.gemini_autoread_debounce, 10) ||
				GAR_Config.DEFAULTS.DEBOUNCE_TIME;
			data.debugMode = GAR_Utils.parseBool(
				initialStore.gemini_autoread_debug,
				GAR_Config.DEFAULTS.DEBUG_MODE,
			);
			data.shortcutToggle =
				initialStore.gemini_autoread_shortcut_toggle ||
				GAR_Config.DEFAULTS.SHORTCUT_TOGGLE;
			data.shortcutSettings =
				initialStore.gemini_autoread_shortcut_settings ||
				GAR_Config.DEFAULTS.SHORTCUT_SETTINGS;
		},

		/**
		 * Persists the current in-memory state to chrome.storage (and sessionStorage for local mode).
		 */
		save: () => {
			if (data.syncMode === "local") {
				sessionStorage.setItem(
					GAR_Config.STORAGE_KEYS.ENABLED,
					data.isAutoReadEnabled,
				);
			} else {
				chrome.storage.local.set({
					[GAR_Config.STORAGE_KEYS.ENABLED]: data.isAutoReadEnabled,
				});
			}

			chrome.storage.local.set({
				[GAR_Config.STORAGE_KEYS.MAX_ATTEMPTS]: data.maxAttempts,
				[GAR_Config.STORAGE_KEYS.DEBOUNCE_TIME]: data.debounceTime,
				[GAR_Config.STORAGE_KEYS.DEBUG_MODE]: data.debugMode,
				[GAR_Config.STORAGE_KEYS.SHORTCUT_TOGGLE]: data.shortcutToggle,
				[GAR_Config.STORAGE_KEYS.SHORTCUT_SETTINGS]: data.shortcutSettings,
				[GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED]: data.defaultEnabled,
				[GAR_Config.STORAGE_KEYS.DEFAULT_SYNC_MODE]: data.defaultSyncMode,
			});
			GAR_Utils.Logger.log(data.debugMode, "Settings saved.");
		},

		/**
		 * Subscribes to chrome.storage changes to keep state in sync across browser tabs.
		 * @param {function} onToggleUpdate - Called when the auto-read enabled state changes.
		 * @param {function} onSettingsUpdate - Called when any other setting changes.
		 */
		listenToChanges: (onToggleUpdate, onSettingsUpdate) => {
			chrome.storage.onChanged.addListener((changes, areaName) => {
				if (areaName !== "local") return;

				const updates = {
					shouldUpdateToggle: false,
					shouldUpdateSettings: false,
				};

				for (const [key, { newValue }] of Object.entries(changes)) {
					processStorageChange(key, newValue, updates);
				}

				if (updates.shouldUpdateToggle && onToggleUpdate) onToggleUpdate();
				if (updates.shouldUpdateSettings && onSettingsUpdate)
					onSettingsUpdate();
			});
		},
	};
})();
