import React, { useState } from 'react';
import { useAppStore } from './store/appStore';
import { useARSupport } from './hooks/useARSupport';
import { Catalog } from './components/Catalog/Catalog';
import { ModelViewer3D } from './components/ModelViewer3D/ModelViewer3D';
import { ARView } from './components/ARView/ARView';
import { QRCodeModal } from './components/ARView/QRCodeModal';
import { InfinityLoader } from './components/LoadingSpinner/InfinityLoader';
import styles from './App.module.css';

export default function App() {
  // Detect WebXR, iOS Quick Look, and mobile browser platform
  useARSupport();
  
  const [isInitialBoot, setIsInitialBoot] = useState(true);
  const { viewMode } = useAppStore();

  return (
    <div className={styles.appRoot}>
      {isInitialBoot && (
        <InfinityLoader
          isInitialBoot={true}
          onComplete={() => setIsInitialBoot(false)}
        />
      )}

      {viewMode === 'catalog' && <Catalog />}
      {viewMode === '3d' && <ModelViewer3D />}
      {viewMode === 'ar' && <ARView />}

      {/* Desktop WebAR QR Code Transfer Modal */}
      <QRCodeModal />
    </div>
  );
}
