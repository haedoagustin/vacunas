<script setup>
import { getVacunaciones } from "../assets/crud";
const client = useSupabaseClient();

const { data: vacunaciones } = await useAsyncData('vacunaciones', () => getVacunaciones(client))
</script>

<template>
    <div class="flex flex-col">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                    <table class="min-w-full">
                        <thead class="border-b">
                            <tr>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Jurisdicción
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Vacunador
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Vacuna
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    DNI Ciudadano
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Datos ciudadano
                                </th>
                                <th scope="col" class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                                    Fecha de aplicación
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b" v-for="vacunacion in vacunaciones">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ vacunacion.envio_id.jurisdiccion_id.nombre }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ vacunacion.vacunador.apellido }} {{ vacunacion.vacunador.nombre }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ vacunacion.envio_id.lote_id.vacuna_desarrollada_id.vacuna_id.nombre }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ vacunacion.dni_vacunado }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    <ModalCiudadano :dni="vacunacion.dni_vacunado"
                                        buttonClass="font-medium text-blue-600 hover:text-blue-500">
                                        Ver datos
                                    </ModalCiudadano>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {{ new Date(vacunacion.created_at).toLocaleDateString() }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
