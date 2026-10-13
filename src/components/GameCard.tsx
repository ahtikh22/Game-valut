import React, { useState } from 'react';
import { 
  Download, 
  ExternalLink, 
  HardDrive, 
  Star, 
  Check, 
  Copy, 
  Play, 
  Trash2, 
  Share2, 
  FileCode,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { Game } from '../types';
import { triggerDownload, generateOfflineGameLauncher } from '../utils/downloadHelper';

interface GameCardProps {
  game: Game;
  onDownload: (game: Game) => void;
  onDelete?: (gameId: string) => void;
  onSelectGame: (game: Game) => void;
  onPlayGame?: (game: Game) => void;
  onOpenQR?: (game: Game) => void;
  isOwner?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onDownload,
  onDelete,
  onSelectGame,
  onPlayGame,
  onOpenQR,
  isOwner
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(game.downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    triggerDownload(game, () => {
      onDownload(game);
    });
    setTimeout(() => setDownloading(false), 1500);
  };

  const handleGenerateLauncher = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateOfflineGameLauncher(game);
  };

  // Platform badge colors
  const getPlatformBadge = (p: string) => {
    switch (p) {
      case 'Android APK':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60';
      case 'Web Browser':
        return 'bg-sky-950/80 text-sky-400 border-sky-800/60';
      case 'PC Windows':
        return 'bg-blue-950/80 text-blue-400 border-blue-800/60';
      default:
        return 'bg-purple-950/80 text-purple-400 border-purple-800/60';
    }
  };

  return (
    <div 
      onClick={() => onSelectGame(game)}
      className="group bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col cursor-pointer relative"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={game.thumbnailUrl}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // fallback image
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border backdrop-blur-md shadow-sm ${getPlatformBadge(game.platform)}`}>
            {game.platform}
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900/80 text-slate-300 border border-slate-800 backdrop-blur-md">
            {game.version}
          </span>
        </div>

        {/* Bottom thumbnail overlays */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-[11px] text-cyan-300 font-medium">
            {game.genre}
          </span>
          {game.fileSize && (
            <span className="flex items-center gap-1 text-[11px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-md">
              <HardDrive className="w-3 h-3 text-cyan-400" />
              {game.fileSize}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-1">
              {game.title}
            </h3>
            <div className="flex items-center gap-1 text-amber-400 text-xs shrink-0 font-semibold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {game.description}
          </p>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span className="truncate">By <strong className="text-slate-300">{game.author}</strong></span>
            <span className="flex items-center gap-1 text-cyan-400/90 font-medium">
              <Download className="w-3 h-3" />
              {game.downloadsCount.toLocaleString()} downloads
            </span>
          </div>
        </div>

        {/* Action Buttons Section - PURE FOCUS ON DOWNLOAD */}
        <div className="pt-2 space-y-2">
          {/* Main Download Button */}
          <button
            type="button"
            onClick={handleDownloadClick}
            disabled={downloading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer"
          >
            <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : 'group-hover/btn:translate-y-0.5 transition-transform'}`} />
            <span>{downloading ? 'Downloading...' : 'Download Game'}</span>
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-3 gap-1.5">
            {game.playUrl || game.platform === 'Web Browser' ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPlayGame) onPlayGame(game);
                  else onSelectGame(game);
                }}
                className="py-1.5 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                title="Play Game In Browser"
              >
                <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                <span>Play</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateLauncher}
                className="py-1.5 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                title="Download HTML Launcher"
              >
                <FileCode className="w-3 h-3 text-indigo-400" />
                <span>Launcher</span>
              </button>
            )}

            {/* QR Code button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenQR) onOpenQR(game);
              }}
              className="py-1.5 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Mobile QR Code"
            >
              <QrCode className="w-3 h-3 text-cyan-400" />
              <span>QR Code</span>
            </button>

            {/* Copy Link */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-1.5 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
              title="Copy Direct Link"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Delete action if user's own game */}
          {isOwner && onDelete && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete "${game.title}"?`)) {
                    onDelete(game.id);
                  }
                }}
                className="text-[11px] text-red-400/80 hover:text-red-300 flex items-center gap-1 px-2 py-0.5 rounded hover:bg-red-950/40 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete from Vault</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
