<!-- app/pages/session/[slug].vue -->
<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { RollModifier } from '~/types/dice.types'

const diceStore = useDiceStore()
const sessionStore = useSessionStore()
const { t } = useI18n()
const route = useRoute()
const supabase = useSupabaseClient()
const { $createDiceBox } = useNuxtApp()
let channel: any = null
console.log('SETUP RUNNING', route.params.slug)

const rollMod = ref<RollModifier>('none')
const bonus = ref(0)
const slug = route.params.slug as string

const COLORS = {
  hope: '#e7c74b',
  fear: '#22135f',
  mod: '#17b1c8'
}

const items: TabsItem[] = [
  {
    slot: 'settings' as const,
    label: t('session.room.settings'),
    icon: 'i-lucide-settings'
  },
  {
    slot: 'history' as const,
    label: t('session.room.history'),
    icon: 'i-lucide-clock-fading'
  }
]

const rollDuality = (mod: RollModifier = 'none', bonus: number = 0) => {
  const diceConfig = [
    { qty: 1, sides: 12, themeColor: COLORS.hope },
    { qty: 1, sides: 12, themeColor: COLORS.fear }
  ]

  // Si hay ventaja/desventaja, añadimos el tercer dado (D6)
  if (mod !== 'none') {
    diceConfig.push({
      qty: 1,
      sides: 6,
      themeColor: mod === 'advantage' ? '#00dc82' : '#ff6467'
    })
  }

  diceStore.executeRoll(diceConfig, { modifier: mod, bonus: bonus })
}

onMounted(async () => {
  console.log('MOUNTED')
  await sessionStore.initializeSession(slug)
  sessionStore.initCharacterName()

  console.log('session id', sessionStore.id)

  if (sessionStore.id) {
    await nextTick()

    const container = document.querySelector('#dice-container')
    if (!container) {
      console.warn('No dice container found')
      return
    }
    console.log('[DiceBox] container rect:', container?.getBoundingClientRect())

    container.innerHTML = ''

    await new Promise(resolve => setTimeout(resolve, 100))

    const box = $createDiceBox('#dice-container')
    await box.init()

    diceStore.setDiceBox(box)

    channel = supabase.channel(`session:${sessionStore.id}`, {
      config: {
        presence: {
          key: sessionStore.activeIdentity // Usamos el nombre del PC como clave única
        }
      }
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        sessionStore.updateOnlineMembers(newState)
      })
      .on('presence', { event: 'join' }, ({ key }: { key: string }) => {
        console.log(`${key} se ha unido a la sesion`)
      })
      .on('presence', { event: 'leave' }, ({ key }: { key: string }) => {
        console.log(`${key} se ha ido`)
      })
      .on('broadcast', { event: 'dice_anim' }, (payload: { user_name: string }) => {
        // Aquí conectaremos con el componente 3D más adelante
        console.log('Dados rodando de:', payload.user_name)
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'rolls',
          filter: `session_id=eq.${sessionStore.id}`
        },
        (payload: { new: any }) => {
          diceStore.addRollToLog(payload.new)
        }
      )
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          // "Track" anuncia nuestra presencia a los demás
          await channel.track({
            name: sessionStore.activeIdentity,
            isOwner: sessionStore.role === 'owner', // Útil para pintar una corona en la UI
            joinedAt: new Date().toISOString()
          })
        }
      })
  }
})

onUnmounted(async () => {
  diceStore.setDiceBox(null)
  if (channel) {
    await supabase.removeChannel(channel)
    channel = null
  }
})
</script>

<template>
  <UPage>
    <UPageBody
      :ui="{ base: 'space-y-4' }"
    >
      <p class="text-lg font-bold uppercase">
        {{ slug }}
      </p>
      <div
        id="dice-container"
        class="flex min-h-62 w-full flex-col items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-950"
      />
      <UButton
        class="w-full justify-center"
        size="xl"
        @click="rollDuality(rollMod, bonus)"
      >
        {{ t('session.room.rollDice') }}
      </UButton>
      <div class="flex justify-center text-center">
        <p v-if="diceStore.lastRoll">
          {{ diceStore.lastRoll.interpreted.total }}
          <span
            v-if="diceStore.lastRoll.interpreted.isCritical"
            class="font-bold"
          >{{ diceStore.lastRoll.interpreted.outcome }}</span>
          <span v-else>{{ diceStore.lastRoll.interpreted.outcome }}</span>
        </p>
        <p
          v-else
          class=""
        >
          &nbsp;
        </p>
      </div>
      <UTabs
        :items="items"
        class="w-full"
      >
        <template #settings>
          <UPageCard :ui="{ body: 'flex flex-col gap-4 w-full', footer: 'w-full' }">
            <template #header>
              <span class="text-bold">{{ t('session.room.rollingDualityDice') }}</span>
            </template>

            <template #body>
              <SessionThreeStateToggle v-model="rollMod" />
              {{ t('session.room.bonus') }}: {{ bonus > 0 ? '+' + bonus : bonus }}
              <USlider
                v-model="bonus"
                :min="-10"
                :max="10"
                :default-value="0"
              />
            </template>
          </UPageCard>
        </template>
        <template #history>
          <SessionDiceLog />
        </template>
      </UTabs>
    </UPageBody>
  </UPage>
</template>
