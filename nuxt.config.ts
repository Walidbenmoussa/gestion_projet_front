// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Désactive le rendu côté serveur
  ssr: false,

  // Modules Nuxt à inclure
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    'nuxt-icon'
  ],

  // Outils de développement activés
  devtools: {
    enabled: true
  },

  // Fichier CSS global
  css: ['~/assets/css/main.css'],

  // Règles de routage
  routeRules: {
    '/': { prerender: true }
  },

  // Date de compatibilité pour activer certaines fonctionnalités de Nuxt
  compatibilityDate: '2025-01-15',

  // Configuration d’ESLint
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Configuration de l'en-tête HTML (balises meta, etc.)
  app: {
    head: {
      meta: [
        { name: 'format-detection', content: 'telephone=no' }
      ]
    }
  }
})
