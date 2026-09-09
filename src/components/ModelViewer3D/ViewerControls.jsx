import React from 'react';
import { ArrowLeft, RotateCw, Info, Smartphone, Maximize, RefreshCw, QrCode } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import styles from './ViewerControls.module.css';

export function ViewerControls({ onToggleFullscreen, isFullscreen }) {
  const {
    selectedProduct,
    closeViewer,
    isAutoRotating,
    toggleAutoRotate,
    isInfoOpen,
    toggleInfoOpen,
    setViewMode,
    arSupport,
    setQrModalOpen
  } = useAppStore();

  const handleEnterAR = () => {
    if (arSupport.platform === 'desktop') {
      setQrModalOpen(true);
    } else {
      setViewMode('ar');
    }
  };

  return (
    <div className={styles.controlsOverlay}>
      {/* Top Header Controls */}
      <div className={styles.topBar}>
        <button onClick={closeViewer} className={styles.iconBtn} aria-label="Back to catalog">
          <ArrowLeft size={18} />
          <span>Catalog</span>
        </button>

        <h3 className={styles.headerTitle}>{selectedProduct?.name}</h3>

        <div className={styles.topRightActions}>
          <button
            onClick={toggleInfoOpen}
            className={`${styles.iconBtn} ${isInfoOpen ? styles.activeBtn : ''}`}
            aria-label="Toggle info panel"
          >
            <Info size={18} />
          </button>

          <button onClick={onToggleFullscreen} className={styles.iconBtn} aria-label="Toggle fullscreen">
            <Maximize size={18} />
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.toolbarGroup}>
          <button
            onClick={toggleAutoRotate}
            className={`${styles.toolBtn} ${isAutoRotating ? styles.activeTool : ''}`}
            title="Auto rotate 3D view"
          >
            <RotateCw size={18} className={isAutoRotating ? styles.spinIcon : ''} />
            <span>{isAutoRotating ? 'Pause Rotation' : 'Auto Rotate'}</span>
          </button>
        </div>

        {/* Enter AR Call To Action */}
        <button onClick={handleEnterAR} className={styles.enterArCta}>
          {arSupport.platform === 'desktop' ? <QrCode size={20} /> : <Smartphone size={20} />}
          <span>{arSupport.platform === 'desktop' ? 'Scan to View in AR' : 'Enter AR Mode'}</span>
        </button>
      </div>
    </div>
  );
}
