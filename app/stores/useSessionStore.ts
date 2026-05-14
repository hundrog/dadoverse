export const useSessionStore = defineStore('session', () => {
  // --- State ---
  const id = ref<string | null>(null)
  const slug = ref<string | null>(null)
  const name = ref<string | null>(null)
  const created_at = ref<string | null>(null)
  const owner_id = ref<string | null>(null)
  const system_type = ref<DiceSystem>('duality')
  const tray_type = ref<'standard' | 'collaborative'>('standard')
  const config = ref<SessionConfig>({
    theme: 'default',
    allow_spectators: true,
    house_rules: {}
  })
  const members = ref<string[]>([])
  const role = ref<'owner' | 'player' | 'spectator'>('spectator')
  const onlineMembers = ref<any[]>([])
  const characterName = ref('')

  const generateObserverName = () => {
    const adjectives = ['Sombrío', 'Etéreo', 'Vigilante', 'Silencioso']
    const nouns = ['Vagabundo', 'Espíritu', 'Cuervo', 'Guardián']
    const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    return `${rand(adjectives)} ${rand(nouns)} #${Math.floor(Math.random() * 900 + 100)}`
  }

  const observerName = ref(generateObserverName())

  // --- Actions ---
  const updateOnlineMembers = (presenceState: any) => {
    // Presence devuelve un objeto con IDs de socket, los aplanamos
    const members = Object.values(presenceState).flat()
    onlineMembers.value = members
  }

  const activeIdentity = computed(() => {
    // Si el usuario escribió un nombre, usamos ese. Si no, es un observador.
    return characterName.value || observerName.value
  })

  const setCharacterName = (name: string) => {
    characterName.value = name
    useCookie('pc_name').value = name
  }

  function initCharacterName() {
    if (import.meta.client) {
      const cookie = useCookie('pc_name')
      characterName.value = cookie.value ?? ''
    }
  }

  async function initializeSession(sessionSlug: string) {
    const supabase = useSupabaseClient<Database>()

    const { data } = await supabase
      .from('sessions')
      .select('id, slug, name, created_at, owner_id, system_type, tray_type, config')
      .eq('slug', sessionSlug)
      .single()

    if (data) {
      id.value = data.id
      slug.value = data.slug
      name.value = data.name
      created_at.value = data.created_at
      owner_id.value = data.owner_id
      system_type.value = data.system_type as DiceSystem
      tray_type.value = data.tray_type as 'standard' | 'collaborative'
      config.value = data.config as unknown as SessionConfig
    } else {
      return navigateTo('/error')
    }
  }

  type CreateSessionInput = SessionInsert & { username?: string }

  async function createSession(payload: CreateSessionInput) {
    const supabase = useSupabaseClient<Database>()
    const user = useSupabaseUser()

    const { username, ...sessionData } = payload

    if (!user.value) {
      await navigateTo('/error')
      return
    }

    if (username) setCharacterName(username)

    const { data, error } = await supabase
      .from('sessions')
      .insert({ ...sessionData, owner_id: user.value.sub })
      .select()
      .single()

    if (data) {
      id.value = data.id
      slug.value = data.slug
      name.value = data.name
      created_at.value = data.created_at
      system_type.value = data.system_type as DiceSystem
      tray_type.value = data.tray_type as 'standard' | 'collaborative'
      config.value = data.config as unknown as SessionConfig

      await navigateTo(`/session/${data.slug}`)
    } else if (error) {
      console.error(error)
      createError({
        statusCode: 500,
        statusMessage: 'Error al crear sesión'
      })
    } else {
      await navigateTo('/error')
      return
    }
  }

  // Solo el owner debería poder llamar a esto
  async function updateRoomSettings(updates: {
    system?: DiceSystem
    tray?: 'standard' | 'collaborative'
  }) {
    if (!id.value) return

    const supabase = useSupabaseClient<Database>()

    const payload: { system_type?: string, tray_type?: string } = {}
    if (updates.system) payload.system_type = updates.system
    if (updates.tray) payload.tray_type = updates.tray

    const { error } = await supabase.from('sessions').update(payload).eq('id', id.value)

    if (!error) {
      if (updates.system) system_type.value = updates.system
      if (updates.tray) tray_type.value = updates.tray
    }
  }

  return {
    // State
    id,
    slug,
    name,
    created_at,
    owner_id,
    system_type,
    tray_type,
    config,
    members,
    role,
    activeIdentity,
    onlineMembers,
    // Actions
    setCharacterName,
    initCharacterName,
    updateOnlineMembers,
    createSession,
    initializeSession,
    updateRoomSettings
  }
})
