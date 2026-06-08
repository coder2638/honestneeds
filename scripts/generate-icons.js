const sharp = require('sharp');
// pngToIco will be dynamically imported inside the async function
const fs = require('fs');
const path = require('path');

const SOURCE = path.join(__dirname, '../public/honest-need-logo.png');
const OUTPUT = path.join(__dirname, '../public');

const ICONS = [
  { name: 'favicon-16x16.png',          size: 16  },
  { name: 'favicon-32x32.png',          size: 32  },
  { name: 'apple-touch-icon.png',       size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

async function generate() {
  console.log('Starting icon generation...');
  const pngToIco = (await import('png-to-ico')).default;
  
  // Ensure source exists
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source file not found at ${SOURCE}`);
    process.exit(1);
  }

  // 1. Generate square PNG icons
  for (const icon of ICONS) {
    await sharp(SOURCE)
      .resize(icon.size, icon.size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFile(path.join(OUTPUT, icon.name));
    console.log(`✅ Generated: ${icon.name}`);
  }

  // 2. Generate og-image.png (1200x630, logo centered with nice padding on #0a0a0a background)
  console.log('Generating og-image.png...');
  const bg = sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 10, g: 10, b: 10, alpha: 1 } // #0a0a0a
    }
  });

  const logoResized = await sharp(SOURCE)
    .resize({ width: 800, height: 400, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await bg.composite([{ input: logoResized, gravity: 'center' }])
    .toFile(path.join(OUTPUT, 'og-image.png'));
  console.log('✅ Generated: og-image.png');

  // 3. Generate favicon.ico
  console.log('Generating favicon.ico...');
  const icoBuf = await pngToIco(path.join(OUTPUT, 'favicon-32x32.png'));
  
  fs.writeFileSync(path.join(OUTPUT, 'favicon.ico'), icoBuf);
  console.log('✅ Generated: public/favicon.ico');
  
  const appFaviconPath = path.join(__dirname, '../app/favicon.ico');
  fs.writeFileSync(appFaviconPath, icoBuf);
  console.log('✅ Updated: app/favicon.ico');

  console.log('🎉 Icon generation complete!');
}

generate().catch(err => {
  console.error('❌ Error during generation:', err);
  process.exit(1);
});
