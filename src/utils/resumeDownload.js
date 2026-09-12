/**
 * Triggers genuine Resume PDF download.
 * If running inside the Android APK app, uses the native AndroidBridge
 * which writes directly to the device's public Downloads directory.
 * In a standard web browser, uses the programmatic anchor download.
 */
export function downloadResumePdf() {
  if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.downloadResume === 'function') {
    try {
      window.AndroidBridge.downloadResume();
      return;
    } catch (e) {
      console.warn('AndroidBridge call failed, falling back to browser download:', e);
    }
  }

  // Web browser fallback
  const link = document.createElement('a');
  link.href = `${import.meta.env.BASE_URL}resume.pdf`;
  link.download = 'Aravind_Bala_Resume.pdf';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 300);
}
