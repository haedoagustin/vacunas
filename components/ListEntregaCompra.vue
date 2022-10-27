<script setup>
const emit = defineEmits(["entrega-completada"])

onMounted(() => {
  refreshNuxtData('compras')
});
const { data: compras, refresh } = await useAsyncData('compras', () => $fetch('/api/compra', { query: { estado: 'pagada' } }))

const actualizarListado = () => {
  refresh()
  if (!compras.length) emit("entrega-completada")
}
</script>

<template>

  <div class="md:grid md:grid-cols-3 md:gap-6">
    <div class="md:col-span-1">
      <div class="px-4 sm:px-0">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Entrega de compras</h3>
        <p class="mt-1 text-sm text-gray-600">Este listado contiene las compras pagadas que están esperando ser
          entregadas.</p>
      </div>
    </div>

    <div class="mt-5 md:col-span-2 md:mt-0">

      <CardCompraPagada v-for="compra in compras" :key="compra.id" :compra="compra" @entrega-compra="actualizarListado">
      </CardCompraPagada>

    </div>
  </div>
</template>