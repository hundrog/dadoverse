<script setup lang="ts">
const diceStore = useDiceStore()
const supabase = useSupabaseClient()
const sessionStore = useSessionStore()
let channel: any = null

const messages = computed(() => {
  return diceStore.rolls.map(roll => ({
    id: roll.id || Math.random(), // id temporal si viene de memoria
    user_name: roll.user_name,
    // Manejamos si el objeto viene de la DB (raw_result) o de la store local
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

watch(
  messages,
  () => {
    // Pequeño timeout para esperar a que el DOM se actualice
    setTimeout(() => {
      const container = document.querySelector('#session-dice-log')
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    }, 50)
  },
  { deep: true }
)
</script>

<template>
  <UScrollArea
    id="session-dice-log"
    class="h-64"
  >
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="bg-accented my-1 rounded-xl p-4"
    >
      <span class="font-bold">{{ msg.user_name }}:</span>
      {{ msg.interpreted.total }}
      <UBadge
        size="xs"
        variant="soft"
        class="ml-2"
      >
        {{ msg.interpreted.outcome }}
      </UBadge>
    </div>
  </UScrollArea>
</template>
