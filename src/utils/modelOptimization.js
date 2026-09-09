import * as THREE from 'three';

/**
 * Utility function to compute accurate bounding box dimensions for GLTF scene
 */
export function getModelStats(gltfScene) {
  if (!gltfScene) return null;

  const bbox = new THREE.Box3().setFromObject(gltfScene);
  const size = new THREE.Vector3();
  bbox.getSize(size);

  let triangleCount = 0;
  let meshCount = 0;

  gltfScene.traverse((child) => {
    if (child.isMesh && child.geometry) {
      meshCount++;
      if (child.geometry.index) {
        triangleCount += child.geometry.index.count / 3;
      } else if (child.geometry.attributes.position) {
        triangleCount += child.geometry.attributes.position.count / 3;
      }
    }
  });

  return {
    widthMeter: size.x.toFixed(2),
    heightMeter: size.y.toFixed(2),
    depthMeter: size.z.toFixed(2),
    triangles: Math.round(triangleCount),
    meshCount
  };
}

/**
 * Recenter mesh geometry pivot point
 */
export function centerModel(gltfScene) {
  if (!gltfScene) return;

  const bbox = new THREE.Box3().setFromObject(gltfScene);
  const center = new THREE.Vector3();
  bbox.getCenter(center);
  
  // Align bottom of object with ground level y = 0
  gltfScene.position.sub(new THREE.Vector3(center.x, bbox.min.y, center.z));
}
