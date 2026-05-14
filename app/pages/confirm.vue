<script setup lang="ts">
import { safeAuthRedirectPath } from '~/utils/safeAuthRedirectPath'

const route = useRoute()
const user = useSupabaseUser()
const redirected = ref(false)

watch(
  user,
  (u) => {
    if (!u || redirected.value) return
    redirected.value = true

    const q = route.query.redirectTo || route.query.redirect
    const raw = Array.isArray(q) ? q[0] : q
    let targetPath = safeAuthRedirectPath(raw)

    if (!targetPath) {
      const redirectCookie = useCookie('supabase-redirect-path')
      targetPath = safeAuthRedirectPath(redirectCookie.value)

      redirectCookie.value = null
    }

    // 3. Redirigimos
    if (targetPath) {
      return navigateTo(targetPath)
    }

    return navigateTo('/profile') // Destino por defecto
  },
  { immediate: true }
)
</script>

<template>
  <LayoutSpinner />
</template>
