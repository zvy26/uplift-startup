import NotFound from '@/pages/NotFound';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

export const notFound: RouteObject[] = [
  {
    path: '*',
    element: <NotFound />,
  },
];
