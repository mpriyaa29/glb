import fs from 'fs';
import path from 'path';
import * as THREE from 'three';

const outputDir = path.resolve('public/models');
const thumbDir = path.resolve('public/thumbnails');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

// Convert Three.js Object3D / BufferGeometry into a standalone binary GLB 2.0 file
function createGlbFromMesh(group, name) {
  const geometries = [];
  const materials = [];

  group.updateMatrixWorld(true);

  group.traverse((child) => {
    if (child.isMesh && child.geometry) {
      // Ensure geometry has positions & normals
      const geom = child.geometry.clone();
      geom.applyMatrix4(child.matrixWorld);
      if (!geom.attributes.normal) geom.computeVertexNormals();

      geometries.push({
        geometry: geom,
        material: child.material || new THREE.MeshStandardMaterial({ color: 0xcccccc })
      });
    }
  });

  // Combine geometries into single attribute buffers
  let totalVertices = 0;
  let totalIndices = 0;

  geometries.forEach(({ geometry }) => {
    totalVertices += geometry.attributes.position.count;
    if (geometry.index) {
      totalIndices += geometry.index.count;
    } else {
      totalIndices += geometry.attributes.position.count;
    }
  });

  const posBuffer = new Float32Array(totalVertices * 3);
  const normBuffer = new Float32Array(totalVertices * 3);
  const idxBuffer = new Uint32Array(totalIndices);

  let vOffset = 0;
  let iOffset = 0;

  const matMap = [];

  geometries.forEach(({ geometry, material }, meshIdx) => {
    const pos = geometry.attributes.position;
    const norm = geometry.attributes.normal;
    const vCount = pos.count;

    for (let i = 0; i < vCount; i++) {
      posBuffer[(vOffset + i) * 3] = pos.getX(i);
      posBuffer[(vOffset + i) * 3 + 1] = pos.getY(i);
      posBuffer[(vOffset + i) * 3 + 2] = pos.getZ(i);

      if (norm) {
        normBuffer[(vOffset + i) * 3] = norm.getX(i);
        normBuffer[(vOffset + i) * 3 + 1] = norm.getY(i);
        normBuffer[(vOffset + i) * 3 + 2] = norm.getZ(i);
      }
    }

    if (geometry.index) {
      for (let i = 0; i < geometry.index.count; i++) {
        idxBuffer[iOffset + i] = vOffset + geometry.index.getX(i);
      }
      iOffset += geometry.index.count;
    } else {
      for (let i = 0; i < vCount; i++) {
        idxBuffer[iOffset + i] = vOffset + i;
      }
      iOffset += vCount;
    }

    // Material color
    const col = material.color || new THREE.Color(0xcccccc);
    matMap.push({
      name: material.name || `Material_${meshIdx}`,
      pbrMetallicRoughness: {
        baseColorFactor: [col.r, col.g, col.b, 1.0],
        metallicFactor: material.metalness !== undefined ? material.metalness : 0.1,
        roughnessFactor: material.roughness !== undefined ? material.roughness : 0.5
      }
    });

    vOffset += vCount;
  });

  // Calculate min/max bounding box
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < totalVertices; i++) {
    const x = posBuffer[i * 3];
    const y = posBuffer[i * 3 + 1];
    const z = posBuffer[i * 3 + 2];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  // Build binary buffer layout: [Indices] -> [Positions] -> [Normals]
  const idxByteLength = idxBuffer.byteLength;
  const posByteLength = posBuffer.byteLength;
  const normByteLength = normBuffer.byteLength;

  const totalBinLength = idxByteLength + posByteLength + normByteLength;
  const binBuffer = Buffer.alloc(totalBinLength);

  Buffer.from(idxBuffer.buffer).copy(binBuffer, 0);
  Buffer.from(posBuffer.buffer).copy(binBuffer, idxByteLength);
  Buffer.from(normBuffer.buffer).copy(binBuffer, idxByteLength + posByteLength);

  // Build glTF JSON header
  const gltfJson = {
    asset: { version: '2.0', generator: 'AGY GLB Studio Generator' },
    scenes: [{ nodes: [0] }],
    nodes: [{ name, mesh: 0 }],
    meshes: [
      {
        name,
        primitives: [
          {
            attributes: {
              POSITION: 1,
              NORMAL: 2
            },
            indices: 0,
            material: 0
          }
        ]
      }
    ],
    materials: matMap.length > 0 ? [matMap[0]] : [{ pbrMetallicRoughness: { baseColorFactor: [0.8, 0.8, 0.8, 1.0] } }],
    accessors: [
      {
        bufferView: 0,
        byteOffset: 0,
        componentType: 5125, // UNSIGNED_INT
        count: totalIndices,
        type: 'SCALAR'
      },
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: totalVertices,
        type: 'VEC3',
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ]
      },
      {
        bufferView: 2,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: totalVertices,
        type: 'VEC3'
      }
    ],
    bufferViews: [
      {
        buffer: 0,
        byteOffset: 0,
        byteLength: idxByteLength,
        target: 34963 // ELEMENT_ARRAY_BUFFER
      },
      {
        buffer: 0,
        byteOffset: idxByteLength,
        byteLength: posByteLength,
        target: 34962 // ARRAY_BUFFER
      },
      {
        buffer: 0,
        byteOffset: idxByteLength + posByteLength,
        byteLength: normByteLength,
        target: 34962 // ARRAY_BUFFER
      }
    ],
    buffers: [
      {
        byteLength: totalBinLength
      }
    ]
  };

  const jsonString = JSON.stringify(gltfJson);
  const jsonBuffer = Buffer.from(jsonString, 'utf8');

  // Pad JSON buffer to 4-byte boundary
  const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
  const jsonChunkLength = jsonBuffer.length + jsonPadding;
  const paddedJsonBuffer = Buffer.alloc(jsonChunkLength, 0x20);
  jsonBuffer.copy(paddedJsonBuffer);

  // Pad BIN buffer to 4-byte boundary
  const binPadding = (4 - (binBuffer.length % 4)) % 4;
  const binChunkLength = binBuffer.length + binPadding;
  const paddedBinBuffer = Buffer.alloc(binChunkLength, 0x00);
  binBuffer.copy(paddedBinBuffer);

  // GLB Header: 12 bytes
  const headerLength = 12;
  const jsonChunkHeaderLength = 8;
  const binChunkHeaderLength = 8;

  const totalGlbLength = headerLength + jsonChunkHeaderLength + jsonChunkLength + binChunkHeaderLength + binChunkLength;

  const glbBuffer = Buffer.alloc(totalGlbLength);

  // Magic 'glTF' (0x46544C67)
  glbBuffer.writeUInt32LE(0x46544C67, 0);
  // Version 2
  glbBuffer.writeUInt32LE(2, 4);
  // Total Length
  glbBuffer.writeUInt32LE(totalGlbLength, 8);

  // JSON Chunk Header
  glbBuffer.writeUInt32LE(jsonChunkLength, 12);
  glbBuffer.writeUInt32LE(0x4E4F534A, 16); // 'JSON'
  paddedJsonBuffer.copy(glbBuffer, 20);

  // BIN Chunk Header
  const binHeaderOffset = 20 + jsonChunkLength;
  glbBuffer.writeUInt32LE(binChunkLength, binHeaderOffset);
  glbBuffer.writeUInt32LE(0x004E4942, binHeaderOffset + 4); // 'BIN\0'
  paddedBinBuffer.copy(glbBuffer, binHeaderOffset + 8);

  return glbBuffer;
}

