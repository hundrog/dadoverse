<!-- app/components/session/ThreeStateToggle.vue -->
<template>
  <div class="flex items-center justify-center gap-3">
    <span
      class="text-sm"
      :class="state === 'disadvantage' ? 'text-error font-semibold' : 'text-muted'"
    >
      Disadvantage
    </span>

    <button
      class="focus-visible:ring-primary relative h-8 w-16 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2"
      :class="{
        'bg-error': state === 'disadvantage',
        'bg-muted': state === 'none',
        'bg-success': state === 'advantage'
      }"
      @click="cycle"
    >
      <span
        class="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all duration-200"
        :class="{
          'left-1': state === 'disadvantage',
          'left-1/2 -translate-x-1/2': state === 'none',
          'left-[calc(100%-1.75rem)]': state === 'advantage'
        }"
      />
    </button>

    <span
      class="text-sm"
      :class="state === 'advantage' ? 'text-success font-semibold' : 'text-muted'"
    >
      Advantage
    </span>
  </div>
</template>

<script setup lang="ts">
import type { RollModifier } from '~/types/dice.types'

const states: RollModifier[] = ['disadvantage', 'none', 'advantage']

const state = defineModel<RollModifier>({ default: 'none' })

function cycle() {
  const idx = states.indexOf(state.value)
  state.value = states[(idx + 1) % states.length] as RollModifier
}
</script>
