import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useAppStore } from '../../store/appStore';
import { StudioScene } from './StudioScene';
import { ProductInfoOverlay } from './ProductInfoOverlay';
import { ViewerControls } from './ViewerControls';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { useFullscreen } from '../../hooks/useFullscreen';
import styles from './ModelViewer3D.module.css';

export function ModelViewer3D() {
  const { selectedProduct } = useAppStore();
  const containerRef = useRef(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  if (!selectedProduct) return null;

  return (
    <div ref={containerRef} className={styles.stageContainer}>
      <ErrorBoundary key={selectedProduct.id}>
        <ViewerControls onToggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} />

        <ProductInfoOverlay />

        <Suspense fallback={<LoadingSpinner message={`Downloading ${selectedProduct.name}...`} />}>
          <Canvas
            shadows
            camera={{ position: [0, 1.2, 2.5], fov: 45 }}
            gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
            className={styles.canvas}
          >
            <StudioScene modelUrl={selectedProduct.modelPath} />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
