import React, { useState } from 'react';
import { 
  Gamepad2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Sparkles, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  X,
  ExternalLink,
  Check
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

// Google 4-Color Official Logo SVG
const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
    />
  </svg>
);

// GitHub Official Logo SVG
const GitHubIcon = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
    />
  </svg>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Social Auth Modal States
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('ahtikh22@gmail.com');
  const [googleNameInput, setGoogleNameInput] = useState('Ahtisham Gamer');
  const [githubUsernameInput, setGithubUsernameInput] = useState('ahtikh22');
  const [isConnecting, setIsConnecting] = useState(false);

  // Standard Email/Password Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    const username = email.includes('@') ? email.split('@')[0] : email;
    const user: UserProfile = {
      id: 'usr_' + Date.now(),
      username: username,
      email: email.includes('@') ? email : `${email}@gamevault.io`,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      gamerTag: gamerTag || `${username}_Gamer`,
      authProvider: 'email',
      publishedCount: 0,
      totalDownloadsCount: 0,
      joinedDate: new Date().toISOString()
    };

    localStorage.setItem('gamevault_user', JSON.stringify(user));
    onLoginSuccess(user);
  };

  // Google Login Flow
  const handleGoogleSignIn = (selectedEmail?: string, selectedName?: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      const emailToUse = selectedEmail || googleEmailInput || 'gamer@gmail.com';
      const nameToUse = selectedName || googleNameInput || emailToUse.split('@')[0];
      const username = emailToUse.split('@')[0];

      const user: UserProfile = {
        id: 'usr_g_' + Date.now(),
        username: username,
        email: emailToUse,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}&backgroundColor=b6e3f4`,
        gamerTag: `${nameToUse.replace(/\s+/g, '')}_Vault`,
        authProvider: 'google',
        publishedCount: 1,
        totalDownloadsCount: 5,
        joinedDate: new Date().toISOString()
      };

      localStorage.setItem('gamevault_user', JSON.stringify(user));
      setIsConnecting(false);
      setShowGoogleModal(false);
      onLoginSuccess(user);
    }, 600);
  };

  // GitHub Login Flow
  const handleGithubSignIn = (handleToUse?: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      const username = handleToUse || githubUsernameInput || 'github_gamer';
      const cleanUsername = username.trim().replace(/^@/, '');

      const user: UserProfile = {
        id: 'usr_gh_' + Date.now(),
        username: cleanUsername,
        email: `${cleanUsername}@users.noreply.github.com`,
        // Direct GitHub avatar or fallback
        avatarUrl: `https://github.com/${cleanUsername}.png`,
        gamerTag: `${cleanUsername}`,
        authProvider: 'github',
        publishedCount: 2,
        totalDownloadsCount: 18,
        joinedDate: new Date().toISOString()
      };

      localStorage.setItem('gamevault_user', JSON.stringify(user));
      setIsConnecting(false);
      setShowGithubModal(false);
      onLoginSuccess(user);
    }, 600);
  };

  // 1-Click Fast Demo accounts
  const handleQuickDemo = (type: 'creator' | 'guest') => {
    const demoUser: UserProfile = type === 'creator' ? {
      id: 'usr_creator_demo',
      username: 'GameCreator_Pro',
      email: 'creator@gamevault.io',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=GameCreator',
      gamerTag: 'AlphaDev_X',
      authProvider: 'email',
      publishedCount: 3,
      totalDownloadsCount: 1420,
      joinedDate: '2026-01-15'
    } : {
      id: 'usr_guest_demo',
      username: 'Guest_Gamer',
      email: 'guest@gamevault.io',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=GuestGamer',
      gamerTag: 'PlayerOne',
      authProvider: 'email',
      publishedCount: 0,
      totalDownloadsCount: 42,
      joinedDate: '2026-03-20'
    };

    localStorage.setItem('gamevault_user', JSON.stringify(demoUser));
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center relative overflow-hidden px-4 py-8">
      {/* Background ambient neon glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 mb-3 backdrop-blur-md">
            <Gamepad2 className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            GameVault
          </h1>
          <p className="text-sm text-slate-400 mt-1 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Game Publisher & Direct Download Portal
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
          
          {/* Social Sign-In Buttons (Google & GitHub) */}
          <div className="space-y-2.5 mb-5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
              Fast Social Sign In
            </p>
            
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={() => setShowGoogleModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs sm:text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer border border-slate-200 hover:shadow-lg"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            {/* GitHub Sign In Button */}
            <button
              type="button"
              onClick={() => setShowGithubModal(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-black text-white font-semibold text-xs sm:text-sm border border-slate-700/80 hover:border-slate-500 shadow-md transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
            >
              <GitHubIcon />
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex py-2 items-center mb-4">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider">
              Or Continue with Email
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-slate-950/80 p-1 mb-5 border border-slate-800">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                !isRegister 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isRegister 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gamer Tag / Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    placeholder="e.g. CyberNinja99"
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com or username"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                {!isRegister && (
                  <button 
                    type="button" 
                    onClick={() => setPassword('vault123')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Auto-fill demo password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer text-xs sm:text-sm"
            >
              <span>{isRegister ? 'Create Account & Enter' : 'Sign In to GameVault'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick 1-Click Access Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Or Instant 1-Click Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('creator')}
                className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Creator Access</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('guest')}
                className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 hover:text-indigo-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Guest Gamer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-5 space-y-1">
          <p className="text-xs text-slate-500">
            GameVault • Publish any game URL, share with anyone & download instantly
          </p>
          <p className="text-[11px] text-cyan-400 font-medium">
            Developed by <span className="text-white font-bold">Ahtisham</span>
          </p>
        </div>
      </div>

      {/* ================= GOOGLE AUTH MODAL ================= */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200">
            <button
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Brand Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <GoogleIcon />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Sign in with Google</h3>
                <p className="text-[11px] text-slate-400">Choose an account for GameVault</p>
              </div>
            </div>

            {/* Quick 1-Click Detected Google Account */}
            <div className="space-y-2 mb-4">
              <button
                type="button"
                disabled={isConnecting}
                onClick={() => handleGoogleSignIn('ahtikh22@gmail.com', 'Ahtisham Gamer')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-700 flex items-center justify-between text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    A
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300">Ahtisham Gamer</p>
                    <p className="text-[11px] text-slate-400 truncate">ahtikh22@gmail.com</p>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                disabled={isConnecting}
                onClick={() => handleGoogleSignIn('developer.vault@gmail.com', 'Vault Developer')}
                className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-700 flex items-center justify-between text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                    V
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-white group-hover:text-indigo-300">Vault Developer</p>
                    <p className="text-[11px] text-slate-400 truncate">developer.vault@gmail.com</p>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Custom Google Account Form */}
            <div className="pt-3 border-t border-slate-800">
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Or enter any Google account:
              </label>
              <div className="space-y-2">
                <input
                  type="email"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  placeholder="your-name@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  disabled={isConnecting}
                  onClick={() => handleGoogleSignIn()}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <GoogleIcon />
                  <span>{isConnecting ? 'Signing in...' : 'Sign in with this Google ID'}</span>
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center mt-4">
              Google will securely share your email, name, and profile picture with GameVault.
            </p>
          </div>
        </div>
      )}

      {/* ================= GITHUB AUTH MODAL ================= */}
      {showGithubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200">
            <button
              onClick={() => setShowGithubModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* GitHub Brand Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-white flex items-center justify-center">
                <GitHubIcon />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Sign in with GitHub</h3>
                <p className="text-[11px] text-slate-400">Authorize GameVault Developer Portal</p>
              </div>
            </div>

            {/* GitHub Profile Live Preview */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 mb-4 flex items-center gap-3">
              <img
                src={`https://github.com/${githubUsernameInput.trim() || 'github'}.png`}
                alt="GitHub Avatar"
                className="w-10 h-10 rounded-full border border-slate-700 object-cover bg-slate-800"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=github';
                }}
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  @{githubUsernameInput.trim() || 'github_user'}
                </p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> GitHub Developer Profile
                </p>
              </div>
            </div>

            {/* GitHub Username Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  GitHub Username / Handle:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">@</span>
                  <input
                    type="text"
                    value={githubUsernameInput}
                    onChange={(e) => setGithubUsernameInput(e.target.value.replace(/^@/, ''))}
                    placeholder="e.g. ahtikh22 or your GitHub username"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Authorize Button */}
              <button
                type="button"
                disabled={isConnecting}
                onClick={() => handleGithubSignIn()}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-black border border-slate-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:border-slate-500"
              >
                <GitHubIcon />
                <span>{isConnecting ? 'Connecting GitHub...' : 'Authorize & Sign In with GitHub'}</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 text-center mt-4">
              Allows GameVault to identify your GitHub developer identity and public repositories.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
