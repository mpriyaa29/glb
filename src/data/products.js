export const PRODUCTS = [
  {
    id: 'bekvam-30178884',
    name: 'BEKVÄM Wooden Step Stool (30178884)',
    category: 'furniture',
    price: 39,
    rating: 4.9,
    reviewsCount: 342,
    description: 'Iconic solid wood step stool with built-in hand hole on top step. Perfect for kitchen counter reach or extra seating.',
    dimensions: {
      width: '43 cm',
      height: '50 cm',
      depth: '39 cm',
      weight: '4.1 kg'
    },
    materials: ['Solid Birch', 'Clear Acrylic Lacquer'],
    colorVariants: [
      { name: 'Natural Birch', hex: '#d2b48c' },
      { name: 'White Stain', hex: '#f5f5f5' },
      { name: 'Black Finish', hex: '#222222' }
    ],
    modelPath: '/models/BEKVÄM_30178884.glb',
    thumbnail: '/thumbnails/bekvam-1-thumb.jpg',
    arScale: 'fixed',
    featured: true,
    polygonCount: '42,000',
    dracoCompressed: true
  },
  {
    id: 'bekvam-40463852',
    name: 'BEKVÄM Step Stool Edition (40463852)',
    category: 'furniture',
    price: 45,
    rating: 4.8,
    reviewsCount: 198,
    description: 'Durable solid wood step stool variant with reinforced rungs. Versatile utility stool and plant stand for modern homes.',
    dimensions: {
      width: '45 cm',
      height: '52 cm',
      depth: '40 cm',
      weight: '4.5 kg'
    },
    materials: ['Solid Hardwood', 'Matte Protective Finish'],
    colorVariants: [
      { name: 'Natural Wood', hex: '#c49a6c' },
      { name: 'Charcoal Dark', hex: '#333333' }
    ],
    modelPath: '/models/BEKVÄM_40463852.glb',
    thumbnail: '/thumbnails/bekvam-2-thumb.jpg',
    arScale: 'fixed',
    featured: true,
    polygonCount: '46,900',
    dracoCompressed: true
  },
  {
    id: 'chair-01',
    name: 'Ergonomic Executive Chair',
    category: 'furniture',
    price: 349,
    rating: 4.8,
    reviewsCount: 124,
    description: 'A modern, height-adjustable executive lounge chair with breathable mesh backing and premium leather seat cushion.',
    dimensions: {
      width: '60 cm',
      height: '92 cm',
      depth: '60 cm',
      weight: '14.2 kg'
    },
    materials: ['Black Anodized Aluminum', 'Memory Foam', 'Full-grain Leather'],
    colorVariants: [
      { name: 'Charcoal Navy', hex: '#2c3e50' },
      { name: 'Espresso Brown', hex: '#4a2c11' },
      { name: 'Slate Gray', hex: '#34495e' },
      { name: 'Modern White', hex: '#ecf0f1' }
    ],
    modelPath: '/models/chair.glb',
    thumbnail: '/thumbnails/chair-thumb.jpg',
    arScale: 'fixed',
    featured: true,
    polygonCount: '18,400',
    dracoCompressed: true
  },
  {
    id: 'lamp-01',
    name: 'Minimalist Brass Desk Lamp',
    category: 'lighting',
    price: 129,
    rating: 4.9,
    reviewsCount: 89,
    description: 'Sleek architectural LED desk lamp with brushed brass accent finish, 3-stage touch dimmer, and warm directional lighting.',
    dimensions: {
      width: '22 cm',
      height: '65 cm',
      depth: '22 cm',
      weight: '2.8 kg'
    },
    materials: ['Brushed Brass', 'Diffused Frosted Glass', 'Weighted Base'],
    colorVariants: [
      { name: 'Brushed Brass', hex: '#d4af37' },
      { name: 'Matte Black', hex: '#1e1e1e' },
      { name: 'Satin Nickel', hex: '#8e9eab' }
    ],
    modelPath: '/models/lamp.glb',
    thumbnail: '/thumbnails/lamp-thumb.jpg',
    arScale: 'fixed',
    featured: true,
    polygonCount: '12,200',
    dracoCompressed: true
  },
  {
    id: 'table-01',
    name: 'Nordic Oak Dining Table',
    category: 'furniture',
    price: 799,
    rating: 4.7,
    reviewsCount: 56,
    description: 'Handcrafted solid oak dining table featuring clean Scandinavian lines, rounded edge profile, and durable matte finish.',
    dimensions: {
      width: '120 cm',
      height: '72 cm',
      depth: '70 cm',
      weight: '28.5 kg'
    },
    materials: ['Solid Natural Oak', 'Powder-coated Steel Legs'],
    colorVariants: [
      { name: 'Natural Oak', hex: '#c49a6c' },
      { name: 'Dark Walnut', hex: '#5c4033' },
      { name: 'Ebony Stain', hex: '#262626' }
    ],
    modelPath: '/models/table.glb',
    thumbnail: '/thumbnails/table-thumb.jpg',
    arScale: 'fixed',
    featured: false,
    polygonCount: '15,600',
    dracoCompressed: true
  },
  {
    id: 'vase-01',
    name: 'Artisan Ceramic Flower Vase',
    category: 'decor',
    price: 65,
    rating: 4.9,
    reviewsCount: 210,
    description: 'Hand-thrown ceramic vase with organic flared geometry and deep turquoise glaze. Perfect center piece for modern interiors.',
    dimensions: {
      width: '18 cm',
      height: '48 cm',
      depth: '18 cm',
      weight: '3.4 kg'
    },
    materials: ['Stoneware Clay', 'Reactive Glaze Finish'],
    colorVariants: [
      { name: 'Deep Turquoise', hex: '#3b7a77' },
      { name: 'Terracotta', hex: '#c85a32' },
      { name: 'Sandstone White', hex: '#e8e3d9' }
    ],
    modelPath: '/models/vase.glb',
    thumbnail: '/thumbnails/vase-thumb.jpg',
    arScale: 'fixed',
    featured: true,
    polygonCount: '9,800',
    dracoCompressed: true
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'furniture', label: 'Furniture' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'decor', label: 'Decor' }
];
