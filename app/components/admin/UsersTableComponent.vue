<script setup lang="ts">
import type { UserWithRole } from "better-auth/plugins";
import UserRowComponent from "./UserRowComponent.vue";

defineProps<{
  userList: UserWithRole[];
  banUser: (id: string) => void;
  unbanUser: (id: string) => void;
  deleteUser: (id: string) => void;
}>();
</script>

<template>
  <div class="bg-white shadow-sm border border-gray-200 rounded-lg">
    <div
      class="flex justify-between items-center px-6 py-4 border-gray-200 border-b"
    >
      <h2 class="font-semibold text-gray-900 text-lg">Users Management</h2>
      <div class="flex items-center space-x-3">
        <div class="relative">
          <!-- prettier-ignore -->
          <input
            type="text"
            placeholder="Search users..."
            class="py-2 pr-4 pl-10 border border-gray-300 focus:border-blue-500 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
          >
          <div
            class="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none"
          >
            <span class="text-gray-400">🔍</span>
          </div>
        </div>
        <button
          class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-white text-sm cursor-pointer"
        >
          Add User
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
            >
              User
            </th>
            <th
              class="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
            >
              Email
            </th>
            <th
              class="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
            >
              Email Verified
            </th>
            <th
              class="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
            >
              Role
            </th>
            <th
              class="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 font-medium text-gray-500 text-xs text-right uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody v-if="userList.length" class="bg-white divide-y divide-gray-200">
          <UserRowComponent
            v-for="user in userList"
            :key="user.id"
            :user="user"
            :ban-user="banUser"
            :unban-user="unbanUser"
            :delete-user="deleteUser"
          />
        </tbody>
        <tbody v-else class="bg-white">
          <tr>
            <td colspan="5" class="px-6 py-12 text-center">
              <div class="text-gray-500">
                <div class="mb-2 text-4xl">👥</div>
                <div class="mb-1 font-medium text-lg">No users found</div>
                <div class="text-sm">
                  Get started by adding your first user.
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
