<script lang="ts" setup>
definePageMeta({
    middleware: ['auth'],
    layout: false,
})

useHead({
    title: "Distribución"
})

</script>
    
<template>
    <NuxtLayout name="default">
        <template #page-title> Distribución </template>
    </NuxtLayout>
</template>