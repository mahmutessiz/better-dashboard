<script setup lang="ts">
import type { Session } from "~/types/general";
defineProps<{
  currentUser: Session["user"] | undefined;
  handleSignout: () => void;
}>();
</script>

<template>
  <header class="bg-white shadow-sm border-gray-200 border-b">
    <div class="px-6 py-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <h1 class="font-bold text-gray-900 text-2xl">Admin Dashboard</h1>
          <span
            class="bg-blue-100 px-3 py-1 rounded-full font-medium text-blue-800 text-xs"
          >
            v1.0
          </span>
        </div>

        <!-- User Info & Actions -->
        <div class="flex items-center space-x-4">
          <div v-if="currentUser" class="flex items-center space-x-3">
            <div class="text-right">
              <div class="font-medium text-gray-900 text-sm">
                {{ currentUser.name || "Unknown User" }}
              </div>
              <div class="text-gray-500 text-xs">
                {{ currentUser.email }}
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                class="px-2 py-1 rounded-md font-medium text-xs"
                :class="
                  currentUser.role === 'admin'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                "
              >
                {{ currentUser.role || "User" }}
              </span>
              <div
                class="flex justify-center items-center bg-gray-300 rounded-full w-8 h-8"
              >
                <span class="font-medium text-gray-700 text-xs">
                  {{ (currentUser.name || "U").charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <button
              type="button"
              class="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 text-sm cursor-pointer"
              @click="handleSignout"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
