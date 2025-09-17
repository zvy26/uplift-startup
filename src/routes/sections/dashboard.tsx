import { RouteObject } from 'react-router-dom';

import Index from '@/pages/Index';
import IeltsWriting from '@/pages/IeltsWriting';
import MySubmissions from '@/pages/MySubmissions';
import { AuthGuard } from '@/auth/guard';

export const dashboard: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        path: '',
        element: (
          <AuthGuard>
            <Index />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/ielts-writing',
    children: [
      {
        path: '',
        element: (
          <AuthGuard>
            <IeltsWriting />
          </AuthGuard>
        ),
      },
    ],
  },
  {
    path: '/my-submissions',
    children: [
      {
        path: '',
        element: (
          <AuthGuard>
            <MySubmissions />
          </AuthGuard>
        ),
      },
    ],
  },
];
