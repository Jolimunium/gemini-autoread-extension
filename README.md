# 🎙️ Gemini Auto-Read Extension

**Gemini Auto-Read** is a Chrome Extension that automatically reads [Gemini's](https://gemini.google.com) responses out loud for you — no more clicking the speaker button every single time.

---

## ✨ Features

- **🚀 Auto-plays voice responses**: As soon as Gemini finishes answering, the extension clicks the read-aloud button for you automatically.
- **⚙️ Easy settings panel**: A small floating panel lets you tweak how the extension behaves without leaving the page.
- **🔄 Two sync modes**:
  - **Global Mode**: One setting applies to all your Gemini tabs at once.
  - **Tab Mode**: Each tab has its own independent on/off switch.
- **⌨️ Keyboard shortcuts**: Toggle auto-read or open settings without touching the mouse.
- **🔔 Status indicator**: The microphone icon tells you what's happening at a glance:
  - 🟢 **Green**: Voice playback started successfully.
  - 🔴 **Red**: Something went wrong or timed out.
- **💾 Default startup state**: Choose whether the extension starts on or off when you open a new tab.
- **📥 Debug log export**: Download a log file if you need to troubleshoot an issue.

---

## ⌨️ Keyboard Shortcuts (Default)

| Action | Shortcut |
| :--- | :--- |
| **Turn Auto-Read On/Off** | `Ctrl + Shift + E` |
| **Open Settings Panel** | `Ctrl + Shift + S` |

> [!TIP]
> You can change these shortcuts to anything you like inside the Settings panel.

---

## 📦 Installation

Install from the Chrome Web Store:

[👉 **Get it on Chrome Web Store**](https://chromewebstore.google.com/detail/nhkhdpeeolebfhjchlhaimkcgpfcmmbp?utm_source=item-share-cb)

---

## 🛠️ Settings & Customization

### Playback Timing

Two settings help smooth out the experience on slower connections or devices:

- **Debounce Time**: How long (in milliseconds) the extension waits after Gemini finishes before trying to play. A small delay makes sure the page is fully ready.
- **Max Attempts**: If the first click doesn't work, the extension will try again — up to however many times you set here.

### Sync Mode

Pick **Global Mode** if you want auto-read to always be on across every Gemini tab. Pick **Tab Mode** if you'd rather control each conversation separately.

---

## 📸 Screenshots

![Preview](assets/preview.png)

| ![Toggle On](assets/toggle-on.png) | ![Toggle Off](assets/toggle-off.png) | ![Settings Panel](assets/settings-panel.png) |
| :---: | :---: | :---: |

---

## ☕ Support the Project

If this extension makes your day a little easier, a coffee would be much appreciated:

[![ko-fi](src/assets/kofi_button.svg)](https://ko-fi.com/olipium)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes and open a Pull Request.

---

## 📜 License

Licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by [Jolimunium](https://github.com/Jolimunium)
