import React from 'react';
import {
  RotateCw,
  RefreshCw,
  Compass,
  Eye,
  BoxSelect,
  Layers
} from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

const PRESET_VIEWS = [
  { id: 'iso', label: 'Isometric' },
  { id: 'front', label: 'Front' },
  { id: 'right', label: 'Side' },
  { id: 'top', label: 'Top' },
  { id: 'detail', label: 'Detail' }
];

export default function Toolbar() {
  const {
    activePresetView,
    setActivePresetView,
    autoRotate,
    setAutoRotate,
    triggerResetCamera,
    showBoundingBox,
    setShowBoundingBox,
    activePanel,
    setActivePanel
  } = useStudio();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel shadow-2xl pointer-events-auto max-w-[95vw] overflow-x-auto">
      {/* Preset View Buttons */}
      <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5">
        {PRESET_VIEWS.map((view) => (
          <button
            key={view.id}
            onClick={() => setActivePresetView(view.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePresetView === view.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-white/10" />

      {/* Auto-Rotation Toggle */}
      <button
        onClick={() => setAutoRotate(!autoRotate)}
        title="Toggle Auto Rotation"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
          autoRotate
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10'
            : 'glass-button text-slate-300'
        }`}
      >
        <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
        <span className="hidden sm:inline">Auto Rotate</span>
      </button>

      {/* Reset Camera Button */}
      <button
        onClick={triggerResetCamera}
        title="Reset Camera Framing"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-button text-slate-300 hover:text-white text-xs font-medium"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Reset</span>
      </button>

      {/* Bounding Box Wireframe Toggle */}
      <button
        onClick={() => setShowBoundingBox(!showBoundingBox)}
        title="Toggle Model Bounds"
        className={`p-2 rounded-xl text-xs font-medium transition-all ${
          showBoundingBox
            ? 'bg-blue-600/30 text-blue-400 border border-blue-500/40'
            : 'glass-button text-slate-300'
        }`}
      >
        <BoxSelect className="w-3.5 h-3.5" />
      </button>

      {/* Mobile Drawer Toggles */}
      <div className="flex md:hidden items-center gap-1 border-l border-white/10 pl-2">
        <button
          onClick={() => setActivePanel(activePanel === 'material' ? null : 'material')}
          className={`p-2 rounded-xl text-xs ${
            activePanel === 'material' ? 'bg-blue-600 text-white' : 'glass-button text-slate-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
