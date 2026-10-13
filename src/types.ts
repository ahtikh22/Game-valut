export type GamePlatform = 'PC Windows' | 'Android APK' | 'Web Browser' | 'Mac' | 'Linux' | 'Cross-Platform';

export type GameGenre = 
  | 'Action' 
  | 'Adventure' 
  | 'Arcade' 
  | 'Puzzle' 
  | 'Racing' 
  | 'RPG' 
  | 'Shooter' 
  | 'Strategy' 
  | 'Casual' 
  | 'Horror' 
  | 'Simulation';

export interface GameReview {
  id: string;
  author: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  downloadUrl: string;
  playUrl?: string; // Optional direct web playable link
  thumbnailUrl: string;
  genre: GameGenre;
  platform: GamePlatform;
  version: string;
  fileSize?: string;
  author: string;
  createdAt: string;
  downloadsCount: number;
  rating: number;
  tags: string[];
  instructions?: string;
  isUserCreated?: boolean;
  verifiedSafe?: boolean;
  reviews?: GameReview[];
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  gamerTag: string;
  authProvider?: 'google' | 'github' | 'email';
  isAdmin?: boolean;
  publishedCount: number;
  totalDownloadsCount: number;
  joinedDate: string;
}

export interface DownloadHistoryItem {
  id: string;
  gameId: string;
  gameTitle: string;
  downloadUrl: string;
  platform: GamePlatform;
  downloadedAt: string;
}
