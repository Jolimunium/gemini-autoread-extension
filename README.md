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
  - 🟢 **Green**: Successfully triggered playback.
  - 🔴 **Red**: Error or timeout (monitors if the voice actually started).
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

## 📦 Installation

Install the extension directly from the **Chrome Web Store**:

[👉 **Get it on Chrome Web Store**](https://chromewebstore.google.com/detail/nhkhdpeeolebfhjchlhaimkcgpfcmmbp?utm_source=item-share-cb)

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

| ![Toggle On](assets/toggle-on.png) | ![Toggle Off](assets/toggle-off.png) | ![Settings Panel](assets/settings-panel.png) |
| :---: | :---: | :---: |

---

## ☕ Support the Project

If this extension saves you time and clicks, consider supporting its development:

[![ko-fi](src/assets/kofi_button.svg)](https://ko-fi.com/olipium)

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
