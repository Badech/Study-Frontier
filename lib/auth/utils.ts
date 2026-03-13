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
 * Returns the authenticated user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Unexpected error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Get current user profile with role
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error getting user:', userError);
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Error getting profile:', profileError);
      return null;
    }

    return {
      id: profile.id,
      email: user.email!,
      role: profile.role as UserRole,
      full_name: profile.full_name,
      phone: profile.phone,
      created_at: profile.created_at,
    };
  } catch (error) {
    console.error('Unexpected error in getUserProfile:', error);
    return null;
  }
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
  try {
    const supabase = createBrowserClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return {
      id: profile.id,
      email: user.email!,
      role: profile.role as UserRole,
      full_name: profile.full_name,
      phone: profile.phone,
      created_at: profile.created_at,
    };
  } catch (error) {
    console.error('Unexpected error in getUserProfileClient:', error);
    return null;
  }
}
