<script setup lang="ts">
import type { StepperItem } from "@nuxt/ui";

const items: StepperItem[] = [
  {
    slot: 'name' as const,
    title: "Name",
    icon: "i-lucide-users",
  },
  {
    slot: 'system' as const,
    title: "System",
    icon: "i-lucide-settings-2",
    component: resolveComponent("SystemGrid"),
  },
  {
    slot: 'create' as const,
    title: "Create",
    icon: "i-lucide-check",
  },
];
</script>

<template>
  <UPage>
    <UPageBody>
      <p class="text-lg font-bold uppercase">New Session</p>
      <UStepper :items="items" class="w-full">
        <template #name>
          <UInput size="xl" placeholder="The Great Adventure" class="w-full"/>
        </template>
        <template #system>
          <SystemGrid />
        </template>
        <template #create>
          <p>Review your session details before creating it.</p>
          <div class="flex mt-4">
            <UButton class="w-full justify-center md:w-auto">
              Create Session
            </UButton>
          </div>
        </template>
      </UStepper>

    </UPageBody>
  </UPage>
</template>
