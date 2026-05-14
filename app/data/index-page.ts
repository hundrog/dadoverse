/** Landing copy previously loaded from Content (`content/index.yml`). */
export const indexPage = {
  seo: {
    title: 'Dadoverse',
    description:
      ''
  },
  title: 'Menos cálculos.\nMás historia.',
  description:
    'Lanza dados, suma bonificadores y gestiona modificadores en segundos. Invita a tus amigos y redescubre la forma más pura de jugar rol sin que las matemáticas interrumpan el flujo.',
  hero: {
    headline: 'v1.0 DualityDice',
    links: [
      { label: 'Crear sesión', color: 'primary' as const, size: 'xl' as const, to: '/session/new' },
      { label: 'Unirse a partida', size: 'xl' as const, color: 'neutral' as const, variant: 'soft' as const, to: '/session' }
    ]
  },
  features: {
    headline: 'Herramientas',
    title: 'Toda la mesa, un solo plano.',
    description:
      'Olvídate de las pestañas infinitas y las calculadoras externas. Conecta tus dados, sistemas y narrativa en una sola interfaz reactiva.',
    items: [
      {
        icon: 'i-lucide-dices', // Icono de dados clásico
        title: 'Física de Dados 3D',
        description:
          'Dados con físicas realistas integrados. Tira, suma y obtén resultados instantáneos sincronizados con toda tu mesa en tiempo real.'
      },
      {
        icon: 'i-lucide-cpu', // Para representar el motor de sistemas
        title: 'Motor Multi-Sistema',
        description:
          'Soporte nativo para Daggerheart, Year Zero, Fabula Ultima y más. La interfaz se adapta a las reglas de tu juego preferido.'
      },
      {
        icon: 'i-lucide-users', // Para el enfoque colaborativo
        title: 'Sesiones Compartidas',
        description:
          'Crea una sala y comparte el enlace. Sin registros complicados para tus jugadores: entrar y rodar es cuestión de segundos.'
      },
      {
        icon: 'i-lucide-history', // Historial de tiradas
        title: 'Log de Resultados',
        description:
          'Historial persistente de todas las tiradas de la sesión. Quién tiró, qué sacó y cuál fue el resultado narrativo, siempre a la vista.'
      },
      {
        icon: 'i-lucide-shield-check', // Seguridad y privacidad
        title: 'Privacidad Total',
        description:
          'Tus datos son tuyos. Controlamos la seguridad mediante Supabase y Cloudflare, asegurando que tus campañas estén siempre protegidas.'
      },
      {
        icon: 'i-lucide-code-2', // Referencia a Open Source
        title: 'Espíritu Open Source',
        description:
          'Construido por y para la comunidad. Dadoverso es una herramienta abierta, transparente y en constante evolución junto a los jugadores.'
      }
    ]
  },
  cta: {
    title: '¿Listo para lanzar los dados?',
    description: 'La forma más rápida de gestionar tus tiradas en Daggerheart, Year Zero Engine y más.',
    links: [
      { label: 'Crear sesión', color: 'primary' as const, size: 'xl' as const, to: '/session/new' },
      { label: 'Unirse a partida', size: 'xl' as const, color: 'neutral' as const, variant: 'soft' as const, to: '/session' }
    ]
  }
}
