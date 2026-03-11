/**
 * Role-based access control (RBAC) utilities
 * Defines user roles and permission checks
 */

export type UserRole = 'student' | 'parent' | 'admin' | 'counselor';

export const USER_ROLES = {
  STUDENT: 'student' as const,
  PARENT: 'parent' as const,
  ADMIN: 'admin' as const,
  COUNSELOR: 'counselor' as const,
} as const;

/**
 * Route access permissions by role
 */
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/dashboard': ['student'],
  '/overview': ['parent'],
  '/admin': ['admin', 'counselor'],
};

/**
 * Check if a user role has access to a specific route
 */
export function hasRouteAccess(role: UserRole | null, path: string): boolean {
  if (!role) return false;

  // Find matching route pattern
  for (const [routePattern, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    if (path.startsWith(routePattern)) {
      return allowedRoles.includes(role);
    }
  }

  return false;
}

/**
 * Get default redirect path for a user role
 */
export function getDefaultRedirect(role: UserRole): string {
  switch (role) {
    case 'student':
      return '/dashboard';
    case 'parent':
      return '/overview';
    case 'admin':
    case 'counselor':
      return '/admin';
    default:
      return '/';
  }
}

/**
 * Check if role has write permissions (parents are read-only)
 */
export function canWrite(role: UserRole): boolean {
  return role !== 'parent';
}

/**
 * Check if user is admin or counselor
 */
export function isStaff(role: UserRole): boolean {
  return role === 'admin' || role === 'counselor';
}
