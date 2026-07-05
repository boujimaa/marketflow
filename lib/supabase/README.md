# Supabase

Supabase client setup for MarketFlow.

- `browser.ts` creates a client for Client Components and browser-only flows.
- `server.ts` creates a client for Server Components, Server Actions, and Route Handlers.
- `env.ts` centralizes required Supabase environment variable checks.

This folder prepares the integration only. Authentication, database tables, and business logic should live in feature or server modules when they are implemented.
