<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
  layout: false,
})

useHead({
  title: "Inicio"
})

</script>

<template>
  <NuxtLayout name="default">
    <template #page-title> Inicio </template>
  </NuxtLayout>
</template>