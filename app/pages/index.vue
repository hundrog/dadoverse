<script setup lang="ts">
const { t, locale } = useI18n()
definePageMeta({
  layout: 'landing',
  colorMode: 'dark'
})

const heroTitle = computed(() => {
  const [primary = '', ...secondaryParts] = t('landing.title').split('\n')

  return {
    primary,
    secondary: secondaryParts.join(' ').trim()
  }
})

const heroLinks = [
  { label: 'landing.hero.links.createSession', color: 'primary' as const, size: 'xl' as const, to: '/session/new' },
  { label: 'landing.hero.links.joinSession', size: 'xl' as const, color: 'neutral' as const, variant: 'soft' as const, to: '/session' }
]

const featureItems = [
  {
    icon: 'i-lucide-dices',
    title: 'landing.features.items.physicsTitle',
    description: 'landing.features.items.physicsDescription'
  },
  {
    icon: 'i-lucide-cpu',
    title: 'landing.features.items.engineTitle',
    description: 'landing.features.items.engineDescription'
  },
  {
    icon: 'i-lucide-users',
    title: 'landing.features.items.sessionsTitle',
    description: 'landing.features.items.sessionsDescription'
  },
  {
    icon: 'i-lucide-history',
    title: 'landing.features.items.logTitle',
    description: 'landing.features.items.logDescription'
  },
  {
    icon: 'i-lucide-shield-check',
    title: 'landing.features.items.privacyTitle',
    description: 'landing.features.items.privacyDescription'
  },
  {
    icon: 'i-lucide-code-2',
    title: 'landing.features.items.openSourceTitle',
    description: 'landing.features.items.openSourceDescription'
  }
]

function enterMotion(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay }
  }
}

function scrollMotion(delay: number = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    inViewOptions: { once: true, amount: 1 },
    transition: { duration: 0.6, delay }
  }
}

function staggerMotion(index: number = 0) {
  return {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    inViewOptions: { once: true, amount: 1 },
    transition: { duration: 0.6, delay: index * 0.08 }
  }
}
</script>

<template>
  <UPage>
    <!-- Hero -->
    <UPageHero
      :ui="{
        root: 'pb-24 sm:pb-32 scroll-mt-(--ui-header-height)',
        container: 'relative z-10 lg:py-32',
        wrapper: 'flex flex-col items-center',
        title: 'sm:text-6xl lg:text-7xl xl:text-[80px] tracking-tighter leading-[1.05]',
        description: 'mt-5 max-w-xl mx-auto text-base sm:text-lg leading-relaxed text-default',
        links: 'gap-3'
      }"
    >
      <template #top>
        <Motion v-bind="staggerMotion(0)">
          <HeroShaders class="absolute inset-x-0 top-0 h-full opacity-15" />
        </Motion>

        <GradientGlow class="top-0 h-1/2 w-2/3" />
      </template>

      <template #headline>
        <Motion v-bind="enterMotion(0.2)">
          <UBadge
            color="neutral"
            variant="soft"
            :label="t('landing.hero.headline')"
            class="gap-1.5 rounded-full bg-white/5 px-3 py-1.5 backdrop-blur"
          >
            <template #leading>
              <UChip
                inset
                standalone
                :ui="{ base: 'animate-pulse ring-0' }"
              />
            </template>
          </UBadge>
        </Motion>
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="enterMotion(0.35)"
          class="inline-block"
        >
          {{ heroTitle.primary }}
          <br v-if="heroTitle.secondary">
          <span
            v-if="heroTitle.secondary"
            class="animate-shimmer bg-size-[200%_auto] bg-clip-text text-transparent"
            :style="{
              backgroundImage:
                'linear-gradient(135deg, var(--color-primary-400), var(--color-primary-300), var(--color-primary-200), var(--color-primary-100), var(--color-primary-200), var(--color-primary-300), var(--color-primary-400))',
              animationDuration: '10s'
            }"
          >
            {{ heroTitle.secondary }}
          </span>
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="enterMotion(0.5)"
          class="inline-block"
        >
          {{ t('landing.description') }}
        </Motion>
      </template>

      <template #links>
        <Motion
          class="flex flex-wrap justify-center gap-6"
          v-bind="enterMotion(0.65)"
        >
          <UButton
            v-for="link in heroLinks"
            :key="link.label"
            :label="t(`${link.label}`)"
            :to="link.to"
            :color="link.color"
            :size="link.size"
            :variant="link.variant"
          />
        </Motion>
      </template>
    </UPageHero>

    <!-- Features -->
    <UPageSection
      id="features"
      orientation="horizontal"
      :headline="t('landing.features.headline')"
      :title="t('landing.features.title')"
      :description="t('landing.features.description')"
      :ui="{
        root: 'py-24 sm:py-32 scroll-mt-(--ui-header-height)',
        container: 'max-w-5xl',
        features: 'grid grid-cols-2',
        headline:
          'font-mono font-medium text-xs text-primary uppercase tracking-[0.12em] text-center',
        title: 'max-w-lg mx-auto',
        description: 'max-w-md mx-auto text-dimmed'
      }"
    >
      <template #features>
        <UPageCard
          v-for="(feature, index) in featureItems"
          :key="index"
          :title="t(feature.title)"
          :description="t(feature.description)"
          :icon="feature.icon"
          spotlight
        />
      </template>
      <img
        v-if="locale === 'es'"
        src="/dadoverse-01.png"
        alt=""
      >
      <img
        v-else
        src="/dadoverse-01-en.png"
        alt=""
      >
    </UPageSection>

    <!-- CTA -->
    <UPageCTA
      variant="naked"
      :ui="{
        root: 'py-24 sm:py-32',
        container: 'max-w-3xl text-center',
        title: 'lg:text-5xl tracking-tighter whitespace-pre-line',
        description: 'mx-auto max-w-sm leading-relaxed text-dimmed'
      }"
    >
      <template #top>
        <GradientGlow class="bottom-0 h-1/2 w-2/3" />
      </template>

      <template #title>
        <Motion
          as="span"
          v-bind="scrollMotion()"
          class="inline-block"
        >
          {{ t('landing.cta.title') }}
        </Motion>
      </template>

      <template #description>
        <Motion
          as="span"
          v-bind="scrollMotion(0.1)"
          class="inline-block"
        >
          {{ t('landing.cta.description') }}
        </Motion>
      </template>

      <template #links>
        <Motion
          class="flex items-center justify-center gap-6"
          v-bind="scrollMotion(0.2)"
        >
          <UButton
            v-for="link in heroLinks"
            :key="link.label"
            :label="t(`${link.label}`)"
            :to="link.to"
            :color="link.color"
            :size="link.size"
            :variant="link.variant"
          />
        </Motion>
      </template>
    </UPageCTA>
  </UPage>
</template>
