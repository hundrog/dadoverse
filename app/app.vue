<script setup lang="ts">
import { en, es } from '@nuxt/ui/locale'

const { t, locale, setLocale } = useI18n()
const localeModel = computed({
  get: () => locale.value as 'en' | 'es',
  set: async (value: 'en' | 'es') => {
    await setLocale(value)
  }
})
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = t('app.name')
const description = t('app.tagline')

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/shared-picture.png',
  twitterCard: 'summary_large_image'
})
const toast = useToast()

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
  <NuxtLoadingIndicator />
  <UApp>
    <UHeader :toggle="false">
      <template #title>
        <img src="/favicon-32x32.png" class="size-6">
        {{ t('app.name') }}
      </template>

      <template #right>
        <UColorModeButton />
        <LayoutUserMenu />
      </template>
    </UHeader>

    <UMain class="mx-auto max-w-xl px-4">
      <NuxtErrorBoundary>
        <template #error="{ error, clearError }">
          <LayoutErrorToastTrigger
            :error="error"
            :on-mount="() => handleError(error, clearError)"
          />
        </template>
        <NuxtPage />
      </NuxtErrorBoundary>
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">
          {{ t('app.footerBuiltWith') }} • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <ULocaleSelect
          v-model="localeModel"
          :locales="[en, es]"
        />
      </template>
    </UFooter>
  </UApp>
</template>
