<script lang="ts" setup>


const formUsuarios = ref(false);

const toggleForm = () => {
    formUsuarios.value = !formUsuarios.value;
};
</script>

<template>
    <NuxtLayout>
        <template #page-title> Usuarios </template>
        <div class="flex flex-col ga-10">
            <div class="flex flex-col content-center w-200px" v-if="formUsuarios">
                <h1 class="text-2xl font-extrabold dark:text-white">
                Formulario de alta de usuario
                </h1>
                <FormUsuarios @submit-usuario="toggleForm"></FormUsuarios>
            </div>
            <div class="flex flex-col content-center" v-if="!formUsuarios">
                <div class="flex justify-between">
                    <h1 class="text-2xl font-extrabold dark:text-white">
                        Lista de usuarios
                    </h1>
                    <button @click="toggleForm"
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Dar de alta usuario
                    </button>
                </div>
                <ListUsuarios  @submit-usuario="toggleForm"></ListUsuarios>
            </div>
        </div>
    </NuxtLayout>
</template>