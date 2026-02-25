/**
 * Environment Validation
 * Ensures all required environment variables are set at startup
 */

import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key is required'),
  SECRET_SIGNATURE_KEY: z.string().min(1, 'Signature encryption key is required'),
  SECRET_SIGNATURE_KEY_SALT: z.string().min(1, 'Signature salt is required'),
  SECRET_SIGNATURE_KEY_IV: z.string().min(1, 'Signature IV is required'),
  SESSION_SECRET: z.string().min(1, 'Session secret is required'),
});

export type Environment = z.infer<typeof envSchema>;

let validatedEnv: Environment | null = null;

/**
 * Validate and get environment variables
 * Should be called once at application startup
 */
export function validateEnv(): Environment {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = envSchema.parse(process.env);
    console.log('✅ Environment variables validated');
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');

      console.error('❌ Environment validation failed:\n', missingVars);
      throw new Error(`Invalid environment configuration:\n${missingVars}`);
    }
    throw error;
  }
}

/**
 * Get a specific validated environment variable
 */
export function getEnv(key: keyof Environment): string {
  const env = validateEnv();
  return env[key];
}
