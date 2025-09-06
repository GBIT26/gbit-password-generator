// GBIT Password Generator Browser Extension
class PasswordGeneratorExtension {
    constructor() {
        this.currentPassword = '';
        this.initializeElements();
        this.loadSettings();
        this.attachEventListeners();
        this.generatePassword(); // Generate initial password
    }

    initializeElements() {
        this.passwordDisplay = document.getElementById('passwordDisplay');
        this.copyBtn = document.getElementById('copyBtn');
        this.generateBtn = document.getElementById('generateBtn');
        this.fillPasswordBtn = document.getElementById('fillPasswordBtn');
        
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.excludeSimilar = document.getElementById('excludeSimilar');
        
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        
        this.presetBtns = document.querySelectorAll('.preset-btn');
    }

    loadSettings() {
        chrome.storage.sync.get({
            length: 16,
            includeLowercase: true,
            includeUppercase: true,
            includeNumbers: true,
            includeSymbols: false,
            excludeSimilar: false
        }, (settings) => {
            this.lengthSlider.value = settings.length;
            this.lengthValue.textContent = settings.length;
            this.includeLowercase.checked = settings.includeLowercase;
            this.includeUppercase.checked = settings.includeUppercase;
            this.includeNumbers.checked = settings.includeNumbers;
            this.includeSymbols.checked = settings.includeSymbols;
            this.excludeSimilar.checked = settings.excludeSimilar;
        });
    }

    saveSettings() {
        const settings = {
            length: parseInt(this.lengthSlider.value),
            includeLowercase: this.includeLowercase.checked,
            includeUppercase: this.includeUppercase.checked,
            includeNumbers: this.includeNumbers.checked,
            includeSymbols: this.includeSymbols.checked,
            excludeSimilar: this.excludeSimilar.checked
        };
        chrome.storage.sync.set(settings);
    }

