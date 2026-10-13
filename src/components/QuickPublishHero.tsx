import React, { useState } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Download, 
  Gamepad2, 
  ArrowRight, 
  Check, 
  Zap, 
  Layers,
  ClipboardPaste
} from 'lucide-react';
import { Game, GamePlatform, GameGenre } from '../types';
import { PRESET_THUMBNAILS } from '../data/initialGames';
import confetti from 'canvas-confetti';

interface QuickPublishHeroProps {
  onQuickPublish: (game: Game) => void;
  onOpenFullModal: () => void;
  currentUsername: string;
}

export const QuickPublishHero: React.FC<QuickPublishHeroProps> = ({
  onQuickPublish,
  onOpenFullModal,
  currentUsername
}) => {
  const [quickTitle, setQuickTitle] = useState('');
  const [quickLink, setQuickLink] = useState('');
  const [quickPlatform, setQuickPlatform] = useState<GamePlatform>('PC Windows');
  const [quickGenre, setQuickGenre] = useState<GameGenre>('Action');
  const [quickError, setQuickError] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuickLink(text);
        if (text.endsWith('.apk')) setQuickPlatform('Android APK');
        else if (text.endsWith('.zip') || text.endsWith('.exe')) setQuickPlatform('PC Windows');
        else if (text.includes('html') || text.includes('github.io')) setQuickPlatform('Web Browser');
      }
    } catch {
      // ignore
    }
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLink.trim()) {
      setQuickError('Please enter or paste a valid game download link!');
      return;
    }

    const title = quickTitle.trim() || 'My Generated Game ' + (Math.floor(Math.random() * 900) + 100);
    const formattedUrl = quickLink.trim().startsWith('http') 
      ? quickLink.trim() 
      : `https://${quickLink.trim()}`;

    // Pick random preset thumbnail
    const thumb = PRESET_THUMBNAILS[Math.floor(Math.random() * PRESET_THUMBNAILS.length)];

    const newGame: Game = {
      id: 'game_' + Date.now(),
      title,
      description: `New game published by ${currentUsername}. Ready for direct download and play.`,
      downloadUrl: formattedUrl,
      playUrl: quickPlatform === 'Web Browser' ? formattedUrl : undefined,
      thumbnailUrl: thumb,
      genre: quickGenre,
      platform: quickPlatform,
      version: 'v1.0.0',
      fileSize: quickPlatform === 'Android APK' ? '45 MB' : '75 MB',
      author: currentUsername || 'GameDeveloper',
      createdAt: new Date().toISOString(),
      downloadsCount: 1, // initial download
      rating: 5.0,
      tags: ['New', quickGenre, quickPlatform],
      instructions: 'Click the Download button to receive your game files.',
      isUserCreated: true,
    };

    onQuickPublish(newGame);
    setQuickTitle('');
    setQuickLink('');
    setQuickError('');

    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-8 lg:p-10 mb-8 shadow-2xl">
      {/* Neon ambient accents */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Game Publishing & Direct Download Terminal</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Publish Your Game & Get <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Direct Download</span> Link
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Paste your generated game link below. GameVault instantly publishes it and creates a high-speed direct download button!
        </p>

        {/* Quick Paste & Publish Form Box */}
        <div className="pt-4 max-w-3xl mx-auto">
          <form 
            onSubmit={handlePublishSubmit}
            className="p-3 sm:p-4 rounded-2xl bg-slate-950/90 border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl space-y-3"
          >
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                Quick Publish Box (Instant Link Publish & Download)
              </span>
              <button
                type="button"
                onClick={handlePaste}
                className="text-[11px] text-cyan-400 hover:text-cyan-200 flex items-center gap-1 cursor-pointer bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
              >
                <ClipboardPaste className="w-3 h-3" />
                <span>Paste Link from Clipboard</span>
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2.5">
              {/* Game Title */}
              <div className="sm:col-span-4">
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="Game Name (e.g. My AI Game)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Game Download Link */}
              <div className="sm:col-span-5">
                <input
                  type="text"
                  value={quickLink}
                  onChange={(e) => {
                    setQuickLink(e.target.value);
                    if (quickError) setQuickError('');
                  }}
                  placeholder="Paste Game Download Link (URL) *"
                  className={`w-full bg-slate-900 border ${quickError ? 'border-red-500' : 'border-slate-800'} rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono`}
                />
              </div>

              {/* Platform Selector */}
              <div className="sm:col-span-3">
                <select
                  value={quickPlatform}
                  onChange={(e) => setQuickPlatform(e.target.value as GamePlatform)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="PC Windows">PC Windows</option>
                  <option value="Android APK">Android APK</option>
                  <option value="Web Browser">Web Browser</option>
                  <option value="Cross-Platform">Cross-Platform</option>
                </select>
              </div>
            </div>

            {/* Link Detection & Status Bar */}
            {quickLink.trim() && (
              <div className="flex items-center justify-between text-[11px] px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-cyan-300 flex items-center gap-1.5 truncate">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    Detected: <strong className="text-white">
                      {quickLink.endsWith('.apk') ? 'Android APK Package' :
                       quickLink.endsWith('.zip') ? 'ZIP Archive' :
                       quickLink.endsWith('.exe') ? 'Windows Executable' :
                       quickLink.includes('drive.google.com') ? 'Google Drive Link' :
                       quickLink.includes('github.com') ? 'GitHub Release / Repo' :
                       quickLink.includes('itch.io') ? 'Itch.io Game Host' : 'Direct Web / Download Link'}
                    </strong>
                  </span>
                </span>
                <a
                  href={quickLink.startsWith('http') ? quickLink : `https://${quickLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 shrink-0 ml-2"
                >
                  <span>Test URL</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            )}

            {quickError && (
              <p className="text-xs text-red-400 text-left px-1">{quickError}</p>
            )}

            {/* Publish & Download Button CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3.5 h-3.5" /> Instant Live
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <Download className="w-3.5 h-3.5" /> Direct Download Ready
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" /> Free & Unlimited
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onOpenFullModal}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
                >
                  More Options (Cover Art, Description)
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish & Download</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
