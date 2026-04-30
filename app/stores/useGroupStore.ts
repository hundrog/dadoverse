export const useGroupStore = defineStore('group', () => {
  // State
  const isGroupRollActive = ref(false)
  const contributions = ref<{ user: string, value: number }[]>([])
  const groupGoal = ref<number | null>(null)

  // Getters
  const average = computed(() => {
    if (!contributions.value.length) return 0
    const sum = contributions.value.reduce((a, b) => a + b.value, 0)
    return (sum / contributions.value.length).toFixed(2)
  })

  const highest = computed(() => Math.max(...contributions.value.map(c => c.value), 0))
  const lowest = computed(() => Math.min(...contributions.value.map(c => c.value), 100))

  // Actions
  function startGroupRoll(goal?: number) {
    isGroupRollActive.value = true
    contributions.value = []
    groupGoal.value = goal || null
  }

  function addContribution(user: string, value: number) {
    contributions.value.push({ user, value })
  }

  return {
    isGroupRollActive,
    contributions,
    groupGoal,
    average,
    highest,
    lowest,
    startGroupRoll,
    addContribution
  }
})
