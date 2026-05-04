<script setup lang="ts">
const diceStore = useDiceStore();
const messages = ref<any[]>([]);

onMounted(async ()=> {
  await diceStore.getSessionRolls();

  messages.value = diceStore.rolls.map((roll) => {
    return {
      id: roll.id,
      user_name: roll.user_name,
      interpreted: roll.raw_result.interpreted
    }
  })
})
</script>

<template>
  <UScrollArea class="h-64">
    <div v-for="msg in messages" :key="msg.id" class="my-1 p-4 rounded-xl bg-accented">
      {{ msg.user_name }} rolled {{ msg.interpreted.total }} {{ msg.interpreted.outcome}}
    </div>
  </UScrollArea>
</template>
