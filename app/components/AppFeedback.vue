<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { t } = useI18n()
const supabase = useSupabaseClient()
const toast = useToast()
const open = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const form = reactive({
  details: '',
  email: '',
  message: ''
})

const schema = z.object({
  details: z.string().optional(),
  email: z.string().email(t('auth.invalidEmail')).optional().or(z.literal('')),
  message: z.string().min(1, t('feedback.fieldRequired')).trim()
})

type Schema = z.output<typeof schema>

const handleSubmit = async (event: FormSubmitEvent<Schema>) => {
  loading.value = true
  error.value = null

  const payload = {
    contact_email: event.data.email,
    description: event.data.message,
    steps_to_reproduce: event.data.details,
    app_version: '1.3.1',
    device_info: navigator.userAgent
  }

  // Insert a Supabase
  const { error: dbError } = await supabase
    .from('bug_reports')
    .insert(payload)

  loading.value = false

  if (dbError) {
    throw new Error(dbError.message)
  }

  toast.add({ title: t('feedback.formSubmitted'), icon: 'i-lucide-mail-check' })

  // Reset y cierra
  form.details = ''
  form.email = ''
  form.message = ''
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="t('feedback.title')"
    :description="t('feedback.description')"
    :ui="{ footer: 'justify-end' }"
  >
    <ULink
      to="#"
      class="cursor-pointer"
    >
      {{ t('app.footerFeedback') }}
    </ULink>

    <template #body>
      <UForm
        :state="form"
        :schema="schema"
        class="flex flex-col space-y-6"
        @submit="handleSubmit"
      >
        <UFormField :label="t('feedback.formEmail')" name="email">
          <UInput
            v-model="form.email"
            placeholder="email@domain.com"
            type="email"
            class="w-full"
          />
        </UFormField>
        <UFormField required :label="t('feedback.formMessage')" name="message">
          <UTextarea
            v-model="form.message"
            autoresize
            :placeholder="t('feedback.messagePlaceholder')"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('feedback.formDetails')" name="details">
          <UTextarea
            v-model="form.details"
            autoresize
            :placeholder="t('feedback.detailsPlaceholder')"
            class="w-full"
          />
        </UFormField>
        <UAlert
          v-if="error"
          color="error"
          :description="error"
        />

        <UButton
          type="submit"
          block
          color="neutral"
          :loading="loading"
        >
          {{ t('feedback.formSubmit') }}
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
