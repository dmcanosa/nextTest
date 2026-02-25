/**
 * Shared Authentication Utilities for Both Projects
 * 
 * This file contains reusable auth functions that apply to both Web and Mobile.
 * Projects should import and adapt as needed.
 * 
 * Copy to:
 * - Web: app/lib/auth-utils.ts
 * - Mobile: utils/auth-utils.ts
 */

import { z } from 'zod';

/**
 * Validation Schemas
 */
export const EmailSchema = z.string().email('Please enter a valid email address.');

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const SignUpFormSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const SignInFormSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Type exports for use in components
 */
export type SignUpFormData = z.infer<typeof SignUpFormSchema>;
export type SignInFormData = z.infer<typeof SignInFormSchema>;

/**
 * Validate sign-up form data
 */
export function validateSignUp(data: unknown) {
  return SignUpFormSchema.safeParse(data);
}

/**
 * Validate sign-in form data
 */
export function validateSignIn(data: unknown) {
  return SignInFormSchema.safeParse(data);
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: unknown): boolean {
  return error instanceof z.ZodError;
}

/**
 * Extract field errors from validation result
 */
export interface FieldErrors {
  name?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
}

export function getFieldErrors(error: z.ZodError | undefined): FieldErrors {
  if (!error) return {};

  return error.flatten().fieldErrors as FieldErrors;
}
