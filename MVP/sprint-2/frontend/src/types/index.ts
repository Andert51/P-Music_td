/**
 * Tipos para Sprint 2
 */

export interface Song {
  id: number
  title: string
  artist: string
  duration: number
  genre: string
  file_path: string
  cover_image?: string | null
  cover_url?: string | null  // Alias para compatibilidad
  album_id?: number | null
  is_approved: boolean
  created_at: string
  user_id: number
}

export interface Album {
  id: number
  title: string
  description?: string | null
  cover_image?: string | null
  release_date?: string | null
  user_id: number
  created_at: string
}

export interface User {
  id: number
  username: string
  email: string
  full_name?: string | null
  role: 'listener' | 'creator' | 'admin'
}

export interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  queue: Song[]
  currentIndex: number
}

export interface UploadResponse {
  success: boolean
  message: string
  song_id?: number
  album_id?: number
}
