import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/appStore';
import { centerModel } from '../../utils/modelOptimization';

function Model({ url }) {
  const { scene } = useGLTF(url);
  const { activeColorHex } = useAppStore();
  const sceneRef = useRef();

  useEffect(() => {
    if (scene) {
      centerModel(scene);

      // Traversal to apply active color variant if selected
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (activeColorHex) {
            // Apply color to main body mesh (exclude pure metallic accents if desired)
            if (!child.material.name.toLowerCase().includes('metal')) {
              child.material = child.material.clone();
              child.material.color = new THREE.Color(activeColorHex);
            }
          }
        }
      });
    }
  }, [scene, activeColorHex]);

  return <primitive ref={sceneRef} object={scene} />;
}

export function StudioScene({ modelUrl }) {
  const { isAutoRotating } = useAppStore();
  const controlsRef = useRef();

  return (
    <>
      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={15}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-bias={-0.0001}
      />
      <pointLight position={[-5, 3, -5]} intensity={0.5} />

      {/* Realistic Environment Map Reflections */}
      <Environment preset="city" background={false} />

      {/* 3D Model Asset */}
      <Model url={modelUrl} />

      {/* Ground Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.65}
        scale={10}
        blur={1.5}
        far={4}
        resolution={1024}
        color="#000000"
      />

      {/* Orbit Controls with Damping */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        autoRotate={isAutoRotating}
        autoRotateSpeed={2.5}
        minDistance={0.5}
        maxDistance={5.0}
        maxPolarAngle={Math.PI / 2 + 0.05} // Don't orbit below ground
      />
    </>
  );
}
