<template>
  <div class="min-h-full">
    <Navbar />

    <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          <slot name="page-title">Dashboard</slot>
        </h2>
        <slot name="page-subheader"></slot>
      </div>
      <div class="mt-5 flex lg:mt-0 lg:ml-4">
        <slot name="page-actions"></slot>
      </div>
    </div>

    <main class="flex justify-center">
      <div class="min-w-full py-6 sm:px-6 lg:px-8">
        <div class="min-h-full">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
