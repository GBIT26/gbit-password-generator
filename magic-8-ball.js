// Mystical Password Oracle - Magic 8-Ball JavaScript
class MysticalPasswordOracle {
    constructor() {
        this.isShaking = false;
        this.isRevealing = false;
        this.currentPassword = '';
        this.shakeTimeout = null;
        this.particleCount = 0;
        
        this.initializeElements();
        this.attachEventListeners();
        this.createMysticalParticles();
        this.loadMysticalSettings();
        
        // Initialize with mystical state
        this.showMysticalMessage("The oracle awaits your command...");
    }

    initializeElements() {
        // Magic 8-Ball elements
        this.magic8Ball = document.getElementById('magic8Ball');
        this.ballOuter = this.magic8Ball.querySelector('.ball-outer');
        this.fogLayer = document.getElementById('fogLayer');
        this.passwordReveal = document.getElementById('passwordReveal');
        this.shakeInstructions = document.getElementById('shakeInstructions');
        
        // Control elements
        this.generateBtn = document.getElementById('generateBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // Settings elements
        this.lengthSlider = document.getElementById('lengthSlider');
        this.lengthValue = document.getElementById('lengthValue');
        this.includeLowercase = document.getElementById('includeLowercase');
        this.includeUppercase = document.getElementById('includeUppercase');
        this.includeNumbers = document.getElementById('includeNumbers');
        this.includeSymbols = document.getElementById('includeSymbols');
        this.excludeSimilar = document.getElementById('excludeSimilar');
        
        // Display elements
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthText = document.getElementById('strengthText');
        this.historyList = document.getElementById('historyList');
        this.particles = document.getElementById('particles');
        
        // Preset buttons
        this.presetBtns = document.querySelectorAll('.preset-btn');
    }

    attachEventListeners() {
        // Magic 8-Ball interactions
        this.ballOuter.addEventListener('click', () => this.invokeOracle());
        
        // Shake detection for mobile
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (e) => this.handleDeviceMotion(e));
        }
        
