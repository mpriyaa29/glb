import React, { useState } from 'react';
import {
  Box,
  Camera,
  Maximize2,
  Minimize2,
  HelpCircle,
  Sparkles,
  SlidersHorizontal,
  SunMedium
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function Header() {
  const {
    modelStats,
    setShowInstructionsModal,
    activePanel,
    setActivePanel,
    activeModelUrl,
    setActiveModelUrl
  } = useStudio();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
      }
    }
  };

  const captureScreenshot = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `product-studio-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch (err) {
      console.error('Screenshot capture failed:', err);
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4 pointer-events-none">
      {/* Brand Title & Status */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel text-white shadow-xl">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold tracking-tight text-sm text-slate-100">
                3D PRODUCT STUDIO
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRO PBR
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                value={activeModelUrl}
                onChange={(e) => setActiveModelUrl(e.target.value)}
                className="bg-slate-900/90 text-blue-400 font-mono text-[11px] px-2 py-0.5 rounded-md border border-white/10 focus:outline-none focus:border-blue-500"
              >
                <option value="/models/BEKVÄM_30178884.glb">BEKVÄM_30178884.glb</option>
                <option value="/models/product.glb">product.glb</option>
              </select>
              <span className="text-[11px] text-slate-400 font-mono">
                {modelStats.triangles ? `• ${(modelStats.triangles / 1000).toFixed(1)}k tris` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Top Navigation / Panels Toggle */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-panel pointer-events-auto shadow-xl">
        <button
          onClick={() => setActivePanel(activePanel === 'material' ? null : 'material')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activePanel === 'material'
              ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40 shadow-lg shadow-blue-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Material Finish</span>
        </button>

        <button
          onClick={() => setActivePanel(activePanel === 'environment' ? null : 'environment')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activePanel === 'environment'
              ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40 shadow-lg shadow-blue-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <SunMedium className="w-4 h-4" />
          <span>Studio Lighting</span>
        </button>
      </div>

      {/* Right Quick Action Icons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={captureScreenshot}
          title="Capture Screenshot"
          className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white shadow-lg"
        >
          <Camera className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowInstructionsModal(true)}
          title="GLB File Placement Instructions"
          className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white shadow-lg"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
          className="p-2.5 rounded-xl glass-button text-slate-300 hover:text-white shadow-lg"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
