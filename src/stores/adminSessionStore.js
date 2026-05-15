import { reactive, readonly } from 'vue';
import { adminAuthService } from '../services/adminAuthService';

const state = reactive({
  admin: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
});

export const useAdminSessionStore = () => {
  const initSession = async () => {
    state.isLoading = true;
    try {
      const currentAdmin = await adminAuthService.getCurrentAdmin();
      if (currentAdmin) {
        state.admin = currentAdmin;
        state.isAuthenticated = true;
      }
    } catch (err) {
      console.error('Failed to init session', err);
    } finally {
      state.isLoading = false;
    }
  };

  const login = async (email, password) => {
    state.isLoading = true;
    state.error = null;
    try {
      const res = await adminAuthService.login(email, password);
      if (res.success) {
        state.admin = res.admin;
        state.isAuthenticated = true;
        return true;
      }
    } catch (err) {
      state.error = err.message || 'Login failed';
      return false;
    } finally {
      state.isLoading = false;
    }
  };

  const logout = async () => {
    await adminAuthService.logout();
    state.admin = null;
    state.isAuthenticated = false;
  };

  return {
    state: readonly(state),
    initSession,
    login,
    logout
  };
};
