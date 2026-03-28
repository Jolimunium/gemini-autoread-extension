"use strict";
globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * StartupConfig: Settings component for configuring default startup behavior.
 * Provides two dropdowns:
 * - "Start Auto-Read": Whether auto-read should be ON or OFF on a new session.
 * - "Start Sync In": Whether the default sync mode is Local or Global.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @returns {HTMLElement} A wrapper div containing the section header and two setting rows.
 */
globalThis.GAR_Components.StartupConfig = (state, createEl) => {
  const defLabel = createEl(
    "div",
    {
      fontWeight: "bold",
      marginBottom: "8px",
      marginTop: "15px",
      borderTop: "1px solid #444",
      paddingTop: "10px",
    },
    { textContent: "🚀 Default Startup Settings:" },
  );

  // Row 1: "Start Auto-Read" — whether auto-read starts ON or OFF by default.
  const defToggleWrapper = createEl("div", {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "5px",
    fontSize: "13px",
  });
  defToggleWrapper.appendChild(
    createEl("span", {}, { textContent: "Start Auto-Read:" }),
  );
  const defToggleSelect = createEl(
    "select",
    {
      padding: "4px",
      background: "#333",
      color: "#fff",
      border: "1px solid #555",
      borderRadius: "4px",
      cursor: "pointer",
    },
    { id: "gemini-autoread-default-toggle" },
  );
  defToggleSelect.appendChild(
    createEl("option", {}, { value: "true", textContent: "ON" }),
  );
  defToggleSelect.appendChild(
    createEl("option", {}, { value: "false", textContent: "OFF" }),
  );
  defToggleSelect.value = state.defaultEnabled ? "true" : "false";

  defToggleSelect.onchange = (e) => {
    state.defaultEnabled = e.target.value === "true";
    GAR_State.save();
  };
  defToggleWrapper.appendChild(defToggleSelect);

  // Row 2: "Start Sync In" — whether the default sync mode is Local or Global.
  const defModeWrapper = createEl("div", {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "5px",
    fontSize: "13px",
  });
  defModeWrapper.appendChild(
    createEl("span", {}, { textContent: "Start Sync In:" }),
  );
  const defModeSelect = createEl(
    "select",
    {
      padding: "4px",
      background: "#333",
      color: "#fff",
      border: "1px solid #555",
      borderRadius: "4px",
      cursor: "pointer",
    },
    { id: "gemini-autoread-default-mode" },
  );
  defModeSelect.appendChild(
    createEl("option", {}, { value: "local", textContent: "Local" }),
  );
  defModeSelect.appendChild(
    createEl("option", {}, { value: "global", textContent: "Global" }),
  );
  defModeSelect.value = state.defaultSyncMode;

  defModeSelect.onchange = (e) => {
    state.defaultSyncMode = e.target.value;
    GAR_State.save();
  };
  defModeWrapper.appendChild(defModeSelect);

  const wrapper = createEl("div");
  wrapper.appendChild(defLabel);
  wrapper.appendChild(defToggleWrapper);
  wrapper.appendChild(defModeWrapper);
  return wrapper;
};
