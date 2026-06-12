import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAdminSessionStore } from '../stores/adminSessionStore';

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const sessionStore = useAdminSessionStore();
  const token = localStorage.getItem('neargrab_admin_access_token');

  // Hydrate admin session on route transition if token is present
  if (token && !sessionStore.state.isAuthenticated && !sessionStore.state.isLoading) {
    await sessionStore.initSession();
  }

  next();
});

export default router;
