import React from 'react';
import { X, Sun, Moon, Sparkles, Sliders, Layers } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ENVIRONMENT_PRESETS } from '../../constants/studioConstants';

export default function EnvironmentPanel() {
  const {
    activePanel,
    setActivePanel,
    envPreset,
    setEnvPreset,
    envIntensity,
    setEnvIntensity,
    shadowOpacity,
    setShadowOpacity,
    backgroundMode,
    setBackgroundMode
  } = useStudio();

  if (activePanel !== 'environment') return null;

  return (
    <aside className="absolute top-20 right-6 z-20 w-80 max-h-[calc(100vh-120px)] overflow-y-auto rounded-3xl glass-panel p-5 shadow-2xl pointer-events-auto border border-white/10 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Studio Lighting</h2>
            <p className="text-[11px] text-slate-400">Environment Maps & Atmosphere</p>
          </div>
        </div>
        <button
          onClick={() => setActivePanel(null)}
          className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* HDRI Presets */}
      <div className="mb-5">
        <label className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
          HDRI Environment Presets
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ENVIRONMENT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setEnvPreset(preset.id)}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                envPreset === preset.id
                  ? 'border-blue-500/60 bg-blue-500/10 text-blue-400 shadow-sm'
                  : 'border-white/5 bg-slate-900/40 text-slate-300 hover:border-white/20'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lighting Parameters */}
      <div className="space-y-4 pt-2 border-t border-white/10">
        {/* Environment Map Intensity */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300 font-medium">Lighting Intensity</span>
            <span className="text-[11px] font-mono text-slate-400">
              {Math.round(envIntensity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={envIntensity}
            onChange={(e) => setEnvIntensity(parseFloat(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Contact Shadow Softness */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-300 font-medium">Contact Shadow Opacity</span>
            <span className="text-[11px] font-mono text-slate-400">
              {Math.round(shadowOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={shadowOpacity}
            onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Background Atmosphere */}
        <div className="pt-2">
          <label className="block text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
            Background Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'studio', label: 'Studio Dark' },
              { id: 'light', label: 'Clean Light' },
              { id: 'dark', label: 'Deep Space' },
              { id: 'gradient', label: 'Midnight Blue' }
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setBackgroundMode(theme.id)}
                className={`p-2 rounded-xl border text-xs font-medium transition-all ${
                  backgroundMode === theme.id
                    ? 'border-blue-500/60 bg-blue-500/10 text-blue-400'
                    : 'border-white/5 bg-slate-900/40 text-slate-400 hover:text-slate-200'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
