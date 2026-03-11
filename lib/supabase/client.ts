import { createBrowserClient } from "@supabase/ssr";

/**
 * Create a Supabase client for use in Client Components
 * This client uses browser-side cookies and session management
 */
export function createClient() {
  // TODO: Add environment variables in .env.local
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
