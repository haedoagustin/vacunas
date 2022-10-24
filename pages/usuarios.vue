<script lang="ts" setup>
useHead({
    title: "Usuarios"
})

const formUsuarios = ref(false);
</script>

<template>
    <NuxtLayout>
        <template #page-title> Usuarios </template>

        <template #page-actions>
            <PageActions v-model="formUsuarios">
                <template #main-label>Nuevo usuario</template>
                <template #back-label>Volver</template>
            </PageActions>
        </template>

        <div class="flex flex-col ga-10">
            <div v-if="formUsuarios" class="flex flex-col content-center w-200px">
                <h1 class="text-2xl font-extrabold dark:text-white">
                    Formulario de alta de usuario
                </h1>
                <FormUsuarios @submit-usuario="formUsuarios = true" />
            </div>
            <div v-else class="flex flex-col content-center">
                <div class="flex justify-between">
                    <h1 class="text-2xl font-extrabold dark:text-white">
                        Lista de usuarios
                    </h1>
                </div>
                <ListUsuarios />
            </div>
        </div>
    </NuxtLayout>
</template>