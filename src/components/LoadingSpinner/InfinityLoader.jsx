import React, { useEffect, useState } from 'react';
import styles from './InfinityLoader.module.css';

export function InfinityLoader({ progress = 0, message, isInitialBoot = false, onComplete }) {
  const [displayPercent, setDisplayPercent] = useState(0);

  useEffect(() => {
    if (isInitialBoot) {
      let start = 0;
      const interval = setInterval(() => {
        start += Math.floor(Math.random() * 7) + 3;
        if (start >= 100) {
          start = 100;
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 350);
        }
        setDisplayPercent(start);
      }, 65);

      return () => clearInterval(interval);
    } else {
      setDisplayPercent(Math.round(progress));
    }
  }, [progress, isInitialBoot, onComplete]);

  const formattedPercent = displayPercent
    .toString()
    .split('')
    .join(' ') + ' %';

  return (
    <div className={styles.overlay}>
      <div className={styles.loaderContainer}>
        {/* Alpha / Infinity Ribbon SVG Loop matching screenshot exactly */}
        <div className={styles.svgContainer}>
          <svg viewBox="0 0 100 65" className={styles.infinitySvg}>
            {/* Background Faint Path */}
            <path
              d="M 80 18 C 64 34, 48 46, 32 46 C 18 46, 10 36, 10 25 C 10 14, 18 8, 32 8 C 48 8, 64 22, 80 44"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            {/* Animated Crisp White Path */}
            <path
              d="M 80 18 C 64 34, 48 46, 32 46 C 18 46, 10 36, 10 25 C 10 14, 18 8, 32 8 C 48 8, 64 22, 80 44"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.4"
              strokeLinecap="round"
              className={styles.animatedPath}
            />
          </svg>
        </div>

        {/* Clean Spaced Percentage Font */}
        <div className={styles.percentFont}>{formattedPercent}</div>
      </div>
    </div>
  );
}
