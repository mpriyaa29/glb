import React, { useState } from 'react';
import { ArrowLeft, RefreshCcw, Camera, Check, Move, ZoomIn, RotateCw } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import styles from './ARGuideOverlay.module.css';

export function ARGuideOverlay({ onResetPlacement, onCaptureScreenshot, isPlaced }) {
  const { selectedProduct, setViewMode } = useAppStore();
  const [capturedNotice, setCapturedNotice] = useState(false);

  const handleCapture = () => {
    if (onCaptureScreenshot) onCaptureScreenshot();
    setCapturedNotice(true);
    setTimeout(() => setCapturedNotice(false), 2500);
  };

  return (
    <div className={styles.arOverlay}>
      {/* Top Controls Bar */}
      <div className={styles.topBar}>
        <button onClick={() => setViewMode('3d')} className={styles.backBtn}>
          <ArrowLeft size={18} />
          <span>Exit AR</span>
        </button>

        <div className={styles.productBadge}>
          <span>{selectedProduct?.name}</span>
        </div>

        <div className={styles.actionGroup}>
          <button onClick={onResetPlacement} className={styles.iconBtn} title="Reset Placement">
            <RefreshCcw size={18} />
          </button>
          
          <button onClick={handleCapture} className={styles.iconBtn} title="Capture Screenshot">
            <Camera size={18} />
          </button>
        </div>
      </div>

      {/* Captured Toast Notification */}
      {capturedNotice && (
        <div className={styles.toast}>
          <Check size={16} /> Screenshot Captured!
        </div>
      )}

      {/* Surface Detection / Guidance Banners */}
      <div className={styles.bottomGuidance}>
        {!isPlaced ? (
          <div className={styles.guidanceCard}>
            <Move size={24} className={styles.pulseIcon} />
            <div>
              <h4>Scanning Surface</h4>
              <p>Move your phone camera around slowly to detect floor or table surface, then tap to place.</p>
            </div>
          </div>
        ) : (
          <div className={styles.gesturesHint}>
            <div className={styles.hintItem}>
              <ZoomIn size={16} />
              <span>Pinch to Scale</span>
            </div>
            <div className={styles.hintItem}>
              <RotateCw size={16} />
              <span>2 Fingers to Rotate</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
