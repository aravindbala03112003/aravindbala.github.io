import fs from 'fs';
import path from 'path';

const htmlPath = path.resolve('dist/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');
const regex = /(?:src|href)="\/aravindbala\.github\.io\/([^"]+)"/g;
let match;
let total = 0;
let missing = 0;

while ((match = regex.exec(html)) !== null) {
  total++;
  const asset = match[1];
  const filePath = path.resolve('dist', asset);
  if (!fs.existsSync(filePath)) {
    console.error('Missing asset:', filePath);
    missing++;
  } else {
    // Verified asset exists
  }
}

console.log(`Verified ${total} assets in dist/index.html. Missing: ${missing}`);
if (missing === 0) {
  console.log('✅ ALL ASSETS AND CHUNKS ARE FULLY PRESENT AND VERIFIED!');
} else {
  process.exit(1);
}
