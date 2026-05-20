export const useDiceSystems = () => {
  const { t } = useI18n()

  return computed(() => [
    {
      id: 'duality',
      disabled: false,
      title: t('session.new.systems.duality.title'),
      description: t('session.new.systems.duality.description'),
      icon: 'i-lucide-dices'
    },
    {
      id: 'step',
      disabled: false,
      title: t('session.new.systems.step.title'),
      description: t('session.new.systems.step.description'),
      icon: 'i-lucide-dices'
    },
    {
      id: '2d20',
      disabled: false,
      title: t('session.new.systems.modiphius2d20.title'),
      description: t('session.new.systems.modiphius2d20.description'),
      icon: 'i-lucide-dices'
    },
    {
      id: 'yze',
      disabled: true,
      title: t('session.new.systems.yze.title'),
      description: t('session.new.systems.yze.description'),
      icon: 'i-lucide-dices'
    }
  ])
}
