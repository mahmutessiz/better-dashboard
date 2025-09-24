# Better Dashboard

A Nuxt.js application with better-auth integration and admin dashboard functionality.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Backend Configuration](#backend-configuration)
- [CORS Configuration](#cors-configuration)
- [Better-Auth Admin Plugin](#better-auth-admin-plugin)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)

## Overview

This dashboard application integrates with better-auth for authentication and provides an admin interface to manage users. The frontend is built with Nuxt.js and Tailwind CSS, while authentication is handled by better-auth.

## Prerequisites

- Node.js (v18 or higher)
- A separate backend server running better-auth on port 6969 (for the default configuration)

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

2. Configure your backend server with better-auth (see Backend Configuration section below)

## Backend Configuration

This application requires a separate backend server running better-auth. Here's how to set it up:

### Setting up the Better-Auth Backend

Create a new Node.js project for your backend:

```bash
mkdir my-backend
cd my-backend
npm init -y
npm install better-auth @better-auth/adapter-drizzle better-sqlite3
```

Create a basic authentication API:

```javascript
// backend/index.js
import { betterAuth } from "better-auth";
import { sqlite } from "@better-auth/adapter-drizzle";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

// Initialize SQLite database
const sqliteDb = new Database("sqlite.db");
const db = drizzle(sqliteDb);

// Initialize better-auth
export const auth = betterAuth({
  database: sqlite(db),
  emailAndPassword: {
    enabled: true,
  },
  // Add admin plugin
  plugins: [
    import("better-auth/plugins").then((m) => m.admin)({
      enabled: true,
    }),
  ],
});

// Create an HTTP server
import { createAuthHttpHandler } from "better-auth/http";
import { serve } from "@hono/node-server";

const handler = createAuthHttpHandler(auth);

const port = 6969;
serve(
  {
    fetch: handler,
    port: port,
  },
  () => {
    console.log(`Server running on http://localhost:${port}`);
  }
);
```

For TypeScript users, use this configuration:

```typescript
// backend/index.ts
import { betterAuth } from "better-auth";
import { sqlite } from "@better-auth/adapter-drizzle";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

// Initialize SQLite database
const sqliteDb = new Database("sqlite.db");
const db = drizzle(sqliteDb);

// Initialize better-auth
export const auth = betterAuth({
  database: sqlite(db),
  emailAndPassword: {
    enabled: true,
  },
  // Add admin plugin
  plugins: [
    import("better-auth/plugins").then((m) => m.admin)({
      enabled: true,
    }),
  ],
});

// Create an HTTP server
import { createAuthHttpHandler } from "better-auth/http";
import { serve } from "@hono/node-server";

const handler = createAuthHttpHandler(auth);

const port = 6969;
serve(
  {
    fetch: handler,
    port: port,
  },
  () => {
    console.log(`Server running on http://localhost:${port}`);
  }
);
```

Add a start script to your backend package.json:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "tsx watch index.ts"
  }
}
```

## CORS Configuration

CORS must be configured in your backend to allow requests from your frontend application:

```javascript
// In your backend configuration
export const auth = betterAuth({
  // ... other configuration
  trustHost: true,
  cors: {
    origin: [
      "http://localhost:3001", // Default frontend port for this dashboard
      "http://localhost:3000", // Alternative port
      // Add your production URL here
      "https://yourdomain.com",
    ],
    credentials: true,
  },
});
```

## Better-Auth Admin Plugin

This dashboard uses the admin plugin to manage users. To enable the admin plugin:

1. Install the admin plugin in your backend:

```bash
npm install better-auth
```

2. Enable the admin plugin in your backend configuration:

```javascript
export const auth = betterAuth({
  // ... other configuration
  plugins: [
    // Enable admin plugin
    import("better-auth/plugins").then((m) => m.admin)({
      enabled: true,
      adminUserEmails: ["admin@example.com"], // Optional: specify admin user emails
    }),
  ],
});
```

3. The admin plugin provides several features:
   - User management (list, ban, unban, delete users)
   - Role management
   - User statistics

## Environment Variables

You can customize the backend URL using environment variables.

### Frontend Environment Variables

Create a `.env` file in your frontend project root:

```env
# The URL of your backend server
NUXT_PUBLIC_BACKEND_URL=http://localhost:6969
```

Then update the client configuration in `app/lib/client.ts` to use the environment variable:

```typescript
import { createAuthClient } from "better-auth/vue";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NUXT_PUBLIC_BACKEND_URL || "http://localhost:6969",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [adminClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

export const session = authClient.$Infer.Session;
```

### Backend Environment Variables

Create a `.env` file in your backend project root:

```env
# Database
DATABASE_URL=file:./db.sqlite

# Session
SESSION_SECRET=your-session-secret-here

# Admin
ADMIN_USER_EMAILS=admin@example.com,admin2@example.com
```

## Development

1. Start your backend server:

```bash
cd my-backend
npm run dev
```

2. Start the frontend development server:

```bash
npm run dev
# or
bun run dev
```

The dashboard will be available at `http://localhost:3001` (as configured in package.json).

## Production

### Building for Production

Build the application for production:

```bash
npm run build
# or
bun run build
```

### Previewing Production Build

Preview the production build locally:

```bash
npm run preview
# or
bun run preview
```

## API Routes

The dashboard uses a proxy endpoint to communicate with the backend:

```typescript
// server/api/session.get.ts
export default defineEventHandler(async (event) => {
  try {
    // Get cookies from the incoming request
    const cookies = parseCookies(event);

    // Forward the request to your backend
    const response = await $fetch(
      "http://localhost:6969/api/auth/get-session",
      {
        headers: {
          Cookie: Object.entries(cookies)
            .map(([key, value]) => `${key}=${value}`)
            .join("; "),
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Session fetch error:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch session",
    });
  }
});
```

## Customization

### Adding New Admin Features

To add new admin features:

1. Extend the admin plugin configuration in your backend
2. Update the dashboard UI in the `components/admin/` directory
3. Ensure API routes are properly configured to handle new operations

### Styling

The dashboard uses Tailwind CSS for styling. You can customize the appearance by:

1. Modifying `app/assets/css/main.css`
2. Adjusting the Tailwind configuration if needed
3. Updating component styles directly

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure your backend allows requests from `http://localhost:3001`
2. **Authentication not working**: Verify that the backend server is running and accessible
3. **Admin features not showing**: Make sure the admin plugin is enabled in your backend

### Debugging Tips

1. Check browser console for errors
2. Verify that the backend server is running on the expected port
3. Confirm that your user has admin privileges if using role-based access

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is licensed under the MIT License.