    attachEventListeners() {
        // Generate button
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        
        // Copy button
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        
        // Fill password button
        this.fillPasswordBtn.addEventListener('click', () => this.fillPassword());
        
        // Length slider
        this.lengthSlider.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthSlider.value;
            this.saveSettings();
            this.generatePassword();
        });
        
        // Checkboxes
        [this.includeLowercase, this.includeUppercase, this.includeNumbers, 
         this.includeSymbols, this.excludeSimilar].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveSettings();
                this.generatePassword();
            });
        });
        
        // Preset buttons
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', () => this.applyPreset(btn.dataset.preset));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'g':
                    case 'G':
                        e.preventDefault();
                        this.generatePassword();
                        break;
                    case 'c':
                    case 'C':
                        if (this.currentPassword) {
                            e.preventDefault();
                            this.copyPassword();
                        }
                        break;
                }
            }
            if (e.key === 'Enter' && e.target === this.passwordDisplay) {
                this.generatePassword();
            }
        });
    }

    applyPreset(preset) {
        // Clear active state from all preset buttons
        this.presetBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active state to clicked button
        event.target.classList.add('active');
        
        const presets = {
            basic: {
                length: 12,
                includeLowercase: true,
                includeUppercase: true,
                includeNumbers: true,
                includeSymbols: false,
                excludeSimilar: false
            },
            strong: {
                length: 16,
                includeLowercase: true,
                includeUppercase: true,
                includeNumbers: true,
                includeSymbols: true,
                excludeSimilar: false
            },
            secure: {
                length: 24,
                includeLowercase: true,
                includeUppercase: true,
                includeNumbers: true,
                includeSymbols: true,
                excludeSimilar: true
            }
        };
        
        const config = presets[preset];
        if (config) {
            this.lengthSlider.value = config.length;
            this.lengthValue.textContent = config.length;
            this.includeLowercase.checked = config.includeLowercase;
            this.includeUppercase.checked = config.includeUppercase;
            this.includeNumbers.checked = config.includeNumbers;
            this.includeSymbols.checked = config.includeSymbols;
            this.excludeSimilar.checked = config.excludeSimilar;
            
            this.saveSettings();
            this.generatePassword();
        }
    }

    generatePassword() {
        const length = parseInt(this.lengthSlider.value);
        let charset = '';
        
        if (this.includeLowercase.checked) {
            charset += 'abcdefghijklmnopqrstuvwxyz';
        }
        if (this.includeUppercase.checked) {
            charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (this.includeNumbers.checked) {
            charset += '0123456789';
        }
        if (this.includeSymbols.checked) {
            charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }
        
        if (this.excludeSimilar.checked) {
            charset = charset.replace(/[0O1lI]/g, '');
        }
        
        if (!charset) {
            this.passwordDisplay.value = 'Select at least one character type';
            this.copyBtn.disabled = true;
            this.fillPasswordBtn.disabled = true;
            this.updateStrengthMeter('', 0);
            return;
        }
        
        // Generate cryptographically secure password
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        
        this.currentPassword = password;
        this.passwordDisplay.value = password;
        this.copyBtn.disabled = false;
        this.fillPasswordBtn.disabled = false;
        
        // Calculate and update strength
        const strength = this.calculatePasswordStrength(password);
        this.updateStrengthMeter(password, strength);
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length scoring
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (password.length >= 16) score += 1;
        if (password.length >= 20) score += 1;
        
        // Character diversity
        if (/[a-z]/.test(password)) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 2;
        
        // Bonus for very long passwords
        if (password.length >= 25) score += 1;
        
        return Math.min(score, 10);
    }

    updateStrengthMeter(password, score) {
        const strengthClasses = ['', 'weak', 'fair', 'good', 'strong'];
        const strengthTexts = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        
        let level = 0;
        if (score >= 8) level = 4; // Strong
        else if (score >= 6) level = 3; // Good
        else if (score >= 4) level = 2; // Fair
        else if (score >= 2) level = 1; // Weak
        
        this.strengthBar.className = 'strength-bar ' + strengthClasses[level];
        this.strengthText.textContent = strengthTexts[level] || 'Generate password';
    }

    async copyPassword() {
        if (!this.currentPassword) return;
        
        try {
            await navigator.clipboard.writeText(this.currentPassword);
            
            // Visual feedback
            this.copyBtn.classList.add('copy-success');
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✓';
            
            setTimeout(() => {
                this.copyBtn.classList.remove('copy-success');
                this.copyBtn.textContent = originalText;
            }, 1000);
            
        } catch (err) {
            console.error('Failed to copy password:', err);
            // Fallback for older browsers
            this.passwordDisplay.select();
            document.execCommand('copy');
        }
    }

    async fillPassword() {
        if (!this.currentPassword) return;
        
        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Execute script to fill password in active input field
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (password) => {
                    const activeElement = document.activeElement;
                    if (activeElement && (
                        activeElement.type === 'password' || 
                        activeElement.type === 'text' ||
                        activeElement.tagName.toLowerCase() === 'input'
                    )) {
                        activeElement.value = password;
                        // Trigger input event for frameworks that listen for it
                        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                        activeElement.dispatchEvent(new Event('change', { bubbles: true }));
                    } else {
                        // If no input is focused, try to find password fields
                        const passwordFields = document.querySelectorAll('input[type="password"], input[name*="password"], input[id*="password"]');
                        if (passwordFields.length > 0) {
                            const field = passwordFields[passwordFields.length - 1]; // Use the last password field
                            field.value = password;
                            field.focus();
                            field.dispatchEvent(new Event('input', { bubbles: true }));
                            field.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                },
                args: [this.currentPassword]
            });
            
            // Close popup after filling
            window.close();
            
        } catch (err) {
            console.error('Failed to fill password:', err);
            // Fallback: just copy to clipboard
            this.copyPassword();
        }
    }
}

// Initialize extension when popup loads
document.addEventListener('DOMContentLoaded', () => {
    new PasswordGeneratorExtension();
});