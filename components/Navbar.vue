<script setup>
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/vue";
import {
  BanknotesIcon,
  Bars3Icon,
  BeakerIcon,
  BuildingLibraryIcon,
  CogIcon,
  Squares2X2Icon,
  TruckIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { ChevronDownIcon } from "@heroicons/vue/20/solid";

const usuario = await useUsuario();

const stock = [
  {
    name: "Stock nacional",
    description: "Visualizá, detalladamente el stock nacional",
    href: "/stock",
    icon: Squares2X2Icon,
    roles: ["operador nacional"],
  },
  {
    name: "Stock provincial",
    description: "Visualizá, detalladamente el stock provincial",
    href: "/stock",
    icon: Squares2X2Icon,
    roles: ["operador nacional"],
  },
];

const vacunas = [
  {
    name: "Vacunas",
    description: "Visualizá, agregá o eliminá vacunas desde esta sección.",
    href: "/vacunas",
    icon: Squares2X2Icon,
    roles: ["operador nacional"],
  },
  {
    name: "Laboratorios",
    description: "Manejá las vacunas desarrolladas por distintos laboratorios.",
    href: "/laboratorios",
    icon: BeakerIcon,
    roles: ["operador nacional"],
  },
  {
    name: "Desarrollos de vacunas",
    description: "Manejá las vacunas desarrolladas por distintos laboratorios.",
    href: "/vacunas-desarrolladas",
    icon: CogIcon,
    roles: ["operador nacional"],
  },
];
const compras = [
  {
    name: "Compras",
    description: "Comprá, pagá y gestioná la entrega de las vacunas.",
    href: "/compras",
    icon: BanknotesIcon,
    roles: ["operador nacional"],
  },
  {
    name: "Distribución",
    description: "Enviá lotes de vacunas a las distintas jurisdicciones.",
    href: "/distribucion",
    icon: TruckIcon,
    roles: ["operador nacional"],
  },
];

const otros = [
  {
    name: "Vacunaciones",
    href: "/vacunacion",
    roles: ["vacunador", "analista provincial", "operador nacional"],
  },
  {
    name: "Usuarios",
    href: "/usuarios",
    roles: ["admin"],
  },
];
</script>

<template>
  <Popover class="relative bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6">
      <div
        class="flex items-center justify-between border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10"
      >
        <div class="flex justify-start lg:w-0 lg:flex-1">
          <span>
            <span class="sr-only">Vacunas</span>
            <img src="/img/logo_x512.png" class="h-8 w-auto sm:h-10" />
          </span>
        </div>
        <div class="-my-2 -mr-2 md:hidden">
          <PopoverButton
            class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span class="sr-only">Open menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </PopoverButton>
        </div>
        <PopoverGroup as="nav" class="hidden space-x-10 md:flex">
          <NuxtLink
            href="/"
            class="text-base font-medium text-gray-500 hover:text-gray-900"
            >Inicio</NuxtLink
          >
          <Popover
            v-if="
              stock.find(
                (item) =>
                  item.roles.includes('any') ||
                  item.roles.includes(usuario?.rol)
              )
            "
            class="relative"
            v-slot="{ open }"
          >
            <PopoverButton
              :class="[
                open ? 'text-gray-900' : 'text-gray-500',
                'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              ]"
            >
              <span>Consulta de stock</span>
              <ChevronDownIcon
                :class="[
                  open ? 'text-gray-600' : 'text-gray-400',
                  'ml-2 h-5 w-5 group-hover:text-gray-500',
                ]"
                aria-hidden="true"
              />
            </PopoverButton>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <PopoverPanel
                class="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2"
              >
                <div
                  class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <div
                    class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8"
                  >
                    <template v-for="item in stock" :key="item.name">
                      <NuxtLink
                        v-if="
                          item.roles.includes('any') ||
                          item.roles.includes(usuario.rol)
                        "
                        :href="item.href"
                        class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                      >
                        <component
                          :is="item.icon"
                          class="h-6 w-6 flex-shrink-0 text-blue-600"
                          aria-hidden="true"
                        />
                        <div class="ml-4">
                          <p class="text-base font-medium text-gray-900">
                            {{ item.name }}
                          </p>
                          <p class="mt-1 text-sm text-gray-500">
                            {{ item.description }}
                          </p>
                        </div>
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>

          <Popover
            v-if="
              vacunas.find(
                (item) =>
                  item.roles.includes('any') ||
                  item.roles.includes(usuario?.rol)
              )
            "
            class="relative"
            v-slot="{ open }"
          >
            <PopoverButton
              :class="[
                open ? 'text-gray-900' : 'text-gray-500',
                'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              ]"
            >
              <span>Gestión vacunas</span>
              <ChevronDownIcon
                :class="[
                  open ? 'text-gray-600' : 'text-gray-400',
                  'ml-2 h-5 w-5 group-hover:text-gray-500',
                ]"
                aria-hidden="true"
              />
            </PopoverButton>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <PopoverPanel
                class="absolute z-10 -ml-4 mt-3 w-screen max-w-md transform px-2 sm:px-0 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2"
              >
                <div
                  class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <div
                    class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8"
                  >
                    <template v-for="item in vacunas" :key="item.name">
                      <NuxtLink
                        v-if="
                          item.roles.includes('any') ||
                          item.roles.includes(usuario.rol)
                        "
                        :href="item.href"
                        class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                      >
                        <component
                          :is="item.icon"
                          class="h-6 w-6 flex-shrink-0 text-blue-600"
                          aria-hidden="true"
                        />
                        <div class="ml-4">
                          <p class="text-base font-medium text-gray-900">
                            {{ item.name }}
                          </p>
                          <p class="mt-1 text-sm text-gray-500">
                            {{ item.description }}
                          </p>
                        </div>
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>

          <Popover
            v-if="
              compras.find(
                (item) =>
                  item.roles.includes('any') ||
                  item.roles.includes(usuario?.rol)
              )
            "
            class="relative"
            v-slot="{ open }"
          >
            <PopoverButton
              :class="[
                open ? 'text-gray-900' : 'text-gray-500',
                'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              ]"
            >
              <span>Gestión de compras</span>
              <ChevronDownIcon
                :class="[
                  open ? 'text-gray-600' : 'text-gray-400',
                  'ml-2 h-5 w-5 group-hover:text-gray-500',
                ]"
                aria-hidden="true"
              />
            </PopoverButton>

            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <PopoverPanel
                class="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0"
              >
                <div
                  class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
                >
                  <div
                    class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8"
                  >
                    <template v-for="item in compras" :key="item.name">
                      <NuxtLink
                        v-if="
                          item.roles.includes('any') ||
                          item.roles.includes(usuario.rol)
                        "
                        :href="item.href"
                        class="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                      >
                        <component
                          :is="item.icon"
                          class="h-6 w-6 flex-shrink-0 text-blue-600"
                          aria-hidden="true"
                        />
                        <div class="ml-4">
                          <p class="text-base font-medium text-gray-900">
                            {{ item.name }}
                          </p>
                          <p class="mt-1 text-sm text-gray-500">
                            {{ item.description }}
                          </p>
                        </div>
                      </NuxtLink>
                    </template>
                  </div>
                </div>
              </PopoverPanel>
            </transition>
          </Popover>

          <template v-for="item in otros" :key="item.name">
            <NuxtLink
              v-if="
                item.roles.includes('any') || item.roles.includes(usuario.rol)
              "
              :href="item.href"
              class="text-base font-medium text-gray-500 hover:text-gray-900"
              >{{ item.name }}</NuxtLink
            >
          </template>
        </PopoverGroup>

        <div class="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton
                class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                {{ usuario.nombre }}
                <ChevronDownIcon
                  class="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <NuxtLink
                      href="/logout"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                      ]"
                    >
                      Salir</NuxtLink
                    >
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <!-- <transition enter-active-class="duration-200 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="duration-100 ease-in"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <PopoverPanel focus class="absolute inset-x-0 top-0 origin-top-right transform p-2 transition md:hidden">
                <div class="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div class="px-5 pt-5 pb-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <img src="/img/logo_x512.png" class="h-8 w-auto" />
                            </div>
                            <div class="-mr-2">
                                <PopoverButton
                                    class="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                                    <span class="sr-only">Cerrar menú</span>
                                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                </PopoverButton>
                            </div>
                        </div>
                        <div class="mt-6">
                            <nav class="grid gap-y-8">
                                <a v-for="item in gestion" :key="item.name" :href="item.href"
                                    class="-m-3 flex items-center rounded-md p-3 hover:bg-gray-50">
                                    <component :is="item.icon" class="h-6 w-6 flex-shrink-0 text-blue-600"
                                        aria-hidden="true" />
                                    <span class="ml-3 text-base font-medium text-gray-900">{{ item.name }}</span>
                                </a>
                            </nav>
                        </div>
                    </div>
                    <div class="space-y-6 py-6 px-5">
                        <div class="grid grid-cols-2 gap-y-4 gap-x-8">
                            <a href="#" class="text-base font-medium text-gray-900 hover:text-gray-700">Pricing</a>

                            <a href="#" class="text-base font-medium text-gray-900 hover:text-gray-700">Docs</a>
                            <a v-for="item in resources" :key="item.name" :href="item.href"
                                class="text-base font-medium text-gray-900 hover:text-gray-700">{{ item.name }}</a>
                        </div>
                        <div>
                            <a href="#"
                                class="flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700">Sign
                                up</a>
                            <p class="mt-6 text-center text-base font-medium text-gray-500">
                                Existing customer?
                                <a href="#" class="text-blue-600 hover:text-blue-500">Sign in</a>
                            </p>
                        </div>
                    </div>
                </div>
            </PopoverPanel>
        </transition> -->
  </Popover>
</template>
