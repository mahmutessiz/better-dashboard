// composables/useAuthClient.ts
import { createAuthClient } from "better-auth/vue"
import { adminClient } from "better-auth/client/plugins"

export function useAuthClient() {
  const config = useRuntimeConfig()
  const authClient = createAuthClient({
    baseURL: config.public.baseURL,
    fetchOptions: {
      credentials: "include"
    },
    plugins: [
      adminClient(),
    ]
  })

  return { authClient }
}