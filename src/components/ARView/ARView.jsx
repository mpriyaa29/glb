import React, { useRef, useEffect, useState } from 'react';
import '@google/model-viewer';
import { useAppStore } from '../../store/appStore';
import { ARGuideOverlay } from './ARGuideOverlay';
import { Smartphone, RefreshCw, AlertCircle } from 'lucide-react';
import styles from './ARView.module.css';

export function ARView() {
  const { selectedProduct, setViewMode } = useAppStore();
  const modelViewerRef = useRef(null);
  const [isPlaced, setIsPlaced] = useState(false);
  const [arStatus, setArStatus] = useState('not-presenting');
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const el = modelViewerRef.current;
    if (!el) return;

    const handleArStatus = (event) => {
      setArStatus(event.detail.status);
      if (event.detail.status === 'object-placed') {
        setIsPlaced(true);
      } else if (event.detail.status === 'not-presenting') {
        setIsPlaced(false);
      }
    };

    const handleError = (error) => {
      console.error('model-viewer error:', error);
      setLoadError(true);
    };

    el.addEventListener('ar-status', handleArStatus);
    el.addEventListener('error', handleError);

    // Attempt auto AR trigger if supported on mobile
    if (el.canActivateAR) {
      setTimeout(() => {
        try {
          el.activateAR();
        } catch (e) {
          console.log('Manual AR trigger required');
        }
      }, 500);
    }

    return () => {
      el.removeEventListener('ar-status', handleArStatus);
      el.removeEventListener('error', handleError);
    };
  }, []);

  const handleResetPlacement = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.recenter();
      setIsPlaced(false);
    }
  };

  const handleCaptureScreenshot = async () => {
    if (modelViewerRef.current) {
      try {
        const blob = await modelViewerRef.current.toBlob({ idealAspect: true });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedProduct.id}-ar-snapshot.png`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Failed to capture snapshot', err);
      }
    }
  };

  if (!selectedProduct) return null;

  return (
    <div className={styles.arContainer}>
      <ARGuideOverlay
        onResetPlacement={handleResetPlacement}
        onCaptureScreenshot={handleCaptureScreenshot}
        isPlaced={isPlaced}
      />

      {loadError && (
        <div className={styles.errorOverlay}>
          <AlertCircle size={40} color="#ef4444" />
          <h3>Unable to launch WebAR</h3>
          <p>Failed to initialize 3D model stream. Ensure your device browser supports WebXR or Quick Look.</p>
          <button onClick={() => setViewMode('3d')} className={styles.errorBtn}>
            Return to 3D Viewer
          </button>
        </div>
      )}

      {/* Google Model Viewer Web Component */}
      <model-viewer
        ref={modelViewerRef}
        src={selectedProduct.modelPath}
        alt={`3D AR model of ${selectedProduct.name}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale={selectedProduct.arScale || 'fixed'}
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1"
        shadow-softness="1"
        interaction-prompt="auto"
        interaction-prompt-threshold="1500"
        exposure="1.0"
        loading="eager"
        class={styles.modelViewerElement}
      >
        <button slot="ar-button" className={styles.customArButton}>
          <Smartphone size={20} />
          <span>Launch Camera AR</span>
        </button>

        <div slot="progress-bar" className={styles.progressBar}>
          <div className={styles.updateBar}></div>
        </div>
      </model-viewer>
    </div>
  );
}
