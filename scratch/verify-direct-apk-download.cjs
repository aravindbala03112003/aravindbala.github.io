const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function testDirectApkDownload() {
  console.log('=== Verifying Direct APK Download in Chrome ===');
  const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const downloadDir = path.resolve('C:/Users/Asus/.gemini/antigravity-ide/brain/87b1c1d9-bef0-4111-b6e0-c692a744119a/scratch/test-downloads');
  
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--window-size=1280,850',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 2200));

  try {
    const listRes = await fetch('http://localhost:9222/json');
    const tabs = await listRes.json();
    const pageTab = tabs.find(t => t.type === 'page');
    if (!pageTab) throw new Error('No page tab found in Chrome');

    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        const handler = (event) => {
          const res = JSON.parse(event.data);
          if (res.id === id) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id, method, params }));
      });
    }

    await send('Runtime.enable');
    await send('Page.enable');
    await send('Browser.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadDir
    });

    // 1. Check initial homepage status
    console.log('1. Checking Desktop Navbar button...');
    await new Promise(r => setTimeout(r, 1200));

    const btnInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.desktop-apk-btn .download-apk-btn');
        return {
          exists: Boolean(btn),
          text: btn ? btn.innerText.trim() : null,
          ariaLabel: btn ? btn.getAttribute('aria-label') : null,
          hasDot: Boolean(btn && btn.querySelector('.download-apk-dot')),
          hasShimmer: Boolean(btn && btn.querySelector('.download-apk-shimmer')),
          hasIcon: Boolean(btn && btn.querySelector('.download-apk-icon-box'))
        };
      })()`,
      returnByValue: true
    });
    console.log('Button Info:', btnInfo.result.value);

    // Track downloads by intercepting link click
    console.log('2. Clicking DOWNLOAD APK button...');
    const clickTrack = await send('Runtime.evaluate', {
      expression: `(() => {
        let downloadedHref = null;
        let downloadedFilename = null;
        const originalAppend = document.body.appendChild.bind(document.body);
        document.body.appendChild = function(node) {
          if (node && node.tagName === 'A') {
            downloadedHref = node.href;
            downloadedFilename = node.download;
          }
          return originalAppend(node);
        };

        const btn = document.querySelector('.desktop-apk-btn .download-apk-btn');
        if (btn) btn.click();

        return {
          downloadedHref,
          downloadedFilename,
          currentPath: window.location.pathname,
          currentSearch: window.location.search
        };
      })()`,
      returnByValue: true
    });
    console.log('Click Evaluation Result:', clickTrack.result.value);

    // Wait a moment and check URL and page state
    await new Promise(r => setTimeout(r, 800));

    const stateCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          pathname: window.location.pathname,
          noSimulator: !document.querySelector('.mobile-app-studio'),
          noPhoneMockup: !document.querySelector('.phone-chassis-container'),
          noDeviceSelector: !document.querySelector('.studio-device-nav'),
          noModal: !document.querySelector('.self-intro-modal-card') && !document.querySelector('.project-modal')
        };
      })()`,
      returnByValue: true
    });
    console.log('Page State After Click:', stateCheck.result.value);

    // 3. Test Mobile Drawer APK button
    console.log('3. Testing Mobile Viewport & Menu APK Button...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise(r => setTimeout(r, 1500));

    // Open mobile menu
    await send('Runtime.evaluate', {
      expression: `(() => {
        const menuBtn = document.querySelector('.menu-button');
        if (menuBtn) menuBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));

    // Click mobile menu APK button
    const mobileClickTrack = await send('Runtime.evaluate', {
      expression: `(() => {
        let mobileDownloadedHref = null;
        let mobileDownloadedFilename = null;
        const originalAppend = document.body.appendChild.bind(document.body);
        document.body.appendChild = function(node) {
          if (node && node.tagName === 'A') {
            mobileDownloadedHref = node.href;
            mobileDownloadedFilename = node.download;
          }
          return originalAppend(node);
        };

        const mobileApkBtn = document.querySelector('.mobile-menu-action .download-apk-btn');
        if (mobileApkBtn) mobileApkBtn.click();

        return {
          exists: Boolean(mobileApkBtn),
          mobileDownloadedHref,
          mobileDownloadedFilename,
          currentPath: window.location.pathname
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile Menu APK Click Result:', mobileClickTrack.result.value);

    console.log('\n=== ALL DIRECT APK DOWNLOAD CHECKS COMPLETED! ===');
    ws.close();
  } catch (err) {
    console.error('Error in verification:', err);
  } finally {
    chrome.kill();
  }
}

testDirectApkDownload();
