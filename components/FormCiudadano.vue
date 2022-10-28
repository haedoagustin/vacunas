<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const search = ref()
const error = ref(false)

const { data: ciudadano, pending, refresh, error: errorValue } = useLazyAsyncData(
    () => $fetch("/api/persona", { query: { dni: search.value } }));

watch(ciudadano, () => {
    error.value = false
    if (ciudadano.value)
        emit('update:modelValue', ciudadano.value)
    else
        emit('update:modelValue', null)
    error.value = errorValue.value
})

watch(search, (newSearch) => {
    if (!newSearch || newSearch.toString().length != 8) {
        ciudadano.value = null
        emit('update:modelValue', null);
    }
    else
        refresh();
})
</script>

<template>
    <Loading v-if="pending" />

    <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="tiempo-entrega">
            Ciudadano a vacunar
        </label>
        <input autofocus
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            :class="{ 'border-red-500': error, 'border-green-500': ciudadano }" type="number" id="ciudadano"
            placeholder="Buscar persona por número de documento" required v-model="search" />
        <p v-if="error" class="text-red-500 text-xs italic">{{ error.data.message }}</p>
    </div>

</template>