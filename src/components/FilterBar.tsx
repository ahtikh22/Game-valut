import React from 'react';
import { Filter, SlidersHorizontal, Gamepad, Sparkles } from 'lucide-react';
import { GameGenre, GamePlatform } from '../types';

interface FilterBarProps {
  selectedPlatform: string;
  onPlatformChange: (p: string) => void;
  selectedGenre: string;
  onGenreChange: (g: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  totalGames: number;
}

const PLATFORMS = ['All', 'PC Windows', 'Android APK', 'Web Browser', 'Cross-Platform'];
const GENRES = ['All', 'Action', 'RPG', 'Racing', 'Puzzle', 'Shooter', 'Strategy', 'Casual', 'Horror'];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedPlatform,
  onPlatformChange,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  totalGames
}) => {
  return (
    <div className="mb-6 space-y-3">
      {/* Platform Chips */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            Platform:
          </span>
          {PLATFORMS.map((platform) => (
            <button
              key={platform}
              type="button"
              onClick={() => onPlatformChange(platform)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedPlatform === platform
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Downloaded</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            ({totalGames} games available)
          </span>
        </div>
      </div>

      {/* Genre Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
        <span className="text-slate-500 mr-1">Genre:</span>
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            onClick={() => onGenreChange(genre)}
            className={`px-2.5 py-0.5 rounded-lg text-[11px] transition-colors whitespace-nowrap cursor-pointer ${
              selectedGenre === genre
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );
};
