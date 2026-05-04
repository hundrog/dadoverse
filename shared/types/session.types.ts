import type { Database } from './database.types'

export interface SessionConfig {
  theme: 'default' | 'moss-green' | 'slate' | 'abyss'
  allow_spectators: boolean
  dice_colors?: {
    primary: string
    secondary: string
  }
  house_rules: {
    yze_push_limit?: number
    duality_mod_enabled?: boolean
  }
  ambient_sound?: string
}

export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type SessionUpdate = Database['public']['Tables']['sessions']['Update']
export type Session = Database['public']['Tables']['sessions']['Row']
export type SessionMember = Database['public']['Tables']['session_members']['Row']
export type Roll = Database['public']['Tables']['rolls']['Row']
export type RollInsert = Database['public']['Tables']['rolls']['Insert']
export type RollUpdate = Database['public']['Tables']['rolls']['Update']
