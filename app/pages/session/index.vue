<script setup lang="ts">
const sessionSlug = ref('')
const name = ref('')
const { t } = useI18n()

const sessionStore = useSessionStore()

const goToSession = async (slug: string) => {
  if (!slug.trim()) return

  if (name.value.trim()) {
    sessionStore.setCharacterName(name.value.trim())
  }

  await navigateTo(`/session/${slug}`)
}
</script>

<template>
  <UPage>
    <UPageBody>
      <p class="text-lg font-bold">
        {{ t('session.join.title') }}
      </p>
      <UInput
        v-model="sessionSlug"
        size="xl"
        :placeholder="t('session.join.slugPlaceholder')"
        class="w-full"
      />
      {{ t('session.join.as') }}
      <UInput
        v-model="name"
        size="xl"
        :placeholder="t('session.join.namePlaceholder')"
        class="w-full"
        @keyup.enter="goToSession(sessionSlug)"
      />
      <div class="flex flex-col gap-4">
        <UButton
          class="w-full justify-center md:w-auto"
          size="xl"
          @click="goToSession(sessionSlug)"
        >
          {{ t('session.join.find') }}
        </UButton>
        <USeparator :label="t('session.join.or')" />
        <UButton
          class="w-full justify-center md:w-auto"
          size="xl"
          to="/session/new"
        >
          {{ t('session.join.create') }}
        </UButton>
      </div>
    </UPageBody>
  </UPage>
</template>
