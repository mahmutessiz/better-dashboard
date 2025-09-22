<script setup lang="ts">
import { authClient } from "~/lib/client";

type Session = {
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
    banned: boolean | null | undefined;
    role?: string | null | undefined;
    banReason?: string | null | undefined;
    banExpires?: Date | null | undefined;
  };
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
    impersonatedBy?: string | null | undefined;
  };
};

const { signOut } = authClient;
const { data: session } = await useFetch<Session>("/api/session", {
  credentials: "include",
});

const { data: getUsers } = await authClient.admin.listUsers({
  query: {
    limit: 100,
    offset: 0,
    sortBy: "createdAt",
  },
});

const handleSignout = async () => {
  try {
    await signOut({
      fetchOptions: {
        onSuccess: async () => {
          await navigateTo("/");
        },
      },
    });
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

const userList = computed(() => getUsers?.users ?? []);

// Current user info from session
const currentUser = computed(() => session.value?.user);
const isAuthenticated = computed(() => !!session.value?.user);

// Sidebar navigation items
const navigationItems = [
  { name: "Dashboard", icon: "📊", active: true },
  { name: "Users", icon: "👥", active: false },
  { name: "Settings", icon: "⚙️", active: false },
  { name: "Reports", icon: "📈", active: false },
];

// Stats for dashboard cards
const stats = computed(() => [
  {
    title: "Total Users",
    value: userList.value.length,
    icon: "👥",
    color: "bg-blue-500",
  },
  {
    title: "Active Sessions",
    value: isAuthenticated.value ? 1 : 0,
    icon: "🟢",
    color: "bg-green-500",
  },
  {
    title: "Admins",
    value: userList.value.filter((user) => user.role === "admin").length,
    icon: "🛡️",
    color: "bg-purple-500",
  },
  {
    title: "Regular Users",
    value: userList.value.filter((user) => user.role !== "admin").length,
    icon: "👤",
    color: "bg-orange-500",
  },
]);
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header -->
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

    <div class="flex">
      <!-- Sidebar -->
      <aside
        class="bg-white shadow-sm border-gray-200 border-r w-64 min-h-screen"
      >
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

        <!-- Sidebar Footer -->
        <div class="right-4 bottom-4 left-4 absolute">
          <div class="bg-gray-50 p-3 rounded-lg">
            <div class="text-gray-500 text-xs">System Status</div>
            <div class="flex items-center space-x-2 mt-1">
              <div class="bg-green-400 rounded-full w-2 h-2" />
              <span class="text-gray-700 text-sm">All Systems Operational</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <!-- Stats Cards -->
        <client-only>
          <div
            class="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8"
          >
            <div
              v-for="stat in stats"
              :key="stat.title"
              class="bg-white shadow-sm p-6 border border-gray-200 rounded-lg"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-600 text-sm">
                    {{ stat.title }}
                  </p>
                  <p class="mt-2 font-bold text-gray-900 text-3xl">
                    {{ stat.value }}
                  </p>
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
        </client-only>

        <!-- Users Table -->
        <div class="bg-white shadow-sm border border-gray-200 rounded-lg">
          <div class="px-6 py-4 border-gray-200 border-b">
            <div class="flex justify-between items-center">
              <h2 class="font-semibold text-gray-900 text-lg">
                Users Management
              </h2>
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
                  class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-white text-sm"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto">
            <client-only>
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
                <tbody
                  v-if="userList.length"
                  class="bg-white divide-y divide-gray-200"
                >
                  <tr
                    v-for="user in userList"
                    :key="user.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div
                          class="flex justify-center items-center bg-gray-200 mr-4 rounded-full w-10 h-10"
                        >
                          <span class="font-medium text-gray-700 text-sm">
                            {{ (user.name || "U").charAt(0).toUpperCase() }}
                          </span>
                        </div>
                        <div>
                          <div class="font-medium text-gray-900 text-sm">
                            {{ user.name || "Unknown" }}
                          </div>
                          <div class="text-gray-500 text-sm">
                            ID: {{ user.id }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-gray-900 text-sm">{{ user.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span
                        class="px-2 py-1 rounded-md font-medium text-xs"
                        :class="
                          user.role === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        "
                      >
                        {{ user.role || "User" }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="flex items-center text-green-600 text-sm">
                        <div class="bg-green-400 mr-2 rounded-full w-2 h-2" />
                        Active
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 font-medium text-sm text-right whitespace-nowrap"
                    >
                      <div class="flex justify-end items-center space-x-2">
                        <button class="text-blue-600 hover:text-blue-900">
                          Edit
                        </button>
                        <button class="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else class="bg-white">
                  <tr>
                    <td colspan="5" class="px-6 py-12 text-center">
                      <div class="text-gray-500">
                        <div class="mb-2 text-4xl">👥</div>
                        <div class="mb-1 font-medium text-lg">
                          No users found
                        </div>
                        <div class="text-sm">
                          Get started by adding your first user.
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </client-only>
          </div>

          <!-- Table Footer with Pagination -->
          <div class="bg-gray-50 px-6 py-3 border-gray-200 border-t">
            <div class="flex justify-between items-center">
              <client-only>
                <div class="text-gray-700 text-sm">
                  Showing <span class="font-medium">1</span> of
                  <span class="font-medium">{{ userList.length }}</span> results
                </div>
              </client-only>
              <div class="flex items-center space-x-2">
                <button
                  class="bg-white hover:bg-gray-50 disabled:opacity-50 px-3 py-1 border border-gray-300 rounded-md font-medium text-gray-500 text-sm"
                  disabled
                >
                  Previous
                </button>
                <button
                  class="bg-white hover:bg-gray-50 disabled:opacity-50 px-3 py-1 border border-gray-300 rounded-md font-medium text-gray-500 text-sm"
                  disabled
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
