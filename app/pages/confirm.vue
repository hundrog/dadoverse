<script setup lang="ts">
import { safeAuthRedirectPath } from '~/utils/safeAuthRedirectPath'
onMounted(() => {
  console.log("URL Completa en Confirm:", window.location.href)
  console.log("Query Params detectados:", route.query)
})

/** Cookie-based redirect (same-origin, no auth-route loops). */
function postAuthPathFromCookie(stored: string | null): string {
  if (!stored) return '/'
  return safeAuthRedirectPath(stored) ?? '/'
}

const route = useRoute()
const user = useSupabaseUser()
const redirected = ref(false)

watch(
  user,
  (u) => {
    if (!u || redirected.value) return
    redirected.value = true

    // 1. Intentamos leer de la URL (por si acaso)
    const q = route.query.redirectTo || route.query.redirect
    const raw = Array.isArray(q) ? q[0] : q
    let targetPath = safeAuthRedirectPath(raw)

    // 2. Si la URL está limpia (que es tu caso), leemos la COOKIE
    if (!targetPath) {
      const redirectCookie = useCookie('supabase-redirect-path')
      targetPath = safeAuthRedirectPath(redirectCookie.value)

      // Limpiamos la cookie una vez usada
      redirectCookie.value = null
    }

    console.log("Destino final encontrado:", targetPath)

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
