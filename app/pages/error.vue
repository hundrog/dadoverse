<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UError
    :error="{
      statusCode: 404,
      statusMessage: t('errorPage.statusMessage'),
      message: t('errorPage.message')
    }"
  />
</template>
