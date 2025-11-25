export type ViewState = 'HOME' | 'CASTING' | 'SPONSORS' | 'MOVIES' | 'DONATIONS';

export interface Movie {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl?: string; // Placeholder for actual video link
  description: string;
  year: number;
  duration: string;
  genre: string[];
}

export interface CastMember {
  id: string;
  name: string;
  imageUrl: string;
  role: string;
}

export interface CastingSubmission {
  name: string;
  email: string;
  socialHandle: string;
  type: string;
  images: File[];
  audio: File | null;
  voluntaryAgreement: boolean;
  signature: string;
}

export interface SponsorSubmission {
  companyName: string;
  contactName: string;
  email: string;
  message: string;
}