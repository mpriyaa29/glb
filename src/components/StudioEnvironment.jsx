import React from 'react';
import { Environment, MeshReflectorMaterial, ContactShadows } from '@react-three/drei';
import { useStudio } from '../context/StudioContext';

class EnvironmentErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('HDRI Environment preset load warning, using studio lighting fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default function StudioEnvironment() {
  const {
    envPreset,
    envIntensity,
    shadowOpacity,
    backgroundMode
  } = useStudio();

  const getBgColor = () => {
    switch (backgroundMode) {
      case 'light':
        return '#f1f5f9';
      case 'dark':
        return '#020617';
      case 'gradient':
        return '#0f172a';
      case 'studio':
      default:
        return '#0a0d14';
    }
  };

  return (
    <>
      <color attach="background" args={[getBgColor()]} />

      {/* HDRI Environment wrapped in Suspense & ErrorBoundary so CDN delays never freeze Canvas */}
      <EnvironmentErrorBoundary key={envPreset}>
        <React.Suspense fallback={null}>
          <Environment
            preset={envPreset === 'studio' ? 'studio' : envPreset}
            environmentIntensity={envIntensity}
            background={false}
          />
        </React.Suspense>
      </EnvironmentErrorBoundary>

      {/* Reliable Local 3-Point Studio Lighting */}
      <group name="ThreePointLighting">
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5 * envIntensity}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={15}
          shadow-bias={-0.0001}
        />
        <directionalLight
          position={[-6, 4, -2]}
          intensity={0.6 * envIntensity}
          color="#e0f2fe"
        />
        <directionalLight
          position={[0, 6, -6]}
          intensity={0.8 * envIntensity}
          color="#f0f9ff"
        />
        <ambientLight intensity={0.5 * envIntensity} color="#ffffff" />
      </group>

      {/* Grounded Soft Contact Shadows */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={shadowOpacity}
        scale={12}
        blur={2.0}
        far={5}
        resolution={1024}
        color="#000000"
      />

      {/* Reflective Studio Floor */}
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mirror={0.4}
          mixBlur={0.8}
          mixStrength={1.5}
          roughness={0.4}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={backgroundMode === 'light' ? '#cbd5e1' : '#090d16'}
          metalness={0.5}
        />
      </mesh>
    </>
  );
}
