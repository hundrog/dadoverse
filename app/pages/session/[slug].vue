<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";
const dices = useDiceLogic()

const items: TabsItem[] = [
  {
    slot: 'roll' as const,
    label: "Roll",
    icon: "i-lucide-dices",
  },
  {
    slot: 'history' as const,
    label: "History",
    icon: "i-lucide-clock-fading",
  },
];
const route = useRoute();

const getResult = () => {
  const result = dices.parseRoll('duality', [10, 4, 5], { modifier: 'advantage' });
  alert(JSON.stringify(result));

}
</script>
<template>
  <UPage>
    <UPageBody>
      <p class="text-lg font-bold uppercase">{{ route.params.slug }}</p>
      <UTabs :items="items" class="w-full">
        <template #roll>
          <img src="https://placehold.co/600x400/transparent/00F?text=Hello+World" />
          <div class="flex mt-4">
            <UButton class="w-full justify-center" size="xl" @click="getResult">
              Roll Dice
            </UButton>
          </div>
        </template>
      </UTabs>
    </UPageBody>
  </UPage>
</template>
