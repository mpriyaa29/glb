import React from 'react';
import { X, Sparkles, Palette, Shield, CircleDot, Eye } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { PRESET_MATERIALS } from '../../constants/studioConstants';

export default function MaterialPanel() {
  const {
    activePanel,
    setActivePanel,
    materialOverrideEnabled,
    setMaterialOverrideEnabled,
    materialProps,
    setMaterialProps,
    applyMaterialPreset
  } = useStudio();

  if (activePanel !== 'material') return null;

  return (
    <aside className="absolute top-20 right-6 z-20 w-80 max-h-[calc(100vh-120px)] overflow-y-auto rounded-3xl glass-panel p-5 shadow-2xl pointer-events-auto border border-white/10 text-slate-200">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Material Configurator</h2>
            <p className="text-[11px] text-slate-400">PBR Surface & Finish Customization</p>
          </div>
        </div>
        <button
          onClick={() => setActivePanel(null)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Enable Override Switch */}
      <div className="flex items-center justify-between p-3 mb-4 rounded-2xl bg-slate-900/60 border border-white/5">
        <span className="text-xs font-semibold text-slate-300">Enable Material Override</span>
        <button
          onClick={() => setMaterialOverrideEnabled(!materialOverrideEnabled)}
          className={`w-11 h-6 rounded-full transition-colors relative ${
            materialOverrideEnabled ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
              materialOverrideEnabled ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Material Presets */}
      <div className="mb-5">
        <label className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
          Design Finishes
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PRESET_MATERIALS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyMaterialPreset(key)}
              className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                materialProps.finish === key && materialOverrideEnabled
                  ? 'border-blue-500/60 bg-blue-500/10 text-blue-300 shadow-sm'
                  : 'border-white/5 bg-slate-900/40 text-slate-300 hover:border-white/20'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full shadow-sm shrink-0 border border-white/20"
                style={{ backgroundColor: preset.color }}
              />
              <span className="text-xs font-medium truncate">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fine-Tuning Controls */}
      <div className="space-y-4 pt-2 border-t border-white/10">
        {/* Custom Color Picker */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-300 font-medium">Base Tint Color</span>
            <span className="text-[11px] font-mono text-slate-400">{materialProps.color}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={materialProps.color}
              onChange={(e) => {
                setMaterialOverrideEnabled(true);
                setMaterialProps((prev) => ({ ...prev, color: e.target.value, finish: 'custom' }));
              }}
              className="w-9 h-9 rounded-xl border border-white/20 bg-transparent cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={materialProps.color}
              onChange={(e) => {
                setMaterialOverrideEnabled(true);
                setMaterialProps((prev) => ({ ...prev, color: e.target.value, finish: 'custom' }));
              }}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Metalness Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300 font-medium">Metallic</span>
            <span className="text-[11px] font-mono text-slate-400">
              {Math.round(materialProps.metalness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={materialProps.metalness}
            onChange={(e) => {
              setMaterialOverrideEnabled(true);
              setMaterialProps((prev) => ({
                ...prev,
                metalness: parseFloat(e.target.value),
                finish: 'custom'
              }));
            }}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Roughness Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300 font-medium">Roughness</span>
            <span className="text-[11px] font-mono text-slate-400">
              {Math.round(materialProps.roughness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.02"
            max="1"
            step="0.05"
            value={materialProps.roughness}
            onChange={(e) => {
              setMaterialOverrideEnabled(true);
              setMaterialProps((prev) => ({
                ...prev,
                roughness: parseFloat(e.target.value),
                finish: 'custom'
              }));
            }}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Clearcoat Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300 font-medium">Gloss / Clearcoat</span>
            <span className="text-[11px] font-mono text-slate-400">
              {Math.round((materialProps.clearcoat || 0) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={materialProps.clearcoat || 0}
            onChange={(e) => {
              setMaterialOverrideEnabled(true);
              setMaterialProps((prev) => ({
                ...prev,
                clearcoat: parseFloat(e.target.value),
                finish: 'custom'
              }));
            }}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Wireframe Mode */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-medium text-slate-300">Wireframe Mesh Mode</span>
          <button
            onClick={() =>
              setMaterialProps((prev) => ({ ...prev, wireframe: !prev.wireframe }))
            }
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              materialProps.wireframe
                ? 'bg-blue-600 text-white'
                : 'glass-button text-slate-400'
            }`}
          >
            {materialProps.wireframe ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </aside>
  );
}
