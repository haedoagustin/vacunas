<script setup>
const { auth } = useSupabaseClient()

onMounted(async () => {
    await auth.signOut().then(() => {
        navigateTo('/login')
    })
})
</script>