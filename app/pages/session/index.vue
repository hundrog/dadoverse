<script setup lang="ts">
const sessionSlug = ref('')
const name = ref('')

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
        Join a Session
      </p>
      <UInput
        v-model="sessionSlug"
        size="xl"
        placeholder="the-great-adventure-9531"
        class="w-full"
      />
      As
      <UInput
        v-model="name"
        size="xl"
        placeholder="Korintya"
        class="w-full"
        @keyup.enter="goToSession(sessionSlug)"
      />
      <div class="flex flex-col gap-4">
        <UButton
          class="w-full justify-center md:w-auto"
          size="xl"
          @click="goToSession(sessionSlug)"
        >
          Find Session
        </UButton>
        <USeparator label="Or" />
        <UButton
          class="w-full justify-center md:w-auto"
          size="xl"
          to="/session/new"
        >
          Create Session
        </UButton>
      </div>
    </UPageBody>
  </UPage>
</template>
