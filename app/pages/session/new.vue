<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'
import { breakpointsTailwind } from '@vueuse/core'
import { z, ZodObject } from 'zod'

const sessionStore = useSessionStore()
const { t } = useI18n()
const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greaterOrEqual('md')
const selected = ref<number | null>(null)
const usernameCookie = useCookie('pc_name')
const formRef = ref()
const currentStep = ref(0)
const stepper = useTemplateRef('stepper')

const form = reactive({
  username: usernameCookie.value || '', // Pre-cargar si existe
  name: sessionStore.name ?? '',
  system_type: sessionStore.system_type as DiceSystem,
  config: { ...sessionStore.config }
})

const items: StepperItem[] = [
  {
    slot: 'name' as const,
    title: t('session.new.steps.name'),
    icon: 'i-lucide-users'
  },
  {
    slot: 'system' as const,
    title: t('session.new.steps.system'),
    icon: 'i-lucide-settings-2'
  },
  {
    slot: 'create' as const,
    title: t('session.new.steps.create'),
    icon: 'i-lucide-check'
  }
]

// Paso 1: Solo el nombre de la sesión
const step1Schema = z.object({
  name: z.string().min(1, t('session.new.validation.nameRequired'))
})

// Paso 2: Solo el sistema
const step2Schema = z.object({
  system_type: z.string().min(1, t('session.new.validation.systemRequired'))
})

// Paso 3: Lo que falta (Username y Config)
const step3Schema = z.object({
  username: z.string().min(1, t('session.new.validation.displayNameRequired')),
  config: z.object({
    allow_spectators: z.boolean()
  })
})

const schemas = [step1Schema, step2Schema, step3Schema]

const systems = ref([
  {
    id: 'duality',
    title: t('session.new.systems.duality.title'),
    description: t('session.new.systems.duality.description'),
    icon: 'i-lucide-dices'
  },
  {
    id: 'yze',
    title: t('session.new.systems.yze.title'),
    description: t('session.new.systems.yze.description'),
    icon: 'i-lucide-dices',
  },
  {
    id: 'step',
    title: t('session.new.systems.step.title'),
    description: t('session.new.systems.step.description'),
    icon: 'i-lucide-dices'
  },
  {
    id: '2d20',
    title: t('session.new.systems.modiphius2d20.title'),
    description: t('session.new.systems.modiphius2d20.description'),
    icon: 'i-lucide-dices'
  }
])

function selectSystem(index: number, id: string) {
  if (index !== 0) return
  selected.value = index
  form.system_type = id as DiceSystem
}

async function handleCreateSession(form: SessionInsert) {
  const currentSchema = schemas[currentStep.value] as ZodObject<any>
  const result = await currentSchema.safeParseAsync(form)
  console.log(result)

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
  console.log(result)

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
      <p class="text-lg font-bold uppercase">{{ t('session.new.title') }}</p>
      <UForm
        ref="formRef"
        :state="form"
        :schema="schemas[currentStep]"
        @submit="handleCreateSession(form)"
      >

        <UStepper
          ref="stepper"
          v-model="currentStep"
          :items="items"
          class="w-full"
        >
          <template #name>
            <UFormField :label="t('session.new.steps.name')" name="name">
              <UInput
                v-model="form.name"
                size="xl"
                :placeholder="t('session.new.namePlaceholder')"
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
                  :variant="system.id === 'duality' ? 'outline' : 'disabled'"
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
                <p class="text-muted text-sm font-medium uppercase">{{ t('session.new.review') }}</p>
                <div class="flex flex-col gap-1">
                  <div class="flex justify-between">
                    <span class="text-muted text-sm">{{ t('session.new.steps.name') }}</span>
                    <span class="text-sm font-medium">{{ form.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-muted text-sm">{{ t('session.new.steps.system') }}</span>
                    <span class="text-sm font-medium">{{
                      systems.find(s => s.id === form.system_type)?.title
                    }}</span>
                  </div>
                </div>
              </div>

              <USeparator />

              <!-- Config -->
              <div class="flex flex-col gap-4">
                <p class="text-muted text-sm font-medium uppercase">{{ t('session.new.configuration') }}</p>

                <div class="flex flex-col gap-2">
                  <div>
                    <p class="text-sm font-medium">{{ t('session.new.displayName') }}</p>
                    <p class="text-muted text-xs">{{ t('session.new.displayNameHelp') }}</p>
                  </div>
                  <UFormField name="username">
                    <UInput
                      v-model="form.username"
                      :placeholder="t('session.new.displayNamePlaceholder')"
                      size="xl"
                      class="w-full"
                    />
                  </UFormField>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium">{{ t('session.new.allowSpectators') }}</p>
                    <p class="text-muted text-xs">{{ t('session.new.allowSpectatorsHelp') }}</p>
                  </div>
                  <USwitch v-model="form.config.allow_spectators" />
                </div>
              </div>

              <UButton
                class="w-full justify-center"
                size="xl"
                type="submit"
              >
                {{ t('session.new.createSession') }}
              </UButton>
            </div>
          </template>
        </UStepper>
        <div class="mt-4 my-4 flex justify-between gap-2">
          <UButton
            leading-icon="i-lucide-arrow-left"
            :disabled="!stepper?.hasPrev"
            @click="stepper?.prev()"
          >
            {{ t('session.new.prev') }}
          </UButton>

          <UButton
            trailing-icon="i-lucide-arrow-right"
            :disabled="!stepper?.hasNext"
            @click="nextStep()"
          >
            {{ t('session.new.next') }}
          </UButton>
        </div>
      </UForm>
    </UPageBody>
  </UPage>
</template>
