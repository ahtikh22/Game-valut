import React, { useState } from 'react';
import { X, Maximize2, Minimize2, RotateCcw, ExternalLink, Play, Gamepad2, AlertCircle } from 'lucide-react';
import { Game } from '../types';

interface PlayGameModalProps {
  game: Game | null;
  onClose: () => void;
}

export const PlayGameModal: React.FC<PlayGameModalProps> = ({ game, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);

  if (!game || (!game.playUrl && game.platform !== 'Web Browser')) return null;

  const playableUrl = game.playUrl || game.downloadUrl;

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
      <div 
        className={`relative w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
          isFullscreen ? 'fixed inset-2 z-50 max-w-none h-[calc(100vh-1rem)]' : 'max-w-5xl h-[85vh]'
        }`}
      >
        {/* Header bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <span>{game.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  In-Vault Player
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReload}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restart Game"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <a
              href={playableUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Iframe Canvas View */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
          <iframe
            key={iframeKey}
            src={playableUrl}
            title={game.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>

        {/* Bottom Helper Bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <AlertCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">Tip: Click inside the game screen to focus controls (Arrow keys / WASD / Mouse).</span>
          </div>
          <a
            href={playableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline shrink-0 ml-2"
          >
            Launch in new tab ↗
          </a>
        </div>
      </div>
    </div>
  );
};
