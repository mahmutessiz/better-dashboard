<script setup lang="ts">
import HeaderComponent from "~/components/admin/HeaderComponent.vue";
import UsersTableComponent from "~/components/admin/UsersTableComponent.vue";
import SidebarComponent from "~/components/admin/SidebarComponent.vue";
import StatCardComponet from "~/components/admin/StatCardComponet.vue";
import { authClient } from "~/lib/client";
import type { Session } from "~/types/general";

const { signOut } = authClient;
const { data: session } = await useFetch<Session>("/api/session", {
  credentials: "include",
});
const { data: getUsers } = await authClient.admin.listUsers({
  query: { limit: 100, offset: 0, sortBy: "createdAt" },
});

const handleSignout = async () => {
  await signOut({ fetchOptions: { onSuccess: async () => navigateTo("/") } });
};

const banUser = async (userId: string) => {
  await authClient.admin.banUser({
    userId,
    banReason: "Spamming",
    banExpiresIn: 60 * 60 * 24 * 7,
  });
  window.location.reload();
};

const unbanUser = async (userId: string) => {
  await authClient.admin.unbanUser({ userId });
  window.location.reload();
};

const userList = computed(() => getUsers?.users ?? []);
const currentUser = computed(() => session.value?.user);
const isAuthenticated = computed(() => !!session.value?.user);

const navigationItems = [
  { name: "Dashboard", icon: "📊", active: true },
  { name: "Users", icon: "👥", active: false },
  { name: "Settings", icon: "⚙️", active: false },
  { name: "Reports", icon: "📈", active: false },
];

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
    value: userList.value.filter((u) => u.role === "admin").length,
    icon: "🛡️",
    color: "bg-purple-500",
  },
  {
    title: "Regular Users",
    value: userList.value.filter((u) => u.role !== "admin").length,
    icon: "👤",
    color: "bg-orange-500",
  },
]);
</script>

<template>
  <div class="bg-gray-50 min-h-screen">
    <header-component
      :current-user="currentUser"
      :handle-signout="handleSignout"
    />
    <div class="flex">
      <sidebar-component :navigation-items="navigationItems" />
      <main class="flex-1 p-6">
        <stat-card-componet :stats="stats" />
        <users-table-component
          :user-list="userList"
          :ban-user="banUser"
          :unban-user="unbanUser"
        />
      </main>
    </div>
  </div>
</template>
