<script setup>
import {
  UserCircleIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  CalendarIcon
} from "@heroicons/vue/24/outline/index.js";

const usuario = await useUsuario();

</script>

<template>
  <NuxtLayout>
    <template #page-title> Inicio </template>
    <template #page-subheader>
      <div class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <UserCircleIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          {{ usuario.nombre }} {{ usuario.apellido }}
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500" style="text-transform: capitalize;">
          <UserGroupIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          {{ usuario.rol }}
        </div>
        <div v-if="['analista provincial','vacunador'].includes(usuario.rol)" class="mt-2 flex items-center text-sm text-gray-500">
          <BuildingLibraryIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          {{ usuario.jurisdiccion.nombre }}
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500">
          <CalendarIcon class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          Miembro desde {{ new Date(usuario.created_at).toLocaleDateString('es', {
              year: 'numeric', month: 'long', day:
                'numeric'
            })
          }}
        </div>
      </div>
    </template>
    <img src="/assets/img/calendario.png" />
  </NuxtLayout>
</template>