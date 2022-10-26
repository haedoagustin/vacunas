<script lang="ts" setup>
import FormCompra from '@/components/FormCompra.vue'
import FormPagoCompra from '~/components/FormPagoCompra.vue'
import FormEntregaCompra from '~/components/FormEntregaCompra.vue'

useHead({
  title: "Compras",
});

const compra = ref()

const iniciarCompra = (nuevaCompra) => {
  compra.value = nuevaCompra
  currentTab.value = 'Pagos'
}

const currentTab = ref('Compras')

const tabs = {
  'Compras': FormCompra,
  'Pagos': FormPagoCompra,
  'Entregas': FormEntregaCompra
}
</script>

<template>
  <NuxtLayout>
    <template #page-title> Compras </template>

    <section aria-labelledby="products-heading" class="pb-24">
      <h2 id="products-heading" class="sr-only">Products</h2>

      <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
        <!-- Filters -->
        <div class="block">
          <h3 class="sr-only">Categories</h3>
          <ul role="list" class="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
            <li v-for="(_, tab) in tabs" :key="tab">
              <button @click="currentTab = tab">{{ tab }}</button>
            </li>
          </ul>
        </div>

        <!-- Product grid -->
        <div class="col-span-3 bg-gray-100 p-7">
          <!-- Replace with your content -->
          <div class="h-fit">
            <component :is="tabs[currentTab]" @iniciar-compra="iniciarCompra" class="tab"></component>
          </div>
          <!-- /End replace -->
        </div>
      </div>
    </section>

    <!-- <div class="mb-4 shadow-md">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Funciones de compra
      </label>
      <select
        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="tipo"
        placeholder="tipo"
        required
        v-model="tipoCompra"
        @change="show"
      >
        <option value="Comprar">Comprar</option>
        <option value="pendiente">Pendientes</option>
        <option value="pagada">Pagadas</option>
        <option value="entregada">Entregadas</option>
      </select>
    </div>
    <div class="mb-4 shadow-md">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="tipo">
        Vacuna
      </label>
      <select
        class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="tipo"
        placeholder="tipo"
        required
        v-model="vacunaSelect"
      >
        <option v-for="vacuna in vacunas">{{ vacuna.nombre }}</option>
      </select>
    </div>
    <div v-if="tipoCompra == 'Comprar'" class="grid grid-cols-4">
      <CardCompra
        v-for="vacuna in vacunasDesarrolladas.filter(
          (vac) => vac.vacuna_id == vacunaSelect
        )"
        :key="vacuna.id"
        :vacuna="vacuna"
      ></CardCompra>
    </div>
    <div v-if="tipoCompra != 'Comprar'" class="grid grid-cols-4 gap-12">
      <CardCompraPendiente
        v-for="compra in compras.filter(
          (compra) => compra.estado == tipoCompra
        )"
        :key="compra.id"
        :compra="compra"
      ></CardCompraPendiente>
    </div> -->
  </NuxtLayout>
</template>
