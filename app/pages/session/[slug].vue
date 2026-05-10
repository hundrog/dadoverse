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
const tempName = ref('')
const { copy, copied } = useClipboard()
const stepDice = ref({
  dice1: 6,
  dice2: 6
})
const stepDiceValues = [
  { label: 'D6', value: 6 },
  { label: 'D8', value: 8 },
  { label: 'D10', value: 10 },
  { label: 'D12', value: 12 }
]
let channel: any = null

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
    slot: 'modifiers' as const,
    label: t('session.room.modifiers'),
    icon: 'i-lucide-sliders-horizontal'
  },
  {
    slot: 'history' as const,
    label: t('session.room.history'),
    icon: 'i-lucide-clock-fading'
  },
  {
    slot: 'settings' as const,
    label: t('session.room.settings'),
    icon: 'i-lucide-settings'
  }
]

const getOutcomeLabel = (interpreted?: any) => {
  if (interpreted?.outcomeKey) {
    return t(interpreted.outcomeKey, interpreted.outcomeParams || {})
  }
  return interpreted?.outcome || ''
}

const shareSession = () => {
  const sessionUrl = window.location.href

  copy(sessionUrl)

  // Opcional: Feedback visual con el sistema de Toasts de Nuxt UI
  const toast = useToast()
  toast.add({ title: 'Enlace copiado', icon: 'i-lucide-clipboard-check' })
}

const _rollDuality = (mod: RollModifier = 'none', bonus: number = 0) => {
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

const rollStep = (bonus: number = 0) => {
  const diceConfig = [
    { qty: 1, sides: stepDice.value.dice1, themeColor: COLORS.hope },
    { qty: 1, sides: stepDice.value.dice2, themeColor: COLORS.fear }
  ]

  diceStore.executeRoll(diceConfig, { bonus: bonus })
}

const _rollYze = (attr: number, skill: number, gear: number, artifact: number) => {
  const diceConfig = [
    { qty: attr, sides: 6, themeColor: 'neutral' },
    { qty: skill, sides: 6, themeColor: 'primary' },
    { qty: gear, sides: 6, themeColor: 'success' },
    { qty: 1, sides: artifact, themeColor: 'fear' }
  ]

  diceStore.executeRoll(diceConfig)
}

const _rollModiphius = (level: number) => {
  const diceConfig = [
    { qty: level, sides: 20, themeColor: 'primary' }
  ]

  diceStore.executeRoll(diceConfig)
}

const handleSaveName = () => {
  if (tempName.value && tempName.value.trim() !== '') {
    sessionStore.setCharacterName(tempName.value.trim())
  }
}

onMounted(async () => {
  await sessionStore.initializeSession(slug)
  sessionStore.initCharacterName()
  tempName.value = sessionStore.activeIdentity

  if (sessionStore.id) {
    await nextTick()

    const container = document.querySelector('#dice-container')
    if (!container) {
      console.warn('No dice container found')
      return
    }

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
      <div class="flex justify-between items-center">
        <p class="text-lg font-bold uppercase">
          {{ slug }}
        </p>
        <UTooltip
          :content="{
            align: 'end',
            side: 'left',
            sideOffset: 3
          }"
          :text="t('session.room.share')"
        >
          <UButton
            :icon="copied ? 'i-lucide-check' : 'i-lucide-share'"
            :color="copied ? 'success' : 'neutral'"
            variant="ghost"
            @click="shareSession"
          />
        </UTooltip>
      </div>
      <div
        id="dice-container"
        class="aspect-square w-full flex flex-col items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-950"
      />
      <UButton
        class="w-full justify-center"
        size="xl"
        @click="rollStep(bonus)"
      >
        {{ t('session.room.rollDice') }}
      </UButton>
      <div class="flex justify-center text-center">
        <p v-if="diceStore.lastRoll">
          {{ diceStore.lastRoll.interpreted.total }}
          <span
            v-if="diceStore.lastRoll.interpreted.isCritical"
            class="font-bold"
          >{{ getOutcomeLabel(diceStore.lastRoll.interpreted) }}</span>
          <span v-else>{{ getOutcomeLabel(diceStore.lastRoll.interpreted) }}</span>
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
        <template #modifiers>
          <UPageCard
            v-if="sessionStore.system_type === 'duality'"
            :ui="{ body: 'flex flex-col gap-4 w-full', footer: 'w-full' }"
          >
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
          <UPageCard
            v-if="sessionStore.system_type === 'step'"
            :ui="{ body: 'flex flex-col gap-4 w-full', footer: 'w-full' }"
          >
            <template #header>
              <span class="text-bold">{{ t('session.room.rollingStepDice') }}</span>
            </template>
            <template #body>
              <div class="">
                <URadioGroup
                  v-model="stepDice.dice1"
                  legend="Dice 1"
                  orientation="horizontal"
                  variant="card"
                  :ui="{ fieldset: 'w-full', item: 'flex-1 justify-center' }"
                  :items="stepDiceValues"
                />
                <URadioGroup
                  v-model="stepDice.dice2"
                  legend="Dice 2"
                  orientation="horizontal"
                  variant="card"
                  :ui="{ fieldset: 'w-full', item: 'flex-1 justify-center' }"
                  :items="stepDiceValues"
                />
              </div>
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
        <template #settings>
          <div class="flex gap-2 mt-2">
            <UInput
              v-model="tempName"
              icon="i-lucide-user"
              :placeholder="sessionStore.activeIdentity || $t('session.room.empty_name')"
              class="w-full"
              @keyup.enter="handleSaveName"
            />
            <UButton
              color="primary"
              variant="soft"
              icon="i-lucide-check"
              :disabled="!tempName || tempName === sessionStore.activeIdentity"
              @click="handleSaveName"
            />
          </div>
          <!-- Visualización del estado actual -->
          <div v-if="sessionStore.activeIdentity" class="text-xs text-on-surface-dim italic">
            {{ $t('session.room.active_as') }}: <span class="text-primary-400">{{ sessionStore.activeIdentity }}</span>
          </div>
        </template>
      </UTabs>
    </UPageBody>
  </UPage>
</template>
