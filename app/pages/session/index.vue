<script setup lang="ts"></script>

<template>
  <UPage>
    <UPageBody>
      <p class="text-lg font-bold uppercase">Find a Session</p>
      <UInput size="xl" placeholder="The Great Adventure" class="w-full" />
      <div class="flex flex-col gap-4">
        <UButton class="w-full justify-center md:w-auto">
          Find Session
        </UButton>
        <USeparator label="Or" />
        <UButton class="w-full justify-center md:w-auto" to="/session/new">
          Create Session
        </UButton>
      </div>
    </UPageBody>
  </UPage>
</template>
