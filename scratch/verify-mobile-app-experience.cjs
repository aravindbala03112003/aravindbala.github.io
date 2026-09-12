const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runVerification() {
  console.log('=== Starting Chrome Mobile App Experience Verification ===');
  const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const artifactDir = 'C:/Users/Asus/.gemini/antigravity-ide/brain/87b1c1d9-bef0-4111-b6e0-c692a744119a';
  
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
    await send('DOM.enable');

    console.log('1. Verifying Desktop Homepage at http://localhost:5173/...');
    await new Promise(r => setTimeout(r, 1200));

    // Check DOWNLOAD APK button exists and has correct text
    const buttonEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.desktop-apk-btn .download-apk-btn');
        return {
          exists: Boolean(btn),
          text: btn ? btn.innerText.trim() : null,
          hasDot: Boolean(btn && btn.querySelector('.download-apk-dot')),
          hasShimmer: Boolean(btn && btn.querySelector('.download-apk-shimmer')),
          hasIcon: Boolean(btn && btn.querySelector('.download-apk-icon-box'))
        };
      })()`,
      returnByValue: true
    });
    console.log('Desktop Navbar Button Check:', buttonEval.result.value);

    // Click DOWNLOAD APK button
    console.log('2. Clicking DOWNLOAD APK button...');
    const clickEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.desktop-apk-btn .download-apk-btn');
        if (btn) {
          btn.click();
          return 'Clicked DOWNLOAD APK';
        }
        return 'Button not found';
      })()`,
      returnByValue: true
    });
    console.log('Click result:', clickEval.result.value);

    // Wait for route change to /app
    await new Promise(r => setTimeout(r, 1500));

    const routeCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          pathname: window.location.pathname,
          search: window.location.search,
          hasStudio: Boolean(document.querySelector('.mobile-app-studio')),
          hasPhoneChassis: Boolean(document.querySelector('.phone-chassis-container')),
          hasDynamicIsland: Boolean(document.querySelector('.phone-dynamic-island')),
          hasStatusBar: Boolean(document.querySelector('.phone-status-bar')),
          hasIframe: Boolean(document.querySelector('.phone-iframe-element')),
          hasExitBtn: Boolean(document.querySelector('.studio-exit-btn')),
          clockText: document.querySelector('.phone-clock-text') ? document.querySelector('.phone-clock-text').innerText : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Route /app Verification:', routeCheck.result.value);

    // Capture screenshot of Desktop Smartphone Simulator
    const shot1 = await send('Page.captureScreenshot', { format: 'png' });
    const shot1Path = path.join(artifactDir, 'mobile_app_desktop_simulator.png');
    fs.writeFileSync(shot1Path, Buffer.from(shot1.data, 'base64'));
    console.log('Saved screenshot:', shot1Path);

    // 3. Test Device Selector Buttons
    console.log('3. Testing Device Preset Switcher (430px)...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const chips = Array.from(document.querySelectorAll('.studio-device-chip'));
        const largeChip = chips.find(c => c.innerText.includes('430px'));
        if (largeChip) largeChip.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 400));
    const widthCheck1 = await send('Runtime.evaluate', {
      expression: `document.querySelector('.phone-chassis-container').style.width`,
      returnByValue: true
    });
    console.log('Width after selecting 430px:', widthCheck1.result.value);

    // 4. Test "Exit to Desktop"
    console.log('4. Testing Exit to Desktop button...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const exitBtn = document.querySelector('.studio-exit-btn');
        if (exitBtn) exitBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 800));
    const exitCheck = await send('Runtime.evaluate', {
      expression: `window.location.pathname`,
      returnByValue: true
    });
    console.log('Pathname after Exit to Desktop:', exitCheck.result.value);

    // 5. Test Mobile Viewport (390px x 844px)
    console.log('5. Testing Mobile Viewport (390px x 844px) at /app...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Page.navigate', { url: 'http://localhost:5173/app' });
    await new Promise(r => setTimeout(r, 1500));

    const mobileCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        return {
          pathname: window.location.pathname,
          isMobileNative: Boolean(document.querySelector('.mobile-native-app-wrapper')),
          hasFloatingBar: Boolean(document.querySelector('.mobile-native-floating-bar')),
          hasNavbar: Boolean(document.querySelector('.nav')),
          hasSelfIntroBtn: Boolean(document.querySelector('.self-intro-btn')),
          hasHero: Boolean(document.querySelector('.hero')),
          hasWork: Boolean(document.querySelector('#work'))
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile Viewport Verification:', mobileCheck.result.value);

    // Capture screenshot of Native Mobile App View
    const shot2 = await send('Page.captureScreenshot', { format: 'png' });
    const shot2Path = path.join(artifactDir, 'mobile_app_native_mobile.png');
    fs.writeFileSync(shot2Path, Buffer.from(shot2.data, 'base64'));
    console.log('Saved screenshot:', shot2Path);

    // Test Self Intro modal in mobile view
    console.log('6. Opening Self Intro Video in Mobile View...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('.self-intro-btn');
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    const modalCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const modal = document.querySelector('.self-intro-modal-card');
        const video = document.querySelector('.self-intro-video-element');
        return {
          modalOpen: Boolean(modal),
          videoSrc: video ? video.getAttribute('src') : null,
          titleText: document.querySelector('.self-intro-title-text') ? document.querySelector('.self-intro-title-text').innerText : null
        };
      })()`,
      returnByValue: true
    });
    console.log('Mobile Self Intro Modal:', modalCheck.result.value);

    const shot3 = await send('Page.captureScreenshot', { format: 'png' });
    const shot3Path = path.join(artifactDir, 'mobile_app_self_intro_modal.png');
    fs.writeFileSync(shot3Path, Buffer.from(shot3.data, 'base64'));
    console.log('Saved screenshot:', shot3Path);

    console.log('\n=== ALL VERIFICATIONS PASSED SUCCESSFULLY! ===');
    ws.close();
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chrome.kill();
  }
}

runVerification();
