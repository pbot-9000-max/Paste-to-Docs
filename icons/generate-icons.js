/**
 * generate-icons.js
 * Converts icons/icon.svg into the PNG sizes required by Chrome Web Store.
 *
 * Usage:
 *   npm install sharp
 *   node generate-icons.js
 */

const sharp = require('sharp');
const path  = require('path');

const SIZES = [16, 32, 48, 128];
const src   = path.join(__dirname, 'icon.svg');

(async () => {
  for (const size of SIZES) {
    const dest = path.join(__dirname, `icon${size}.png`);
    await sharp(src).resize(size, size).png().toFile(dest);
    console.log(`✓ icons/icon${size}.png`);
  }
  console.log('\nAll icons generated.');
})();
