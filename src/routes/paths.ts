const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/',
};

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
      register: `${ROOTS.AUTH}/jwt/sing-up`,
    },
  },
  dashboard: {
    root: `${ROOTS.DASHBOARD}`,
    ieltsWriting: '/ielts-writing',
    mySubmissions: '/my-submissions',
  },
};
