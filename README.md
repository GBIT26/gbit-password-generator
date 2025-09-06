# 🔐 GBIT Password Generator

A secure, user-friendly password generator by GBIT Automation, available as both a desktop application and web app. Generate strong passwords with customizable options and real-time strength analysis.

## ✨ Features

- **🎲 Secure Generation**: Uses cryptographically secure random number generation
- **🎨 Modern Interface**: Beautiful, responsive design that works on all devices
- **⚡ Real-time Updates**: Instant password generation as you adjust settings
- **📊 Strength Analysis**: Visual strength meter with detailed feedback
- **📋 One-click Copy**: Easy clipboard copying with success notifications
- **🔢 Batch Generation**: Create multiple passwords at once (up to 20)
- **🎯 Customizable Options**:
  - Adjustable length (4-128 characters)
  - Include/exclude lowercase letters
  - Include/exclude uppercase letters
  - Include/exclude numbers
  - Include/exclude symbols
  - Exclude similar characters (0, O, 1, l, I)

## 🚀 Quick Start

### Desktop App (Recommended)

1. **Download** the latest release for your platform:
   - Windows: `GBIT-Password-Generator-Setup.exe`
   - macOS: `GBIT-Password-Generator.dmg`
   - Linux: `GBIT-Password-Generator.AppImage`

2. **Install** and run the application

### Web Version

Run locally:

```bash
# Clone or download this repository
cd password-generator
python3 -m http.server 8000
# Open http://localhost:8000 in your browser
```

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm

### Setup

```bash
# Install dependencies
npm install

# Run desktop app in development
npm start

# Run web version locally
npm run web

# Build desktop apps
npm run build           # Build for current platform
npm run build-win      # Build for Windows
npm run build-mac      # Build for macOS
npm run build-linux    # Build for Linux
```

### Project Structure

```
password-generator/
├── index.html          # Main HTML file
├── style.css          # Styles and responsive design
├── script.js          # Password generation and UI logic
├── electron-main.js   # Electron main process
├── package.json       # Project configuration
├── assets/           # Icons and images
└── dist/            # Built applications (after build)
```

## 🔒 Security

- **No Network Requests**: All generation happens locally - your passwords never leave your device
- **Cryptographically Secure**: Uses `crypto.getRandomValues()` for true randomness
- **No Storage**: Passwords are not saved or logged anywhere
- **Open Source**: Full transparency - inspect the code yourself

## 📦 Distribution Options

### 1. Desktop Applications
- **Cross-platform**: Windows, macOS, Linux
- **Standalone**: No dependencies required
- **Native feel**: Integrates with OS menus and shortcuts

### 2. Web Application
- **Universal access**: Works in any modern browser
- **No installation**: Instant access via URL
- **Mobile friendly**: Responsive design for all devices

### 3. PWA (Progressive Web App)
- **Install from browser**: Add to home screen
- **Offline capable**: Works without internet connection
- **App-like experience**: Full-screen, native feel

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/GBIT26/gbit-password-generator/issues) page
2. Create a new issue with detailed information
3. For security concerns, please contact us through [gbitautomation.com.au](https://gbitautomation.com.au)

## 🎯 Roadmap

- [ ] Browser extension
- [ ] Mobile apps (iOS/Android)
- [ ] Password strength history
- [ ] Export to password managers
- [ ] Custom character sets
- [ ] Password templates

---

**Made with ❤️ by GBIT Automation for better digital security**

Visit us at: [gbitautomation.com.au](https://gbitautomation.com.au)