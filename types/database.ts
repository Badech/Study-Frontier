/**
 * Supabase Database Types
 * Sprint 02: Database-specific type definitions
 * 
 * This file contains Supabase-specific types for database operations
 */

import { Database as DatabaseGenerated } from './supabase';

// ============================================================================
// DATABASE TYPE HELPERS
// ============================================================================

/**
 * Helper type to extract table row types from Supabase
 * Usage: Tables<'profiles'> returns the type for a profiles table row
 */
export type Tables<T extends keyof DatabaseGenerated['public']['Tables']> =
  DatabaseGenerated['public']['Tables'][T]['Row'];

/**
 * Helper type for table insert operations
 * Usage: TablesInsert<'profiles'> returns the type for inserting into profiles
 */
export type TablesInsert<T extends keyof DatabaseGenerated['public']['Tables']> =
  DatabaseGenerated['public']['Tables'][T]['Insert'];

/**
 * Helper type for table update operations
 * Usage: TablesUpdate<'profiles'> returns the type for updating profiles
 */
export type TablesUpdate<T extends keyof DatabaseGenerated['public']['Tables']> =
  DatabaseGenerated['public']['Tables'][T]['Update'];

// ============================================================================
// SUPABASE CLIENT TYPES
// ============================================================================

/**
 * Type for Supabase client instances
 * Used for type-safe database operations
 */
export type SupabaseClient = ReturnType<typeof import('@supabase/supabase-js').createClient>;

// ============================================================================
// QUERY FILTER TYPES
// ============================================================================

/**
 * Common filter options for list queries
 */
export interface QueryFilters {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
}

/**
 * Student-specific filters
 */
export interface StudentFilters extends QueryFilters {
  stage?: string;
  is_active?: boolean;
  qualification_label?: string;
}

/**
 * Lead-specific filters
 */
export interface LeadFilters extends QueryFilters {
  status?: string;
  source?: string;
  date_from?: string;
  date_to?: string;
}

/**
 * Document-specific filters
 */
export interface DocumentFilters extends QueryFilters {
  student_id?: string;
  status?: string;
  category?: string;
  is_required?: boolean;
}

/**
 * Appointment filters
 */
export interface AppointmentFilters extends QueryFilters {
  student_id?: string;
  type?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

/**
 * Payment filters
 */
export interface PaymentFilters extends QueryFilters {
  student_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}

// ============================================================================
// DATABASE OPERATION RESULTS
// ============================================================================

/**
 * Result type for database operations
 */
export interface DbResult<T = any> {
  data: T | null;
  error: Error | null;
}

/**
 * Result type for list queries with pagination
 */
export interface DbListResult<T = any> {
  data: T[] | null;
  error: Error | null;
  count?: number;
}

// ============================================================================
// STORAGE TYPES
// ============================================================================

/**
 * Storage bucket names
 */
export type StorageBucket = 'documents' | 'avatars' | 'attachments';

/**
 * File upload options
 */
export interface FileUploadOptions {
  bucket: StorageBucket;
  path: string;
  file: File;
  upsert?: boolean;
}

/**
 * File metadata
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

// ============================================================================
// RLS POLICY HELPERS
// ============================================================================

/**
 * Type for RLS policy context
 * Used in server-side operations to bypass RLS when needed
 */
export interface RLSContext {
  bypass_rls?: boolean;
  user_id?: string;
  user_role?: string;
}

// ============================================================================
// MIGRATION TYPES
// ============================================================================

/**
 * Migration metadata
 */
export interface Migration {
  id: string;
  name: string;
  executed_at: string;
}

// ============================================================================
// PLACEHOLDER FOR GENERATED TYPES
// ============================================================================

/**
 * This interface will be replaced by Supabase-generated types
 * Run: npx supabase gen types typescript --project-id <project-id> > types/supabase.ts
 * 
 * For now, we define a minimal structure
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: any;
        Insert: any;
        Update: any;
      };
      students: {
        Row: any;
        Insert: any;
        Update: any;
      };
      // Add other tables as needed
      [key: string]: {
        Row: any;
        Insert: any;
        Update: any;
      };
    };
    Views: {
      [key: string]: {
        Row: any;
      };
    };
    Functions: {
      [key: string]: any;
    };
  };
}

// ============================================================================
// NOTES
// ============================================================================

/*
USAGE INSTRUCTIONS:

1. After setting up Supabase project, generate types:
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts

2. Import the generated Database type and use it:
   import { Database } from './supabase';

3. Use helper types for type-safe operations:
   const profile: Tables<'profiles'> = await supabase
     .from('profiles')
     .select('*')
     .single();

4. For insert operations:
   const newStudent: TablesInsert<'students'> = {
     id: userId,
     city: 'Casablanca',
     // ... other fields
   };

5. For update operations:
   const update: TablesUpdate<'students'> = {
     current_stage: 'documents',
     stage_updated_at: new Date().toISOString()
   };

FUTURE ENHANCEMENTS:

- Generate types automatically on schema changes
- Add custom database functions types
- Add view types for complex queries
- Add materialized view types for analytics
*/
