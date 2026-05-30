/**
 * GAR_Config: Centralized configuration constants for Gemini Auto-Read.
 * All selectors, storage keys, timings, defaults, colors, and layout values are defined here.
 */
// biome-ignore lint/correctness/noUnusedVariables: shared globally
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
		MORE_OPTIONS_ICON: 'mat-icon[fonticon="more_horiz"]',
		TTS_BUTTON:
			'gem-menu-item[data-test-id="tts-button"], gem-menu-item[value="tts"]',
		PAUSE_ICON: 'mat-icon[fonticon="pause"]',
	},

	/** Default values applied when no saved settings are found. */
	DEFAULTS: {
		SYNC_MODE: "global",
		ENABLED: true,
		MAX_ATTEMPTS: 3,
		DEBOUNCE_TIME: 1000,
		DEBUG_MODE: false,
		SHORTCUT_TOGGLE: "Control+Shift+KeyE",
		SHORTCUT_SETTINGS: "Control+Shift+KeyS",
	},

	/** Timing values (in milliseconds) used for delays and timeouts. */
	TIMINGS: {
		RETRY_INTERVAL: 250,
		PLAYBACK_CONFIRM_TIMEOUT: 2500,
		PAGE_LOAD_TIMEOUT: 1500,
		ERROR_RESET_TIMEOUT: 3000,
		TTS_MENU_TIMEOUT: 1500,
		MENU_POLL_INTERVAL: 100,
	},

	/** Color palette used throughout the UI. Single source of truth for all color values. */
	COLORS: {
		// Accent colors
		GREEN: "#10b981",
		RED: "#f43f5e",
		BLUE: "#3b82f6",
		SURFACE: "#1e293b",
		RECORDING_BG: "#064e3b",
		// Neutral palette — inputs, borders, dividers, and text
		INPUT_BG: "#333",
		BORDER: "#444",
		BORDER_LIGHT: "#555",
		DIVIDER: "#334155",
		TOGGLE_DIVIDER: "#666",
		TEXT: "#fff",
		TEXT_MUTED: "#ccc",
		HINT: "#888",
		HINT_FAINT: "#64748b",
		// Floating toggle surfaces
		TOGGLE_BG: "rgba(30, 30, 30, 0.6)",
		HOVER_BG: "rgba(255, 255, 255, 0.1)",
		SHADOW: "rgba(0, 0, 0, 0.5)",
	},

	/** Layout positioning for the floating UI elements. */
	LAYOUT: {
		TOGGLE_BOTTOM: "100px",
		TOGGLE_RIGHT: "20px",
		PANEL_BOTTOM: "160px",
		PANEL_RIGHT: "20px",
	},
};
