<script setup lang="ts">
const { t } = useI18n()
const open = ref(false)

const form = reactive({
  type: 'bug',
  title: '',
  message: ''
})

const getGitHubIssueUrl = (data: { title: string, body: string, label: string }) => {
  const repo = 'hundrog/dadoverse' // Ej: 'owner/dadoverso'
  const base = `https://github.com/${repo}/issues/new`

  const params = new URLSearchParams({
    title: data.title,
    body: data.body,
    labels: data.label
  })

  return `${base}?${params.toString()}`
}

const sendToGitHub = () => {
  const body = `
**Tipo:** ${form.type.toUpperCase()}
**Mensaje:** ${form.message}

---
*Enviado desde Dadoverso App*
  `.trim()

  const url = getGitHubIssueUrl({
    title: `[${form.type.toUpperCase()}] ${form.title}`,
    body,
    label: form.type === 'bug' ? 'bug' : 'kudos'
  })

  // Abrir en nueva pestaña
  window.open(url, '_blank')
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
    <ULink to="#">{{ t('app.footerFeedback') }}</ULink>

    <template #body>
      <UForm
        :state="form"
        class="flex flex-col space-y-6"
        @submit="sendToGitHub"
      >
        <UFormField :label="t('feedback.formType')">
          <USelectMenu
            v-model="form.type"
            :options="['bug', 'kudo']"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('feedback.formTitle')">
          <UInput
            v-model="form.title"
            placeholder="Ej: Error al tirar dados de Hope"
            class="w-full"
          />
        </UFormField>

        <UFormField :label="t('feedback.formMessage')">
          <UTextarea
            v-model="form.message"
            autoresize
            placeholder="Cuéntame más..."
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          color="neutral"
        >
          {{ t('feedback.formSubmit') }}
          <template #trailing>
            <UIcon name="i-lucide-external-link" />
          </template>
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>
