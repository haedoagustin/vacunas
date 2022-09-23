<script setup>
definePageMeta({
  layout: 'blank'
})
const user = useSupabaseUser()

watch(user, () => {
    if (user.value) {
        navigateTo('/')
    }
})
</script>
    
<template>
    <NuxtLayout>
        <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            Ingresando...
        </div>
    </NuxtLayout>
</template>