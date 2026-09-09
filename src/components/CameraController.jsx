import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStudio } from '../context/StudioContext';

const CAMERA_PRESETS = {
  iso: { position: [3.2, 2.4, 3.2], target: [0, 1.0, 0] },
  front: { position: [0, 1.2, 4.5], target: [0, 1.0, 0] },
  back: { position: [0, 1.2, -4.5], target: [0, 1.0, 0] },
  left: { position: [-4.5, 1.2, 0], target: [0, 1.0, 0] },
  right: { position: [4.5, 1.2, 0], target: [0, 1.0, 0] },
  top: { position: [0, 5.2, 0.001], target: [0, 1.0, 0] },
  detail: { position: [1.2, 1.4, 1.6], target: [0, 1.1, 0] }
};

export default function CameraController() {
  const controlsRef = useRef();
  const { camera } = useThree();
  const {
    activePresetView,
    autoRotate,
    rotateSpeed,
    resetCameraCounter
  } = useStudio();

  const isTransitioningRef = useRef(false);
  const targetCamPosRef = useRef(new THREE.Vector3(3.2, 2.4, 3.2));
  const targetLookAtRef = useRef(new THREE.Vector3(0, 1.0, 0));

  // Trigger smooth transition when preset or reset button changes
  useEffect(() => {
    const preset = CAMERA_PRESETS[activePresetView] || CAMERA_PRESETS.iso;
    targetCamPosRef.current.set(...preset.position);
    targetLookAtRef.current.set(...preset.target);
    isTransitioningRef.current = true;
  }, [activePresetView, resetCameraCounter]);

  // Smooth lerp camera position and target on each frame
  useFrame((state, delta) => {
    if (isTransitioningRef.current && controlsRef.current) {
      // Lerp camera position
      camera.position.lerp(targetCamPosRef.current, delta * 4.5);
      
      // Lerp controls target
      controlsRef.current.target.lerp(targetLookAtRef.current, delta * 4.5);
      controlsRef.current.update();

      // Stop lerping when close enough
      const posDist = camera.position.distanceTo(targetCamPosRef.current);
      const targetDist = controlsRef.current.target.distanceTo(targetLookAtRef.current);

      if (posDist < 0.02 && targetDist < 0.02) {
        camera.position.copy(targetCamPosRef.current);
        controlsRef.current.target.copy(targetLookAtRef.current);
        isTransitioningRef.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
      minDistance={1.2}
      maxDistance={12.0}
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI / 2 - 0.02} // Stop camera from going below floor plane
      autoRotate={autoRotate && !isTransitioningRef.current}
      autoRotateSpeed={rotateSpeed * 1.5}
      makeDefault
    />
  );
}
