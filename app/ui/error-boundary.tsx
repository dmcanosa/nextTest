/**
 * Error Page Component
 * Centralized error display with user-friendly messages
 */

'use client';

import { useRouter } from 'next/navigation';

export default function ErrorPage({
  error,
  reset,
  context = 'An error occurred',
}: {
  error: Error & { digest?: string };
  reset: () => void;
  context?: string;
}) {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-8">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <span className="text-2xl">⚠️</span>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mb-6 text-gray-700">{context}</p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 rounded border border-red-300 bg-red-100 p-4">
            <p className="font-mono text-sm text-red-800">{error.message}</p>
            {error.digest && (
              <p className="mt-2 text-xs text-red-700">Error ID: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Try again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex-1 rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
