<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  titleTemplate: '%s - Vacunas',
  htmlAttrs: {
    class: "h-full bg-gray-50"
  },
  bodyAttrs: {
    class: "h-full"
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: 'assets/img/logo.svg' }
  ]
})
</script>