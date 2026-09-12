import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '..', 'public');
const iconPath = path.join(publicDir, 'icons', 'icon-192.png');
const svgPath = path.join(publicDir, 'favicon.svg');

const b64 = fs.readFileSync(iconPath, 'base64');
const content = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="100%" height="100%">
  <image href="data:image/png;base64,${b64}" width="192" height="192" />
</svg>
`;

fs.writeFileSync(svgPath, content);
console.log('Optimized favicon.svg size:', (fs.statSync(svgPath).size / 1024).toFixed(1), 'KB');
