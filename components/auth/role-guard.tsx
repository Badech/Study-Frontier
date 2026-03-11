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
    async function checkAccess() {
      const profile = await getUserProfileClient();
      if (profile && allowedRoles.includes(profile.role)) {
        setHasAccess(true);
      }
      setLoading(false);
    }

    checkAccess();
  }, [allowedRoles]);

  if (loading) {
    return null;
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
    async function checkWriteAccess() {
      const profile = await getUserProfileClient();
      // Parents cannot write
      if (profile && profile.role !== 'parent') {
        setCanWrite(true);
      }
      setLoading(false);
    }

    checkWriteAccess();
  }, []);

  if (loading) {
    return null;
  }

  return canWrite ? <>{children}</> : <>{fallback}</>;
}
