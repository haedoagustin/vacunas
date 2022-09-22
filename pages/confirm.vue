<script setup>
definePageMeta({
  middleware: ['guest'],
  layout: 'blank'
})
const user = useSupabaseUser()

watchEffect(() => {
    if (user.value) {
        navigateTo('/')
    }
})
</script>
    
<template>
    <NuxtLayout name="blank">
        <div class="block">
            Ingresando...
        </div>
    </NuxtLayout>
</template>