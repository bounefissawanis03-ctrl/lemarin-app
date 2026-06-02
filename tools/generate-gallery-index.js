// tools/generate-gallery-index.js
// Scans assets/images/gallery and generates gallery-index.json and gallery-data.js
const fs = require('fs');
const path = require('path');

const galleryDir = path.resolve(process.cwd(), 'assets', 'images', 'gallery');
const outJson = path.join(galleryDir, 'gallery-index.json');
const outJs = path.join(galleryDir, 'gallery-data.js');

function isMedia(f) {
  return !f.startsWith('.') && !f.toLowerCase().endsWith('.db') && f.toLowerCase() !== 'thumbs.db';
}

try {
  if (!fs.existsSync(galleryDir)) {
    console.error('Gallery directory not found:', galleryDir);
    process.exit(0);
  }
  const files = fs.readdirSync(galleryDir).filter(isMedia).sort();
  const userPhotos = files.map(f => 'assets/images/gallery/' + f);

  // Write JSON index
  fs.writeFileSync(outJson, JSON.stringify(userPhotos, null, 2), 'utf8');

  // Write a small JS file that injects a global used by app.js
  const jsContent = `// Auto-generated gallery data — safe to commit
window.GENERATED_GALLERY = window.GENERATED_GALLERY || {};
window.GENERATED_GALLERY.userPhotos = ${JSON.stringify(userPhotos, null, 2)};
`;
  fs.writeFileSync(outJs, jsContent, 'utf8');

  console.log('Generated', outJson, 'and', outJs);
} catch (err) {
  console.error('Failed to generate gallery index:', err);
  process.exit(1);
}
