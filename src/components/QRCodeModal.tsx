import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, QrCode, Download, Copy, Check, Smartphone, ExternalLink } from 'lucide-react';
import { Game } from '../types';

interface QRCodeModalProps {
  game: Game | null;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ game, onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (game?.downloadUrl) {
      QRCode.toDataURL(game.downloadUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#030712',
          light: '#ffffff'
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR code generation failed:', err));
    }
  }, [game]);

  if (!game) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(game.downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-200 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
          <Smartphone className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          Scan to Download on Mobile
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Point your smartphone camera at the QR code to download <strong className="text-white">{game.title}</strong> directly to your device.
        </p>

        {/* QR Code Container */}
        <div className="p-4 bg-white rounded-2xl inline-block shadow-lg border border-slate-200 mb-4">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 mx-auto" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
              Generating QR Code...
            </div>
          )}
        </div>

        {/* Game Platform details */}
        <div className="flex items-center justify-center gap-2 mb-4 text-xs text-slate-300">
          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
            {game.platform}
          </span>
          <span>•</span>
          <span>{game.fileSize || 'Standard file'}</span>
        </div>

        {/* Quick action buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Direct Download URL'}</span>
          </button>

          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download={`${game.title.replace(/\s+/g, '_')}_QRCode.png`}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Save QR Code Image (.PNG)</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
