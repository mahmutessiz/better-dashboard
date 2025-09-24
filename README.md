# Better Dashboard

A Nuxt.js application with better-auth integration and admin dashboard functionality.

## Overview

This dashboard application integrates with better-auth for authentication and provides an admin interface to manage users. The frontend is built with Nuxt.js and Tailwind CSS, while authentication is handled by better-auth.

## Setup

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Make sure your backend server has the better-auth admin plugin enabled (see configuration below)

## Admin Plugin Configuration

### Backend Setup

Enable the admin plugin in your better-auth configuration:

```ts
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  // ... other config options
  plugins: [
    admin({
      // Optional: specify admin user emails
      adminUserIds: ["your-admin-user-id"],
      // Optional: set default role for new users
      defaultRole: "user",
      // Optional: define custom admin roles
      adminRoles: ["admin", "superadmin"],
    }),
  ],
});
```

### Database Migration

After adding the plugin, run the migration to add the necessary fields:

```bash
npx @better-auth/cli migrate
```

### Client Plugin Setup

In your Nuxt app, make sure the admin client plugin is enabled:

```ts
// app/lib/client.ts
import { createAuthClient } from "better-auth/vue";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:6969", // Your backend URL
  fetchOptions: {
    credentials: "include",
  },
  plugins: [adminClient()],
});
```

## Important Admin Functions

The admin dashboard provides these key user management capabilities:

### List Users

```ts
const { data: users } = await authClient.admin.listUsers({
  query: {
    limit: 100,
    offset: 0,
    sortBy: "createdAt",
  },
});
```

### Ban/Unban Users

```ts
// Ban a user
await authClient.admin.banUser({
  userId: "user-id",
  banReason: "Violation of terms",
  banExpiresIn: 60 * 60 * 24 * 7, // 1 week
});

// Unban a user
await authClient.admin.unbanUser({ userId: "user-id" });
```

### Set User Role

```ts
await authClient.admin.setRole({
  userId: "user-id",
  role: "admin",
});
```

### Remove User

```ts
await authClient.admin.removeUser({ userId: "user-id" });
```

### User Impersonation

```ts
// Impersonate a user
await authClient.admin.impersonateUser({ userId: "user-id" });

// Stop impersonating
await authClient.admin.stopImpersonating({});
```

## CORS Configuration

Make sure your backend allows requests from your frontend:

```ts
export const auth = betterAuth({
  // ... other options
  cors: {
    origin: [
      "http://localhost:3001", // Default port for this dashboard
      // Add your production URL
    ],
    credentials: true,
  },
});
```

## Environment Variables

You can configure the backend URL using environment variables:

```env
# .env
NUXT_PUBLIC_BACKEND_URL=http://localhost:6969
```

## Development

Start the development server:

```bash
npm run dev
# or
bun run dev
```

The dashboard will be available at `http://localhost:3001` (as configured in package.json).

## Admin Access

To become an admin user:

1. Register an account on your backend
2. Either assign the "admin" role to the user in your database, or
3. Add the user ID to the `adminUserIds` option in your backend configuration

## Troubleshooting

- **Admin features not showing**: Verify that your user has admin privileges
- **CORS errors**: Ensure your backend allows requests from the frontend origin
- **Authentication issues**: Confirm that the backend server is running and accessible
