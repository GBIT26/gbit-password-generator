class PasswordGenerator {
    constructor() {
        this.lowercase = 'abcdefghijklmnopqrstuvwxyz';
        this.uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.numbers = '0123456789';
        this.symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    }

    generate(options = {}) {
        const {
            length = 16,
            includeLowercase = true,
            includeUppercase = true,
            includeNumbers = true,
            includeSymbols = false,
            excludeSimilar = false
        } = options;

        if (length < 1) {
            throw new Error('Password length must be at least 1');
        }

        let charset = '';
        
        if (includeLowercase) charset += this.lowercase;
        if (includeUppercase) charset += this.uppercase;
        if (includeNumbers) charset += this.numbers;
        if (includeSymbols) charset += this.symbols;

        if (excludeSimilar) {
            charset = charset.replace(/[0O1lI]/g, '');
        }

        if (charset === '') {
            throw new Error('At least one character type must be included');
        }

        let password = '';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        return password;
    }

    checkStrength(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)
        };

        const score = Object.values(checks).filter(Boolean).length;
        
        let strength = 'Very Weak';
        if (score >= 5) strength = 'Very Strong';
        else if (score >= 4) strength = 'Strong';
        else if (score >= 3) strength = 'Medium';
        else if (score >= 2) strength = 'Weak';

        return { strength, score, checks };
    }
}

class PasswordGeneratorUI {
    constructor() {
        this.generator = new PasswordGenerator();
        this.initializeElements();
        this.loadPreferences();
        this.loadHistory();
        this.attachEventListeners();
        this.currentPassword = '';
    }

    initializeElements() {
        this.passwordDisplay = document.getElementById('passwordDisplay');
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.excludeSimilar = document.getElementById('excludeSimilar');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        this.strengthDetails = document.getElementById('strengthDetails');
        this.batchCount = document.getElementById('batchCount');
        this.generateBatchBtn = document.getElementById('generateBatchBtn');
        this.batchOutput = document.getElementById('batchOutput');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.presetButtons = document.querySelectorAll('.preset-btn');
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generatePassword());
        this.copyBtn.addEventListener('click', () => this.copyPassword());
        this.lengthSlider.addEventListener('input', () => this.updateLengthValue());
        this.generateBatchBtn.addEventListener('click', () => this.generateBatch());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Preset buttons
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

