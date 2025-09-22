<script setup lang="ts">
import { ref } from "vue";
import { authClient } from "~/lib/client";

// reactive form fields
const email = ref("");
const password = ref("");

// session (fetched from your Hono backend route `/api/session`)
const { data: session, refresh } = await useFetch("/api/session", {
  credentials: "include", // important for cookies
});
console.log("session", session);

const { signIn, signOut } = authClient;

// handle login
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

// handle logout
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
        class="bg-red-500 px-4 py-2 rounded w-full text-white"
        @click="handleLogout"
      >
        Logout
      </button>
    </div>

    <form v-else class="space-y-4" @submit.prevent="handleLogin">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="px-3 py-2 border rounded w-full"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="px-3 py-2 border rounded w-full"
      />
      <button
        type="submit"
        class="bg-blue-600 px-4 py-2 rounded w-full text-white"
      >
        Login
      </button>
    </form>
  </div>
</template>
