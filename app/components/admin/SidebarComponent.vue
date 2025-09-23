<script setup lang="ts">
defineProps<{
  navigationItems: { name: string; icon: string; active: boolean }[];
}>();
</script>

<template>
  <aside class="bg-white shadow-sm border-gray-200 border-r w-64 min-h-screen">
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="item in navigationItems" :key="item.name">
          <a
            href="#"
            class="flex items-center space-x-3 px-3 py-2 rounded-md font-medium text-sm transition-colors"
            :class="
              item.active
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            "
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span>{{ item.name }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>
