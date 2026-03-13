'use client';

/**
 * Reusable authentication form component
 * Handles both sign-in and sign-up flows
 * 
 * Security improvements:
 * - Client-side validation with Zod
 * - Sanitized inputs
 * - Secure error messages
 * - Rate limiting awareness
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { UserRole } from '@/lib/auth/roles';
import { signUpSchema, signInSchema, type SignUpInput, type SignInInput } from '@/lib/validations/auth';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  role?: UserRole;
  redirectTo?: string;
}

export function AuthForm({ mode, role = 'student', redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setFieldErrors({});

    const supabase = createClient();

    try {
      if (mode === 'signup') {
        // Validate signup data
        const validationResult = signUpSchema.safeParse({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          role,
        });

        if (!validationResult.success) {
          const errors: Record<string, string> = {};
          validationResult.error.issues.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0].toString()] = err.message;
            }
          });
          setFieldErrors(errors);
          setError('Please fix the errors below');
          return;
        }

        const validData = validationResult.data;

        // Sign up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: validData.email,
          password: validData.password,
          options: {
            data: {
              full_name: validData.fullName,
              role: validData.role,
            },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });

        if (signUpError) {
          // Provide user-friendly error messages
          if (signUpError.message.includes('already registered')) {
            throw new Error('This email is already registered. Please sign in instead.');
          }
          throw signUpError;
        }

        setMessage(
          'Account created! Please check your email to confirm your account.'
        );
      } else {
        // Validate signin data
        const validationResult = signInSchema.safeParse({
          email: email.trim(),
          password,
        });

        if (!validationResult.success) {
          const errors: Record<string, string> = {};
          validationResult.error.issues.forEach((err) => {
            if (err.path[0]) {
              errors[err.path[0].toString()] = err.message;
            }
          });
          setFieldErrors(errors);
          setError('Please fix the errors below');
          return;
        }

        const validData = validationResult.data;

        // Sign in
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: validData.email,
          password: validData.password,
        });

        if (signInError) {
          // Provide generic error message for security (don't reveal if email exists)
          throw new Error('Invalid email or password');
        }

        // Get user profile to determine redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        // Redirect based on role
        let redirect = redirectTo || '/';
        if (profile?.role) {
          switch (profile.role as UserRole) {
            case 'student':
              redirect = '/dashboard';
              break;
            case 'parent':
              redirect = '/overview';
              break;
            case 'admin':
            case 'counselor':
              redirect = '/admin';
              break;
          }
        }

        router.push(redirect);
        router.refresh();
      }
    } catch (err: any) {
      // Handle rate limiting
      if (err.message?.includes('rate limit') || err.status === 429) {
        setError('Too many attempts. Please try again in a few minutes.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {mode === 'signup' && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-2">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              // Clear field error on change
              if (fieldErrors.fullName) {
                setFieldErrors((prev) => ({ ...prev, fullName: '' }));
              }
            }}
            required
            aria-required="true"
            aria-invalid={!!fieldErrors.fullName}
            aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              fieldErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            autoComplete="name"
          />
          {fieldErrors.fullName && (
            <p id="fullName-error" className="text-xs text-red-600 mt-1" role="alert">
              {fieldErrors.fullName}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: '' }));
            }
          }}
          required
          aria-required="true"
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            fieldErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="you@example.com"
          autoComplete="email"
        />
        {fieldErrors.email && (
          <p id="email-error" className="text-xs text-red-600 mt-1" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) {
              setFieldErrors((prev) => ({ ...prev, password: '' }));
            }
          }}
          required
          aria-required="true"
          aria-invalid={!!fieldErrors.password}
          aria-describedby={fieldErrors.password ? "password-error" : mode === 'signup' ? "password-hint" : undefined}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="••••••••"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />
        {fieldErrors.password && (
          <p id="password-error" className="text-xs text-red-600 mt-1" role="alert">
            {fieldErrors.password}
          </p>
        )}
        {mode === 'signup' && !fieldErrors.password && (
          <p id="password-hint" className="text-xs text-gray-500 mt-1">
            Must be at least 8 characters with uppercase, lowercase, and numbers
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm" role="status" aria-live="polite">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {loading ? 'Processing...' : mode === 'signup' ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
}
