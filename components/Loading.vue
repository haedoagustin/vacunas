<template>
    <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div class="fixed inset-0 z-10 overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <LoadingSpin class="animate-spin h-10 w-10 text-indigo-500 group-hover:text-indigo-400 cursor-wait"
                    aria-hidden="true" />
            </div>
        </div>
    </div>
</template>