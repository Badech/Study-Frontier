'use client';

/**
 * Client-side role guard component
 * Protects UI elements based on user role
 */

import { useEffect, useState } from 'react';
import { getUserProfileClient } from '@/lib/auth/utils';
import type { UserRole } from '@/lib/auth/roles';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkAccess() {
      try {
        const profile = await getUserProfileClient();
        if (isMounted) {
          if (profile && allowedRoles.includes(profile.role)) {
            setHasAccess(true);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking role access:', error);
        if (isMounted) {
          setHasAccess(false);
          setLoading(false);
        }
      }
    }

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [allowedRoles]);

  if (loading) {
    return null; // or a loading skeleton
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

interface WriteGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Protects write operations (parents are read-only)
 */
export function WriteGuard({ children, fallback = null }: WriteGuardProps) {
  const [canWrite, setCanWrite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkWriteAccess() {
      try {
        const profile = await getUserProfileClient();
        if (isMounted) {
          // Parents cannot write
          if (profile && profile.role !== 'parent') {
            setCanWrite(true);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking write access:', error);
        if (isMounted) {
          setCanWrite(false);
          setLoading(false);
        }
      }
    }

    checkWriteAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return null; // or a loading skeleton
  }

  return canWrite ? <>{children}</> : <>{fallback}</>;
}
