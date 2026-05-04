import { defineStore } from 'pinia'
import { useDiceLogic } from '@/composables/useDiceLogic'

export const useDiceStore = defineStore('dice', () => {
  const session = useSessionStore()
  const { parseRoll } = useDiceLogic() // Importamos el motor lógico
  const diceBoxInstance = ref<any>(null)

  function setDiceBox(instance: any) {
    if (diceBoxInstance.value) return
    diceBoxInstance.value = markRaw(instance)
  }

  // State
  const rolls = ref<any[]>([])
  const lastRoll = ref<any | null>(null)
  const isRolling = ref(false)

  // --- MÉTODOS PRIVADOS ---

  function addRollToLog(roll: any) {
    rolls.value.push(roll)
    if (rolls.value.length > 50) rolls.value.pop()
  }

  async function _broadcastRoll(payload: {
    rawValues: number[]
    system: DiceSystem
    options: any
    user_name: string
  }) {
    const supabase = useSupabaseClient<Database>()
    const channel = supabase.channel(`session:${session.id}`)
    await channel.send({
      type: 'broadcast',
      event: 'dice_anim',
      payload
    })
  }

  async function _saveRoll(interpretedRoll: any) {
    const supabase = useSupabaseClient<Database>()
    // Nota: El objeto interpretedRoll ya viene con la estructura de RollResult
    await supabase.from('rolls').insert({
      session_id: session.id,
      system_type: interpretedRoll.system,
      raw_result: interpretedRoll, // El JSON interpretado completo
      user_name: session.activeIdentity ?? 'Anónimo'
    })
  }

  // --- MÉTODOS PÚBLICOS ---

  async function getSessionRolls() {
    const supabase = useSupabaseClient<Database>()
    const { data, error } = await supabase
      .from('rolls')
      .select('*')
      .eq('session_id', session.id as string)
      .order('created_at', { ascending: true })

    if (!error) rolls.value = data
  }

  /**
   * ORQUESTADOR PRINCIPAL
   * @param diceConfig Configuración para DiceBox (ej: [{sides:6, theme:'attr'}, ...])
   * @param options Opciones para parseRoll (modifier, yzeClusters, etc.)
   */
  async function executeRoll(diceConfig: any[], options: any = {}) {
    if (!session.id || !session.activeIdentity || !diceBoxInstance.value) return

    isRolling.value = true

    try {
      // 1. Física: Tirar dados en el Canvas 3D
      // Esperamos a que los dados dejen de rodar

      const boxResults = await diceBoxInstance.value.roll(diceConfig)

      // Extraemos solo los valores numéricos para la lógica
      const rawValues = boxResults.map((d: any) => d.value)

      // 2. Lógica: Interpretar según el sistema de la sesión
      const interpreted = parseRoll(session.system_type, rawValues, options)

      // 3. Enriquecer: Añadimos metadata de la sesión
      const enrichedRoll = {
        ...interpreted,
        user_name: session.activeIdentity,
        session_id: session.id,
        created_at: new Date().toISOString()
      }

      // 4. UI Local: Actualizar log inmediatamente
      addRollToLog(enrichedRoll)
      lastRoll.value = enrichedRoll

      // 5. Red: Notificar a otros y persistir
      await Promise.all([
        _broadcastRoll({
          rawValues,
          system: session.system_type,
          options,
          user_name: session.activeIdentity
        }),
        _saveRoll(enrichedRoll)
      ])
    } catch (err) {
      console.error('[DiceStore] Fallo en la tirada:', err)
    } finally {
      isRolling.value = false
    }
  }

  return {
    rolls,
    lastRoll,
    isRolling,
    addRollToLog,
    executeRoll,
    getSessionRolls,
    setDiceBox
  }
})
