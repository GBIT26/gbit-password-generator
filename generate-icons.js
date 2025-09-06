const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Ensure assets directory exists
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

function drawIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient - Black and white theme
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(1, '#1a1a1a');
    
    // Draw rounded rectangle background
    const radius = size * 0.2;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    
    // Draw lock icon
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = size * 0.08;
    
    const centerX = size / 2;
    const centerY = size / 2;
    const lockSize = size * 0.4;
    
    // Lock body
    ctx.fillRect(
        centerX - lockSize/2, 
        centerY - lockSize/6, 
        lockSize, 
        lockSize * 0.6
    );
    
    // Lock shackle
    ctx.beginPath();
    ctx.arc(centerX, centerY - lockSize/3, lockSize/3, Math.PI, 0, false);
    ctx.stroke();
    
    // Keyhole
    ctx.fillStyle = '#b0b0b0';
    ctx.beginPath();
    ctx.arc(centerX, centerY, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillRect(
        centerX - size * 0.02,
        centerY,
        size * 0.04,
        size * 0.08
    );
    
    return canvas;
}

// Generate all required icon sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
    const canvas = drawIcon(size);
    const buffer = canvas.toBuffer('image/png');
    const filename = path.join(assetsDir, `icon-${size}.png`);
    fs.writeFileSync(filename, buffer);
    console.log(`Generated ${filename}`);
});

console.log('All icons generated successfully!');