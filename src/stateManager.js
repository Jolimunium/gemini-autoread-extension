"use strict";

/**
 * GAR_State: Manages the application's in-memory state object.
 * Provides the central `data` store shared across all modules.
 * Persistence (chrome.storage / sessionStorage) is handled by GAR_Storage.
 */
const GAR_State = (() => {
  /**
   * The central in-memory state object shared across the application.
   * Initialized with sensible defaults; overwritten by saved storage values on `init`.
   * @type {object}
   */
  const data = {
    defaultSyncMode: "global",
    defaultEnabled: true,
    syncMode: "global",
    isAutoReadEnabled: true,
    maxAttempts: 5,
    debounceTime: 1000,
    debugMode: false,
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
