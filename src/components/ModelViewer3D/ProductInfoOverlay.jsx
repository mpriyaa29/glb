import React from 'react';
import { X, Check, Info, Box, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import styles from './ProductInfoOverlay.module.css';

export function ProductInfoOverlay() {
  const { selectedProduct, isInfoOpen, toggleInfoOpen, activeColorHex, setActiveColorHex } = useAppStore();

  if (!selectedProduct || !isInfoOpen) return null;

  return (
    <div className={styles.infoDrawer}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.categoryBadge}>{selectedProduct.category}</span>
          <h2 className={styles.productTitle}>{selectedProduct.name}</h2>
          <span className={styles.price}>${selectedProduct.price}</span>
        </div>
        <button onClick={toggleInfoOpen} className={styles.closeBtn} aria-label="Close info">
          <X size={20} />
        </button>
      </div>

      <p className={styles.description}>{selectedProduct.description}</p>

      {/* Color Variant Selector */}
      {selectedProduct.colorVariants && selectedProduct.colorVariants.length > 0 && (
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Material Finishes</label>
          <div className={styles.colorSwatches}>
            {selectedProduct.colorVariants.map((variant) => {
              const isSelected = activeColorHex === variant.hex;
              return (
                <button
                  key={variant.hex}
                  onClick={() => setActiveColorHex(variant.hex)}
                  className={`${styles.swatchBtn} ${isSelected ? styles.swatchActive : ''}`}
                  title={variant.name}
                  style={{ backgroundColor: variant.hex }}
                >
                  {isSelected && <Check size={14} color="#ffffff" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dimensions & Specifications Grid */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Product Specifications</label>
        <div className={styles.specsGrid}>
          <div className={styles.specItem}>
            <span className={styles.specKey}>Width</span>
            <span className={styles.specVal}>{selectedProduct.dimensions.width}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specKey}>Height</span>
            <span className={styles.specVal}>{selectedProduct.dimensions.height}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specKey}>Depth</span>
            <span className={styles.specVal}>{selectedProduct.dimensions.depth}</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specKey}>Weight</span>
            <span className={styles.specVal}>{selectedProduct.dimensions.weight}</span>
          </div>
        </div>
      </div>

      {/* Materials List */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Materials & Build</label>
        <ul className={styles.materialsList}>
          {selectedProduct.materials.map((mat, idx) => (
            <li key={idx}>
              <ShieldCheck size={14} className={styles.matIcon} /> {mat}
            </li>
          ))}
        </ul>
      </div>

      {/* 3D Tech Badge */}
      <div className={styles.techFooter}>
        <Box size={14} />
        <span>3D Mesh: {selectedProduct.polygonCount} polygons • Draco Compressed</span>
      </div>
    </div>
  );
}
