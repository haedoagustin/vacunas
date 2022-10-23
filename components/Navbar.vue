<script setup>
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  Bars3Icon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline/index.js";

const route = useRoute();
const currentRoute = (item) => route.matched[0].path === item.href;

const usuario = await useUsuario();

const navigation = [
  { name: "Inicio", href: "/", roles: ["any", "admin"] },
  { name: "Vacunas", href: "/vacunas", roles: ["admin"] },
  {
    name: "Vacunas desarrolladas",
    href: "/vacunas-desarrolladas",
    roles: ["admin"],
  },
  { name: "Compras", href: "/compras", roles: ["operador nacional", "admin"] },
  {
    name: "Distribución",
    href: "/distribucion",
    roles: ["operador nacional", "admin"],
  },
  {
    name: "Vacunación",
    href: "/vacunacion",
    roles: ["vacunador", "admin"],
  },
  { name: "Laboratorios", href: "/laboratorios", roles: ["admin"] },
  { name: "Usuarios", href:"/usuarios", roles:["admin"] }
];

const { auth } = useSupabaseClient();

const logout = async () => {
  await auth.signOut().then(() => {
    navigateTo("/login");
  });
};
</script>

<template>
  <Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
        <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div class="flex flex-shrink-0 items-center">
            <img src="/img/logo.svg" class="block h-8 w-auto lg:hidden" />
            <img src="/img/logo.svg" class="hidden h-8 w-auto lg:block" />
          </div>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4">
              <div v-for="item in navigation">
                <NuxtLink v-if="item.roles.includes(usuario?.rol)" :key="item.name" :to="item.href" :class="[
                  currentRoute(item)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                  'px-3 py-2 rounded-md text-sm font-medium',
                ]" :aria-current="currentRoute(item) ? 'page' : undefined">{{ item.name }}</NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <!-- Profile dropdown -->
          <Menu as="div" class="relative ml-3 bg-gray-800">
            <div>
              <MenuButton
                class="rounded-full p-1 bg-gray-800 text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span class="sr-only">Abrir menú de usuario</span>
                <UserIcon class="h-6 w-6 rounded-full" aria-hidden="true" />
              </MenuButton>
            </div>
            <transition enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95">
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem v-slot="{ active }">
                <button @click="logout" :class="[
                  active ? 'bg-gray-100' : '',
                  'w-full block px-4 py-2 text-sm text-gray-700',
                ]">
                  Salir
                </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>

    <DisclosurePanel class="sm:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[
          item.current
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          'block px-3 py-2 rounded-md text-base font-medium',
        ]" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
