/**
 * Authentication utility functions
 * Provides helpers for auth state management and user operations
 */

import { createClient } from '@/lib/supabase/server';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import type { UserRole } from './roles';
import type { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  created_at: string;
}

/**
 * Get current user from server component
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Get current user profile with role
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    email: user.email!,
    role: profile.role as UserRole,
    full_name: profile.full_name,
    phone: profile.phone,
    created_at: profile.created_at,
  };
}

/**
 * Sign up a new user with role
 */
export async function signUpUser(
  email: string,
  password: string,
  fullName: string,
  role: UserRole,
  metadata?: Record<string, unknown>
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        ...metadata,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign in with email and password
 */
export async function signInUser(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Client-side: Get current user
 */
export async function getCurrentUserClient(): Promise<User | null> {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Client-side: Get user profile
 */
export async function getUserProfileClient(): Promise<UserProfile | null> {
  const supabase = createBrowserClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  return {
    id: profile.id,
    email: user.email!,
    role: profile.role as UserRole,
    full_name: profile.full_name,
    phone: profile.phone,
    created_at: profile.created_at,
  };
}
