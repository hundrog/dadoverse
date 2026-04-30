export const useDiceStore = defineStore('dice', () => {
  // State
  const rolls = ref<any[]>([])
  const lastRoll = ref<any | null>(null)
  const activeSystem = ref<DiceSystem>('duality')
  const isRolling = ref(false)

  // Actions
  function addRollToLog(roll: any) {
    rolls.value.unshift(roll) // El más reciente arriba
    if (rolls.value.length > 50) rolls.value.pop() // Limpieza de memoria
  }

  async function broadcastRoll(payload: { rawValues: number[], system: DiceSystem, options: any }) {
    const sessionStore = useSessionStore()
    const sessionId = sessionStore.id
    const supabase = useSupabaseClient<Database>()
    const channel = supabase.channel(`session:${sessionId}`)

    // 1. Avisar a otros para animar (Broadcast)
    await channel.send({
      type: 'broadcast',
      event: 'dice_anim',
      payload
    })
  }

  async function saveRoll(interpretedRoll: any) {
    const sessionStore = useSessionStore()
    const sessionId = sessionStore.id
    const supabase = useSupabaseClient<Database>()

    // 2. Persistir en DB
    await supabase.from('rolls').insert({
      session_id: sessionId,
      system_type: interpretedRoll.system,
      raw_result: interpretedRoll,
      user_name: 'Usuario' // Aquí iría el nombre del member
    })
  }

  return {
    rolls,
    lastRoll,
    activeSystem,
    isRolling,
    addRollToLog,
    broadcastRoll,
    saveRoll
  }
})
