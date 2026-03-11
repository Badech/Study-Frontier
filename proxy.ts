/**
 * Next.js Middleware for route protection and authentication
 * Runs on every request to check auth status and enforce RBAC
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { ROUTE_PERMISSIONS, type UserRole } from '@/lib/auth/roles';

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/process',
  '/institutions',
  '/study-usa',
  '/privacy',
  '/terms',
  '/refund',
];

// Auth routes
const AUTH_ROUTES = ['/login', '/signup'];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => path === route || path.startsWith(route))) {
    return response;
  }

  // If not authenticated and trying to access protected route
  if (!user && !AUTH_ROUTES.some((route) => path.startsWith(route))) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(redirectUrl);
  }

  // If authenticated and trying to access auth routes, redirect to dashboard
  if (user && AUTH_ROUTES.some((route) => path.startsWith(route))) {
    // Get user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role) {
      const role = profile.role as UserRole;
      let redirectPath = '/';

      switch (role) {
        case 'student':
          redirectPath = '/dashboard';
          break;
        case 'parent':
          redirectPath = '/overview';
          break;
        case 'admin':
        case 'counselor':
          redirectPath = '/admin';
          break;
      }

      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
  }

  // Check role-based access for protected routes
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role) {
      const role = profile.role as UserRole;

      // Check if user has access to this route
      for (const [routePattern, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
        if (path.startsWith(routePattern)) {
          if (!allowedRoles.includes(role)) {
            // Redirect to appropriate dashboard
            let redirectPath = '/';
            switch (role) {
              case 'student':
                redirectPath = '/dashboard';
                break;
              case 'parent':
                redirectPath = '/overview';
                break;
              case 'admin':
              case 'counselor':
                redirectPath = '/admin';
                break;
            }
            return NextResponse.redirect(new URL(redirectPath, request.url));
          }
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
