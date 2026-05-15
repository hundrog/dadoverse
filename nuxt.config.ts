// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    'nuxt-security',
    '@nuxtjs/i18n',
    'motion-v/nuxt'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Valor por defecto (local)
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },

  routeRules: {
    '/': { prerender: false }
  },

  sourcemap: {
    server: false,
    client: false
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    compressPublicAssets: true,
    devProxy: {
      // A veces necesario en desarrollo para evitar problemas de CORS con los assets
    },
    prerender: {
      autoSubfolderIndex: false
    },
    routeRules: {
      '/dice-box/**': {
        headers: {
          'Content-Type': 'application/wasm',
          'Cross-Origin-Embedder-Policy': 'require-corp',
          'Cross-Origin-Resource-Policy': 'same-origin'
        }
      }
    }
  },

  vite: {
    optimizeDeps: {
      include: ['@3d-dice/dice-box', 'zod', 'shaders/vue']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    strategy: 'no_prefix',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'es', language: 'es-MX', file: 'es.json' }
    ],
    defaultLocale: 'es'
  },

  security: {
    nonce: true,
    headers: {
      contentSecurityPolicy: {
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "'wasm-unsafe-eval'"
        ],
        'worker-src': ["'self'", "blob:"],
        'img-src': [
          "'self'",
          'data:',
          'https://api.dicebear.com',
          'https://source.boringavatars.com'
        ],
        'connect-src': [
          "'self'",
          'https://*.supabase.co',
          'wss://*.supabase.co',
          'ws://localhost:*',
          'ws://api.iconify.design/*'
        ],
        'style-src': ["'self'", "'unsafe-inline'"],
        'base-uri': ["'self'"]
      },
      crossOriginEmbedderPolicy: 'unsafe-none',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginResourcePolicy: 'cross-origin'
    }
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: ['/profile/*'],
      exclude: [],
      saveRedirectToCookie: true
    }
  }
})
