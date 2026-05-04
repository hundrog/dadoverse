<script setup lang="ts">
  import type { StepperItem } from '@nuxt/ui'
  import { breakpointsTailwind } from '@vueuse/core'

  const sessionStore = useSessionStore()
  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isDesktop = breakpoints.greaterOrEqual('md')
  const selected = ref<number | null>(null)

  const form = reactive({
    name: sessionStore.name as string,
    system_type: sessionStore.system_type as DiceSystem,
    config: { ...sessionStore.config }
  })

  const items: StepperItem[] = [
    {
      slot: 'name' as const,
      title: 'Name',
      icon: 'i-lucide-users'
    },
    {
      slot: 'system' as const,
      title: 'System',
      icon: 'i-lucide-settings-2'
    },
    {
      slot: 'create' as const,
      title: 'Create',
      icon: 'i-lucide-check'
    }
  ]

  const systems = ref([
    {
      id: 'duality',
      title: 'Daggerheart Duality Dice',
      description:
        'The Duality Dice system in the Daggerheart RPG uses two d12s (Hope and Fear) rolled together to determine success and narrative tone.',
      icon: 'i-lucide-dices'
    },
    {
      id: 'yze',
      title: 'Year Zero Engine',
      description:
        'In the dice pool system, every action is resolved by rolling a bunch of d6 dice, only the results of 6 count as successes, and the number of successes determines the outcome of the action.',
      icon: 'i-lucide-dices'
    },
    {
      id: 'step',
      title: 'Step Dice',
      description:
        'The step-dice variant uses different-sized dice (d6, d8, d10…), giving a gentler difficulty curve and fewer “push” penalties.',
      icon: 'i-lucide-dices'
    },
    {
      id: '2d20',
      title: 'Modiphius 2D20',
      description:
        'The Modiphius 2D20 system uses two d20 dice to determine the outcome of actions, with the difference between the dice determining the degree of success.',
      icon: 'i-lucide-dices'
    }
  ])

  function selectSystem(index: number, id: string) {
    selected.value = index
    form.system_type = id as DiceSystem
  }

  async function handleCreateSession(form: SessionInsert) {
    try {
      await sessionStore.createSession(form)
    } catch (e) {
      throw e
    }
  }
</script>

<template>
  <UPage>
    <UPageBody>
      <p class="text-lg font-bold uppercase">New Session</p>
      <UStepper
        :items="items"
        class="w-full"
      >
        <template #name>
          <UInput
            size="xl"
            placeholder="The Great Adventure"
            class="w-full"
            v-model="form.name"
          />
        </template>
        <template #system>
          <UPageGrid :ui="{ base: 'lg:grid-cols-2' }">
            <UPageCard
              v-for="(system, index) in systems"
              :key="index"
              v-bind="system"
              :highlight="selected === index"
              highlight-color="primary"
              :spotlight="isDesktop"
              spotlight-color="secondary"
              @click="selectSystem(index, system.id)"
            />
          </UPageGrid>
        </template>
        <template #create>
          <div class="flex flex-col gap-6">
            <!-- Review -->
            <div class="flex flex-col gap-2">
              <p class="text-muted text-sm font-medium uppercase">Review</p>
              <div class="flex flex-col gap-1">
                <div class="flex justify-between">
                  <span class="text-muted text-sm">Name</span>
                  <span class="text-sm font-medium">{{ form.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted text-sm">System</span>
                  <span class="text-sm font-medium">{{
                    systems.find(s => s.id === form.system_type)?.title
                  }}</span>
                </div>
              </div>
            </div>

            <USeparator />

            <!-- Config -->
            <div class="flex flex-col gap-4">
              <p class="text-muted text-sm font-medium uppercase">Configuration</p>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium">Allow Spectators</p>
                  <p class="text-muted text-xs">Let others join as observers</p>
                </div>
                <USwitch v-model="form.config.allow_spectators" />
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium">Theme</p>
                  <p class="text-muted text-xs">Visual style for the session</p>
                </div>
                <USelect
                  v-model="form.config.theme"
                  :items="[
                    { label: 'Default', value: 'default' },
                    { label: 'Moss Green', value: 'moss-green' },
                    { label: 'Slate', value: 'slate' },
                    { label: 'Abyss', value: 'abyss' }
                  ]"
                />
              </div>
            </div>

            <UButton
              class="w-full justify-center"
              size="xl"
              @click="handleCreateSession(form)"
            >
              Create Session
            </UButton>
          </div>
        </template>
      </UStepper>
    </UPageBody>
  </UPage>
</template>
