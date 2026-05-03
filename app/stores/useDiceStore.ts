export const useDiceStore = defineStore('dice', () => {
  // State
  const session = useSessionStore()
  const rolls = ref<any[]>([])
  const lastRoll = ref<any | null>(null)
  const activeSystem = ref<DiceSystem>('duality')
  const isRolling = ref(false)

  // Private: añade al log local
  function addRollToLog(roll: any) {
    rolls.value.unshift(roll)
    if (rolls.value.length > 50) rolls.value.pop()
  }

  // Private: broadcast a otros clientes para animar
  async function _broadcastRoll(payload: {
    rawValues: number[]
    system: DiceSystem
    options: any
  }) {
    const supabase = useSupabaseClient<Database>()
    const channel = supabase.channel(`session:${session.id}`)
    await channel.send({
      type: 'broadcast',
      event: 'dice_anim',
      payload
    })
  }

  // Private: persiste en DB con identidad y sesión correctas
  async function _saveRoll(interpretedRoll: any) {
    const supabase = useSupabaseClient<Database>()
    await supabase.from('rolls').insert({
      session_id: session.id,
      system_type: interpretedRoll.system,
      raw_result: interpretedRoll,
      user_name: session.activeIdentity ?? 'Anónimo'
    })
  }

  // Public: única acción expuesta para ejecutar una tirada completa
  async function executeRoll(payload: {
    rawValues: number[]
    system: DiceSystem
    interpretedRoll: any
    options?: any
  }) {
    if (!session.id) {
      console.warn('[DiceStore] No hay sesión activa')
      return
    }
    if (!session.activeIdentity) {
      console.warn('[DiceStore] No hay identidad activa')
      return
    }

    isRolling.value = true

    try {
      // Asociar identidad y sesión al resultado antes de procesarlo
      const enrichedRoll = {
        ...payload.interpretedRoll,
        user_name: session.activeIdentity,
        session_id: session.id,
        timestamp: new Date().toISOString()
      }

      // 1. Log local inmediato
      addRollToLog(enrichedRoll)
      lastRoll.value = enrichedRoll

      // 2. Broadcast para animaciones en otros clientes
      await _broadcastRoll({
        rawValues: payload.rawValues,
        system: payload.system,
        options: payload.options ?? {}
      })

      // 3. Persistir en DB
      await _saveRoll(enrichedRoll)
    } catch (err) {
      console.error('[DiceStore] Error al ejecutar tirada:', err)
    } finally {
      isRolling.value = false
    }
  }

  return {
    // State
    rolls,
    lastRoll,
    activeSystem,
    isRolling,
    // Actions (solo la orquestadora es pública)
    addRollToLog,
    executeRoll
  }
})
