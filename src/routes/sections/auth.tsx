import { RouteObject } from 'react-router-dom';

import { Login } from '@/modules/auth/ui/Login';

export const authRoutes: RouteObject[] = [
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <Login />,
      },
    ],
  },
];
