export const routes = [
  { path: '/', redirect: '/dashboard' },
  { 
    path: '/dashboard', 
    name: 'dashboard',
    component: () => import('../pages/dashboard/DashboardPage.vue')
  },
  { 
    path: '/users', 
    name: 'users',
    component: () => import('../pages/users/UsersPage.vue')
  },
  { 
    path: '/products', 
    name: 'products',
    component: () => import('../pages/products/ProductsPage.vue')
  },
  { 
    path: '/banners', 
    name: 'banners',
    component: () => import('../pages/banners/BannersPage.vue')
  },
  { 
    path: '/visits', 
    name: 'visits',
    component: () => import('../pages/visits/VisitsPage.vue')
  }
];
