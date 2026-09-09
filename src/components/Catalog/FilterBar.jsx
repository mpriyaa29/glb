import React from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../../data/products';
import { useAppStore } from '../../store/appStore';
import styles from './FilterBar.module.css';

export function FilterBar() {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useAppStore();

  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Search 3D models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.categoriesGroup}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`${styles.categoryTab} ${selectedCategory === cat.id ? styles.activeTab : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
