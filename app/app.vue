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
        <ULocaleSelect
          v-model="localeModel"
          :locales="[en, es]"
        />
        <LayoutUserMenu />
      </template>
    </UHeader>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UFooter
      :ui="{
        left: 'flex-col space-y-1',
        right: 'flex-col space-y-1',
        center: 'flex-col space-y-1'
      }"
    >
      <template #left>
        <p class="text-muted text-sm">
          {{ t('app.footerBuiltWith') }} • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #default>
        <UButton to="https://github.com/hundrog/dadoverse" target="_blank" variant="ghost" icon="i-simple-icons-github">Github</UButton>
        <UButton to="https://buymeacoffee.com/the.blue.pixel" target="_blank" variant="ghost" icon="i-simple-icons-buymeacoffee">BuyMeACoffee</UButton>
      </template>

      <template #right>
        <AppFeedback />
        <ULink to="/about/terms">{{ t('app.footerTerms') }}</ULink>
        <ULink to="/about/privacy">{{ t('app.footerPrivacy') }}</ULink>
      </template>
    </UFooter>
  </UApp>
</template>
