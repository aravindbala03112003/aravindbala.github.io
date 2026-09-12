import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

console.log('=== ASSET AUDIT REPORT ===');

function inspectVideo(filePath) {
  try {
    const res = execSync(`"${ffmpeg}" -i "${filePath}"`, { stdio: 'pipe' });
    return res.toString();
  } catch (err) {
    return err.stderr ? err.stderr.toString() : '';
  }
}

const selfIntro = path.join(publicDir, 'self-intro', 'aravind v2.mp4');
console.log('\n--- Self Intro Video ---');
const introInfo = inspectVideo(selfIntro);
const matchStream = introInfo.match(/Stream #0:.*Video: .*/);
const matchAudio = introInfo.match(/Stream #0:.*Audio: .*/);
const matchDuration = introInfo.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d{2}), start: .*, bitrate: (\d+) kb\/s/);

console.log('File size:', (fs.statSync(selfIntro).size / (1024 * 1024)).toFixed(2), 'MB');
if (matchDuration) console.log('Duration:', matchDuration[1], 'Bitrate:', matchDuration[2], 'kbps');
if (matchStream) console.log('Video stream:', matchStream[0].trim());
if (matchAudio) console.log('Audio stream:', matchAudio[0].trim());

console.log('\n--- GIF/Video Previews in public/gifs/ ---');
const gifsDir = path.join(publicDir, 'gifs');
for (const file of fs.readdirSync(gifsDir)) {
  const fullPath = path.join(gifsDir, file);
  const sizeMB = (fs.statSync(fullPath).size / (1024 * 1024)).toFixed(2);
  console.log(`${file}: ${sizeMB} MB`);
}

console.log('\n--- Large Images & Icons ---');
function scanImages(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      scanImages(full);
    } else if (/\.(png|jpg|jpeg|svg|webp|pdf)$/i.test(item)) {
      const sizeKB = (fs.statSync(full).size / 1024).toFixed(1);
      if (sizeKB > 150) {
        console.log(`${path.relative(publicDir, full)}: ${sizeKB} KB`);
      }
    }
  }
}
scanImages(publicDir);
