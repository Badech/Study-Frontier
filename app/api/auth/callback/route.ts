/**
 * Auth callback route for OAuth flows
 * Handles the callback from Supabase after email confirmation or OAuth login
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      // Validate 'next' parameter to prevent open redirect attacks
      // Only allow relative paths starting with '/' and not containing protocol
      let redirectPath = '/';
      if (next && typeof next === 'string') {
        // Sanitize the redirect path
        const sanitized = next.trim();
        // Only allow paths that start with / and don't start with //
        // Also block common XSS patterns
        if (
          sanitized.startsWith('/') && 
          !sanitized.startsWith('//') &&
          !sanitized.includes('javascript:') &&
          !sanitized.includes('data:') &&
          !sanitized.includes('<') &&
          !sanitized.includes('>')
        ) {
          redirectPath = sanitized;
        }
      }

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`);
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-code-error`);
}
