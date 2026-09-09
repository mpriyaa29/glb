import React from 'react';
import { PRODUCTS } from '../../data/products';
import { useAppStore } from '../../store/appStore';
import { FilterBar } from './FilterBar';
import { ProductCard } from '../ProductCard/ProductCard';
import { Box, Sparkles, Smartphone, Layers } from 'lucide-react';
import styles from './Catalog.module.css';

export function Catalog() {
  const { selectedCategory, searchQuery, arSupport } = useAppStore();

  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.logoIcon}>
            <Box size={28} color="#6366f1" />
          </div>
          <div>
            <h1 className={styles.appTitle}>Spatial3D Catalog</h1>
            <p className={styles.appSubtitle}>Real-time 3D & Augmented Reality Product Visualization</p>
          </div>
        </div>

        <div className={styles.arBadgeContainer}>
          <Smartphone size={16} />
          <span>{arSupport.isMobile ? 'Mobile WebAR Ready' : 'Desktop Preview (QR AR Supported)'}</span>
        </div>
      </header>

      <FilterBar />

      {filteredProducts.length > 0 ? (
        <div className={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Layers size={48} className={styles.emptyIcon} />
          <h3>No 3D Models Found</h3>
          <p>Try adjusting your search criteria or selecting a different category.</p>
        </div>
      )}
    </div>
  );
}
