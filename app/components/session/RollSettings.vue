<script setup lang="ts">
import type { RollModifier } from "~/types/dice.types";

const rollType = ref<RollModifier>("none");
const value = ref(0);
</script>

<template>
  <UPageCard>
    <template #header>
      <span class="text-bold">Rolling Duality Dice</span>
    </template>

    <div class="flex flex-col justify-center text-center gap-4">
      <SessionThreeStateToggle v-model="rollType" />
      Modifier: {{ value > 0 ? "+" + value : value }}
      <USlider
        v-model="value"
        :min="-10"
        :max="10"
        :default-value="0"
        tooltip
      />
    </div>
    <template #footer>
    </template>
  </UPageCard>
</template>
