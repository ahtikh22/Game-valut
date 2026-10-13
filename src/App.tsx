/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Game, UserProfile, DownloadHistoryItem, GameReview } from './types';
import { INITIAL_GAMES } from './data/initialGames';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { QuickPublishHero } from './components/QuickPublishHero';
import { FilterBar } from './components/FilterBar';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { PublishGameModal } from './components/PublishGameModal';
import { PlayGameModal } from './components/PlayGameModal';
import { QRCodeModal } from './components/QRCodeModal';
import { DownloadsHistoryView } from './components/DownloadsHistoryView';
import { AdminPanel } from './components/AdminPanel';
import { 
  Gamepad2, 
  Sparkles, 
  Upload, 
  Download, 
  ShieldCheck, 
  Layers, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem('gamevault_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Games State with LocalStorage persistence
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const savedGames = localStorage.getItem('gamevault_games');
      if (savedGames) {
        return JSON.parse(savedGames);
      }
      return INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  });

  // Download History State
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('gamevault_downloads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Navigation & Filters
  const [activeTab, setActiveTab] = useState<'all' | 'my-games' | 'downloads' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals & Inspection
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [playingGame, setPlayingGame] = useState<Game | null>(null);
  const [qrGame, setQrGame] = useState<Game | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Sync games to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gamevault_games', JSON.stringify(games));
    } catch (e) {
      console.error('Failed to save games:', e);
    }
  }, [games]);

  // Sync download history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gamevault_downloads', JSON.stringify(downloadHistory));
    } catch (e) {
      console.error('Failed to save downloads history:', e);
    }
  }, [downloadHistory]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLoginSuccess = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    if (loggedInUser.isAdmin) {
      showToast(`👑 Welcome Administrator Ahtisham01! Master control panel unlocked.`);
    } else {
      showToast(`Welcome ${loggedInUser.gamerTag}! Your GameVault session is ready.`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gamevault_user');
    setUser(null);
    showToast('You have been signed out.', 'info');
  };

  const handleToggleVerifyGame = (gameId: string) => {
    setGames((prev) => prev.map(g => {
      if (g.id === gameId) {
        const nextStatus = g.verifiedSafe === false ? true : false;
        showToast(`"${g.title}" marked as ${nextStatus ? 'Verified Safe' : 'Unverified'}.`);
        return { ...g, verifiedSafe: nextStatus };
      }
      return g;
    }));
  };

  const handlePublishGame = (newGame: Game) => {
    setGames((prev) => [newGame, ...prev]);
    if (user) {
      const updatedUser = {
        ...user,
        publishedCount: (user.publishedCount || 0) + 1
      };
      setUser(updatedUser);
      localStorage.setItem('gamevault_user', JSON.stringify(updatedUser));
    }
    showToast(`🎉 "${newGame.title}" published successfully! Direct download button is ready.`);
  };

  const handleDeleteGame = (gameId: string) => {
    setGames((prev) => prev.filter(g => g.id !== gameId));
    showToast('Game removed from vault.', 'info');
    if (selectedGame?.id === gameId) setSelectedGame(null);
    if (playingGame?.id === gameId) setPlayingGame(null);
    if (qrGame?.id === gameId) setQrGame(null);
  };

  const handleDownloadGame = (game: Game) => {
    // Increment download count
    setGames((prev) => prev.map(g => {
      if (g.id === game.id) {
        return { ...g, downloadsCount: g.downloadsCount + 1 };
      }
      return g;
    }));

    // Record in history
    const historyItem: DownloadHistoryItem = {
      id: 'dl_' + Date.now(),
      gameId: game.id,
      gameTitle: game.title,
      downloadUrl: game.downloadUrl,
      platform: game.platform,
      downloadedAt: new Date().toISOString()
    };

    setDownloadHistory((prev) => [historyItem, ...prev]);
    showToast(`⬇️ Download started for "${game.title}"!`);
  };

  const handleClearHistory = () => {
    setDownloadHistory([]);
    showToast('Downloads history cleared.', 'info');
  };

  const handleAddReview = (gameId: string, rating: number, comment: string) => {
    const newRev: GameReview = {
      id: 'rev_' + Date.now(),
      author: user?.gamerTag || user?.username || 'Gamer',
      avatarUrl: user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=gamer',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setGames((prev) => prev.map(g => {
      if (g.id === gameId) {
        const existingReviews = g.reviews || [];
        const updatedReviews = [newRev, ...existingReviews];
        const avg = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        const updatedGame = {
          ...g,
          rating: Number(avg.toFixed(1)),
          reviews: updatedReviews
        };
        if (selectedGame?.id === gameId) {
          setSelectedGame(updatedGame);
        }
        return updatedGame;
      }
      return g;
    }));

    showToast('Review added! Thank you for rating.');
  };

  // Export Vault Backup
  const handleExportVault = () => {
    const data = {
      games,
      downloadHistory,
      exportedAt: new Date().toISOString(),
      user: user?.gamerTag
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GameVault_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Vault backup file downloaded.');
  };

  // Import Vault Backup
  const handleImportVault = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.games)) {
          setGames(parsed.games);
          if (Array.isArray(parsed.downloadHistory)) {
            setDownloadHistory(parsed.downloadHistory);
          }
          showToast(`Successfully imported ${parsed.games.length} games into your vault!`);
        } else {
          showToast('Invalid backup file format.', 'info');
        }
      } catch (err) {
        showToast('Failed to parse backup file.', 'info');
      }
    };
    reader.readAsText(file);
  };

  // Filter and sort games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Tab filter
        if (activeTab === 'my-games') {
          if (!game.isUserCreated && game.author !== user?.username && game.author !== user?.gamerTag) {
            return false;
          }
        }

        // Platform filter
        if (selectedPlatform !== 'All' && game.platform !== selectedPlatform) {
          return false;
        }

        // Genre filter
        if (selectedGenre !== 'All' && game.genre !== selectedGenre) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = game.title.toLowerCase().includes(q);
          const matchesDesc = game.description.toLowerCase().includes(q);
          const matchesAuthor = game.author.toLowerCase().includes(q);
          const matchesTag = game.tags?.some(t => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesTag) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.downloadsCount - a.downloadsCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [games, activeTab, selectedPlatform, selectedGenre, searchQuery, sortBy, user]);

  const userGamesCount = useMemo(() => {
    return games.filter(g => g.isUserCreated || g.author === user?.username || g.author === user?.gamerTag).length;
  }, [games, user]);

  // If user is NOT logged in, show the HTML Login Page first
  if (!user) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-white text-xs sm:text-sm shadow-2xl shadow-cyan-500/20 animate-fade-in">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenPublish={() => setIsPublishModalOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userGamesCount={userGamesCount}
        downloadsCount={downloadHistory.length}
        onExportVault={handleExportVault}
        onImportVault={handleImportVault}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        
        {/* Quick Publish Hero Box on 'all' or 'my-games' tabs */}
        {(activeTab === 'all' || activeTab === 'my-games') && (
          <QuickPublishHero
            onQuickPublish={handlePublishGame}
            onOpenFullModal={() => setIsPublishModalOpen(true)}
            currentUsername={user.gamerTag || user.username}
          />
        )}

        {/* Admin Panel Tab */}
        {activeTab === 'admin' && user.isAdmin ? (
          <AdminPanel
            games={games}
            onDeleteGame={handleDeleteGame}
            onToggleVerify={handleToggleVerifyGame}
            onClearAllDownloads={handleClearHistory}
            onExportBackup={handleExportVault}
          />
        ) : activeTab === 'downloads' ? (
          <DownloadsHistoryView
            history={downloadHistory}
            onClearHistory={handleClearHistory}
            onReDownload={(item) => {
              const matchedGame = games.find(g => g.id === item.gameId) || {
                id: item.gameId,
                title: item.gameTitle,
                description: '',
                downloadUrl: item.downloadUrl,
                thumbnailUrl: '',
                genre: 'Action',
                platform: item.platform,
                version: 'v1.0.0',
                author: 'Developer',
                createdAt: item.downloadedAt,
                downloadsCount: 1,
                rating: 5.0,
                tags: []
              };
              handleDownloadGame(matchedGame);
            }}
          />
        ) : (
          <>
            {/* Filter and sorting controls */}
            <FilterBar
              selectedPlatform={selectedPlatform}
              onPlatformChange={setSelectedPlatform}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalGames={filteredGames.length}
            />

            {/* Games Grid */}
            {filteredGames.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-8 space-y-4">
                <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-base font-bold text-slate-200">
                  {activeTab === 'my-games' 
                    ? 'No games published yet' 
                    : 'No games match your criteria'}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeTab === 'my-games'
                    ? 'Paste your game download link above to publish it and enable instant downloads.'
                    : 'Try clearing your search query or platform filter, or publish a new game!'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Publish New Game Now</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onDownload={handleDownloadGame}
                    onDelete={handleDeleteGame}
                    onSelectGame={setSelectedGame}
                    onPlayGame={setPlayingGame}
                    onOpenQR={setQrGame}
                    isOwner={game.isUserCreated || game.author === user.username || game.author === user.gamerTag}
                    isAdmin={user.isAdmin}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Game Details Modal */}
      <GameDetailModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onDownload={handleDownloadGame}
        onPlayGame={(g) => {
          setSelectedGame(null);
          setPlayingGame(g);
        }}
        onOpenQR={(g) => {
          setSelectedGame(null);
          setQrGame(g);
        }}
        onAddReview={handleAddReview}
        currentUserGamerTag={user.gamerTag}
      />

      {/* In-Vault Web Game Player */}
      <PlayGameModal
        game={playingGame}
        onClose={() => setPlayingGame(null)}
      />

      {/* Mobile QR Code Scanner Modal */}
      <QRCodeModal
        game={qrGame}
        onClose={() => setQrGame(null)}
      />

      {/* Publish Game Full Modal */}
      <PublishGameModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onPublish={handlePublishGame}
        currentUsername={user.gamerTag || user.username}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Brand info */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-500/10">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">GameVault</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-semibold">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Next-Gen Game Publisher & Direct Download Portal
              </p>
            </div>
          </div>

          {/* Center: Beautiful Developer Signature Badge */}
          <div className="flex flex-col items-center justify-center px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/40 shadow-xl shadow-cyan-500/10 group hover:border-cyan-400 transition-all duration-300">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                Developed with ❤️ by{' '}
                <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300 text-sm sm:text-base tracking-wide drop-shadow-sm">
                  Ahtisham
                </span>
              </span>
            </div>
            <span className="text-[10px] text-cyan-400/90 uppercase tracking-widest font-bold mt-0.5">
              Lead Platform Architect & Creator
            </span>
          </div>

          {/* Right: Guarantee & Info */}
          <div className="text-center md:text-right">
            <p className="text-xs text-slate-300 font-medium flex items-center justify-center md:justify-end gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Fast • Direct • Verified Safe</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Paste your links anytime & download directly with 1 click.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
