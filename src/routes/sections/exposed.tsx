import About from '@/pages/About';
import Pricing from '@/pages/Pricing';
import Rubrics from '@/pages/Rubrics';
import { RouteObject } from 'react-router-dom';

export const exposed: RouteObject[] = [
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/rubrics',
    element: <Rubrics />,
  },
];
