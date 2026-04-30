<!-- components/ErrorToastTrigger.vue -->
<script setup lang="ts">
const props = defineProps<{
  error: Error
  onMount: () => void
}>()

onMounted(() => props.onMount())
</script>

<template>
  <!-- slot vacío, solo dispara el side effect -->
</template>
