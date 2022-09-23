<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Vacunas` : 'Vacunas';
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  charset: 'utf-8',
  meta: [
    { name: 'description', content: 'Sitio para la gestión de compras, distribución y administración de vacunas.' }
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

<template>
  <div>
    <NuxtPage />
  </div>
</template>