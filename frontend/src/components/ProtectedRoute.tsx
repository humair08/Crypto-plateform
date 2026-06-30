'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * Protected Route Component
 * Ensures user is authenticated before rendering children
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    // Check if user is authenticated
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
      } else if (requiredRole && user?.role !== requiredRole) {
        // Redirect if user doesn't have required role
        router.push('/dashboard');
      } else {
        // User is authenticated and has required role
        setIsChecking(false);
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook for checking if user is authenticated
 */
export function useRequireAuth(requiredRole?: string) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }

    if (!isLoading && requiredRole && user?.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, requiredRole, user, router]);

  return { isAuthenticated, user, loading: isLoading };
}
