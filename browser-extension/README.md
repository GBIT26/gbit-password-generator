# 🔐 GBIT Password Generator Browser Extension

A powerful browser extension for generating secure passwords directly in your browser. Right-click on any input field or use the toolbar icon to generate strong, customizable passwords.

## ✨ Features

- **🎯 One-click Generation**: Click the toolbar icon or right-click on input fields
- **⌨️ Keyboard Shortcuts**: Ctrl+Shift+G (Cmd+Shift+G on Mac) to open
- **🎨 Custom Options**: Adjust length, character types, and complexity
- **📋 Auto-copy**: Passwords automatically copied to clipboard
- **🔑 Auto-fill**: Fill passwords directly into active form fields
- **💾 Settings Sync**: Your preferences sync across devices
- **🔒 Secure**: Uses cryptographically secure random generation
- **🎨 Modern UI**: Clean, responsive design matching GBIT branding

## 🚀 Installation

### From Chrome Web Store (Coming Soon)
1. Visit the Chrome Web Store
2. Search for "GBIT Password Generator"
3. Click "Add to Chrome"

### Manual Installation (Developer Mode)
1. **Download**: Clone or download this repository
2. **Enable Developer Mode**: 
   - Open Chrome/Edge and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right
3. **Load Extension**:
   - Click "Load unpacked"
   - Select the `browser-extension` folder
4. **Pin Extension**: Click the puzzle piece icon and pin GBIT Password Generator

## 🎯 Usage

### Toolbar Icon
1. Click the GBIT Password Generator icon in your browser toolbar
2. Adjust settings as needed (length, character types)
3. Click "Generate" to create a new password
4. Use "📋" to copy or "🔑 Fill Password" to auto-fill active fields

### Right-click Context Menu
1. Right-click on any password field or input
2. Select "Generate Password" or "Fill Strong Password"
3. Password is automatically filled into the field

### Keyboard Shortcuts
- **Ctrl+Shift+G** (Windows/Linux) or **Cmd+Shift+G** (Mac): Open password generator
- **Ctrl+G** (inside popup): Generate new password
- **Ctrl+C** (inside popup): Copy password to clipboard
- **Enter** (inside popup): Generate new password

## ⚙️ Settings

### Password Options
- **Length**: 4-64 characters (slider)
- **Lowercase**: a-z characters
- **Uppercase**: A-Z characters  
- **Numbers**: 0-9 digits
- **Symbols**: Special characters (!@#$%^&*)
- **Exclude Similar**: Remove confusing characters (0,O,1,l,I)

### Quick Presets
- **Basic**: 12 chars, letters + numbers
- **Strong**: 16 chars, letters + numbers + symbols
- **Secure**: 24 chars, all options + exclude similar

## 🔒 Security & Privacy

- **Local Generation**: All passwords generated locally in your browser
- **No Network Requests**: Extension works completely offline
- **No Data Collection**: We don't track, store, or transmit your passwords
- **Secure Random**: Uses `crypto.getRandomValues()` for cryptographic randomness
- **Settings Sync**: Only your preferences (not passwords) sync via Chrome

## 🛠️ Development

### Prerequisites
- Chrome/Chromium browser
- Basic understanding of browser extensions

### Local Development
1. Clone the repository
2. Navigate to `browser-extension/` folder
3. Load as unpacked extension in Chrome
4. Make changes and reload extension to test

### File Structure
```
browser-extension/
├── manifest.json       # Extension configuration
├── popup.html         # Main popup interface
├── popup.css          # Styling
├── popup.js           # Popup logic
├── background.js      # Background service worker
├── icons/            # Extension icons
└── README.md         # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in multiple browsers
5. Submit a pull request

## 📋 Browser Compatibility

- ✅ Chrome 88+
- ✅ Microsoft Edge 88+
- ✅ Opera 74+
- ✅ Brave Browser
- ⚠️ Firefox (requires manifest v2 version - coming soon)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/GBIT26/gbit-password-generator/issues)
- **Website**: [gbitautomation.com.au](https://gbitautomation.com.au)
- **Email**: Contact us through our website

## 🎯 Roadmap

- [ ] Firefox support (Manifest V2)
- [ ] Safari extension
- [ ] Password strength history
- [ ] Custom character sets
- [ ] Bulk password generation
- [ ] Integration with password managers
- [ ] Multi-language support

---

**Made with ❤️ by GBIT Automation for better digital security**