<!-- app/components/session/ThreeStateToggle.vue -->
<template>
  <div class="flex items-center justify-center gap-3">
    <span
      class="text-sm"
      :class="state === 'disadvantage' && !disabled ? 'text-error font-semibold' : 'text-muted'"
    >
      {{ t('session.room.disadvantage') }}
    </span>

    <button
      class="focus-visible:ring-primary relative h-8 w-16 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="disabled"
      :class="{
        'bg-error': state === 'disadvantage' && !disabled,
        'bg-muted': state === 'none' || disabled,
        'bg-success': state === 'advantage' && !disabled,
        'cursor-pointer': !disabled
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
      :class="state === 'advantage' && !disabled ? 'text-success font-semibold' : 'text-muted'"
    >
      {{ t('session.room.advantage') }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { RollModifier } from '~/types/dice.types'

const { t } = useI18n()

const props = defineProps<{
  disabled?: boolean
}>()

const states: RollModifier[] = ['disadvantage', 'none', 'advantage']

const state = defineModel<RollModifier>({ default: 'none' })

function cycle() {
  if (props.disabled) return
  const idx = states.indexOf(state.value)
  state.value = states[(idx + 1) % states.length] as RollModifier
}
</script>
