import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAdminSessionStore } from '../stores/adminSessionStore';

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const { state, initSession } = useAdminSessionStore();
  
  if (state.isLoading) {
    await initSession();
  }

  // The auth guard logic is mostly handled by the AdminLoginModal 
  // blocking the UI when not authenticated, but we could add route-level 
  // checking here if needed. For now, the App.vue will handle the modal overlay.
  next();
});

export default router;
