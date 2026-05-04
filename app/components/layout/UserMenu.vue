<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const items = ref<DropdownMenuItem[]>([
  {
    label: 'LogOut',
    icon: 'i-lucide-log-out',
    onSelect(e: Event) {
      e.preventDefault()
      logout()
    }
  }
])

const logout = async () => {
  await supabase.auth.signOut()

  return navigateTo('/login')
}
</script>

<template>
  <UDropdownMenu
    v-if="user"
    :items="items"
    :content="{
      align: 'start',
      side: 'bottom',
      sideOffset: 8
    }"
    :ui="{
      content: 'w-48'
    }"
  >
    <img
      :src="`https://api.dicebear.com/7.x/avataaars-neutral/svg?seed=${user.sub}`"
      alt="avatar"
      class="size-7 rounded-full bg-neutral-200 dark:bg-neutral-950"
    >
  </UDropdownMenu>
</template>
