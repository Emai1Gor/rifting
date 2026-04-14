// Generate PWA icons as simple PNG files using canvas
// Run: node scripts/generate-icons.mjs

import { writeFileSync } from 'fs';

function createPNG(size) {
  // Create a minimal valid PNG with the Rifting "R" logo
  // We'll use an SVG-based approach since we don't have canvas in Node without deps
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#0f1117"/>
  <rect x="${size * 0.08}" y="${size * 0.08}" width="${size * 0.84}" height="${size * 0.84}" rx="${size * 0.12}" fill="#6366f1" opacity="0.2"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
    font-family="Arial,Helvetica,sans-serif" font-weight="bold"
    font-size="${size * 0.5}" fill="#a5b4fc">R</text>
</svg>`;
  return svg;
}

// Write as SVG (browsers will use these)
writeFileSync('public/icons/icon-192.svg', createPNG(192));
writeFileSync('public/icons/icon-512.svg', createPNG(512));

console.log('SVG icons generated. For PNG conversion, use an online tool or sharp.');
