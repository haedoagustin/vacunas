<script setup>
const emit = defineEmits(["pago-completado"])

onMounted(() => {
  refreshNuxtData('compras')
});

const actualizarListado = () => {
  refresh()
  if (!data.length) emit("pago-completado")
}

const { data: compras, refresh } = await useAsyncData('compras', () => $fetch('/api/compra', { query: { estado: 'pendiente' } }))
</script>

<template>

  <div class="md:grid md:grid-cols-3 md:gap-6">
    <div class="md:col-span-1">
      <div class="px-4 sm:px-0">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Pago de compras</h3>
        <p class="mt-1 text-sm text-gray-600">En esta sección vas a poder pagar las compras hechas.</p>
      </div>
    </div>

    <div class="mt-5 md:col-span-2 md:mt-0">

      <CardCompraPendiente v-for="compra in compras" :key="compra.id" :compra="compra" @pago-compra="actualizarListado">
      </CardCompraPendiente>

    </div>
  </div>
</template>