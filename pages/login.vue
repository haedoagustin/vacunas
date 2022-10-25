<script setup>
import { LockClosedIcon } from '@heroicons/vue/20/solid/index.js'

definePageMeta({
  layout: 'blank',
})

useHead({
  title: "Ingresar"
})

const user = useSupabaseUser();
const { auth } = useSupabaseClient()

watch(user, () => {
  if (user.value) {
    navigateTo('/')
  }
})

const loading = ref(false)
const email = ref('')
const password = ref('')

const redirectTo = ref((process.client) ? `${window.location.origin}/confirm` : null)

const login = async (provider) => {
  try {
    loading.value = true
    const { error } = await auth.signIn(provider, { redirectTo: redirectTo.value })
    if (error) throw error
  } catch (error) {
    throw createError({ statusCode: 404, statusMessage: error.error_description || error.message })
  } finally {
    loading.value = false
  }
}

const loginWithEmail = async () => await login({ email: email.value, password: password.value })
</script>

<template>
  <NuxtLayout name="blank">
    <div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <img class="mx-auto h-12 w-auto" src="/img/logo_x48.png" />
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Iniciar sesión</h2>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="loginWithEmail()">
          <div class="-space-y-px rounded-md shadow-sm">
            <div>
              <label for="email-address" class="sr-only">Dirección de email</label>
              <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required=""
                class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Dirección de email" />
            </div>
            <div>
              <label for="password" class="sr-only">Contraseña</label>
              <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
                required=""
                class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Contraseña" />
            </div>
          </div>

          <div>
            <button
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 dark:bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <LoadingSpin v-if="loading" class="animate-spin h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  aria-hidden="true" />
                <LockClosedIcon v-else class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
              </span>

              <span>
                Iniciar sesión
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>