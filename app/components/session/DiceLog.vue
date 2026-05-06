<script setup lang="ts">
const diceStore = useDiceStore()
const supabase = useSupabaseClient()
const sessionStore = useSessionStore()
const scrollContainer = ref<HTMLElement | null>(null)
let channel: any = null

const messages = computed(() => {
  return diceStore.rolls.slice().map(roll => ({
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

const scrollToBottom = () => {
  // nextTick espera a que Vue actualice el DOM con el nuevo mensaje
  nextTick(() => {
    if (scrollContainer.value) {
      // UScrollArea expone el elemento de scroll a través de su referencia
      // Si es un div normal, sería .scrollTop.
      // En UScrollArea de Nuxt UI, buscamos el viewport:
      const el = (scrollContainer.value as any).$el
        ? (scrollContainer.value as any).$el.querySelector('[data-radix-scroll-area-viewport]') || (scrollContainer.value as any).$el
        : (scrollContainer.value as any).$el

      el.scrollTo({
        top: el.scrollHeight,
        behavior: 'smooth' // O 'auto' si quieres que sea instantáneo
      })
    }
  })
}

watch(messages, scrollToBottom, { deep: true })
</script>

<template>
  <UScrollArea
    id="session-dice-log"
    ref="scrollContainer"
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
