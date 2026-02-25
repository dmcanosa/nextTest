/**
 * Error Handler Utility
 * Centralizes error handling, logging, and user-friendly messages
 */

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ERROR_CODES = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  AUTH_EMAIL_EXISTS: 'AUTH_EMAIL_EXISTS',
  DB_ERROR: 'DB_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SIGNATURE_ERROR: 'SIGNATURE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password.',
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: 'User account not found.',
  [ERROR_CODES.AUTH_EMAIL_EXISTS]: 'Email already registered.',
  [ERROR_CODES.DB_ERROR]: 'Database operation failed. Please try again.',
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ERROR_CODES.SIGNATURE_ERROR]: 'Failed to process signature. Please try again.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Map Supabase error to app error
 */
export function parseSupabaseError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const err = error as any;
  const message = err?.message || err?.error_description || 'Unknown error';

  // Handle specific Supabase errors
  if (message.includes('Invalid login credentials')) {
    return new AppError(
      ERROR_CODES.AUTH_INVALID_CREDENTIALS,
      ERROR_MESSAGES[ERROR_CODES.AUTH_INVALID_CREDENTIALS],
      401,
      error
    );
  }

  if (message.includes('User not found')) {
    return new AppError(
      ERROR_CODES.AUTH_USER_NOT_FOUND,
      ERROR_MESSAGES[ERROR_CODES.AUTH_USER_NOT_FOUND],
      404,
      error
    );
  }

  if (message.includes('already registered') || message.includes('duplicate key')) {
    return new AppError(
      ERROR_CODES.AUTH_EMAIL_EXISTS,
      ERROR_MESSAGES[ERROR_CODES.AUTH_EMAIL_EXISTS],
      409,
      error
    );
  }

  // Default to unknown error
  return new AppError(
    ERROR_CODES.UNKNOWN_ERROR,
    ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR],
    500,
    error
  );
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  const appError = parseSupabaseError(error);
  return appError.message;
}

/**
 * Logger utility
 */
export function logError(error: unknown, context?: string) {
  const appError = error instanceof AppError ? error : parseSupabaseError(error);

  console.error(
    `[${context || 'ERROR'}] ${appError.code}: ${appError.message}`,
    appError.details
  );

  // In production, you could send to error tracking service (e.g., Sentry)
  if (process.env.NODE_ENV === 'production') {
    // Send to error tracking service
  }
}
