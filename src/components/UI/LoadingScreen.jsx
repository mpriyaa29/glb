import React from 'react';
import { useProgress } from '@react-three/drei';
import { Box, Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  const { active, progress, item } = useProgress();

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity duration-500">
      <div className="flex flex-col items-center max-w-sm px-8 py-10 rounded-3xl glass-panel text-center shadow-2xl border border-white/10">
        <div className="relative mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/20">
            <Box className="w-8 h-8 text-white animate-pulse" />
          </div>
          <Loader2 className="absolute -inset-2 w-16 h-16 text-blue-400 animate-spin opacity-40 stroke-1" />
        </div>

        <h3 className="text-base font-bold text-slate-100 mb-1">
          Loading 3D Experience
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-5 truncate max-w-[240px]">
          {item ? item.split('/').pop() : 'Preparing shaders & geometry...'}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden mb-3 border border-white/5">
          <div
            className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
          />
        </div>

        <span className="text-xs font-mono font-bold text-blue-400">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
