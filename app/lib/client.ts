import { createAuthClient } from "better-auth/vue"
import { admin } from "better-auth/plugins"
export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:6969",
    fetchOptions: {
        credentials: "include"
    },
    plugins: [
        admin()
    ]
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient

export const session = authClient.$Infer.Session