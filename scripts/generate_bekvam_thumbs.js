import fs from 'fs';
import path from 'path';

const thumbDir = path.resolve('public/thumbnails');
if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

const newThumbs = [
  { file: 'bekvam-1-thumb.jpg', color: '#d2b48c', label: 'BEKVÄM Stool (30178884)' },
  { file: 'bekvam-2-thumb.jpg', color: '#c49a6c', label: 'BEKVÄM Stool (40463852)' }
];

newThumbs.forEach(({ file, color, label }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#121824"/>
    <circle cx="300" cy="260" r="160" fill="${color}" opacity="0.85"/>
    <rect x="220" y="220" width="160" height="20" rx="10" fill="#ffffff" opacity="0.9"/>
    <rect x="200" y="270" width="200" height="25" rx="12" fill="#ffffff" opacity="0.9"/>
    <text x="300" y="500" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">${label}</text>
  </svg>`;
  fs.writeFileSync(path.join(thumbDir, file), svg);
});

console.log('BEKVÄM thumbnails generated!');
