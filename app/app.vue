<script setup lang="ts">
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "/favicon.ico" }],
  htmlAttrs: {
    lang: "en",
  },
});

const title = "Nuxt Starter Template";
const description =
  "A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours.";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: "https://ui.nuxt.com/assets/templates/nuxt/starter-light.png",
  twitterCard: "summary_large_image",
});

import type { NavigationMenuItem } from "@nuxt/ui";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Docs",
    // to: '/docs/getting-started',
    active: route.path.startsWith("/docs/getting-started"),
  },
  {
    label: "Components",
    // to: '/docs/components',
    active: route.path.startsWith("/docs/components"),
  },
  {
    label: "Figma",
    to: "https://go.nuxt.com/figma-ui",
    target: "_blank",
  },
  {
    label: "Releases",
    to: "https://github.com/nuxt/ui/releases",
    target: "_blank",
  },
]);

const toast = useToast();

function handleError(error: Error, clearError: () => void) {
  toast.add({
    title: "Something went wrong",
    description: error.message,
    color: "error",
    icon: "i-lucide-alert-circle",
    duration: 5000,
    'onUpdate:open': (open: boolean) => {
      if (!open) clearError()
    }
  });
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
      <UHeader>
        <template #title>
          <NuxtLink to="/"> Roll & Roll </NuxtLink>
        </template>

        <UNavigationMenu :items="items" />

        <template #body>
          <UNavigationMenu :items="items" orientation="vertical" />
        </template>

        <template #right>
          <UColorModeButton />

          <UButton
            to="https://github.com/nuxt-ui-templates/starter"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
          />
        </template>
      </UHeader>

      <UMain class="px-4 max-w-xl mx-auto">
        <NuxtPage />
      </UMain>

      <USeparator icon="i-simple-icons-nuxtdotjs" />

      <UFooter>
        <template #left>
          <p class="text-sm text-muted">
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
