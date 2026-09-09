import React, { useState } from 'react';
import { X, FolderPlus, FileCheck, Copy, Check, Info, Box } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function InstructionsModal() {
  const { showInstructionsModal, setShowInstructionsModal } = useStudio();
  const [copied, setCopied] = useState(false);

  if (!showInstructionsModal) return null;

  const modelPath = 'public/models/product.glb';

  const copyPath = () => {
    navigator.clipboard.writeText(modelPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel p-6 shadow-2xl border border-white/10 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">3D Model File Placement</h2>
              <p className="text-xs text-slate-400">How to load your custom GLB product model</p>
            </div>
          </div>
          <button
            onClick={() => setShowInstructionsModal(false)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          <p>
            To present your own 3D model in this Studio Configurator, simply place your <code className="text-blue-400 font-mono">.glb</code> file at the following location inside your project folder:
          </p>

          {/* Copyable Path Box */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-blue-300 font-mono text-xs">
            <span className="truncate">{modelPath}</span>
            <button
              onClick={copyPath}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-white font-sans text-xs transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Path'}</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">Automatic Bounding Box Alignment</strong>
                The viewer will automatically calculate your model’s bounding box, center it at world origin <code className="font-mono text-slate-400">(0, 0, 0)</code>, and align its lowest point with the studio floor.
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <Box className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">Automatic Viewport Scaling</strong>
                Regardless of your model's raw scale (millimeters, inches, or meters), it will be scaled uniformly to occupy ~65% of the viewport.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => setShowInstructionsModal(false)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
