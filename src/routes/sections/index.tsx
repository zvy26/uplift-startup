import { Suspense } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import { useAuthContext } from '@/auth/hooks/useAuthContext';
import { PageLoading } from '@/components/PageLoading';

import { notFound } from './404';
import { authRoutes } from './auth';
import { dashboard } from './dashboard';
import { exposed } from './exposed';

export const Router = () => {
  const { authenticated, unauthenticated, loading } = useAuthContext();
  console.log('authenticated', authenticated);

  const routes = [
    ...exposed,
    ...dashboard, // Allow access to main page for all users
    ...(unauthenticated ? authRoutes : []), // Only show auth routes if authenticated
    ...notFound,
  ];

  const router = createBrowserRouter(routes);

  if (loading) return <PageLoading />;

  return (
    <Suspense fallback={<PageLoading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
