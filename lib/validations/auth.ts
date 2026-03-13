/**
 * Authentication validation schemas
 * Sprint 03: Auth and roles
 * Provides validation for signup, signin, and password requirements
 */

import { z } from 'zod';
import type { UserRole } from '@/lib/auth/roles';

/**
 * Password validation requirements
 * - Minimum 8 characters (Supabase default is 6, we're strengthening it)
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must not exceed 72 characters') // bcrypt limit
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(5, 'Email is too short')
  .max(255, 'Email is too long')
  .toLowerCase()
  .trim();

/**
 * Full name validation
 */
export const fullNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name is too long')
  .trim()
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

/**
 * Phone number validation (international format)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code')
  .optional()
  .or(z.literal(''));

/**
 * User role validation
 */
export const userRoleSchema = z.enum(['student', 'parent', 'admin', 'counselor']);

/**
 * Sign up validation schema
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema,
  role: userRoleSchema,
  phone: phoneSchema.optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Sign in validation schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type SignInInput = z.infer<typeof signInSchema>;

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset schema (with token)
 */
export const passwordResetSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

/**
 * Profile update schema
 */
export const updateProfileSchema = z.object({
  fullName: fullNameSchema.optional(),
  phone: phoneSchema.optional(),
  // Add other profile fields as needed
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
