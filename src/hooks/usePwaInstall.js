import { useState, useEffect, useCallback } from 'react';

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState('other');

  useEffect(() => {
    // Check if already installed / running in standalone mode
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      setIsInstalled(Boolean(isStandalone));
    };
    checkStandalone();

    // Detect operating system / device platform
    const ua = window.navigator.userAgent || '';
    const isIos =
      /iphone|ipad|ipod/i.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    const isAndroid = /android/i.test(ua);
    const isWindows = /windows|win32/i.test(ua);
    const isMac = /macintosh|mac os x/i.test(ua) && !isIos;
    const isLinux = /linux/i.test(ua) && !isAndroid;

    if (isAndroid) setPlatform('android');
    else if (isIos) setPlatform('ios');
    else if (isWindows) setPlatform('windows');
    else if (isMac) setPlatform('macos');
    else if (isLinux) setPlatform('linux');
    else setPlatform('other');

    // Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const triggerInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult?.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return { success: true, native: true };
        }
        return { success: false, native: true, dismissed: true };
      } catch (err) {
        console.warn('Install prompt error:', err);
        return { success: false, native: false };
      }
    }
    // No native prompt available — caller should display instructions modal
    return { success: false, native: false };
  }, [deferredPrompt]);

  return {
    deferredPrompt,
    isInstalled,
    platform,
    hasNativePrompt: Boolean(deferredPrompt),
    triggerInstall,
  };
}
