import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

console.log('=== SECOND PASS MEDIA OPTIMIZATION (TARGET < 40MB TOTAL ASSETS) ===');

function runFFmpeg(args) {
  const cmd = `"${ffmpeg}" -y ${args}`;
  execSync(cmd, { stdio: 'pipe' });
}

// 1. Optimize video loops in public/gifs/
const gifsDir = path.join(publicDir, 'gifs');
if (fs.existsSync(gifsDir)) {
  const files = fs.readdirSync(gifsDir).filter(f => f.endsWith('.mp4'));
  for (const filename of files) {
    const fullPath = path.join(gifsDir, filename);
    const sizeMB = fs.statSync(fullPath).size / (1024 * 1024);
    console.log(`Optimizing video: ${filename} (${sizeMB.toFixed(2)} MB)...`);
    const tempPath = path.join(gifsDir, `temp_pass2_${Date.now()}.mp4`);
    try {
      runFFmpeg(`-i "${fullPath}" -vf "scale='min(960,iw)':-2" -an -c:v libx264 -crf 26 -preset medium -movflags +faststart "${tempPath}"`);
      const newSizeMB = fs.statSync(tempPath).size / (1024 * 1024);
      if (newSizeMB < sizeMB) {
        fs.unlinkSync(fullPath);
        fs.renameSync(tempPath, fullPath);
        console.log(`  -> Reduced from ${sizeMB.toFixed(2)} MB to ${newSizeMB.toFixed(2)} MB`);
      } else {
        fs.unlinkSync(tempPath);
      }
    } catch (err) {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
      console.error(`  -> Failed for ${filename}:`, err.message);
    }
  }
}

// 2. Optimize self-intro video to ~4.5 MB
const selfIntroPath = path.join(publicDir, 'self-intro', 'aravind v2.mp4');
if (fs.existsSync(selfIntroPath)) {
  const sizeMB = fs.statSync(selfIntroPath).size / (1024 * 1024);
  console.log(`Optimizing self-intro: ${sizeMB.toFixed(2)} MB...`);
  const tempPath = path.join(publicDir, 'self-intro', `temp_intro2_${Date.now()}.mp4`);
  try {
    runFFmpeg(`-i "${selfIntroPath}" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 26 -preset medium -c:a aac -b:a 96k -ar 44100 -movflags +faststart "${tempPath}"`);
    const newSizeMB = fs.statSync(tempPath).size / (1024 * 1024);
    if (newSizeMB < sizeMB) {
      fs.unlinkSync(selfIntroPath);
      fs.renameSync(tempPath, selfIntroPath);
      console.log(`  -> Reduced from ${sizeMB.toFixed(2)} MB to ${newSizeMB.toFixed(2)} MB`);
    } else {
      fs.unlinkSync(tempPath);
    }
  } catch (err) {
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.error(`  -> Self-intro optimization failed:`, err.message);
  }
}

console.log('\n=== Pass 2 Complete! ===');
