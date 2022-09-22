<script lang="ts" setup>
definePageMeta({
    middleware: ['auth'],
    layout: false,
})

useHead({
    title: "Vacunación"
})

</script>
    
<template>
    <NuxtLayout name="default">
        <template #page-title> Vacunación </template>
    </NuxtLayout>
</template>