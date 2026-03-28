"use strict";
// Initialize the shared component namespace to prevent naming collisions.
globalThis.GAR_Components = globalThis.GAR_Components || {};

/**
 * FloatingToggle: The persistent floating button widget anchored to the bottom-right corner.
 * Consists of two interactive areas:
 * - Left (togglePart): Toggles auto-read ON/OFF.
 * - Right (settingsPart): Opens/closes the settings panel.
 * @param {object} state - The shared application state object.
 * @param {function} createEl - Utility function to create styled DOM elements.
 * @param {function} updateToggleUI - Callback to refresh the toggle button appearance.
 * @param {function} togglePanelCallback - Callback to open or close the settings panel.
 * @param {function} onToggleCallback - Callback to toggle the auto-read enabled state.
 * @returns {HTMLElement} The fully constructed floating toggle container.
 */
globalThis.GAR_Components.FloatingToggle = (
  state,
  createEl,
  updateToggleUI,
  togglePanelCallback,
  onToggleCallback,
) => {
  // Outer container: the floating widget fixed to bottom-right of the screen.
  const container = createEl(
    "div",
    {
      position: "fixed",
      bottom: GAR_Config.LAYOUT.TOGGLE_BOTTOM,
      right: GAR_Config.LAYOUT.TOGGLE_RIGHT,
      backgroundColor: "rgba(30, 30, 30, 0.6)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      color: "white",
      borderRadius: "12px",
      zIndex: "2147483647",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      fontFamily: "sans-serif",
      fontSize: "14px",
      userSelect: "none",
      display: "flex",
      alignItems: "center",
      border: `2px solid ${state.isAutoReadEnabled ? GAR_Config.COLORS.GREEN : GAR_Config.COLORS.RED}`,
      transition: "all 0.3s ease",
      padding: "0",
    },
    { id: "gemini-autoread-toggle" }, // ID used to reference this element for color updates.
  );

  // Left section: clickable area that toggles auto-read ON/OFF.
  const togglePart = createEl("div", {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    cursor: "pointer",
    borderTopLeftRadius: "10px",
    borderBottomLeftRadius: "10px",
  });

  // Mic icon, label text, and ON/OFF status badge.
  togglePart.appendChild(
    createEl("span", { fontSize: "18px", transition: "filter 0.3s" }, { id: "gemini-autoread-mic-icon", textContent: "🎙️" }),
  );
  togglePart.appendChild(createEl("span", {}, { textContent: "Auto-Read:" }));
  togglePart.appendChild(
    createEl(
      "strong",
      {
        color: state.isAutoReadEnabled ? GAR_Config.COLORS.GREEN : GAR_Config.COLORS.RED,
        marginLeft: "4px",
      },
      {
        id: "status-text",
        textContent: state.isAutoReadEnabled ? "ON" : "OFF",
      },
    ),
  );

  // On click: invoke the toggle callback to flip the enabled state, save, and update UI.
  togglePart.onclick = () => {
    if (onToggleCallback) {
      onToggleCallback();
    } else {
      // Fallback if callback not provided
      state.isAutoReadEnabled = !state.isAutoReadEnabled;
      GAR_State.save();
      updateToggleUI();
    }
  };

  // Hover effect: subtle background highlight when hovering over the toggle area.
  togglePart.onmouseenter = () =>
    (togglePart.style.backgroundColor = "rgba(255,255,255,0.1)");
  togglePart.onmouseleave = () =>
    (togglePart.style.backgroundColor = "transparent");

  // Right section: the gear icon button that opens the settings panel.
  const settingsPart = createEl("div", {
    padding: "10px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    borderTopRightRadius: "10px",
    borderBottomRightRadius: "10px",
  });
  const gear = createEl(
    "span",
    { fontSize: "18px", transition: "transform 0.3s" },
    { textContent: "⚙️" },
  );

  settingsPart.appendChild(gear);

  // On click: open or close the settings panel via the callback.
  settingsPart.onclick = (e) => {
    e.stopPropagation();
    togglePanelCallback();
  };

  // Hover effect: highlight background and rotate gear icon on hover.
  settingsPart.onmouseenter = () => {
    settingsPart.style.backgroundColor = "rgba(255,255,255,0.1)";
    gear.style.transform = "rotate(45deg)";
  };
  settingsPart.onmouseleave = () => {
    settingsPart.style.backgroundColor = "transparent";
    gear.style.transform = "rotate(0deg)";
  };

  container.appendChild(togglePart);
  // Vertical divider between the two sections.
  container.appendChild(
    createEl("div", { width: "1px", height: "20px", backgroundColor: "#666" }),
  );
  container.appendChild(settingsPart);

  return container;
};
