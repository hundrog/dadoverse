<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
const diceStore = useDiceStore()
const sessionStore = useSessionStore();
const route = useRoute();
const supabase = useSupabaseClient();
const { $createDiceBox } = useNuxtApp()

const slug = route.params.slug as string;

const COLORS = {
  hope: "#e7c74b",
  fear: "#22135f",
  mod: "#17b1c8"
}

const items: TabsItem[] = [
  {
    slot: "settings" as const,
    label: "settings",
    icon: "i-lucide-settings",
  },
  {
    slot: "history" as const,
    label: "History",
    icon: "i-lucide-clock-fading",
  },
];

const rollDuality = (mod: 'advantage' | 'disadvantage' | 'none') => {
  const diceConfig = [
    { qty: 1, sides: 12, themeColor: COLORS.hope },
    { qty: 1, sides: 12, themeColor: COLORS.fear }
  ]

  // Si hay ventaja/desventaja, añadimos el tercer dado (D6)
  if (mod !== 'none') {
    diceConfig.push({
      qty: 1,
      sides: 6,
      themeColor: mod === 'advantage' ? '#10b981' : '#f59e0b'
    })
  }

  diceStore.executeRoll(diceConfig, { modifier: mod })
}

onMounted(async () => {
  await sessionStore.initializeSession(slug);

  if (sessionStore.id) {
    const box = $createDiceBox('#dice-container')
    await box.init()

    diceStore.setDiceBox(box)

    const channel = supabase.channel(`session:${sessionStore.id}`, {
      config: {
        presence: {
          key: sessionStore.activeIdentity, // Usamos el nombre del PC como clave única
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
        sessionStore.updateOnlineMembers(newState);
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log(`${key} se ha unido a la sesion`);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log(`${key} se ha ido`);
      })
      .on("broadcast", { event: "dice_anim" }, (payload) => {
        // Aquí conectaremos con el componente 3D más adelante
        console.log("Dados rodando de:", payload.user_name);
      })
      // .on(
      //   "postgres_changes",
      //   {
      //     event: "INSERT",
      //     schema: "public",
      //     table: "rolls",
      //     filter: `session_id=eq.${sessionStore.id}`,
      //   },
      //   (payload) => {
      //     diceStore.addRollToLog(payload.new);
      //   },
      // )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // "Track" anuncia nuestra presencia a los demás
          await channel.track({
            name: sessionStore.activeIdentity,
            isOwner: sessionStore.role === "owner", // Útil para pintar una corona en la UI
            joinedAt: new Date().toISOString(),
          });
        }
      })

  }
});
</script>
<template>
  <UPage>
    <UPageBody v-if="sessionStore.id">
      <p class="text-lg font-bold uppercase">{{ slug }}</p>
        <div id="dice-container" class="min-h-62 w-full bg-neutral-950 rounded-xl" />
      <UButton class="w-full justify-center" size="xl" @click="rollDuality('advantage')">
          Roll Dice
        </UButton>
      <UTabs :items="items" class="w-full">
        <template #settings>
          <div class="py-4"></div>
        </template>
        <template #history>
          <div class="py-4"></div>
        </template>
      </UTabs>
    </UPageBody>
  </UPage>
</template>

<style scoped>
#dice-container {
  pointer-events: none; /* Para que puedas clickear los botones de abajo */
}
</style>
