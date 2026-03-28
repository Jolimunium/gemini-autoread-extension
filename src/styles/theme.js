"use strict";

/**
 * GAR_Theme: The global CSS stylesheet for the Gemini Auto-Read Shadow DOM.
 * Defines CSS custom properties (design tokens), base layout, component styles,
 * hover animations, and input overrides — all scoped to the extension's Shadow Root.
 * Color and layout values are sourced from GAR_Config to ensure a single source of truth.
 * @type {string}
 */
const GAR_Theme = `
  :host {
    --bg-panel: #0f172a;
    --border-color: #334155;
    --text-color: #f8fafc;
    --accent-green: ${GAR_Config.COLORS.GREEN};
    --accent-red: ${GAR_Config.COLORS.RED};
    --accent-blue: ${GAR_Config.COLORS.BLUE};
    --font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* ─── Settings Panel ─────────────────────────────────── */
  #gemini-autoread-settings {
    position: fixed !important;
    bottom: ${GAR_Config.LAYOUT.PANEL_BOTTOM} !important;
    right: ${GAR_Config.LAYOUT.PANEL_RIGHT} !important;
    width: 320px !important;
    max-height: 80vh !important;
    overflow-y: auto !important;
    padding: 20px !important;
    background-color: rgba(15, 23, 42, 0.97) !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    color: var(--text-color) !important;
    border-radius: 8px !important;
    z-index: 2147483646 !important;
    box-shadow: 0 8px 30px rgba(0,0,0,0.6) !important;
    font-family: var(--font-family) !important;
    font-size: 14px !important;
    border: 1px solid var(--border-color) !important;

    /* ─── Panel Animation (hidden state) ─── */
    opacity: 0 !important;
    visibility: hidden !important;
    transform: translateY(10px) scale(0.98) !important;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease,
      visibility 0s linear 0.2s !important;
    pointer-events: none !important;
  }

  /* Visible state — toggled by adding .is-visible class */
  #gemini-autoread-settings.is-visible {
    opacity: 1 !important;
    visibility: visible !important;
    transform: translateY(0) scale(1) !important;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease,
      visibility 0s linear 0s !important;
    pointer-events: auto !important;
  }

  /* ─── Custom Scrollbar ───────────────────────────────── */
  #gemini-autoread-settings::-webkit-scrollbar {
    width: 4px;
  }
  #gemini-autoread-settings::-webkit-scrollbar-track {
    background: transparent;
  }
  #gemini-autoread-settings::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 2px;
  }
  #gemini-autoread-settings::-webkit-scrollbar-thumb:hover {
    background: #475569;
  }

  #gemini-autoread-toggle {
    background-color: rgba(15, 23, 42, 0.95) !important;
    font-family: var(--font-family) !important;
    border-radius: 6px !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5) !important;
  }

  /* ─── Interactive Elements ───────────────────────────── */
  button, input, select {
    outline: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    font-family: var(--font-family) !important;
  }

  button:hover {
    transform: translateY(-1px);
    filter: brightness(1.2);
  }
  button:active {
    transform: translateY(1px);
  }

  /* ─── Ko-fi Button ───────────────────────────────────── */
  .kofi-button {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), filter 0.2s ease !important;
    text-decoration: none !important;
  }
  .kofi-button:hover {
    transform: scale(1.04) translateY(-2px) !important;
    filter: brightness(1.1) drop-shadow(0 4px 10px rgba(0,0,0,0.4)) !important;
  }
  .kofi-button:active {
    transform: scale(0.98) !important;
  }

  /* ─── Button Variants ────────────────────────────────── */
  .btn-export { background-color: var(--accent-blue) !important; color: white !important; border-radius: 6px !important; }
  .btn-close  { background-color: var(--accent-red)  !important; color: white !important; border-radius: 6px !important; }

  /* ─── Inputs ─────────────────────────────────────────── */
  input[type="number"], select, input[type="text"] {
    background: #1e293b !important;
    border: 1px solid var(--border-color) !important;
    color: var(--text-color) !important;
    border-radius: 4px !important;
    padding: 4px 6px !important;
  }
  input[type="number"]:focus, select:focus, input[type="text"]:focus {
    border-color: var(--accent-green) !important;
  }
`;
