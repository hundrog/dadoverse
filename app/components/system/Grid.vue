<script setup lang="ts">
const cards = ref([
  {
    id: 'duality',
    title: 'Daggerheart Duality Dice',
    description: 'The Duality Dice system in the Daggerheart RPG uses two d12s (Hope and Fear) rolled together to determine success and narrative tone.',
    icon: 'i-lucide-dices',
  },
  {
    id: 'yze',
    title: 'Year Zero Engine',
    description: 'In the dice pool system, every action is resolved by rolling a bunch of d6 dice, only the results of 6 count as successes, and the number of successes determines the outcome of the action.',
    icon: 'i-lucide-dices',
  },
  {
    id: 'step',
    title: 'Step Dice',
    description: 'The step-dice variant uses different-sized dice (d6, d8, d10…), giving a gentler difficulty curve and fewer “push” penalties.',
    icon: 'i-lucide-dices',
  },
  {
    id: 'modiphius',
    title: 'Modiphius 2D20',
    description: 'The Modiphius 2D20 system uses two d20 dice to determine the outcome of actions, with the difference between the dice determining the degree of success.',
    icon: 'i-lucide-dices',
  }
])

const selected = ref<number | null>(null)

const selectCard = (id: string) => {
  const index = cards.value.findIndex(card => card.id === id)
  selected.value = index === selected.value ? null : index
}
</script>

<template>
  <UPageGrid>
    <UPageCard
      v-for="(card, index) in cards"
      :key="index"
      v-bind="card"
      :highlight="selected === index"
      highlight-color="primary"
      spotlight
      spotlight-color="secondary"
      @click="selectCard(card.id)"
    />
  </UPageGrid>
</template>