        // Auto-generate when options change and save preferences
        [this.includeLowercase, this.includeUppercase, this.includeNumbers, 
         this.includeSymbols, this.excludeSimilar].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.savePreferences();
                if (this.currentPassword) {
                    this.generatePassword();
                }
            });
        });

        this.lengthSlider.addEventListener('change', () => {
            this.savePreferences();
            if (this.currentPassword) {
                this.generatePassword();
            }
        });

        // Generate initial password
        this.generatePassword();
    }

    updateLengthValue() {
        this.lengthValue.textContent = this.lengthSlider.value;
    }

    getOptions() {
        return {
            length: parseInt(this.lengthSlider.value),
            includeLowercase: this.includeLowercase.checked,
            includeUppercase: this.includeUppercase.checked,
            includeNumbers: this.includeNumbers.checked,
            includeSymbols: this.includeSymbols.checked,
            excludeSimilar: this.excludeSimilar.checked
        };
    }

    generatePassword() {
        try {
            const options = this.getOptions();
            this.currentPassword = this.generator.generate(options);
            
            this.passwordDisplay.textContent = this.currentPassword;
            this.passwordDisplay.classList.add('has-password');
            this.copyBtn.disabled = false;
            
            this.updateStrengthMeter(this.currentPassword);
            this.addToHistory(this.currentPassword, options);
        } catch (error) {
            this.passwordDisplay.textContent = error.message;
            this.passwordDisplay.classList.remove('has-password');
            this.copyBtn.disabled = true;
            this.resetStrengthMeter();
        }
    }

    async copyPassword() {
        if (!this.currentPassword) return;

        try {
            await navigator.clipboard.writeText(this.currentPassword);
            this.showCopySuccess();
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.currentPassword;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showCopySuccess();
        }
    }

    async copyBatchPassword(password, button) {
        try {
            await navigator.clipboard.writeText(password);
            const originalText = button.textContent;
            button.textContent = '✓ Copied';
            button.style.background = '#28a745';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#28a745';
            }, 1000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    showCopySuccess() {
        const successMsg = document.createElement('div');
        successMsg.className = 'copy-success';
        successMsg.textContent = '✓ Password copied to clipboard!';
        document.body.appendChild(successMsg);

        setTimeout(() => successMsg.classList.add('show'), 100);
        setTimeout(() => {
            successMsg.classList.remove('show');
            setTimeout(() => document.body.removeChild(successMsg), 300);
        }, 2000);
    }

    updateStrengthMeter(password) {
        const result = this.generator.checkStrength(password);
        const colors = {
            'Very Weak': '#dc3545',
            'Weak': '#fd7e14',
            'Medium': '#ffc107',
            'Strong': '#20c997',
            'Very Strong': '#28a745'
        };

        const widths = {
            'Very Weak': '20%',
            'Weak': '40%',
            'Medium': '60%',
            'Strong': '80%',
            'Very Strong': '100%'
        };

        this.strengthBar.style.width = widths[result.strength];
        this.strengthBar.style.background = colors[result.strength];
        this.strengthText.textContent = `${result.strength} (${result.score}/5)`;
        this.strengthText.style.color = colors[result.strength];

        const details = [];
        if (result.checks.length) details.push('✓ 8+ characters');
        else details.push('✗ 8+ characters');
        
        if (result.checks.lowercase) details.push('✓ Lowercase');
        else details.push('✗ Lowercase');
        
        if (result.checks.uppercase) details.push('✓ Uppercase');
        else details.push('✗ Uppercase');
        
        if (result.checks.numbers) details.push('✓ Numbers');
        else details.push('✗ Numbers');
        
        if (result.checks.symbols) details.push('✓ Symbols');
        else details.push('✗ Symbols');

        this.strengthDetails.innerHTML = details.join(' &nbsp;&nbsp; ');
    }

    resetStrengthMeter() {
        this.strengthBar.style.width = '0%';
        this.strengthText.textContent = 'Generate a password to see strength';
        this.strengthText.style.color = '#6c757d';
        this.strengthDetails.textContent = '';
    }

    generateBatch() {
        const count = parseInt(this.batchCount.value);
        if (count < 1 || count > 20) {
            alert('Please enter a number between 1 and 20');
            return;
        }

        try {
            const options = this.getOptions();
            const passwords = [];
            
            for (let i = 0; i < count; i++) {
                passwords.push(this.generator.generate(options));
            }

            this.displayBatchPasswords(passwords);
        } catch (error) {
            alert(error.message);
        }
    }

    displayBatchPasswords(passwords) {
        this.batchOutput.innerHTML = '';
        
        passwords.forEach((password, index) => {
            const passwordDiv = document.createElement('div');
            passwordDiv.className = 'batch-password';
            
            const passwordSpan = document.createElement('span');
            passwordSpan.textContent = `${index + 1}. ${password}`;
            
            const copyBtn = document.createElement('button');
            copyBtn.className = 'batch-copy';
            copyBtn.textContent = 'Copy';
            copyBtn.addEventListener('click', () => this.copyBatchPassword(password, copyBtn));
            
            passwordDiv.appendChild(passwordSpan);
            passwordDiv.appendChild(copyBtn);
            this.batchOutput.appendChild(passwordDiv);
        });

        this.batchOutput.classList.add('show');
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + G = Generate Password
        if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
            e.preventDefault();
            this.generatePassword();
            this.showToast('🎲 Password generated!');
        }
        
        // Ctrl/Cmd + C = Copy Password (when password is focused or no input focused)
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && 
            (!e.target.matches('input, textarea') || e.target === this.passwordDisplay)) {
            if (this.currentPassword) {
                e.preventDefault();
                this.copyPassword();
            }
        }
        
        // Spacebar = Generate new password (when not in input field)
        if (e.key === ' ' && !e.target.matches('input, textarea, button')) {
            e.preventDefault();
            this.generatePassword();
        }
        
        // Escape = Clear password
        if (e.key === 'Escape') {
            this.clearPassword();
        }
    }

    clearPassword() {
        this.currentPassword = '';
        this.passwordDisplay.textContent = 'Click "Generate Password" to create a secure password';
        this.passwordDisplay.classList.remove('has-password');
        this.copyBtn.disabled = true;
        this.resetStrengthMeter();
    }

    showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            font-family: inherit;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, duration);
    }

    loadPreferences() {
        try {
            const saved = localStorage.getItem('gbit-password-preferences');
            if (saved) {
                const prefs = JSON.parse(saved);
                
                // Apply saved preferences
                if (prefs.length !== undefined) {
                    this.lengthSlider.value = prefs.length;
                    this.lengthValue.textContent = prefs.length;
                }
                
                if (prefs.includeLowercase !== undefined) this.includeLowercase.checked = prefs.includeLowercase;
                if (prefs.includeUppercase !== undefined) this.includeUppercase.checked = prefs.includeUppercase;
                if (prefs.includeNumbers !== undefined) this.includeNumbers.checked = prefs.includeNumbers;
                if (prefs.includeSymbols !== undefined) this.includeSymbols.checked = prefs.includeSymbols;
                if (prefs.excludeSimilar !== undefined) this.excludeSimilar.checked = prefs.excludeSimilar;
            }
        } catch (error) {
            console.warn('Could not load preferences:', error);
        }
    }

    savePreferences() {
        try {
            const prefs = {
                length: parseInt(this.lengthSlider.value),
                includeLowercase: this.includeLowercase.checked,
                includeUppercase: this.includeUppercase.checked,
                includeNumbers: this.includeNumbers.checked,
                includeSymbols: this.includeSymbols.checked,
                excludeSimilar: this.excludeSimilar.checked,
                lastSaved: Date.now()
            };
            
            localStorage.setItem('gbit-password-preferences', JSON.stringify(prefs));
        } catch (error) {
            console.warn('Could not save preferences:', error);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('gbit-password-history');
            this.passwordHistory = saved ? JSON.parse(saved) : [];
            this.updateHistoryDisplay();
        } catch (error) {
            console.warn('Could not load history:', error);
            this.passwordHistory = [];
        }
    }

    addToHistory(password, options) {
        const historyItem = {
            password,
            timestamp: Date.now(),
            length: password.length,
            options
        };

        // Add to beginning of array
        this.passwordHistory.unshift(historyItem);
        
        // Keep only last 5 passwords
        if (this.passwordHistory.length > 5) {
            this.passwordHistory = this.passwordHistory.slice(0, 5);
        }

        this.saveHistory();
        this.updateHistoryDisplay();
    }

    saveHistory() {
        try {
            localStorage.setItem('gbit-password-history', JSON.stringify(this.passwordHistory));
        } catch (error) {
            console.warn('Could not save history:', error);
        }
    }

    updateHistoryDisplay() {
        if (!this.passwordHistory || this.passwordHistory.length === 0) {
            this.historyList.innerHTML = '<p class="no-history">No passwords generated yet</p>';
            return;
        }

        const historyHTML = this.passwordHistory.map((item, index) => {
            const timeAgo = this.getTimeAgo(item.timestamp);
            return `
                <div class="history-item">
                    <span class="history-password">${item.password}</span>
                    <div class="history-meta">
                        <span>${item.length} chars</span>
                        <span>${timeAgo}</span>
                        <button class="history-copy" onclick="window.passwordUI.copyHistoryPassword('${item.password}', this)">Copy</button>
                    </div>
                </div>
            `;
        }).join('');

        this.historyList.innerHTML = historyHTML;
    }

    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return new Date(timestamp).toLocaleDateString();
    }

    async copyHistoryPassword(password, button) {
        try {
            await navigator.clipboard.writeText(password);
            const originalText = button.textContent;
            button.textContent = '✓';
            button.style.background = '#28a745';
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '#b0b0b0';
            }, 1000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }

    clearHistory() {
        if (confirm('Clear all password history?')) {
            this.passwordHistory = [];
            this.saveHistory();
            this.updateHistoryDisplay();
            this.showToast('🗑️ History cleared');
        }
    }

    applyPreset(presetName) {
        // Remove active class from all preset buttons
        this.presetButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        const clickedBtn = document.querySelector(`[data-preset="${presetName}"]`);
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }

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
            wifi: {
                length: 16,
                includeLowercase: true,
                includeUppercase: true,
                includeNumbers: true,
                includeSymbols: false,
                excludeSimilar: true
            },
            banking: {
                length: 20,
                includeLowercase: true,
                includeUppercase: true,
                includeNumbers: true,
                includeSymbols: true,
                excludeSimilar: true
            }
        };

        const preset = presets[presetName];
        if (preset) {
            // Apply preset settings
            this.lengthSlider.value = preset.length;
            this.lengthValue.textContent = preset.length;
            this.includeLowercase.checked = preset.includeLowercase;
            this.includeUppercase.checked = preset.includeUppercase;
            this.includeNumbers.checked = preset.includeNumbers;
            this.includeSymbols.checked = preset.includeSymbols;
            this.excludeSimilar.checked = preset.excludeSimilar;

            // Save preferences and generate new password
            this.savePreferences();
            this.generatePassword();
            this.showToast(`📋 Applied ${presetName} preset`);
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.passwordUI = new PasswordGeneratorUI();
});