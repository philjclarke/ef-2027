// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts'],
  tailwindcss: { cssPath: '~/assets/css/main.css' },

  googleFonts: {
    families: {
      Poppins: [600, 700, 800],
      Figtree: [400, 500, 600, 700, 800],
    },
    display: 'swap',
    download: true,
    inject: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      title: 'Energising Futures',
      titleTemplate: '%s · Energising Futures',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Free, curriculum-linked STEM resources for ages 4–16. Prototype for review.' },
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'theme-color', content: '#110E63' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/brand/ef-logo.svg' }],
    },
  },

  // Everything is prerendered; /search renders client-side (it depends on the query string).
  routeRules: {
    '/search': { ssr: false },
  },
  nitro: {
    prerender: { routes: ['/', '/search'], crawlLinks: false },
  },

  typescript: { strict: true },
})
