// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],

  meta: {
    title: 'Vacunas',
    charset: 'utf-8',
    meta: [
      { name: 'theme-color', content: '#4F46E5' }
    ],
    link: [
      { hid: 'icon', rel: 'icon', type: 'image/png', href: '/img/logo_x32.png' },
      { hid: 'apple-touch-icon', rel: 'apple-touch-icon', href: '/img/logo_x180.png' },
      { rel: 'manifest', href: '/manifest.json' }
    ]
  }
});
