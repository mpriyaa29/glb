import React from 'react';
import { Eye, Smartphone, Star, QrCode } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { launchNativeAR } from '../../utils/arLauncher';
import styles from './ProductCard.module.css';

export function ProductCard({ product }) {
  const { selectProduct, arSupport, setQrModalOpen } = useAppStore();

  const handleLaunch3D = () => {
    selectProduct(product, '3d');
  };

  const handleLaunchAR = () => {
    if (arSupport.platform === 'desktop') {
      selectProduct(product, 'catalog');
      setQrModalOpen(true);
    } else {
      selectProduct(product, 'catalog');
      const launched = launchNativeAR(product);
      if (!launched) {
        selectProduct(product, 'ar');
      }
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper} onClick={handleLaunch3D}>
        <img
          src={product.thumbnail}
          alt={product.name}
          className={styles.thumbnail}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231e293b"/><text x="50%" y="50%" fill="%2394a3b8" dominant-baseline="middle" text-anchor="middle" font-size="20">3D Product Model</text></svg>';
          }}
        />
        <span className={styles.categoryBadge}>{product.category}</span>
        {product.dracoCompressed && (
          <span className={styles.dracoBadge}>Draco 3D</span>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{product.name}</h3>
          <div className={styles.rating}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating}</span>
          </div>
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.priceRow}>
          <span className={styles.price}>${product.price}</span>
          <span className={styles.polygonTag}>{product.polygonCount} polys</span>
        </div>

        <div className={styles.actionsGroup}>
          <button onClick={handleLaunch3D} className={styles.btnPrimary}>
            <Eye size={16} /> View in 3D
          </button>
          
          <button onClick={handleLaunchAR} className={styles.btnSecondary}>
            {arSupport.platform === 'desktop' ? <QrCode size={16} /> : <Smartphone size={16} />}
            {arSupport.arBadgeText}
          </button>
        </div>
      </div>
    </div>
  );
}
