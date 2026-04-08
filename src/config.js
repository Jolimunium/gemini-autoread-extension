"use strict";

/**
 * GAR_Config: Centralized configuration constants for Gemini Auto-Read.
 * All selectors, storage keys, timings, defaults, colors, and layout values are defined here.
 */
const GAR_Config = {
  /** Prefix string prepended to all debug console messages. */
  LOG_PREFIX: "[Gemini Auto-Read]:",

  /** Keys used to read/write settings in chrome.storage.local and sessionStorage. */
  STORAGE_KEYS: {
    ENABLED: "gemini_autoread_enabled",
    SYNC_MODE: "gemini_autoread_sync_mode",
    DEFAULT_SYNC_MODE: "gemini_autoread_default_sync_mode",
    DEFAULT_ENABLED: "gemini_autoread_default_enabled",
    MAX_ATTEMPTS: "gemini_autoread_max_attempts",
    DEBOUNCE_TIME: "gemini_autoread_debounce",
    DEBUG_MODE: "gemini_autoread_debug",
    SHORTCUT_TOGGLE: "gemini_autoread_shortcut_toggle",
    SHORTCUT_SETTINGS: "gemini_autoread_shortcut_settings",
  },

  /** CSS selectors used to locate key elements in the Gemini UI. */
  SELECTORS: {
    CHAT_CONTAINER: 'infinite-scroller[data-test-id="chat-history-container"]',
    CHAT_CONTAINER_FALLBACK: "main.chat-app",
    VOLUME_ICON: 'mat-icon[fonticon="volume_up"]',
    PAUSE_ICON: 'mat-icon[fonticon="pause"]',
  },

  /** Default values applied when no saved settings are found. */
  DEFAULTS: {
    SHORTCUT_TOGGLE: "Control+Shift+KeyE",
    SHORTCUT_SETTINGS: "Control+Shift+KeyS",
  },

  /** Timing values (in milliseconds) used for delays and timeouts. */
  TIMINGS: {
    SLEEP_INTERVAL: 500,
    WAIT_TIMEOUT: 3000,
  },

  /** Accent color palette used throughout the UI. Single source of truth for all color values. */
  COLORS: {
    GREEN: "#10b981",
    RED: "#f43f5e",
    BLUE: "#3b82f6",
    SURFACE: "#1e293b",
    RECORDING_BG: "#064e3b",
  },

  /** Layout positioning for the floating UI elements. */
  LAYOUT: {
    TOGGLE_BOTTOM: "100px",
    TOGGLE_RIGHT: "20px",
    PANEL_BOTTOM: "160px",
    PANEL_RIGHT: "20px",
  },
};
