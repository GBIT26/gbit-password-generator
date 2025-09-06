#!/usr/bin/env node

const PasswordGenerator = require('./index.js');

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    length: 16,
    includeLowercase: true,
    includeUppercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeSimilar: false,
    count: 1,
    check: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-l':
      case '--length':
        options.length = parseInt(args[++i]);
        break;
      case '-c':
      case '--count':
        options.count = parseInt(args[++i]);
        break;
      case '--no-lowercase':
        options.includeLowercase = false;
        break;
      case '--no-uppercase':
        options.includeUppercase = false;
        break;
      case '--no-numbers':
        options.includeNumbers = false;
        break;
      case '-s':
      case '--symbols':
        options.includeSymbols = true;
        break;
      case '--exclude-similar':
        options.excludeSimilar = true;
        break;
      case '--check':
        options.check = args[++i];
        break;
      case '-h':
      case '--help':
        showHelp();
        process.exit(0);
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
    }
  }

  return options;
}

function showHelp() {
  console.log(`
Password Generator CLI

Usage: passgen [options]

Options:
  -l, --length <n>       Password length (default: 16)
  -c, --count <n>        Number of passwords to generate (default: 1)
  -s, --symbols          Include symbols
  --no-lowercase         Exclude lowercase letters
  --no-uppercase         Exclude uppercase letters  
  --no-numbers           Exclude numbers
  --exclude-similar      Exclude similar characters (0, O, 1, l, I)
  --check <password>     Check password strength
  -h, --help             Show this help

Examples:
  passgen                           Generate a 16-character password
  passgen -l 20 -s                  Generate a 20-character password with symbols
  passgen -c 5                      Generate 5 passwords
  passgen --check "mypassword"      Check password strength
  `);
}

function main() {
  try {
    const options = parseArgs();
    const generator = new PasswordGenerator();

    if (options.check) {
      const result = generator.checkStrength(options.check);
      console.log(`Password: ${options.check}`);
      console.log(`Strength: ${result.strength} (${result.score}/5)`);
      console.log('Requirements:');
      console.log(`  ✓ Length ≥ 8: ${result.checks.length ? '✓' : '✗'}`);
      console.log(`  ✓ Lowercase: ${result.checks.lowercase ? '✓' : '✗'}`);
      console.log(`  ✓ Uppercase: ${result.checks.uppercase ? '✓' : '✗'}`);
      console.log(`  ✓ Numbers: ${result.checks.numbers ? '✓' : '✗'}`);
      console.log(`  ✓ Symbols: ${result.checks.symbols ? '✓' : '✗'}`);
      return;
    }

    const passwords = generator.generateMultiple(options.count, options);
    
    if (options.count === 1) {
      console.log(passwords[0]);
    } else {
      passwords.forEach((password, index) => {
        console.log(`${index + 1}: ${password}`);
      });
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();