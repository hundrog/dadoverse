<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Estado para las sesiones
const { data: sessions, pending } = await useAsyncData('user-sessions', async () => {
  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('owner_id', user.value?.sub as string) // Filtramos por el creador
    .order('created_at', { ascending: false })
  return data
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}
</script>

<template>
  <UContainer class="py-8">
    <header class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-display text-white">Mis Sesiones</h1>
        <p class="text-on-surface-dim">Gestiona tus salas de Dadoverso</p>
      </div>
      <UButton to="/session/new" icon="i-lucide-plus" color="primary">
        Nueva Sesión
      </UButton>
    </header>

    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-20 w-full" v-for="i in 3" :key="i" />
    </div>

    <div v-else-if="sessions?.length" class="grid gap-4">
      <UCard
        v-for="session in sessions"
        :key="session.id"
        class="hover:border-primary-500/50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="font-bold text-white text-lg">{{ session.name || 'Sesión sin nombre' }}</h3>
            <div class="flex gap-4 text-sm text-on-surface-dim">
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-calendar" />
                {{ formatDate(session.created_at || '') }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-lucide-hash" />
                {{ session.slug }}
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <UButton
              :to="`/session/${session.slug}`"
              variant="soft"
              color="primary"
              icon="i-lucide-play"
            >
              Entrar
            </UButton>

            <!-- Botón de ajustes de la sesión -->
            <!-- <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-cog"
            /> -->
          </div>
        </div>
      </UCard>
    </div>

    <UCard v-else class="text-center py-12">
      <p class="text-on-surface-dim mb-4">Aún no has creado ninguna sesión.</p>
      <UButton to="/session/new" variant="outline">Crear mi primera sala</UButton>
    </UCard>
  </UContainer>
</template>
