<script setup lang="ts">
const diceStore = useDiceStore()
const supabase = useSupabaseClient()
const sessionStore = useSessionStore()
let channel: any = null

const getBadgeClass = (interpreted?: any) => {
  const metadata = interpreted?.metadata
  const hope = metadata?.hope
  const fear = metadata?.fear

  if (typeof hope === 'number' && typeof fear === 'number') {
    if (hope > fear) {
      return 'bg-hope-500/15 text-hope-400 ring-hope-500/30'
    }
    if (fear > hope) {
      return 'bg-fear-500/20 text-fear-200 ring-fear-500/30'
    }
  }

  if (interpreted?.isCritical) {
    return 'bg-primary/15 text-primary ring-primary/30'
  }

  return ''
}

const messages = computed(() => {
  return diceStore.rolls.map(roll => ({
    id: roll.id || `temp-${roll.timestamp}`,
    user_name: roll.user_name,
    interpreted: roll.raw_result?.interpreted || roll.interpreted
  }))
})

onMounted(async () => {
  // Cargar historial inicial
  await diceStore.getSessionRolls()

  // 2. Suscripción en tiempo real a la base de datos
  channel = supabase
    .channel('db-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'rolls',
        filter: `session_id=eq.${sessionStore.id}`
      },
      (payload) => {
        // Evitamos duplicar si la tirada es nuestra (ya la añadimos localmente)
        const exists = diceStore.rolls.some(r => r.id === payload.new.id)
        if (!exists) {
          diceStore.addRollToLog(payload.new)
        }
      }
    )
    .subscribe()
})
// Limpiar suscripción al destruir el componente
onUnmounted(() => {
  supabase.removeChannel(channel)
})
</script>

<template>
  <UScrollArea
    id="session-dice-log"
    class="h-64"
  >
    <div
      v-for="(msg, index) in messages"
      :key="msg.id"
      :class="[
        'bg-accented my-1 rounded-xl border p-4',
        index === 0 ? 'mb-4 p-6' : 'mb-0',
        msg.interpreted?.isCritical ? 'border-primary' : 'border-transparent'
      ]"
    >
      <span class="font-bold">{{ msg.user_name }}:</span>
      {{ msg.interpreted.total }}
      <UBadge
        size="md"
        variant="soft"
        :class="['ml-2', getBadgeClass(msg.interpreted)]"
      >
        {{ msg.interpreted.outcome }}
      </UBadge>
    </div>
  </UScrollArea>
</template>
