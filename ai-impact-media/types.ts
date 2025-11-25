export interface Movie {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  genre: string;
  year: number;
  description: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  message: string;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  socialHandle: string;
  platform: 'Instagram' | 'Twitter' | 'TikTok' | 'YouTube';
  bio: string;
  files: string[]; // Mock URLs
  signature: string; // Data URL
  timestamp: number;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user';
  email: string;
}

export interface DonationTier {
  amount: number;
  label: string;
  perk: string;
}

export enum AppRoute {
  HOME = '/',
  CASTING = '/casting',
  SPONSORS = '/sponsors',
  MOVIES = '/movies',
  DONATIONS = '/donations',
  ADMIN = '/admin',
  LOGIN = '/login'
}
