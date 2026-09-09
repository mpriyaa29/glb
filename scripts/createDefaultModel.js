import * as THREE from 'three';
import { GLTFExporter } from 'three-stdlib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function buildHeadphoneModel() {
  const group = new THREE.Group();
  group.name = 'Studio_Headphones_Product';

  // Materials
  const matteMat = new THREE.MeshStandardMaterial({
    color: 0x1c1c24,
    roughness: 0.7,
    metalness: 0.2,
    name: 'Matte_Body'
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.95,
    roughness: 0.1,
    name: 'Chrome_Accent'
  });

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.9,
    roughness: 0.25,
    name: 'Gold_Ring'
  });

  const leatherMat = new THREE.MeshStandardMaterial({
    color: 0x27272a,
    roughness: 0.9,
    metalness: 0.05,
    name: 'Ear_Cushion'
  });

  const copperMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.85,
    roughness: 0.3,
    name: 'Copper_Mesh'
  });

  // 1. Headband Arc
  const headbandCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.8, 1.2, 0),
    new THREE.Vector3(-1.4, 3.2, 0),
    new THREE.Vector3(0, 3.8, 0),
    new THREE.Vector3(1.4, 3.2, 0),
    new THREE.Vector3(1.8, 1.2, 0)
  ]);
  const headbandGeo = new THREE.TubeGeometry(headbandCurve, 64, 0.22, 16, false);
  const headbandMesh = new THREE.Mesh(headbandGeo, matteMat);
  group.add(headbandMesh);

  // Headband Inner Cushion
  const cushionCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.2, 2.9, 0),
    new THREE.Vector3(0, 3.65, 0),
    new THREE.Vector3(1.2, 2.9, 0)
  ]);
  const cushionGeo = new THREE.TubeGeometry(cushionCurve, 40, 0.16, 12, false);
  const cushionMesh = new THREE.Mesh(cushionGeo, leatherMat);
  group.add(cushionMesh);

  // 2. Ear Cups (Left & Right)
  const createEarCup = (xPos, isRight) => {
    const cupGroup = new THREE.Group();
    cupGroup.position.set(xPos, 0.9, 0);
    cupGroup.rotation.z = isRight ? -0.15 : 0.15;

    // Outer Housing
    const housingGeo = new THREE.CylinderGeometry(1.2, 1.1, 0.7, 48);
    const housingMesh = new THREE.Mesh(housingGeo, matteMat);
    housingMesh.rotation.z = Math.PI / 2;
    cupGroup.add(housingMesh);

    // Chrome Outer Ring
    const ringGeo = new THREE.TorusGeometry(1.18, 0.08, 16, 48);
    const ringMesh = new THREE.Mesh(ringGeo, chromeMat);
    ringMesh.rotation.y = Math.PI / 2;
    cupGroup.add(ringMesh);

    // Gold Accent Trim
    const goldRingGeo = new THREE.TorusGeometry(0.85, 0.04, 16, 48);
    const goldRingMesh = new THREE.Mesh(goldRingGeo, goldMat);
    goldRingMesh.rotation.y = Math.PI / 2;
    goldRingMesh.position.x = isRight ? -0.36 : 0.36;
    cupGroup.add(goldRingMesh);

    // Speaker Grill Mesh
    const grillGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.05, 32);
    const grillMesh = new THREE.Mesh(grillGeo, copperMat);
    grillMesh.rotation.z = Math.PI / 2;
    grillMesh.position.x = isRight ? -0.37 : 0.37;
    cupGroup.add(grillMesh);

    // Cushion
    const cushionRingGeo = new THREE.TorusGeometry(1.05, 0.28, 24, 48);
    const cushionMesh = new THREE.Mesh(cushionRingGeo, leatherMat);
    cushionMesh.rotation.y = Math.PI / 2;
    cushionMesh.position.x = isRight ? 0.3 : -0.3;
    cupGroup.add(cushionMesh);

    // Hinge Pivot Stem
    const hingeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.8, 24);
    const hingeMesh = new THREE.Mesh(hingeGeo, chromeMat);
    hingeMesh.position.set(0, 0.6, 0);
    cupGroup.add(hingeMesh);

    return cupGroup;
  };

  group.add(createEarCup(-1.9, false));
  group.add(createEarCup(1.9, true));

  // 3. Display Stand / Base
  const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.3, 48);
  const baseMesh = new THREE.Mesh(baseGeo, matteMat);
  baseMesh.position.set(0, -1.2, 0);
  group.add(baseMesh);

  // Stand Base Chrome Rim
  const baseRimGeo = new THREE.TorusGeometry(1.78, 0.06, 16, 48);
  const baseRimMesh = new THREE.Mesh(baseRimGeo, chromeMat);
  baseRimMesh.rotation.x = Math.PI / 2;
  baseRimMesh.position.set(0, -1.33, 0);
  group.add(baseRimMesh);

  // Vertical Stem Stand
  const stemGeo = new THREE.CylinderGeometry(0.15, 0.22, 3.2, 24);
  const stemMesh = new THREE.Mesh(stemGeo, chromeMat);
  stemMesh.position.set(0, 0.4, -0.6);
  group.add(stemMesh);

  // Stand Top Hanger Hook
  const hookGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 24);
  const hookMesh = new THREE.Mesh(hookGeo, matteMat);
  hookMesh.rotation.z = Math.PI / 2;
  hookMesh.position.set(0, 2.0, -0.6);
  group.add(hookMesh);

  return group;
}

export function exportDefaultModel(outputPath) {
  const scene = new THREE.Scene();
  const model = buildHeadphoneModel();
  scene.add(model);

  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (gltf) => {
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(outputPath, Buffer.from(gltf));
      console.log('Successfully created product.glb at:', outputPath);
    },
    (error) => {
      console.error('Error exporting GLTF:', error);
    },
    { binary: true }
  );
}

// Execute if run directly
const targetPath = path.resolve(__dirname, '../public/models/product.glb');
exportDefaultModel(targetPath);
