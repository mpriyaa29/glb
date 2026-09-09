import React, { useMemo, useEffect, useRef } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStudio } from '../context/StudioContext';

function CanvasLoadingPlaceholder() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-2xl glass-panel text-white shadow-2xl border border-white/20">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <span className="text-xs font-mono font-medium text-slate-200">Parsing 3D Geometry...</span>
      </div>
    </Html>
  );
}

// Procedural Fallback Model rendered if product.glb fetch fails
function ProceduralFallbackProduct() {
  const { materialOverrideEnabled, materialProps, setModelStats, showBoundingBox } = useStudio();

  useEffect(() => {
    setModelStats({
      vertices: 3840,
      triangles: 7680,
      meshes: 7,
      name: 'product.glb (Sample Concept)'
    });
  }, [setModelStats]);

  const mat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: materialOverrideEnabled ? materialProps.color : '#2563eb',
      metalness: materialOverrideEnabled ? materialProps.metalness : 0.6,
      roughness: materialOverrideEnabled ? materialProps.roughness : 0.2,
      wireframe: materialProps.wireframe
    });
  }, [materialOverrideEnabled, materialProps]);

  const chromeMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      metalness: 0.9,
      roughness: 0.1,
      wireframe: materialProps.wireframe
    });
  }, [materialProps.wireframe]);

  const accentMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      metalness: 0.8,
      roughness: 0.2,
      wireframe: materialProps.wireframe
    });
  }, [materialProps.wireframe]);

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow material={chromeMat}>
        <cylinderGeometry args={[1.2, 1.4, 0.3, 48]} />
      </mesh>
      
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow material={mat}>
        <cylinderGeometry args={[0.9, 0.9, 1.7, 48]} />
      </mesh>

      <mesh position={[0, 1.15, 0]} castShadow receiveShadow material={accentMat}>
        <torusGeometry args={[0.92, 0.05, 16, 48]} />
      </mesh>

      <mesh position={[0, 2.0, 0]} castShadow receiveShadow material={chromeMat}>
        <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      <mesh position={[0.95, 1.4, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={accentMat}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 32]} />
      </mesh>

      <mesh position={[-0.95, 1.4, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow material={chromeMat}>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
      </mesh>

      {showBoundingBox && (
        <mesh position={[0, 1.15, 0]}>
          <boxGeometry args={[2.0, 2.3, 2.0]} />
          <meshBasicMaterial color="#3b82f6" wireframe />
        </mesh>
      )}
    </group>
  );
}

// Main Loader Component consuming useGLTF
function LoadedGLBModel({ url }) {
  const gltf = useGLTF(url);
  const groupRef = useRef();
  const {
    materialOverrideEnabled,
    materialProps,
    showBoundingBox,
    setModelStats
  } = useStudio();

  const clonedScene = useMemo(() => {
    if (!gltf || !gltf.scene) return null;
    try {
      const clone = gltf.scene.clone(true);
      
      let vertices = 0;
      let triangles = 0;
      let meshes = 0;

      clone.traverse((child) => {
        if (child.isMesh) {
          meshes++;
          const geom = child.geometry;
          if (geom) {
            if (geom.index) {
              triangles += geom.index.count / 3;
            } else if (geom.attributes && geom.attributes.position) {
              triangles += geom.attributes.position.count / 3;
            }
            if (geom.attributes && geom.attributes.position) {
              vertices += geom.attributes.position.count;
            }
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const fileName = url.split('/').pop() || 'product.glb';
      setModelStats({
        vertices: Math.round(vertices),
        triangles: Math.round(triangles),
        meshes,
        name: fileName
      });

      return clone;
    } catch (err) {
      console.error('Error cloning GLTF scene:', err);
      return null;
    }
  }, [gltf, url, setModelStats]);

  const { centerOffset, scaleFactor } = useMemo(() => {
    if (!clonedScene) return { centerOffset: [0, 0, 0], scaleFactor: 1 };

    clonedScene.position.set(0, 0, 0);
    clonedScene.rotation.set(0, 0, 0);
    clonedScene.scale.set(1, 1, 1);

    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2.4;
    const scale = targetSize / maxDim;

    const offsetX = -center.x * scale;
    const offsetY = -box.min.y * scale;
    const offsetZ = -center.z * scale;

    return {
      centerOffset: [offsetX, offsetY, offsetZ],
      scaleFactor: scale
    };
  }, [clonedScene]);

  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        if (materialOverrideEnabled) {
          if (!child.userData.originalMaterial) {
            child.userData.originalMaterial = child.material;
          }
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(materialProps.color),
            metalness: materialProps.metalness,
            roughness: materialProps.roughness,
            wireframe: materialProps.wireframe,
            clearcoat: materialProps.clearcoat || 0,
            clearcoatRoughness: 0.1,
            envMapIntensity: 1.2
          });
        } else if (child.userData.originalMaterial) {
          child.material = child.userData.originalMaterial;
          if (child.material) child.material.wireframe = materialProps.wireframe;
        } else if (child.material) {
          child.material.wireframe = materialProps.wireframe;
        }
      }
    });
  }, [clonedScene, materialOverrideEnabled, materialProps]);

  if (!clonedScene) return <ProceduralFallbackProduct />;

  return (
    <group ref={groupRef} position={centerOffset} scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <primitive object={clonedScene} />
      {showBoundingBox && (
        <boxHelper args={[clonedScene, 0x3b82f6]} />
      )}
    </group>
  );
}

class GLTFErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('GLTF load caught error, reverting to procedural fallback:', error);
  }

  render() {
    if (this.state.hasError) {
      return <ProceduralFallbackProduct />;
    }
    return this.props.children;
  }
}

export default function ModelViewer({ modelUrl = '/models/product.glb' }) {
  return (
    <GLTFErrorBoundary key={modelUrl}>
      <React.Suspense fallback={<CanvasLoadingPlaceholder />}>
        <LoadedGLBModel url={modelUrl} />
      </React.Suspense>
    </GLTFErrorBoundary>
  );
}
