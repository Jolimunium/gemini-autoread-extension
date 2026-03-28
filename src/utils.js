"use strict";

/**
 * GAR_Utils: General purpose utility functions for the Gemini Auto-Read extension.
 */
const GAR_Utils = {
  /**
   * DOM utility functions for element creation and state observation.
   */
  DOM: {
    /**
     * Creates a DOM element with specified styles and properties.
     * @param {string} tag - The HTML tag name.
     * @param {object} styles - CSS styles to apply.
     * @param {object} props - Properties to assign to the element.
     * @returns {HTMLElement} The created element.
     */
    createEl: (tag, styles = {}, props = {}) => {
      const el = document.createElement(tag);
      Object.assign(el.style, styles);
      Object.assign(el, props);
      return el;
    },

    /**
     * Pauses execution for a set duration.
     * @param {number} ms - Milliseconds to sleep.
     * @returns {Promise<void>}
     */
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),

    /**
     * Polls a condition function until it returns true or times out.
     * @param {function} evaluationFn - Function that returns boolean.
     * @param {number} maxWaitMs - Total timeout duration.
     * @param {number} intervalMs - Polling frequency.
     * @returns {Promise<boolean>} Resolves to true if successful, false on timeout.
     */
    waitForState: async (evaluationFn, maxWaitMs = 5000, intervalMs = 250) => {
      const startTime = Date.now();
      while (Date.now() - startTime < maxWaitMs) {
        if (evaluationFn()) return true;
        await GAR_Utils.DOM.sleep(intervalMs);
      }
      return false;
    },
  },

  /**
   * Logger: Centralized logging system with buffered history and export capabilities.
   */
  Logger: (() => {
    /** @type {Array<object>} Internal log history buffer. */
    let logHistory = [];

    return {
      /**
       * Records log entries and optionally outputs to console.
       * @param {boolean} debugMode - Whether to print entries to the developer console.
       * @param {...any} args - Values to record in the log history.
       */
      log: (debugMode, ...args) => {
        const timestamp = new Date().toISOString();

        if (debugMode) console.log(GAR_Config.LOG_PREFIX, ...args);

        logHistory.push({
          time: timestamp,
          message: args
            .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
            .join(" "),
          type: "info",
          raw: args,
        });

        // Cap the log history to the most recent 500 entries (Memory Management).
        if (logHistory.length > 500) logHistory.shift();
      },

      /**
       * Compiles buffered logs and current settings into a JSON file for download.
       * @param {object} settingsState - The current application state to include as metadata.
       */
      exportLogs: (settingsState) => {
        /**
         * Safely retrieves the extension version from the manifest.
         * @returns {string} The version string.
         */
        const getVer = () =>
          globalThis.chrome?.runtime?.getManifest?.()?.version || "unknown";

        const exportData = {
          meta: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            version: getVer(),
            settings: settingsState,
          },
          logs: logHistory,
        };

        // Create an invisible link to trigger a file download.
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gemini-autoread-debug-${Date.now()}.json`;
        a.click();

        // Clean up the object URL to prevent memory leaks.
        URL.revokeObjectURL(url);
      },
    };
  })(),
};
