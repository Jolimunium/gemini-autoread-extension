# 🎙️ Gemini Auto-Read Extension

**Gemini Auto-Read** is a Chrome Extension that enhances your [Gemini](https://gemini.google.com) experience by automatically playing the voice response as soon as a new answer appears. Stop clicking the volume icon manually—let the extension handle it for you.

---

## ✨ Features

- **🚀 Instant Auto-play**: Seamlessly detects and plays Gemini's audio responses the moment they finish generating.
- **⚙️ Advanced Settings Panel**: A sleek, non-intrusive floating UI to customize your experience.
- **🔄 Smart Sync Modes**:
  - **Global Mode**: Sync settings across all open Gemini tabs and browser windows.
  - **Tab-specific Mode**: Control auto-read independently for each conversation.
- **⌨️ Customizable Shortcuts**: Fast-access keys for toggling the feature or opening settings.
- **🔔 Visual Logic Feedback**: The microphone icon changes color to reflect real-time status:
  - <span style="color:#10b981">●</span> **Green**: Successfully triggered playback.
  - <span style="color:#f43f5e">●</span> **Red**: Error or timeout (monitors if the voice actually started).
- **💾 Startup Preferences**: Configure whether the extension starts **Enabled** or **Disabled** by default.
- **📥 Debug Log Export**: One-click download of activity logs (JSON) for easy troubleshooting.

---

## ⌨️ Keyboard Shortcuts (Default)

| Action                  | Shortcut           |
| :---------------------- | :----------------- |
| **Toggle Auto-Read**    | `Ctrl + Shift + E` |
| **Open Settings Panel** | `Ctrl + Shift + S` |

> [!TIP]
> You can rebind these keys to any combination you prefer directly in the **Shortcuts** section of the Settings panel.

---

## 🛠️ Usage & Configuration

### 🔍 Fine-Tuning Playback

To ensure the best experience on different devices and internet speeds, you can adjust:

- **Debounce Time**: The delay (in ms) after Gemini finishes generating before the extension attempts to click. This ensures the UI is stable and the button is interactive.
- **Max Attempts (Retry Policy)**: If the first click doesn't trigger the voice (e.g., due to page lag), the extension will intelligently retry up to your specified limit until playback is confirmed.

### 🌐 Synchronization

Change the **Default Sync Mode** to decide how new tabs should behave. **Global Sync** is perfect for power users who want a consistent "always-on" voice experience across multiple Gemini instances.

---

## 📸 Screenshots

![Preview](assets/preview.png)

<p align="center">
  <img src="assets/toggle-on.png" width="30%" />
  <img src="assets/toggle-off.png" width="30%" />
  <img src="assets/settings-panel.png" width="30%" />
</p>

---

## ☕ Support the Project

If this extension saves you time and clicks, consider supporting its development:

[![ko-fi](https://storage.ko-fi.com/cdn/kofiv2.png)](https://ko-fi.com/olipium)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes and open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by [Jolimunium](https://github.com/Jolimunium)
