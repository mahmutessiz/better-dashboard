<script setup lang="ts">
defineProps<{
  stats: { title: string; value: number; icon: string; color: string }[];
}>();
</script>

<template>
  <div class="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
    <div
      v-for="stat in stats"
      :key="stat.title"
      class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg"
    >
      <div class="flex justify-between items-center">
        <div>
          <p class="font-medium text-gray-600 text-sm">{{ stat.title }}</p>
          <p class="mt-2 font-bold text-gray-900 text-3xl">{{ stat.value }}</p>
        </div>
        <div
          :class="[
            stat.color,
            'w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl',
          ]"
        >
          {{ stat.icon }}
        </div>
      </div>
    </div>
  </div>
</template>
