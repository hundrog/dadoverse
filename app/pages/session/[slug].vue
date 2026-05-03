<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
const dices = useDiceLogic()
const sessionStore = useSessionStore();
const diceStore = useDiceStore()
const route = useRoute()

const slug = route.params.slug as string

const items: TabsItem[] = [
  {
    slot: 'roll' as const,
    label: "Roll",
    icon: "i-lucide-dices",
  },
  {
    slot: 'history' as const,
    label: "History",
    icon: "i-lucide-clock-fading",
  },
];

const getResult = () => {
  const result = dices.parseRoll('duality', [10, 4, 5], { modifier: 'advantage' });
  alert(JSON.stringify(result));

}

onMounted(async ()=>{
  await sessionStore.initializeSession(slug)
  const supabase = useSupabaseClient()
  const channel = supabase.channel(`session:${sessionStore.id}`)

  channel
    .on('broadcast', { event: 'dice_anim' }, (payload) => {
      // Aquí conectaremos con el componente 3D más adelante
      console.log('Dados rodando de:', payload.user_name)
    })
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'rolls',
      filter: `session_id=eq.${sessionStore.id}`
    }, (payload) => {
      diceStore.addRollToLog(payload.new)
    })
    .subscribe()
  })
</script>
<template>
  <UPage>
    <UPageBody v-if="sessionStore.id">
      <p class="text-lg font-bold uppercase">{{ slug }}</p>
      <UTabs :items="items" class="w-full">
        <template #roll>
          <img src="https://placehold.co/600x400/transparent/00F?text=Hello+World" />
          <div class="flex mt-4">
            <UButton class="w-full justify-center" size="xl" @click="getResult">
              Roll Dice
            </UButton>
          </div>
        </template>
        <template #history>
          <div class="py-4"></div>
        </template>
      </UTabs>
    </UPageBody>
  </UPage>
</template>
