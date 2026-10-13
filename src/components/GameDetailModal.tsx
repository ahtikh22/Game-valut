import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Play, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  HardDrive, 
  Calendar, 
  User, 
  Tag, 
  Star,
  FileCode,
  Sparkles,
  Share2,
  QrCode,
  MessageSquarePlus,
  MessageCircle,
  Send
} from 'lucide-react';
import { Game } from '../types';
import { triggerDownload, generateOfflineGameLauncher } from '../utils/downloadHelper';

interface GameDetailModalProps {
  game: Game | null;
  onClose: () => void;
  onDownload: (game: Game) => void;
  onPlayGame?: (game: Game) => void;
  onOpenQR?: (game: Game) => void;
  onAddReview?: (gameId: string, rating: number, comment: string) => void;
  currentUserGamerTag?: string;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  onClose,
  onDownload,
  onPlayGame,
  onOpenQR,
  onAddReview,
  currentUserGamerTag
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!game) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(game.downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    triggerDownload(game, () => {
      onDownload(game);
    });
    setTimeout(() => setDownloading(false), 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    if (onAddReview) {
      onAddReview(game.id, reviewRating, reviewComment.trim());
      setReviewComment('');
      setShowReviewForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-white/80 hover:text-white bg-black/60 hover:bg-black/90 rounded-full backdrop-blur-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[2.2/1] w-full bg-slate-950 overflow-hidden shrink-0">
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  {game.genre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                  {game.platform}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-slate-800/90 text-slate-300 backdrop-blur-md">
                  {game.version}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                {game.title}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-amber-400/20 border border-amber-400/30 backdrop-blur-md px-3 py-1 rounded-xl text-amber-300 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{game.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">

          {/* Primary Action Panel */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-500/30 shadow-lg space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verified Safe & Clean Package
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {game.fileSize || 'Standard Size'} • {game.downloadsCount.toLocaleString()} Total Downloads
                </p>
              </div>

              {/* Big Download Button */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <Download className={`w-5 h-5 ${downloading ? 'animate-bounce' : ''}`} />
                <span>{downloading ? 'Starting Download...' : 'Download Game File'}</span>
              </button>
            </div>

            {/* Direct Link Box */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Direct File Link:</span>
                <span className="text-[11px] text-cyan-400">Copy or open directly</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 rounded-xl p-2 font-mono text-xs text-slate-300">
                <span className="truncate flex-1 select-all">{game.downloadUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-sans text-cyan-300 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a
                  href={game.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
                  title="Open Link Directly"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(game.playUrl || game.platform === 'Web Browser') && (
              <button
                type="button"
                onClick={() => {
                  if (onPlayGame) onPlayGame(game);
                }}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-emerald-400" />
                <span>Play in Vault</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (onOpenQR) onOpenQR(game);
              }}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-cyan-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Mobile QR</span>
            </button>

            <button
              type="button"
              onClick={() => generateOfflineGameLauncher(game)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-indigo-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileCode className="w-4 h-4" />
              <span>HTML Launcher</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: game.title,
                    text: `Download ${game.title} on GameVault!`,
                    url: game.downloadUrl
                  }).catch(() => {});
                } else {
                  handleCopyLink();
                }
              }}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Share Link</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">Description</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {game.description}
            </p>
          </div>

          {/* Instructions */}
          {game.instructions && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">
                Installation & How to Play
              </h4>
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-1">
                <p>{game.instructions}</p>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-500 block">Publisher</span>
              <span className="text-xs font-semibold text-slate-200 truncate block mt-0.5">{game.author}</span>
            </div>
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-500 block">Platform</span>
              <span className="text-xs font-semibold text-cyan-300 block mt-0.5">{game.platform}</span>
            </div>
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-500 block">File Size</span>
              <span className="text-xs font-semibold text-slate-200 block mt-0.5">{game.fileSize || 'N/A'}</span>
            </div>
            <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[11px] text-slate-500 block">Published On</span>
              <span className="text-xs font-semibold text-slate-200 block mt-0.5">
                {new Date(game.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* User Reviews & Ratings Section */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white">
                  Player Reviews ({game.reviews?.length || 0})
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{showReviewForm ? 'Cancel Review' : 'Write Review'}</span>
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="mb-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Your Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="cursor-pointer p-0.5 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts about gameplay, bugs, or performance..."
                  rows={2}
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {game.reviews && game.reviews.length > 0 ? (
              <div className="space-y-2.5">
                {game.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <img src={rev.avatarUrl} alt={rev.author} className="w-5 h-5 rounded-full bg-slate-800" />
                        <span className="font-bold text-slate-200">{rev.author}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-semibold">{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic bg-slate-950/30 p-3 rounded-xl text-center">
                No reviews yet. Be the first player to review this game!
              </p>
            )}
          </div>

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {game.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 text-[11px] text-slate-300 border border-slate-700/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
