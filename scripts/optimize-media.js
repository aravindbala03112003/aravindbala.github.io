import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

console.log('=== MEDIA OPTIMIZATION SCRIPT ===');
console.log('Using ffmpeg from:', ffmpeg);

// Helper to run ffmpeg
function runFFmpeg(args) {
  const cmd = `"${ffmpeg}" -y ${args}`;
  console.log(`Running: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

// 1. Optimize Self Intro Video
const introOriginal = path.join(publicDir, 'self-intro', 'aravind v2.mp4');
const introOptimized = path.join(publicDir, 'self-intro', 'aravind v2_opt.mp4');

if (fs.existsSync(introOriginal)) {
  const originalSize = fs.statSync(introOriginal).size / (1024 * 1024);
  console.log(`\nOriginal self-intro size: ${originalSize.toFixed(2)} MB`);

  // 720p high quality, CRF 22, AAC 128k, faststart
  runFFmpeg(`-i "${introOriginal}" -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -crf 22 -preset slow -c:a aac -b:a 128k -ar 44100 -movflags +faststart "${introOptimized}"`);

  const optSize = fs.statSync(introOptimized).size / (1024 * 1024);
  console.log(`Optimized self-intro size: ${optSize.toFixed(2)} MB`);

  // Replace original with optimized
  fs.unlinkSync(introOriginal);
  fs.renameSync(introOptimized, introOriginal);
  console.log(`Replaced original with optimized video (${optSize.toFixed(2)} MB)`);
}

// 2. Optimize Project Card Videos in public/gifs/
const projectVideos = [
  'Creating_product_animation_video_1080p_202609021652.mp4',
  'Campus_vote_video_generation_prompt_202609021700.mp4',
  'AI_video_generation_prompt_FinDesk_202609021727.mp4',
  'Smart_travel_mode_video_animation_202609021732.mp4',
  'Research_paper_management_AI_video_202609021737.mp4'
];

console.log('\n--- Optimizing Project Card Loops ---');
for (const filename of projectVideos) {
  const vidPath = path.join(publicDir, 'gifs', filename);
  if (!fs.existsSync(vidPath)) {
    console.warn(`File not found: ${vidPath}`);
    continue;
  }
  const oldSize = fs.statSync(vidPath).size / (1024 * 1024);
  const tempPath = path.join(publicDir, 'gifs', `opt_${filename}`);

  // Scale to 720p max, remove audio (muted loop), CRF 23, faststart
  runFFmpeg(`-i "${vidPath}" -vf "scale='min(1280,iw)':-2" -an -c:v libx264 -crf 23 -preset medium -movflags +faststart "${tempPath}"`);

  const newSize = fs.statSync(tempPath).size / (1024 * 1024);
  console.log(`${filename}: ${oldSize.toFixed(2)} MB -> ${newSize.toFixed(2)} MB`);

  fs.unlinkSync(vidPath);
  fs.renameSync(tempPath, vidPath);
}

// 3. Remove Unused GIF
const unusedGif = path.join(publicDir, 'gifs', 'Campus_vote__ai_video_generation_promptcre.gif');
if (fs.existsSync(unusedGif)) {
  const unusedSize = fs.statSync(unusedGif).size / (1024 * 1024);
  fs.unlinkSync(unusedGif);
  console.log(`\nDeleted unused GIF Campus_vote__ai_video_generation_promptcre.gif (${unusedSize.toFixed(2)} MB)`);
}

// 4. Remove Duplicate Resume Image
const duplicateResume = path.join(publicDir, 'resume', 'aravindbala_resume_page-0001.jpg');
if (fs.existsSync(duplicateResume)) {
  const dupSize = fs.statSync(duplicateResume).size / (1024 * 1024);
  fs.unlinkSync(duplicateResume);
  console.log(`Deleted duplicate resume image in public/resume/ (${dupSize.toFixed(2)} MB)`);
}
// If public/resume is now empty, remove it or keep empty dir
const resumeDir = path.join(publicDir, 'resume');
if (fs.existsSync(resumeDir) && fs.readdirSync(resumeDir).length === 0) {
  fs.rmdirSync(resumeDir);
  console.log('Removed empty public/resume directory');
}

// 5. Remove Duplicate Logo
const duplicateLogo = path.join(publicDir, 'logo', 'ChatGPT Image Sep 9, 2026, 03_24_50 PM.png');
if (fs.existsSync(duplicateLogo)) {
  const dupLogoSize = fs.statSync(duplicateLogo).size / (1024 * 1024);
  fs.unlinkSync(duplicateLogo);
  console.log(`Deleted duplicate ChatGPT Image in public/logo/ (${dupLogoSize.toFixed(2)} MB)`);
}

// 6. Optimize resume page preview image public/aravindbala_resume_page-0001.jpg
const resumeImg = path.join(publicDir, 'aravindbala_resume_page-0001.jpg');
if (fs.existsSync(resumeImg)) {
  const oldImgSize = fs.statSync(resumeImg).size / (1024 * 1024);
  const tempImg = path.join(publicDir, 'aravindbala_resume_page-0001_opt.jpg');
  // Re-encode at max width 1600px, high quality JPEG (q:v 3 / quality 88)
  runFFmpeg(`-i "${resumeImg}" -vf "scale='min(1600,iw)':-1" -q:v 3 "${tempImg}"`);
  const newImgSize = fs.statSync(tempImg).size / (1024 * 1024);
  console.log(`\nResume image: ${oldImgSize.toFixed(2)} MB -> ${newImgSize.toFixed(2)} MB`);
  fs.unlinkSync(resumeImg);
  fs.renameSync(tempImg, resumeImg);
}

// 7. Optimize public/logo/portfolio-logo.png
const logoImg = path.join(publicDir, 'logo', 'portfolio-logo.png');
if (fs.existsSync(logoImg)) {
  const oldLogoSize = fs.statSync(logoImg).size / 1024;
  const tempLogo = path.join(publicDir, 'logo', 'portfolio-logo_opt.png');
  // Scale to 512x512 crisp PNG (crisp brand logo)
  runFFmpeg(`-i "${logoImg}" -vf "scale=512:512" "${tempLogo}"`);
  const newLogoSize = fs.statSync(tempLogo).size / 1024;
  console.log(`Logo: ${oldLogoSize.toFixed(1)} KB -> ${newLogoSize.toFixed(1)} KB`);
  fs.unlinkSync(logoImg);
  fs.renameSync(tempLogo, logoImg);
}

console.log('\n=== Media Optimization Complete! ===');
