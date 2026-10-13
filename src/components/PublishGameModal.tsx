import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Link as LinkIcon, 
  Gamepad2, 
  Layers, 
  FileCode, 
  Sparkles, 
  Check, 
  Image as ImageIcon, 
  Info,
  Download,
  ClipboardCheck
} from 'lucide-react';
import { Game, GameGenre, GamePlatform } from '../types';
import { PRESET_THUMBNAILS } from '../data/initialGames';
import confetti from 'canvas-confetti';

interface PublishGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (newGame: Game) => void;
  currentUsername: string;
}

const GENRES: GameGenre[] = [
  'Action', 'Adventure', 'Arcade', 'Puzzle', 'Racing', 
  'RPG', 'Shooter', 'Strategy', 'Casual', 'Horror', 'Simulation'
];

const PLATFORMS: GamePlatform[] = [
  'PC Windows', 'Android APK', 'Web Browser', 'Cross-Platform', 'Mac', 'Linux'
];

export const PublishGameModal: React.FC<PublishGameModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  currentUsername
}) => {
  const [title, setTitle] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [playUrl, setPlayUrl] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState<GameGenre>('Action');
  const [platform, setPlatform] = useState<GamePlatform>('PC Windows');
  const [version, setVersion] = useState('v1.0.0');
  const [fileSize, setFileSize] = useState('50 MB');
  const [thumbnailUrl, setThumbnailUrl] = useState(PRESET_THUMBNAILS[0]);
  const [instructions, setInstructions] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Indie', 'New']);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setDownloadUrl(text);
        // Auto guess platform
        if (text.endsWith('.apk')) {
          setPlatform('Android APK');
        } else if (text.endsWith('.zip') || text.endsWith('.exe')) {
          setPlatform('PC Windows');
        } else if (text.includes('itch.io') || text.includes('github.io') || text.includes('vercel.app')) {
          setPlatform('Web Browser');
        }
      }
    } catch {
      // clipboard access denied, ignore
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Game title is required.';
    }
    if (!downloadUrl.trim()) {
      newErrors.downloadUrl = 'Game download link is required.';
    } else {
      try {
        // Validate URL format
        new URL(downloadUrl.trim());
      } catch {
        // If it doesn't have http/https, we can prepend or warn
        if (!downloadUrl.startsWith('http://') && !downloadUrl.startsWith('https://')) {
          newErrors.downloadUrl = 'Please enter a valid URL starting with https://';
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formattedDownloadUrl = downloadUrl.trim().startsWith('http') 
      ? downloadUrl.trim() 
      : `https://${downloadUrl.trim()}`;

    const newGame: Game = {
      id: 'game_' + Date.now(),
      title: title.trim(),
      description: description.trim() || 'A newly generated exciting game published on GameVault.',
      downloadUrl: formattedDownloadUrl,
      playUrl: playUrl.trim() || (platform === 'Web Browser' ? formattedDownloadUrl : undefined),
      thumbnailUrl: thumbnailUrl.trim() || PRESET_THUMBNAILS[0],
      genre,
      platform,
      version: version.trim() || 'v1.0.0',
      fileSize: fileSize.trim() || '45 MB',
      author: currentUsername || 'GameDeveloper',
      createdAt: new Date().toISOString(),
      downloadsCount: 0,
      rating: 5.0,
      tags: tags.length > 0 ? tags : [genre, platform],
      instructions: instructions.trim() || 'Click Download button to save and run game.',
      isUserCreated: true,
    };

    onPublish(newGame);

    // Fire fireworks celebration
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Publish New Game
              </h2>
              <p className="text-xs text-slate-400">
                Paste your game download link and generate an instant direct download card
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {/* Main Link Input (CRITICAL REQUIREMENT) */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border-2 border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-cyan-400" />
                Game Download Link / URL *
              </label>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-xs px-2.5 py-1 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 flex items-center gap-1.5 transition-colors border border-cyan-700/50"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                Paste Clipboard Link
              </button>
            </div>

            <input
              type="text"
              value={downloadUrl}
              onChange={(e) => {
                setDownloadUrl(e.target.value);
                if (errors.downloadUrl) setErrors({ ...errors, downloadUrl: '' });
              }}
              placeholder="https://example.com/game.zip, APK file, Google Drive, or GitHub release link..."
              className={`w-full bg-slate-950 border ${errors.downloadUrl ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono`}
            />
            {errors.downloadUrl && (
              <p className="text-xs text-red-400">{errors.downloadUrl}</p>
            )}
            <p className="text-[11px] text-slate-400">
              💡 Tip: Paste direct file links (.zip, .apk, .exe) or links from Google Drive, GitHub Releases, Itch.io, or any host.
            </p>
          </div>

          {/* Game Title & Platform */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Game Title / Name *
              </label>
              <div className="relative">
                <Gamepad2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: '' });
                  }}
                  placeholder="e.g. Shadow Runner, Mega Quest..."
                  className={`w-full bg-slate-950 border ${errors.title ? 'border-red-500' : 'border-slate-800'} rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500`}
                />
              </div>
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Platform / Type
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as GamePlatform)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {PLATFORMS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Genre, Version, File Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category / Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as GameGenre)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {GENRES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Version
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="v1.0.0"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Estimated File Size
              </label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                placeholder="e.g. 85 MB, 1.2 GB"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Optional Web Playable Link */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              Online Playable URL (Optional)
            </label>
            <input
              type="text"
              value={playUrl}
              onChange={(e) => setPlayUrl(e.target.value)}
              placeholder="e.g. Web playable URL to test directly in browser"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Thumbnail Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                Select Cover Image or Paste Custom Image URL
              </span>
              <span className="text-[11px] text-slate-400">Click a preset below</span>
            </label>

            {/* Thumbnail Presets Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
              {PRESET_THUMBNAILS.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setThumbnailUrl(img)}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    thumbnailUrl === img 
                      ? 'border-cyan-400 ring-2 ring-cyan-500/50 scale-105' 
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-600'
                  }`}
                >
                  <img src={img} alt="preset" className="w-full h-full object-cover" />
                  {thumbnailUrl === img && (
                    <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-cyan-300 drop-shadow" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="Or paste custom image link (https://...)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Description & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Game Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your game's story, gameplay features, and controls..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Installation & How to Run
              </label>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Extract ZIP and run .exe, or install APK on Android..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-cyan-300 flex items-center gap-1"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-slate-400 hover:text-red-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter (e.g. 2D, AI, Shooter)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-200"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Live Button Preview */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Direct download button that will appear on your card:</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20">
              <Download className="w-4 h-4 animate-bounce" />
              <span>Download {title || 'Game'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish to GameVault</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
