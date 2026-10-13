import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Crown, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  HardDrive, 
  Download, 
  Gamepad2, 
  BarChart3, 
  Layers, 
  Star,
  ExternalLink,
  RefreshCw,
  Search
} from 'lucide-react';
import { Game } from '../types';

interface AdminPanelProps {
  games: Game[];
  onDeleteGame: (gameId: string) => void;
  onToggleVerify: (gameId: string) => void;
  onClearAllDownloads: () => void;
  onExportBackup: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  games,
  onDeleteGame,
  onToggleVerify,
  onClearAllDownloads,
  onExportBackup,
}) => {
  const [adminSearch, setAdminSearch] = useState('');

  const totalDownloads = games.reduce((acc, g) => acc + (g.downloadsCount || 0), 0);
  const totalReviews = games.reduce((acc, g) => acc + (g.reviews?.length || 0), 0);
  const avgPlatformRating = games.length 
    ? (games.reduce((acc, g) => acc + g.rating, 0) / games.length).toFixed(1)
    : '5.0';

  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    g.author.toLowerCase().includes(adminSearch.toLowerCase()) ||
    g.platform.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/50 shadow-lg shadow-amber-500/10">
              <Crown className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Super Admin Terminal
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Master Access
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <strong className="text-amber-300">Ahtisham01</strong>. Full administrative control over all games and platform data.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onExportBackup}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
          >
            <HardDrive className="w-4 h-4" />
            <span>Export Full Database Backup</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Total Games</p>
            <p className="text-lg font-black text-white">{games.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Platform Downloads</p>
            <p className="text-lg font-black text-white">{totalDownloads.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Average Rating</p>
            <p className="text-lg font-black text-white">{avgPlatformRating} / 5.0</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Player Reviews</p>
            <p className="text-lg font-black text-white">{totalReviews}</p>
          </div>
        </div>
      </div>

      {/* Admin Game Moderation Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Master Game Moderation & Controls
            </h3>
            <p className="text-xs text-slate-400">
              Delete any published game, verify safety badges, or inspect download URLs.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              placeholder="Filter vault games..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-500">
                <th className="py-3 px-3">Game</th>
                <th className="py-3 px-3">Platform</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Downloads</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredGames.map((game) => (
                <tr key={game.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={game.thumbnailUrl}
                        alt={game.title}
                        className="w-9 h-9 rounded-lg object-cover bg-slate-950 border border-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=100&q=80';
                        }}
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{game.title}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[180px] font-mono">
                          {game.downloadUrl}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-semibold text-cyan-400">
                    {game.platform}
                  </td>

                  <td className="py-3 px-3 text-slate-300">
                    {game.author}
                  </td>

                  <td className="py-3 px-3 font-mono font-bold text-slate-200">
                    {game.downloadsCount.toLocaleString()}
                  </td>

                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => onToggleVerify(game.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 cursor-pointer transition-colors ${
                        game.verifiedSafe !== false
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                          : 'bg-red-950/60 text-red-400 border-red-800/60'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{game.verifiedSafe !== false ? 'Verified Safe' : 'Unverified'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={game.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Direct Download Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`ADMIN ACTION: Are you sure you want to permanently delete "${game.title}"?`)) {
                            onDeleteGame(game.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 hover:text-red-200 transition-colors cursor-pointer"
                        title="Delete Game as Admin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
