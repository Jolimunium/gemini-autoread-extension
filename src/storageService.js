"use strict";

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
          const valBool = newValue !== false && newValue !== "false";
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
        data.maxAttempts = Number.parseInt(newValue) || 5;
        updates.shouldUpdateSettings = true;
        break;
      case GAR_Config.STORAGE_KEYS.DEBOUNCE_TIME:
        data.debounceTime = Number.parseInt(newValue) || 1000;
        updates.shouldUpdateSettings = true;
        break;
      case GAR_Config.STORAGE_KEYS.DEBUG_MODE:
        data.debugMode = newValue === true || newValue === "true";
        updates.shouldUpdateSettings = true;
        break;
      case GAR_Config.STORAGE_KEYS.SHORTCUT_TOGGLE:
        data.shortcutToggle = newValue || GAR_Config.DEFAULTS.SHORTCUT_TOGGLE;
        updates.shouldUpdateSettings = true;
        break;
      case GAR_Config.STORAGE_KEYS.SHORTCUT_SETTINGS:
        data.shortcutSettings = newValue || GAR_Config.DEFAULTS.SHORTCUT_SETTINGS;
        updates.shouldUpdateSettings = true;
        break;
      case GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED:
        data.defaultEnabled = newValue !== false && newValue !== "false";
        updates.shouldUpdateSettings = true;
        break;
      case GAR_Config.STORAGE_KEYS.DEFAULT_SYNC_MODE:
        data.defaultSyncMode = newValue || "global";
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
        if (val !== null) return val !== "false";
      } else {
        const store = await chrome.storage.local.get(GAR_Config.STORAGE_KEYS.ENABLED);
        const val = store[GAR_Config.STORAGE_KEYS.ENABLED];
        if (val !== undefined) return val !== false && val !== "false";
      }
      const defStore = await chrome.storage.local.get(GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED);
      return (
        defStore[GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED] !== false &&
        defStore[GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED] !== "false"
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
        initialStore[GAR_Config.STORAGE_KEYS.DEFAULT_SYNC_MODE] || "global";
      data.defaultEnabled =
        initialStore[GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED] !== false &&
        initialStore[GAR_Config.STORAGE_KEYS.DEFAULT_ENABLED] !== "false";

      data.syncMode = sessionStorage.getItem(GAR_Config.STORAGE_KEYS.SYNC_MODE);
      if (!data.syncMode) {
        data.syncMode = data.defaultSyncMode;
        sessionStorage.setItem(GAR_Config.STORAGE_KEYS.SYNC_MODE, data.syncMode);
      }

      data.isAutoReadEnabled = await GAR_Storage.getEnabledState(data.syncMode);

      data.maxAttempts =
        Number.parseInt(initialStore[GAR_Config.STORAGE_KEYS.MAX_ATTEMPTS]) || 5;
      data.debounceTime =
        Number.parseInt(initialStore[GAR_Config.STORAGE_KEYS.DEBOUNCE_TIME]) || 1000;
      data.debugMode =
        initialStore[GAR_Config.STORAGE_KEYS.DEBUG_MODE] === true ||
        initialStore[GAR_Config.STORAGE_KEYS.DEBUG_MODE] === "true";
      data.shortcutToggle =
        initialStore[GAR_Config.STORAGE_KEYS.SHORTCUT_TOGGLE] ||
        GAR_Config.DEFAULTS.SHORTCUT_TOGGLE;
      data.shortcutSettings =
        initialStore[GAR_Config.STORAGE_KEYS.SHORTCUT_SETTINGS] ||
        GAR_Config.DEFAULTS.SHORTCUT_SETTINGS;
    },

    /**
     * Persists the current in-memory state to chrome.storage (and sessionStorage for local mode).
     */
    save: () => {
      if (data.syncMode === "local") {
        sessionStorage.setItem(GAR_Config.STORAGE_KEYS.ENABLED, data.isAutoReadEnabled);
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
        if (updates.shouldUpdateSettings && onSettingsUpdate) onSettingsUpdate();
      });
    },
  };
})();
