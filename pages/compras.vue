<script lang="ts" setup>
definePageMeta({
    middleware: ['auth'],
    layout: false,
})

useHead({
    title: "Compras"
})

</script>
    
<template>
    <NuxtLayout name="default">
        <template #page-title> Compras </template>
    </NuxtLayout>
</template>