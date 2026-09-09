import React, { createContext, useContext, useState, useCallback } from 'react';
import { PRESET_MATERIALS } from '../constants/studioConstants';

const StudioContext = createContext(null);

export const StudioProvider = ({ children }) => {
  const [activePresetView, setActivePresetView] = useState('iso');
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotateSpeed, setRotateSpeed] = useState(1.0);
  const [envPreset, setEnvPreset] = useState('studio');
  const [envIntensity, setEnvIntensity] = useState(1.0);
  const [shadowOpacity, setShadowOpacity] = useState(0.7);
  const [backgroundMode, setBackgroundMode] = useState('studio');
  
  const [materialOverrideEnabled, setMaterialOverrideEnabled] = useState(false);
  const [materialProps, setMaterialProps] = useState({
    color: '#3b82f6',
    metalness: 0.5,
    roughness: 0.25,
    wireframe: false,
    clearcoat: 0.4,
    finish: 'custom'
  });

  const [activePanel, setActivePanel] = useState(null);
  const [showBoundingBox, setShowBoundingBox] = useState(false);
  const [activeModelUrl, setActiveModelUrl] = useState('/models/product.glb');
  const [modelStats, setModelStats] = useState({ vertices: 0, triangles: 0, meshes: 0, name: 'product.glb' });
  const [resetCameraCounter, setResetCameraCounter] = useState(0);
  const [modelError, setModelError] = useState(null);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const triggerResetCamera = useCallback(() => {
    setActivePresetView('iso');
    setResetCameraCounter((prev) => prev + 1);
  }, []);

  const applyMaterialPreset = useCallback((presetKey) => {
    const preset = PRESET_MATERIALS[presetKey];
    if (preset) {
      setMaterialOverrideEnabled(true);
      setMaterialProps((prev) => ({
        ...prev,
        color: preset.color,
        metalness: preset.metalness,
        roughness: preset.roughness,
        clearcoat: preset.clearcoat,
        finish: presetKey
      }));
    }
  }, []);

  return (
    <StudioContext.Provider
      value={{
        activePresetView,
        setActivePresetView,
        autoRotate,
        setAutoRotate,
        rotateSpeed,
        setRotateSpeed,
        envPreset,
        setEnvPreset,
        envIntensity,
        setEnvIntensity,
        shadowOpacity,
        setShadowOpacity,
        backgroundMode,
        setBackgroundMode,
        materialOverrideEnabled,
        setMaterialOverrideEnabled,
        materialProps,
        setMaterialProps,
        applyMaterialPreset,
        activeModelUrl,
        setActiveModelUrl,
        activePanel,
        setActivePanel,
        showBoundingBox,
        setShowBoundingBox,
        modelStats,
        setModelStats,
        resetCameraCounter,
        triggerResetCamera,
        modelError,
        setModelError,
        showInstructionsModal,
        setShowInstructionsModal
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
