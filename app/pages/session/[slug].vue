<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const items: TabsItem[] = [
  {
    label: "Roll",
    icon: "i-lucide-dices",
  },
  {
    label: "System",
    icon: "i-lucide-settings-2",
    component: resolveComponent('SystemGrid'),
  },
  {
    label: "History",
    icon: "i-lucide-clock-fading",
  },
];
const route = useRoute();
</script>
<template>
  <UPage>
    <UPageBody>
      <p class="text-lg font-bold uppercase">{{ route.params.slug }}</p>
      <UTabs :items="items" class="w-full">
        <template #content="{ item }">
          <component :is="item.component" v-if="item.component" />
        </template>
      </UTabs>
    </UPageBody>
  </UPage>
</template>
