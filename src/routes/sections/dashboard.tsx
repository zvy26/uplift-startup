import { RouteObject } from 'react-router-dom';

import Index from '@/pages/Index';
import IeltsWriting from '@/pages/IeltsWriting';
import MySubmissions from '@/pages/MySubmissions';

export const dashboard: RouteObject[] = [
  {
    path: '/',
    children: [
      {
        path: '',
        element: <Index />,
      },
    ],
  },
  {
    path: '/ielts-writing',
    children: [
      {
        path: '',
        element: <IeltsWriting />,
      },
    ],
  },
  {
    path: '/my-submissions',
    children: [
      {
        path: '',
        element: <MySubmissions />,
      },
    ],
  },
];