        // Keyboard shake (spacebar or Enter)
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.invokeOracle();
            }
        });
        
        // Control buttons
        this.generateBtn.addEventListener('click', () => this.invokeOracle());
        this.copyBtn.addEventListener('click', () => this.transcribePassword());
        this.clearHistoryBtn.addEventListener('click', () => this.clearVisions());
        
        // Settings
        this.lengthSlider.addEventListener('input', () => {
            this.lengthValue.textContent = this.lengthSlider.value;
            this.saveMysticalSettings();
        });
        
        // Spell components (checkboxes)
        [this.includeLowercase, this.includeUppercase, this.includeNumbers, 
         this.includeSymbols, this.excludeSimilar].forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveMysticalSettings();
                this.updateSpellComponents();
            });
        });
        
        // Preset incantations
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', () => this.castPresetSpell(btn.dataset.preset));
        });
    }

    handleDeviceMotion(event) {
        if (this.isShaking || this.isRevealing) return;
        
        const acceleration = event.accelerationIncludingGravity;
        const threshold = 15;
        
        if (acceleration && 
            (Math.abs(acceleration.x) > threshold || 
             Math.abs(acceleration.y) > threshold || 
             Math.abs(acceleration.z) > threshold)) {
            
            this.invokeOracle();
        }
    }

    invokeOracle() {
        if (this.isShaking || this.isRevealing) return;
        
        this.isShaking = true;
        this.shakeInstructions.style.opacity = '0';
        
        // Add shaking animation
        this.ballOuter.classList.add('shaking');
        
        // Create magical effects
        this.createShakeParticles();
        this.intensifyFog();
        
        // Show mystical preparation message
        this.showMysticalMessage("The oracle stirs... consulting the digital spirits...");
        
        // After shake animation, reveal password
        setTimeout(() => {
            this.ballOuter.classList.remove('shaking');
            this.revealMysticalPassword();
        }, 800);
    }

    revealMysticalPassword() {
        this.isRevealing = true;
        
        // Generate the mystical password
        const password = this.generateSecurePassword();
        
        if (!password || password.includes('Error') || password.includes('Select')) {
            this.showMysticalMessage("The spirits are displeased... check your spell components");
            this.resetOracleState();
            return;
        }
        
        this.currentPassword = password;
        
        // Gradually clear fog and reveal password
        this.clearFog(() => {
            this.showRevealedPassword(password);
            this.analyzeMysticalPower(password);
            this.addToVisions(password);
            this.enableActions();
            
            setTimeout(() => {
                this.resetOracleState();
            }, 5000); // Keep password visible for 5 seconds
        });
    }

    showRevealedPassword(password) {
        const revealDiv = this.passwordReveal;
        revealDiv.innerHTML = `<div class="revealed-password">${password}</div>`;
        revealDiv.querySelector('.revealed-password').style.animation = 'passwordAppear 2s ease-out';
    }

    showMysticalMessage(message) {
        this.passwordReveal.innerHTML = `<div class="mystical-text">${message}</div>`;
    }

    generateSecurePassword() {
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
            return 'Select at least one spell component';
        }
        
        // Generate cryptographically secure password
        try {
            const array = new Uint8Array(length);
            crypto.getRandomValues(array);
            
            let password = '';
            for (let i = 0; i < length; i++) {
                password += charset[array[i] % charset.length];
            }
            
            // Clear array from memory
            array.fill(0);
            return password;
            
        } catch (error) {
            console.error('Oracle summoning failed:', error);
            return 'The spirits are silent... try again';
        }
    }

    analyzeMysticalPower(password) {
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
        
        const maxScore = 10;
        const percentage = Math.min(score, maxScore) / maxScore * 100;
        
        // Update power bar
        this.strengthBar.style.width = percentage + '%';
        
        // Update power text
        const powerLevels = [
            'Dormant Spirit',
            'Weak Enchantment', 
            'Modest Power',
            'Strong Magic',
            'Legendary Force'
        ];
        
        let level = 0;
        if (score >= 8) level = 4;
        else if (score >= 6) level = 3;
        else if (score >= 4) level = 2;
        else if (score >= 2) level = 1;
        
        this.strengthText.textContent = powerLevels[level] || 'Unknown Power';
    }

    castPresetSpell(preset) {
        // Clear active state
        this.presetBtns.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const spells = {
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
                includeSymbols: true,
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
        
        const spell = spells[preset];
        if (spell) {
            this.lengthSlider.value = spell.length;
            this.lengthValue.textContent = spell.length;
            this.includeLowercase.checked = spell.includeLowercase;
            this.includeUppercase.checked = spell.includeUppercase;
            this.includeNumbers.checked = spell.includeNumbers;
            this.includeSymbols.checked = spell.includeSymbols;
            this.excludeSimilar.checked = spell.excludeSimilar;
            
            this.updateSpellComponents();
            this.saveMysticalSettings();
        }
    }

    updateSpellComponents() {
        const components = document.querySelectorAll('.spell-component');
        components.forEach(component => {
            const checkbox = component.querySelector('input[type="checkbox"]');
            const rune = component.querySelector('.rune');
            
            if (checkbox.checked) {
                component.style.background = 'rgba(106, 27, 154, 0.3)';
                component.style.borderColor = 'var(--mystical-gold)';
                rune.style.color = 'var(--mystical-gold)';
                rune.style.textShadow = 'var(--glow-gold)';
            } else {
                component.style.background = 'rgba(26, 26, 46, 0.6)';
                component.style.borderColor = 'rgba(106, 27, 154, 0.3)';
                rune.style.color = 'var(--mystical-silver)';
                rune.style.textShadow = 'none';
            }
        });
    }

    async transcribePassword() {
        if (!this.currentPassword) return;
        
        try {
            await navigator.clipboard.writeText(this.currentPassword);
            
            // Visual feedback
            const btn = this.copyBtn;
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Copied!</span>';
            btn.style.background = 'linear-gradient(135deg, var(--mystical-gold), #ff8c00)';
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
            }, 2000);
            
        } catch (err) {
            console.error('Transcription failed:', err);
        }
    }

    addToVisions(password) {
        const visions = this.getStoredVisions();
        const timestamp = new Date().toLocaleString();
        
        visions.unshift({
            password: password,
            timestamp: timestamp,
            strength: this.strengthText.textContent
        });
        
        // Keep only last 10 visions
        if (visions.length > 10) {
            visions.splice(10);
        }
        
        localStorage.setItem('mystical_visions', JSON.stringify(visions));
        this.updateVisionsDisplay();
    }

    getStoredVisions() {
        try {
            return JSON.parse(localStorage.getItem('mystical_visions') || '[]');
        } catch {
            return [];
        }
    }

    updateVisionsDisplay() {
        const visions = this.getStoredVisions();
        
        if (visions.length === 0) {
            this.historyList.innerHTML = '<p class="no-visions">The tome of secrets is empty...</p>';
            return;
        }
        
        const visionsHTML = visions.map(vision => `
            <div class="vision-entry" style="
                background: rgba(106, 27, 154, 0.1);
                border: 1px solid rgba(106, 27, 154, 0.3);
                border-radius: 8px;
                padding: 12px;
                margin: 8px 0;
                font-family: 'Courier New', monospace;
            ">
                <div style="color: var(--mystical-gold); font-weight: bold; margin-bottom: 5px;">
                    ${vision.password}
                </div>
                <div style="color: var(--mystical-silver); font-size: 0.8rem; opacity: 0.7;">
                    ${vision.timestamp} • ${vision.strength}
                </div>
            </div>
        `).join('');
        
        this.historyList.innerHTML = visionsHTML;
    }

    clearVisions() {
        localStorage.removeItem('mystical_visions');
        this.updateVisionsDisplay();
        
        // Visual feedback
        this.showMysticalMessage("The ancient tome has been cleansed...");
        setTimeout(() => {
            this.showMysticalMessage("The oracle awaits your command...");
        }, 2000);
    }

    createShakeParticles() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: var(--mystical-gold);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                    box-shadow: 0 0 10px var(--mystical-gold);
                    left: ${this.ballOuter.getBoundingClientRect().left + Math.random() * 380}px;
                    top: ${this.ballOuter.getBoundingClientRect().top + Math.random() * 380}px;
                    animation: particleFade 2s ease-out forwards;
                `;
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 2000);
            }, i * 50);
        }
    }

    createMysticalParticles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFade {
                0% { opacity: 1; transform: translateY(0px) scale(1); }
                100% { opacity: 0; transform: translateY(-100px) scale(0); }
            }
            
            @keyframes floatingParticle {
                0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
                50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
            }
        `;
        document.head.appendChild(style);
        
        // Create ambient floating particles
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createFloatingParticle();
            }
        }, 2000);
    }

    createFloatingParticle() {
        const particle = document.createElement('div');
        const symbols = ['✨', '🌟', '💫', '⭐', '🔮'];
        
        particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        particle.style.cssText = `
            position: fixed;
            font-size: ${8 + Math.random() * 12}px;
            pointer-events: none;
            z-index: 1;
            left: ${Math.random() * window.innerWidth}px;
            top: ${window.innerHeight + 20}px;
            animation: floatingParticle ${3 + Math.random() * 4}s ease-in-out forwards;
        `;
        
        this.particles.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 7000);
    }

    intensifyFog() {
        this.fogLayer.style.animation = 'swirlingFog 1s ease-in-out';
        this.fogLayer.style.opacity = '1';
    }

    clearFog(callback) {
        this.fogLayer.style.transition = 'opacity 2s ease-out';
        this.fogLayer.style.opacity = '0.3';
        
        setTimeout(callback, 1000);
    }

    enableActions() {
        this.copyBtn.disabled = false;
        this.copyBtn.style.opacity = '1';
    }

    resetOracleState() {
        this.isShaking = false;
        this.isRevealing = false;
        this.shakeInstructions.style.opacity = '0.7';
        
        // Reset fog
        this.fogLayer.style.transition = '';
        this.fogLayer.style.opacity = '0.8';
        this.fogLayer.style.animation = 'swirlingFog 8s ease-in-out infinite';
    }

    loadMysticalSettings() {
        const settings = JSON.parse(localStorage.getItem('mystical_settings') || '{}');
        
        this.lengthSlider.value = settings.length || 16;
        this.lengthValue.textContent = this.lengthSlider.value;
        this.includeLowercase.checked = settings.includeLowercase !== false;
        this.includeUppercase.checked = settings.includeUppercase !== false;
        this.includeNumbers.checked = settings.includeNumbers !== false;
        this.includeSymbols.checked = settings.includeSymbols || false;
        this.excludeSimilar.checked = settings.excludeSimilar || false;
        
        this.updateSpellComponents();
        this.updateVisionsDisplay();
    }

    saveMysticalSettings() {
        const settings = {
            length: parseInt(this.lengthSlider.value),
            includeLowercase: this.includeLowercase.checked,
            includeUppercase: this.includeUppercase.checked,
            includeNumbers: this.includeNumbers.checked,
            includeSymbols: this.includeSymbols.checked,
            excludeSimilar: this.excludeSimilar.checked
        };
        
        localStorage.setItem('mystical_settings', JSON.stringify(settings));
    }
}

// Initialize the Mystical Password Oracle when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MysticalPasswordOracle();
});

// Add mystical console message
console.log(`
🔮 Mystical Password Oracle Initialized 🔮
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The digital spirits have been summoned...
Shake your device or click the orb to reveal your password destiny!

Built with mystical powers by GBIT Automation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);