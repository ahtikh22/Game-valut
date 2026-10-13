import confetti from 'canvas-confetti';
import { Game } from '../types';

export function triggerDownload(game: Game, onTrackHistory?: (game: Game) => void) {
  // Fire celebratory gamer confetti
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899']
    });
  } catch (e) {
    console.error('Confetti error:', e);
  }

  const url = game.downloadUrl?.trim();
  if (!url) {
    alert('No download link provided for this game.');
    return;
  }

  // Record in download history
  if (onTrackHistory) {
    onTrackHistory(game);
  }

  // Handle direct download trigger
  // If the link is an external URL, trigger download via link element
  const link = document.createElement('a');
  link.href = url;
  
  // Clean filename from title
  const cleanTitle = game.title.replace(/[^a-zA-Z0-9_-]/g, '_');
  let ext = '.zip';
  if (game.platform === 'Android APK') ext = '.apk';
  else if (game.platform === 'Web Browser') ext = '.html';
  else if (game.platform === 'PC Windows') ext = '.zip';

  // If the URL already ends with an extension like .zip, .apk, .exe, let browser respect it
  const hasExt = /\.(zip|apk|exe|rar|tar\.gz|7z|html|dmg|deb|iso)$/i.test(url);
  if (!hasExt) {
    link.download = `${cleanTitle}_${game.version || 'v1.0'}${ext}`;
  } else {
    const filename = url.split('/').pop() || `${cleanTitle}${ext}`;
    link.download = filename;
  }

  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate downloadable bundle for user's generated games if they want a direct launcher file
export function generateOfflineGameLauncher(game: Game) {
  const launcherContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${game.title} - Game Launcher</title>
  <style>
    body {
      margin: 0;
      background: #090d16;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 20px;
    }
    .card {
      background: #111827;
      border: 1px solid #374151;
      padding: 30px;
      border-radius: 16px;
      max-width: 500px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    h1 { color: #38bdf8; margin-top: 0; }
    p { color: #9ca3af; line-height: 1.6; }
    .btn {
      display: inline-block;
      background: #0284c7;
      color: white;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      font-weight: bold;
      margin-top: 15px;
      transition: background 0.2s;
    }
    .btn:hover { background: #0369a1; }
    .badge {
      display: inline-block;
      background: #1f2937;
      color: #a78bfa;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 13px;
      margin-bottom: 12px;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">${game.platform} • ${game.version}</span>
    <h1>${game.title}</h1>
    <p>${game.description || 'Welcome to ' + game.title}</p>
    <div style="margin: 20px 0;">
      <a class="btn" href="${game.downloadUrl}" target="_blank">Direct Download / Play Game</a>
    </div>
    <p style="font-size: 12px; color: #6b7280;">Published on GameVault portal by ${game.author}</p>
  </div>
</body>
</html>`;

  const blob = new Blob([launcherContent], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `${game.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_launcher.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
