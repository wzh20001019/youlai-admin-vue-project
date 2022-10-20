export const childRoutes = [
  {
    path: 'dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    name: 'Dashboard',
    meta: { title: 'dashboard', icon: 'homepage', affix: true },
  },
  {
    path: '401',
    component: () => import('@/views/error-page/401.vue'),
    meta: { hidden: true },
  },
  {
    path: 'user',
    component: () => import('@/views/system/user/index.vue'),
    meta: { hidden: true },
  },
  {
    path: 'menu',
    component: () => import('@/views/system/menu/index.vue'),
    meta: { hidden: true },
  },
]
