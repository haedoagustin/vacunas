<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Vacunas` : 'Vacunas';
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  charset: 'utf-8',
  meta: [
    { name: 'description', content: 'Sitio para pruebas de Nuxt y Supabase' }
  ],
  htmlAttrs: {
    lang: 'es',
    class: "h-full bg-gray-50"
  },
  bodyAttrs: {
    class: "h-full"
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/img/logo.svg' }
  ]
})
</script>