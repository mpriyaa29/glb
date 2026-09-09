import { useEffect } from 'react';
import { detectARSupport } from '../utils/arDetection';
import { useAppStore } from '../store/appStore';

export function useARSupport() {
  const { arSupport, setARSupport } = useAppStore();

  useEffect(() => {
    let mounted = true;

    async function checkSupport() {
      const support = await detectARSupport();
      if (mounted) {
        setARSupport(support);
      }
    }

    checkSupport();

    return () => {
      mounted = false;
    };
  }, [setARSupport]);

  return arSupport;
}
