<script setup lang="ts">
const systems = useDiceSystems()
const sessionStore = useSessionStore()

// Estado para las sesiones
const { pending } = await useAsyncData('user-sessions', () => sessionStore.fetchUserSessions().then(() => true))

const handleDeleteSession = async (session: any) => {
  if (confirm('¿Estás seguro de que quieres borrar esta sesión?')) {
    await sessionStore.deleteSession(session.id)
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const systemName = (id: string) => systems.value.find(s => s.id === id)?.title
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
      <USkeleton v-for="i in 3" :key="i" class="h-20 w-full" />
    </div>

    <div v-else-if="sessionStore.userSessions?.length" class="grid gap-4">
      <UCard
        v-for="session in sessionStore.userSessions"
        :key="session.id"
        class="hover:border-primary-500/50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <h3 class="font-bold text-white text-lg">{{ session.name || 'Sesión sin nombre' }}</h3>
            <UBadge variant="outline" color="secondary" :label="systemName(session.system_type)" />
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

          <div class="flex flex-col gap-2">
            <UButton
              :to="`/session/${session.slug}`"
              variant="soft"
              color="primary"
              icon="i-lucide-play"
            >
              Entrar
            </UButton>

            <!-- Botón de ajustes de la sesión -->
            <UButton
              variant="outline"
              color="error"
              label="Delete"
              icon="i-lucide-trash"
              @click="handleDeleteSession(session)"
            />
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
