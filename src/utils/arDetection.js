/**
 * Detects AR features, browser capabilities, and platform support.
 */

export async function detectARSupport() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);
  const isMobile = isIOS || isAndroid;

  let webxrSupported = false;

  if (navigator.xr && typeof navigator.xr.isSessionSupported === 'function') {
    try {
      webxrSupported = await navigator.xr.isSessionSupported('immersive-ar');
    } catch (e) {
      webxrSupported = false;
    }
  }

  // iOS QuickLook check
  const quickLookSupported = isIOS && (function() {
    const a = document.createElement('a');
    return a.relList && a.relList.supports && a.relList.supports('ar');
  })();

  const isSupported = isIOS || isAndroid || webxrSupported;

  let platform = 'desktop';
  if (isIOS) platform = 'ios';
  else if (isAndroid) platform = 'android';

  let arBadgeText = 'View in AR';
  if (platform === 'ios') arBadgeText = 'View in AR (iOS)';
  else if (platform === 'android') arBadgeText = 'View in AR (Android)';
  else if (platform === 'desktop') arBadgeText = 'Scan AR (Mobile)';

  return {
    isSupported,
    isMobile,
    platform,
    webxr: webxrSupported,
    quickLook: quickLookSupported,
    arBadgeText
  };
}