// Builders
function createChairMesh() {
  const group = new THREE.Group();
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.8 });
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.4 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), fabricMat);
  seat.position.y = 0.45;
  group.add(seat);

  const back = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.5, 0.08), fabricMat);
  back.position.set(0, 0.72, -0.25);
  group.add(back);

  [[-0.25, 0.225, -0.25], [0.25, 0.225, -0.25], [-0.25, 0.225, 0.25], [0.25, 0.225, 0.25]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 12), woodMat);
    leg.position.set(x, y, z);
    group.add(leg);
  });
  return group;
}

function createLampMesh() {
  const group = new THREE.Group();
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
  
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.03, 24), brassMat);
  base.position.y = 0.015;
  group.add(base);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 12), brassMat);
  stem.position.y = 0.33;
  group.add(stem);

  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.15, 24), brassMat);
  shade.position.set(0.1, 0.6, 0);
  group.add(shade);
  return group;
}

function createTableMesh() {
  const group = new THREE.Group();
  const oakMat = new THREE.MeshStandardMaterial({ color: 0xc49a6c, roughness: 0.6 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5 });

  const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.7), oakMat);
  top.position.y = 0.72;
  group.add(top);

  [[-0.52, 0.35, -0.28], [0.52, 0.35, -0.28], [-0.52, 0.35, 0.28], [0.52, 0.35, 0.28]].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.7, 12), darkMat);
    leg.position.set(x, y, z);
    group.add(leg);
  });
  return group;
}

function createVaseMesh() {
  const group = new THREE.Group();
  const ceramicMat = new THREE.MeshStandardMaterial({ color: 0x3b7a77, roughness: 0.2 });
  
  const points = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.12, 0.02),
    new THREE.Vector2(0.18, 0.15),
    new THREE.Vector2(0.14, 0.3),
    new THREE.Vector2(0.08, 0.42),
    new THREE.Vector2(0.1, 0.48)
  ];
  const vase = new THREE.Mesh(new THREE.LatheGeometry(points, 24), ceramicMat);
  group.add(vase);
  return group;
}

const items = [
  { name: 'chair.glb', builder: createChairMesh },
  { name: 'lamp.glb', builder: createLampMesh },
  { name: 'table.glb', builder: createTableMesh },
  { name: 'vase.glb', builder: createVaseMesh }
];

items.forEach(({ name, builder }) => {
  const meshGroup = builder();
  const buffer = createGlbFromMesh(meshGroup, name);
  const targetPath = path.join(outputDir, name);
  fs.writeFileSync(targetPath, buffer);
  console.log(`Successfully generated valid GLB model: ${name} (${buffer.length} bytes)`);
});

// Also copy product.glb fallback if needed
const existingProductGlb = path.resolve('public/models/product.glb');
if (!fs.existsSync(existingProductGlb) && fs.existsSync(path.join(outputDir, 'chair.glb'))) {
  fs.copyFileSync(path.join(outputDir, 'chair.glb'), existingProductGlb);
}

// Generate basic SVG thumbnails as fallbacks
const thumbnails = [
  { file: 'chair-thumb.jpg', color: '#2c3e50', label: 'Chair' },
  { file: 'lamp-thumb.jpg', color: '#d4af37', label: 'Lamp' },
  { file: 'table-thumb.jpg', color: '#c49a6c', label: 'Table' },
  { file: 'vase-thumb.jpg', color: '#3b7a77', label: 'Vase' }
];

thumbnails.forEach(({ file, color, label }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#121824"/>
    <circle cx="300" cy="280" r="160" fill="${color}" opacity="0.85"/>
    <text x="300" y="500" font-family="sans-serif" font-size="36" font-weight="bold" fill="#ffffff" text-anchor="middle">${label}</text>
  </svg>`;
  fs.writeFileSync(path.join(thumbDir, file), svg);
});

console.log('All GLB models and thumbnails generated successfully!');
