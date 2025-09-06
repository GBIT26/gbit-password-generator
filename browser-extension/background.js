// GBIT Password Generator Extension Background Script

// Install event
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('GBIT Password Generator extension installed');
        
        // Set default settings
        chrome.storage.sync.set({
            length: 16,
            includeLowercase: true,
            includeUppercase: true,
            includeNumbers: true,
            includeSymbols: false,
            excludeSimilar: false
        });
    }
});

// Context menu (optional - for right-click password generation)
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'generatePassword',
        title: 'Generate Password',
        contexts: ['editable']
    });
    
    chrome.contextMenus.create({
        id: 'fillStrongPassword',
        title: 'Fill Strong Password',
        contexts: ['editable']
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'generatePassword' || info.menuItemId === 'fillStrongPassword') {
        // Get settings and generate password
        chrome.storage.sync.get({
            length: info.menuItemId === 'fillStrongPassword' ? 16 : 12,
            includeLowercase: true,
            includeUppercase: true,
            includeNumbers: true,
            includeSymbols: info.menuItemId === 'fillStrongPassword',
            excludeSimilar: false
        }, (settings) => {
            const password = generateSecurePassword(settings);
            
            // Fill the password into the active field
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (generatedPassword) => {
                    const activeElement = document.activeElement;
                    if (activeElement && (
                        activeElement.type === 'password' || 
                        activeElement.type === 'text' ||
                        activeElement.tagName.toLowerCase() === 'input'
                    )) {
                        activeElement.value = generatedPassword;
                        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                        activeElement.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                },
                args: [password]
            });
        });
    }
});

// Generate secure password function (shared with popup)
function generateSecurePassword(settings) {
    let charset = '';
    
    if (settings.includeLowercase) {
        charset += 'abcdefghijklmnopqrstuvwxyz';
    }
    if (settings.includeUppercase) {
        charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    if (settings.includeNumbers) {
        charset += '0123456789';
    }
    if (settings.includeSymbols) {
        charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }
    
    if (settings.excludeSimilar) {
        charset = charset.replace(/[0O1lI]/g, '');
    }
    
    if (!charset) {
        return 'Error: No character types selected';
    }
    
    // Generate cryptographically secure password
    const array = new Uint8Array(settings.length);
    crypto.getRandomValues(array);
    
    let password = '';
    for (let i = 0; i < settings.length; i++) {
        password += charset[array[i] % charset.length];
    }
    
    return password;
}

// Keyboard shortcut handler
chrome.commands.onCommand.addListener((command) => {
    if (command === 'generate-password') {
        chrome.action.openPopup();
    }
});

// Badge text (optional - could show password strength or count)
chrome.action.setBadgeBackgroundColor({ color: '#b0b0b0' });