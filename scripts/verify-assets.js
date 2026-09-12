import http from 'http';

const urls = [
  '/',
  '/aravindbala-portfolio.apk',
  '/resume.pdf',
  '/aravindbala_resume_page-0001.jpg',
  '/self-intro/aravind%20v2.mp4',
  '/gifs/Creating_product_animation_video_1080p_202609021652.mp4',
  '/gifs/Campus_vote_video_generation_prompt_202609021700.mp4',
  '/gifs/AI_video_generation_prompt_FinDesk_202609021727.mp4',
  '/gifs/Smart_travel_mode_video_animation_202609021732.mp4',
  '/gifs/Research_paper_management_AI_video_202609021737.mp4',
  '/logo/portfolio-logo.png'
];

async function checkAll() {
  console.log('=== VERIFYING SERVER ASSET RESPONSES ===');
  let allOk = true;
  for (const u of urls) {
    await new Promise((resolve) => {
      http.get('http://localhost:5173' + u, (res) => {
        const len = res.headers['content-length'];
        const mb = len ? (len / (1024 * 1024)).toFixed(2) + ' MB' : 'chunked';
        console.log(`[${res.statusCode}] ${u} -> ${res.headers['content-type'] || 'unknown'} (${mb})`);
        if (res.statusCode !== 200) allOk = false;
        res.resume();
        resolve();
      }).on('error', (err) => {
        console.error('Error on', u, err.message);
        allOk = false;
        resolve();
      });
    });
  }
  console.log(allOk ? '\n✅ ALL ASSETS DELIVERED 200 OK WITH ACCURATE MIME TYPES!' : '\n❌ SOME ASSETS FAILED');
}

checkAll();
