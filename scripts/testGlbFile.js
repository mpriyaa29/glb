import fs from 'fs';
import path from 'path';

const filePath = path.resolve('public/models/BEKVÄM_30178884.glb');

console.log('Testing file exists:', filePath);
if (fs.existsSync(filePath)) {
  const stats = fs.statSync(filePath);
  console.log('File size:', stats.size, 'bytes (', (stats.size / 1024 / 1024).toFixed(2), 'MB)');

  // Read header
  const buffer = fs.readFileSync(filePath);
  const magic = buffer.toString('utf8', 0, 4);
  const version = buffer.readUInt32LE(4);
  const length = buffer.readUInt32LE(8);
  console.log('GLB Magic:', magic, '(Expected: glTF)');
  console.log('GLB Version:', version);
  console.log('GLB Length in header:', length);
} else {
  console.error('File does NOT exist!');
}
