<script setup lang="ts">
/** Only same-origin app paths; blocks open redirects and auth-route loops. */
function postAuthPath(stored: string | null): string {
  if (!stored) return '/'
  const s = stored.trim()
  if (!s.startsWith('/') || s.startsWith('//')) return '/'
  const pathOnly = s.split('?')[0]?.split('#')[0] ?? ''
  if (pathOnly === '/login' || pathOnly === '/confirm') return '/'
  return s
}

const user = useSupabaseUser()
const redirected = ref(false)

watch(
  user,
  (u) => {
    if (!u || redirected.value) return
    redirected.value = true
    const stored = useSupabaseCookieRedirect().pluck()
    return navigateTo(postAuthPath(stored))
  },
  { immediate: true }
)
</script>

<template>
  <LayoutSpinner />
</template>
