import { reactive, readonly } from 'vue';
import { adminAuthService } from '../services/adminAuthService';
import apiClient from '../services/apiClient';

const VALID_ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "SUPPORT_ADMIN", "CONTENT_ADMIN"];

const addAvatarInitials = (admin) => {
  if (!admin) return null;
  const initials = admin.name
    ? admin.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';
  return {
    ...admin,
    avatarInitials: initials
  };
};

const state = reactive({
  admin: addAvatarInitials(JSON.parse(localStorage.getItem('neargrab_admin_user') || 'null')),
  accessToken: localStorage.getItem('neargrab_admin_access_token') || null,
  refreshToken: localStorage.getItem('neargrab_admin_refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('neargrab_admin_access_token'),
  isLoading: false,
  error: null
});

// Configure onUnauthorized callback for admin apiClient
apiClient.onUnauthorized = () => {
  localStorage.removeItem('neargrab_admin_access_token');
  localStorage.removeItem('neargrab_admin_refresh_token');
  localStorage.removeItem('neargrab_admin_user');
  state.admin = null;
  state.accessToken = null;
  state.refreshToken = null;
  state.isAuthenticated = false;
  state.error = 'Session expired. Please log in again.';
};

export const useAdminSessionStore = () => {
  const initSession = async () => {
    state.isLoading = true;
    state.error = null;
    try {
      const currentAdmin = await adminAuthService.getCurrentAdmin();
      if (currentAdmin) {
        if (!VALID_ADMIN_ROLES.includes(currentAdmin.role)) {
          await adminAuthService.logout();
          state.admin = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.error = 'Unauthorized access: Invalid admin role.';
          return;
        }
        state.admin = addAvatarInitials(currentAdmin);
        state.accessToken = localStorage.getItem('neargrab_admin_access_token');
        state.refreshToken = localStorage.getItem('neargrab_admin_refresh_token');
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    } catch (err) {
      console.error('Failed to init session', err);
      state.isAuthenticated = false;
      state.error = err.message || 'Session verification failed';
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
        const admin = res.admin;
        if (!VALID_ADMIN_ROLES.includes(admin.role)) {
          await adminAuthService.logout();
          state.error = 'Unauthorized access: Invalid admin role.';
          return false;
        }
        state.admin = addAvatarInitials(admin);
        state.accessToken = localStorage.getItem('neargrab_admin_access_token');
        state.refreshToken = localStorage.getItem('neargrab_admin_refresh_token');
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
    state.isLoading = true;
    try {
      await adminAuthService.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      state.admin = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    }
  };

  return {
    state: readonly(state),
    initSession,
    login,
    logout
  };
};
