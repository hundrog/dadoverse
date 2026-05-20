<!-- app/pages/session/[slug].vue -->
<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { RollModifier } from '~/types/dice.types'

const diceStore = useDiceStore()
const sessionStore = useSessionStore()
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const { $createDiceBox } = useNuxtApp()
const { copy, copied } = useClipboard()
const tempName = ref('')
const slug = route.params.slug as string

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

const yzeDice = ref({
  attr: 2,
  skill: 2,
  gear: 2,
  artifact: 6
})

const rollMod = ref<RollModifier>('none')
const bonus = ref(0)
const level = ref(2)
const tn = ref(10)

/** Unclaimed sessions are removed this many days after `created_at` (see alert copy / backend policy). */
const TEMPORARY_SESSION_TTL_DAYS = 5
const MS_PER_DAY = 86_400_000

const temporarySessionDescription = computed(() => {
  const created = sessionStore.created_at
  if (!created) {
    return t('session.room.temporarySessionDescriptionPlural', {
      days: TEMPORARY_SESSION_TTL_DAYS
    })
  }
  const createdMs = new Date(created).getTime()
  if (Number.isNaN(createdMs)) {
    return t('session.room.temporarySessionDescriptionPlural', {
      days: TEMPORARY_SESSION_TTL_DAYS
    })
  }
  const nowMs = Date.now()
  // Avoid ceil → TTL+1 when server `created_at` is marginally ahead of client time.
  const effectiveCreatedMs = Math.min(createdMs, nowMs)
  const remainingMs = effectiveCreatedMs + TEMPORARY_SESSION_TTL_DAYS * MS_PER_DAY - nowMs
  const days = Math.max(0, Math.ceil(remainingMs / MS_PER_DAY))
  if (days === 0) {
    return t('session.room.temporarySessionDescriptionSoon')
  }
  if (days === 1) {
    return t('session.room.temporarySessionDescriptionSingular')
  }
  return t('session.room.temporarySessionDescriptionPlural', { days })
})

const COLORS = {
  hope: '#e7c74b',
  fear: '#22135f',
  adv: '#00dc82',
  dis: '#ff6467'
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

let channel: any = null

const getOutcomeLabel = (interpreted?: any) => {
  if (interpreted?.outcomeKey) {
    return t(interpreted.outcomeKey, interpreted.outcomeParams || {})
  }
  return interpreted?.outcome || ''
}

const shareSession = () => {
  const sessionUrl = window.location.href

  copy(sessionUrl)
  toast.add({ title: t('session.room.linkCopied'), icon: 'i-lucide-clipboard-check' })
}

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
      themeColor: mod === 'advantage' ? COLORS.adv : COLORS.dis
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

const rollYze = (attr: number, skill: number, gear: number, artifact: number) => {
  const diceConfig = [
    { qty: attr, sides: 6, themeColor: COLORS.hope },
    { qty: skill, sides: 6, themeColor: COLORS.adv },
    { qty: gear, sides: 6, themeColor: COLORS.dis },
    { qty: 1, sides: artifact, themeColor: COLORS.fear }
  ]

  diceStore.executeRoll(diceConfig)
}

const rollModiphius = (level: number = 1) => {
  const diceConfig = [
    { qty: level, sides: 20, themeColor: COLORS.hope }
  ]

  diceStore.executeRoll(diceConfig, { tn: tn.value })
}

const handleRoll = () => {
  if (sessionStore.system_type === 'step') {
    rollStep(bonus.value)
  } else if (sessionStore.system_type === 'duality') {
    rollDuality(rollMod.value, bonus.value)
  } else if (sessionStore.system_type === 'yze') {
    rollYze(yzeDice.value.attr, yzeDice.value.skill, yzeDice.value.gear, yzeDice.value.artifact)
  } else if (sessionStore.system_type === '2d20') {
    rollModiphius(level.value)
  }
}

const handleSaveName = () => {
  if (tempName.value && tempName.value.trim() !== '') {
    sessionStore.setCharacterName(tempName.value.trim())
  }
}

const handleClaimSession = async () => {
  if (!user.value) {
    // Si no hay usuario, vamos al login pasando la ruta actual como retorno
    // encodeURIComponent es clave para que los / y ? no rompan la URL del login
    const separator = route.fullPath.includes('?') ? '&' : '?'
    const returnTo = encodeURIComponent(`${route.fullPath}${separator}action=claim`)
    return navigateTo(`/login?redirectTo=${returnTo}`)
  }
  const { error } = await supabase
    .from('sessions')
    .update({ owner_id: user.value.sub })
    .eq('slug', slug)

  if (!error) {
    sessionStore.owner_id = user.value.sub
    toast.add({ title: t('session.room.sessionClaimed'), icon: 'i-lucide-check' })
  } else {
    createError({
      statusCode: 500,
      statusMessage: error.message,
      message: t('session.room.sessionClaimFailed')
    })
    return
  }
}

onMounted(async () => {
  await sessionStore.initializeSession(slug)
  if (route.query.action === 'claim' && user.value) {
    handleClaimSession()
    router.replace({ query: {} })
  }
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

    const box = $createDiceBox('#dice-container', sessionStore.system_type)
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
        console.log(`${key} ${t('session.room.sessionJoined')}`)
      })
      .on('presence', { event: 'leave' }, ({ key }: { key: string }) => {
        console.log(`${key} ${t('session.room.sessionLeft')}`)
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
      <UAlert
        v-if="!sessionStore.owner_id"
        icon="i-lucide-clock-5"
        color="warning"
        variant="soft"
        :title="t('session.room.temporarySession')"
        :description="temporarySessionDescription"
      >
        <template #actions>
          <UButton size="xs" color="warning" @click="() => void handleClaimSession()">
            {{ t('session.room.claimSession') }}
          </UButton>
        </template>
      </UAlert>
      <div
        id="dice-container"
        class="aspect-square w-full flex flex-col items-center justify-center rounded-xl bg-neutral-200 dark:bg-neutral-950"
      />
      <UButton
        class="w-full justify-center"
        size="xl"
        @click="handleRoll()"
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
            v-else-if="sessionStore.system_type === 'step'"
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
          <UPageCard
            v-else-if="sessionStore.system_type === '2d20'"
            :ui="{ body: 'flex flex-col gap-4 w-full', footer: 'w-full' }"
          >
            <template #header>
              <span class="text-bold">{{ t('session.room.rollingModiphius2D20') }}</span>
            </template>
            <template #body>
              {{ t('session.room.numberOfDice') }}: {{ level }}
              <USlider
                v-model="level"
                :min="0"
                :max="5"
                :default-value="2"
              />
              {{ t('session.room.targetNumber') }}: {{ tn }}
              <USlider
                v-model="tn"
                :min="6"
                :max="20"
                :default-value="10"
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
