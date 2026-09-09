import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // View states
  viewMode: 'catalog', // 'catalog' | '3d' | 'ar'
  selectedProduct: null,
  
  // Catalog filters
  selectedCategory: 'all',
  searchQuery: '',

  // 3D Viewer options
  isAutoRotating: false,
  isInfoOpen: true,
  activeColorHex: null,
  
  // AR State & Modals
  qrModalOpen: false,
  arSupport: {
    isSupported: false,
    platform: 'unknown', // 'ios' | 'android' | 'desktop'
    webxr: false,
    quickLook: false
  },

  // Loading & Diagnostics
  loadingProgress: 0,
  isModelLoading: false,
  modelError: null,

  // Action reducers
  setViewMode: (mode) => set({ viewMode: mode }),
  
  selectProduct: (product, mode = '3d') => {
    const defaultHex = product?.colorVariants?.[0]?.hex || null;
    set({
      selectedProduct: product,
      viewMode: mode,
      activeColorHex: defaultHex,
      modelError: null,
      loadingProgress: 0
    });
  },

  closeViewer: () => set({ viewMode: 'catalog', selectedProduct: null }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  toggleAutoRotate: () => set((state) => ({ isAutoRotating: !state.isAutoRotating })),
  setAutoRotate: (flag) => set({ isAutoRotating: flag }),
  
  toggleInfoOpen: () => set((state) => ({ isInfoOpen: !state.isInfoOpen })),
  setInfoOpen: (flag) => set({ isInfoOpen: flag }),

  setActiveColorHex: (hex) => set({ activeColorHex: hex }),

  setQrModalOpen: (open) => set({ qrModalOpen: open }),

  setARSupport: (supportInfo) => set({ arSupport: supportInfo }),

  setLoadingProgress: (progress) => set({ loadingProgress: progress }),
  setModelLoading: (isLoading) => set({ isModelLoading: isLoading }),
  setModelError: (error) => set({ modelError: error })
}));
