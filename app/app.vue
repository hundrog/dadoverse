<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Dadoverse'
const description
  = 'A TTRPG dice roller for complex dice systems'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png',
  twitterCard: 'summary_large_image'
})
const toast = useToast()

function handleError(error: Error, clearError: () => void) {
  toast.add({
    'title': 'Something went wrong',
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
    <NuxtErrorBoundary>
      <template #error="{ error, clearError }">
        <!-- Componente puente que dispara el toast como side effect -->
        <LayoutErrorToastTrigger
          :error="error"
          :on-mount="() => handleError(error, clearError)"
        />
      </template>
      <UHeader :toggle="false">
        <template #title>
          Roll & Roll
        </template>

        <template #right>
          <UColorModeButton />
          <LayoutUserMenu />
        </template>
      </UHeader>

      <UMain class="mx-auto max-w-xl px-4">
        <NuxtPage />
      </UMain>

      <USeparator icon="i-simple-icons-nuxtdotjs" />

      <UFooter>
        <template #left>
          <p class="text-muted text-sm">
            Built with Nuxt UI • © {{ new Date().getFullYear() }}
          </p>
        </template>

        <template #right>
          <UButton
            to="https://github.com/nuxt-ui-templates/starter"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UFooter>
    </NuxtErrorBoundary>
  </UApp>
</template>
