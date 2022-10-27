<script lang="ts" setup>
import FormCompra from '@/components/FormCompra.vue'
import ListPagoCompra from '~/components/ListPagoCompra.vue'
import ListEntregaCompra from '~/components/ListEntregaCompra.vue'

useHead({
  title: "Compras",
});

const currentTab = ref('Compras')

const tabs = {
  'Compras': FormCompra,
  'Pagos': ListPagoCompra,
  'Entregas': ListEntregaCompra
}
</script>

<template>
  <NuxtLayout>
    <template #page-title> Compras </template>

    <section aria-labelledby="products-heading" class="pb-24">
      <div class="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">

        <div class="block">
          <h3 class="sr-only">Categories</h3>
          <ul role="list" class="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
            <li v-for="(_, tab) in tabs" :key="tab">
              <button @click="currentTab = tab">{{ tab }}</button>
            </li>
          </ul>
        </div>

        <div class="col-span-3 bg-gray-100 p-7">
          <div class="h-fit">
            <component :is="tabs[currentTab]" @inicio-completado="currentTab = 'Pagos'"
              @pago-completado="currentTab = 'Entregas'" @entrega-completada="currentTab = 'Compras'" class="tab">
            </component>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
