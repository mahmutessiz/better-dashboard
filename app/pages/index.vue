<script setup lang="ts">
import { ref } from "vue";
// import { authClient } from "~/lib/client";
import type { Session } from "~/types/general";

const email = ref("");
const password = ref("");

const { data: session, refresh } = await useFetch<Session>("/api/session", {
  credentials: "include",
});

// const { signIn, signOut } = authClient;
const { authClient } = useAuthClient();
const { signIn, signOut } = authClient;

async function handleLogin() {
  try {
    await signIn.email({
      email: email.value,
      password: password.value,
    });

    await navigateTo("/dashboard");
  } catch (err) {
    console.error("Login failed:", err);
  }
}

async function handleLogout() {
  try {
    await signOut();
    await refresh();
  } catch (err) {
    console.error("Logout failed:", err);
  }
}
</script>

<template>
  <div class="shadow mx-auto mt-10 p-6 border rounded-lg max-w-sm">
    <h1 class="mb-4 font-bold text-xl">Login</h1>

    <div v-if="session?.user">
      <p class="mb-4">Welcome, {{ session.user.email }}</p>
      <button
        class="bg-red-500 px-4 py-2 rounded w-full text-white cursor-pointer"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>

    <form v-else class="space-y-4" @submit.prevent="handleLogin">
      <!-- prettier-ignore -->
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="px-3 py-2 border rounded w-full"
      >
      <!-- prettier-ignore -->
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="px-3 py-2 border rounded w-full"
      >
      <button
        type="submit"
        class="bg-blue-600 px-4 py-2 rounded w-full text-white cursor-pointer"
      >
        Login
      </button>
    </form>
  </div>
</template>
