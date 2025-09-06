// Enhanced Matrix Rain Effect with JavaScript
function createMatrixRain() {
    const matrixContainer = document.querySelector('.matrix-rain');
    if (!matrixContainer) return;

    // Create multiple columns
    const columns = Math.floor(window.innerWidth / 30);
    const characters = [
        // Binary (higher frequency)
        '0', '1', '0', '1', '0', '1', '0', '1',
        // Alphabet uppercase
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        // Alphabet lowercase
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        // Numbers
        '2', '3', '4', '5', '6', '7', '8', '9',
        // Symbols
        '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', '|', '\\', ';', ':', '"', "'", '<', '>', ',', '.', '?', '/',
        // Block characters for visual effect
        '█', '▓', '▒', '░'
    ];
    
    // Generate evenly distributed positions across full width with random variation
    const positions = [];
    const baseSpacing = 100 / 24; // ~4.17% base spacing for 24 columns
    
    for (let i = 0; i < 24; i++) {
        // Start with even distribution then add random variation
        let basePosition = i * baseSpacing;
        // Add random offset within reasonable bounds to maintain coverage
        let randomOffset = (Math.random() - 0.5) * (baseSpacing * 0.6); // ±60% of base spacing
        let position = Math.max(0, Math.min(95, basePosition + randomOffset));
        positions.push(position);
    }
    // Shuffle array to randomize the visual order
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    for (let i = 0; i < 24; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.cssText = `
            position: absolute;
            top: ${-100 - (Math.random() * 200)}px;
            left: ${positions[i]}%;
            font-family: 'Courier New', monospace;
            font-size: ${10 + Math.random() * 12}px;
            color: rgba(${170 + Math.random() * 15}, ${170 + Math.random() * 15}, ${170 + Math.random() * 15}, ${0.2 + Math.random() * 0.4});
            line-height: ${16 + Math.random() * 12}px;
            white-space: pre;
            animation: matrix-fall-${i + 1} ${4 + Math.random() * 6}s linear infinite ${Math.random() * 4}s;
            text-shadow: 0 0 8px rgba(176, 176, 176, 0.5), 0 0 4px rgba(255, 255, 255, 0.2);
            pointer-events: none;
        `;

        // Generate random character content with varied length
        let content = '';
        const streamLength = 50 + Math.random() * 60; // 50-110 characters
        for (let j = 0; j < streamLength; j++) {
            // Bias towards binary (0,1) with 40% probability, then mix of all other characters
            let charIndex;
            if (Math.random() < 0.4) {
                // Select from binary characters (first 8 in array)
                charIndex = Math.floor(Math.random() * 8);
            } else {
                // Select from any character in the full set
                charIndex = Math.floor(Math.random() * characters.length);
            }
            content += characters[charIndex] + '\n';
        }
        column.textContent = content;
        
        matrixContainer.appendChild(column);
    }

    // Add CSS animations for each column
    const style = document.createElement('style');
    let animations = '';
    for (let i = 1; i <= 24; i++) {
        animations += `
            @keyframes matrix-fall-${i} {
                0% { transform: translateY(-100vh); opacity: 0; }
                5% { opacity: 1; }
                95% { opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
            }
        `;
    }
    style.textContent = animations;
    document.head.appendChild(style);
}

// Initialize matrix rain when page loads
document.addEventListener('DOMContentLoaded', createMatrixRain);

// Recreate on window resize
window.addEventListener('resize', () => {
    const matrixContainer = document.querySelector('.matrix-rain');
    if (matrixContainer && window.innerWidth > 768) {
        matrixContainer.innerHTML = '';
        createMatrixRain();
    }
});