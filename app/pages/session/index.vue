<script setup lang="ts">
const sessionSlug = ref("");

const goToSession = (slug: string) => {
  if (!slug) return;

  navigateTo(`/session/${slug}`);
};
</script>

<template>
  <UPage>
    <UPageBody>
      <p class="text-lg font-bold uppercase">Find a Session</p>
      <UInput
        size="xl"
        placeholder="The Great Adventure"
        class="w-full"
        v-model="sessionSlug"
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
        <UButton class="w-full justify-center md:w-auto" size="xl" to="/session/new">
          Create Session
        </UButton>
      </div>
    </UPageBody>
  </UPage>
</template>
