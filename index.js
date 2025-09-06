const crypto = require('crypto');

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

  generateMultiple(count = 1, options = {}) {
    const passwords = [];
    for (let i = 0; i < count; i++) {
      passwords.push(this.generate(options));
    }
    return passwords;
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

module.exports = PasswordGenerator;