export const useSessionStore = defineStore('session', () => {
  // --- State ---
  const id = ref<string | null>(null)
  const slug = ref<string | null>(null)
  const name = ref<string | null>(null)
  const systemType = ref<DiceSystem>('duality')
  const trayType = ref<'standard' | 'collaborative'>('standard')
  const config = ref<SessionConfig>({
    theme: 'default',
    allow_spectators: true,
    house_rules: {}
  })
  const members = ref<string[]>([])
  const role = ref<'owner' | 'player' | 'spectator'>('spectator')

  // --- Actions ---
  async function initializeSession(sessionSlug: string) {
    const supabase = useSupabaseClient<Database>()

    const { data } = await supabase
      .from('sessions')
      .select('id, slug, name, system_type, tray_type, config')
      .eq('slug', sessionSlug)
      .single()

    if (data) {
      id.value = data.id
      slug.value = data.slug
      name.value = data.name
      systemType.value = data.system_type as DiceSystem
      trayType.value = data.tray_type as 'standard' | 'collaborative'
      config.value = data.config as unknown as SessionConfig
    }
  }

  // Solo el owner debería poder llamar a esto
  async function updateRoomSettings(updates: {
    system?: DiceSystem
    tray?: 'standard' | 'collaborative'
  }) {
    if (!id.value) return

    const supabase = useSupabaseClient<Database>()

    const payload: { system_type?: string; tray_type?: string } = {}
    if (updates.system) payload.system_type = updates.system
    if (updates.tray) payload.tray_type = updates.tray

    const { error } = await supabase
      .from('sessions')
      .update(payload)
      .eq('id', id.value)

    if (!error) {
      if (updates.system) systemType.value = updates.system
      if (updates.tray) trayType.value = updates.tray
    }
  }

  return {
    // State
    id,
    slug,
    name,
    systemType,
    trayType,
    config,
    members,
    role,
    // Actions
    initializeSession,
    updateRoomSettings
  }
})
