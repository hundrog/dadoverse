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

