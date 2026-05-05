<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import { breakpointsTailwind } from '@vueuse/core'
import { z, ZodObject } from 'zod'

const sessionStore = useSessionStore()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual('md')
const selected = ref<number | null>(null)
const usernameCookie = useCookie('pc_name')
const formRef = ref()
const currentStep = ref(0)
const stepper = useTemplateRef('stepper')

const form = reactive({
  username: usernameCookie.value || '', // Pre-cargar si existe
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

// Paso 1: Solo el nombre de la sesión
const step1Schema = z.object({
  name: z.string().min(1, 'Name is required')
})

// Paso 2: Solo el sistema
const step2Schema = z.object({
  system_type: z.string().min(1, 'System is required')
})

// Paso 3: Lo que falta (Username y Config)
const step3Schema = z.object({
  username: z.string().min(1, 'Display name is required'),
  config: z.object({
    allow_spectators: z.boolean()
  })
})

const schemas = [step1Schema, step2Schema, step3Schema]

const systems = ref([
  {
    id: 'duality',
    title: 'Daggerheart Duality Dice',
    description:
      'The Duality Dice system in the Daggerheart RPG uses two d12s (Hope and Fear) rolled together to determine success and narrative tone.',
    icon: 'i-lucide-dices'
  }
  // {
  //   id: 'yze',
  //   title: 'Year Zero Engine',
  //   description:
  //     'In the dice pool system, every action is resolved by rolling a bunch of d6 dice, only the results of 6 count as successes, and the number of successes determines the outcome of the action.',
  //   icon: 'i-lucide-dices'
  // },
  // {
  //   id: 'step',
  //   title: 'Step Dice',
  //   description:
  //     'The step-dice variant uses different-sized dice (d6, d8, d10…), giving a gentler difficulty curve and fewer “push” penalties.',
  //   icon: 'i-lucide-dices'
  // },
  // {
  //   id: '2d20',
  //   title: 'Modiphius 2D20',
  //   description:
  //     'The Modiphius 2D20 system uses two d20 dice to determine the outcome of actions, with the difference between the dice determining the degree of success.',
  //   icon: 'i-lucide-dices'
  // }
])

function selectSystem(index: number, id: string) {
  selected.value = index
  form.system_type = id as DiceSystem
}

async function handleCreateSession(form: SessionInsert) {
  const currentSchema = schemas[currentStep.value] as ZodObject<any>
  const result = await currentSchema.safeParseAsync(form)

  if (!result.success) {
    formRef.value.setErrors(
      result.error.issues.map(issue => ({
        message: issue.message,
        name: issue.path.join('.')
      }))
    )
    return
  }

  formRef.value.setErrors([])
  await sessionStore.createSession(form)
}

async function nextStep() {
  const currentSchema = schemas[currentStep.value] as ZodObject<any>
  const result = await currentSchema.safeParseAsync(form)

  if (!result.success) {
    formRef.value.setErrors(
      result.error.issues.map(issue => ({
        message: issue.message,
        name: issue.path.join('.') // 'name' no 'path'
      }))
    )
    return
  }

  formRef.value.setErrors([])
  currentStep.value++
}
</script>

<template>
  <UPage>
    <UPageBody>
      <p class="text-lg font-bold uppercase">New Session</p>
      <UForm
        ref="formRef"
        :state="form"
        :schema="schemas[currentStep]"
        @submit="handleCreateSession(form)"
      >
        <div class="mt-4 flex justify-between gap-2">
          <UButton
            leading-icon="i-lucide-arrow-left"
            :disabled="!stepper?.hasPrev"
            @click="stepper?.prev()"
          >
            Prev
          </UButton>

          <UButton
            trailing-icon="i-lucide-arrow-right"
            :disabled="!stepper?.hasNext"
            @click="nextStep()"
          >
            Next
          </UButton>
        </div>
        <UStepper
          ref="stepper"
          v-model="currentStep"
          :items="items"
          class="w-full"
        >
          <template #name>
            <UFormField label="Name" name="name">
              <UInput
                v-model="form.name"
                size="xl"
                placeholder="The Great Adventure"
                class="w-full"
              />
            </UFormField>
          </template>
          <template #system>
            <UFormField name="system_type">
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
            </UFormField>
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

                <div class="flex flex-col gap-2">
                  <div>
                    <p class="text-sm font-medium">Display name</p>
                    <p class="text-muted text-xs">The name your rolls will have (like GM)</p>
                  </div>
                  <UFormField name="username">
                    <UInput
                      v-model="form.username"
                      placeholder="Ej. Will el Sabio"
                      size="xl"
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium">Allow Spectators</p>
                    <p class="text-muted text-xs">Let others join as observers</p>
                  </div>
                  <USwitch v-model="form.config.allow_spectators" />
                </div>
              </div>

              <UButton
                class="w-full justify-center"
                size="xl"
                type="submit"
              >
                Create Session
              </UButton>
            </div>
          </template>
        </UStepper>
      </UForm>
    </UPageBody>
  </UPage>
</template>
