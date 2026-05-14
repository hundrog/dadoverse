<script setup lang="ts">
const toast = useToast()
const { t } = useI18n()

function handleError(error: Error, clearError: () => void) {
  toast.add({
    'title': t('app.errorToastTitle'),
    'description': error.message,
    'color': 'error',
    'icon': 'i-lucide-alert-circle',
    'duration': 5000,
    'onUpdate:open': (open: boolean) => {
      if (!open) clearError()
    }
  })
}
</script>

<template>
  <UMain class="mx-auto w-full max-w-screen-2xl px-4">
    <NuxtErrorBoundary>
      <template #error="{ error, clearError }">
        <LayoutErrorToastTrigger
          :error="error"
          :on-mount="() => handleError(error, clearError)"
        />
      </template>
      <slot />
    </NuxtErrorBoundary>
  </UMain>
</template>
