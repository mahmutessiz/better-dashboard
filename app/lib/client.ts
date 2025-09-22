import { createAuthClient } from "better-auth/vue"
import { adminClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:6969",
    fetchOptions: {
        credentials: "include"
    },
    plugins: [
        adminClient(),
    ]
})

export const {
    signIn,
    signOut,
    signUp,
    useSession,
} = authClient

export const session = authClient.$Infer.Session