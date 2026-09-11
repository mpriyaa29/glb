/**
 * Launches native mobile camera AR directly for Android Scene Viewer and iOS Quick Look
 */
export function launchNativeAR(product) {
  if (!product || !product.modelPath) return false;

  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /android/i.test(ua);

  // Form absolute HTTPS URL to GLB model
  const absoluteGlbUrl = new URL(product.modelPath, window.location.origin).href;

  if (isAndroid) {
    // Android Scene Viewer native Intent URL — opens phone camera AR directly
    const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
      absoluteGlbUrl
    )}&mode=ar_only&title=${encodeURIComponent(
      product.name
    )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
      window.location.href
    )};end;`;

    window.location.href = sceneViewerUrl;
    return true;
  }

  if (isIOS) {
    // iOS QuickLook anchor trigger — opens native Apple camera AR directly
    const anchor = document.createElement('a');
    anchor.setAttribute('rel', 'ar');
    anchor.setAttribute('href', absoluteGlbUrl);
    
    // Add quicklook image thumbnail fallback if available
    const img = document.createElement('img');
    img.src = product.thumbnail || '';
    anchor.appendChild(img);
    
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    return true;
  }

  return false;
}
