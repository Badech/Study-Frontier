'use client';

/**
 * Sign out button component
 * Handles user logout
 */

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

interface SignOutButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function SignOutButton({ className, children }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        throw signOutError;
      }
      
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Failed to sign out. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={className}
        aria-busy={loading}
        aria-label="Sign out of your account"
      >
        {children || (loading ? 'Signing out...' : 'Sign Out')}
      </button>
      {error && (
        <div className="text-xs text-red-600 mt-1" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </>
  );
}
