export interface User {
  id: number;
  email: string;
  username: string;
  role: 'user' | 'premium' | 'creator' | 'admin';
  is_active: boolean;
  profile_picture?: string;
  created_at: string;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
  cover_url?: string;
  genre?: string;
  file_path: string;
  album_id?: number;
  creator_id: number;
  is_approved: boolean;
  play_count: number;
  created_at: string;
}

export interface Album {
  id: number;
  title: string;
  description?: string;
  cover_image?: string;
  release_date?: string;
  creator_id: number;
  is_approved: boolean;
  created_at: string;
  songs: Song[];
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  cover_image?: string;
  is_public: boolean;
  owner_id: number;
  created_at: string;
  songs?: Song[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  role?: 'user' | 'premium' | 'creator' | 'admin';
}
