import { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { useAuthContext } from '@/auth/hooks/useAuthContext';

import { notFound } from './404';
import { authRoutes } from './auth';
import { dashboard } from './dashboard';
import { exposed } from './exposed';

export const Router = () => {
  const { authenticated, unauthenticated, loading } = useAuthContext();

  const routes = [
    ...exposed,
    ...dashboard, // Allow access to main page for all users
    ...(unauthenticated ? authRoutes : []), // Only show auth routes if authenticated
    ...notFound,
  ];

  const router = createBrowserRouter(routes);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  );
};
