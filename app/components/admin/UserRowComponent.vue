<script setup lang="ts">
import type { UserWithRole } from "better-auth/plugins";

const props = defineProps<{
  user: UserWithRole;
  banUser: (id: string) => void;
  unbanUser: (id: string) => void;
  deleteUser: (id: string) => void;
}>();

function handleDelete() {
  if (confirm(`Are you sure you want to delete ${props.user.email}?`)) {
    props.deleteUser(props.user.id);
  }
}

async function handleBanToggle() {
  if (props.user.banned) {
    await props.unbanUser(props.user.id);
  } else {
    await props.banUser(props.user.id);
  }
}
</script>

<template>
  <tr class="hover:bg-gray-50">
    <!-- Name & ID -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center">
        <div
          class="flex justify-center items-center bg-gray-200 mr-4 rounded-full w-10 h-10"
        >
          <span class="font-medium text-gray-700 text-sm">
            {{ (props.user.name || "U").charAt(0).toUpperCase() }}
          </span>
        </div>
        <div>
          <div class="font-medium text-gray-900 text-sm">
            {{ props.user.name || "Unknown" }}
          </div>
          <div class="text-gray-500 text-sm">ID: {{ props.user.id }}</div>
        </div>
      </div>
    </td>

    <!-- Email -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-gray-900 text-sm">{{ props.user.email }}</div>
    </td>
    <!-- Email Verified -->
    <td class="px-6 py-4 whitespace-nowrap">
      <div
        class="text-sm"
        :class="{
          'text-green-600': props.user.emailVerified,
          'text-red-600': !props.user.emailVerified,
        }"
      >
        {{ props.user.emailVerified }}
      </div>
    </td>
    <!-- Role -->
    <td class="px-6 py-4 whitespace-nowrap">
      <span
        class="px-2 py-1 rounded-md font-medium text-xs"
        :class="
          props.user.role === 'admin'
            ? 'bg-red-100 text-red-800'
            : 'bg-gray-100 text-gray-800'
        "
      >
        {{ props.user.role || "User" }}
      </span>
    </td>

    <!-- Status -->
    <td class="px-6 py-4 whitespace-nowrap">
      <span
        class="flex items-center text-green-600 text-sm"
        :class="{ 'text-red-700': props.user.banned }"
      >
        <div
          class="bg-green-400 mr-2 rounded-full w-2 h-2"
          :class="{ 'bg-red-700': props.user.banned }"
        />
        {{ props.user.banned ? "Banned" : "Active" }}
      </span>
    </td>

    <!-- Actions -->
    <td class="px-6 py-4 font-medium text-sm text-right whitespace-nowrap">
      <div class="flex justify-end items-center space-x-2">
        <button
          class="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded-md text-black transition-all duration-200 cursor-pointer"
          @click="handleBanToggle"
        >
          {{ props.user.banned ? "Unban" : "Ban" }}
        </button>

        <!-- DELETE -->
        <button
          class="text-red-600 hover:text-red-900 cursor-pointer"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
</template>
