export default defineNuxtConfig({
  ssr: false, // mode SPA

  modules: ['@nuxt/eslint', '@nuxt/ui', 'nuxt-icon'],

  devtools: {
    enabled: false
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  // date de compatibilité Nuxt 4
  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Configuration spécifique Vite pour compatibilité iOS Safari 15+
  vite: {
    build: {
      target: ['safari15'] // cibler Safari 15 et supérieur
    },
    plugins: [
      require('@vitejs/plugin-legacy')({
        targets: ['safari >= 15'] // legacy pour iOS Safari
      })
    ]
  },

  // Désactiver importmaps sur iOS/Safari si besoin
  experimental: {
    entryImportMap: false
  },

  app: {
    head: {
      meta: [
        { name: 'format-detection', content: 'telephone=no' } // éviter détection automatique téléphone iOS
      ]
    }
  }
});
