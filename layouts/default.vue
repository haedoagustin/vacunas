<template>
  <div class="min-h-full">
    <Navbar />

    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">
          <slot name="page-title">Dashboard</slot>
        </h1>
      </div>
    </header>

    <main class="overflow-auto">
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <!-- Replace with your content -->
        <div class="px-4 py-6 sm:px-0 h-96">
          <div class="min-h-full rounded-lg border-4 border-dashed border-gray-200">
            <slot />
          </div>
        </div>
        <!-- /End replace -->
      </div>
    </main>
  </div>
</template>
