<template>
  <div v-if="!sessionStore.state.isAuthenticated" class="auth-overlay">
    <div class="auth-modal">
      <div class="auth-header">
        <img src="/favicon.svg" alt="Neargrab Logo" class="auth-logo" />
        <h2>Admin Sign In</h2>
        <p>Please verify your identity to access the panel.</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            placeholder="admin@neargrab.com" 
            required 
            :disabled="sessionStore.state.isLoading"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="Enter password" 
            required 
            :disabled="sessionStore.state.isLoading"
          />
        </div>

        <div v-if="sessionStore.state.error" class="error-msg">
          {{ sessionStore.state.error }}
        </div>

        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="sessionStore.state.isLoading"
        >
          <span v-if="sessionStore.state.isLoading">Verifying...</span>
          <span v-else>Sign In</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAdminSessionStore } from '../../stores/adminSessionStore';

const sessionStore = useAdminSessionStore();

const email = ref('admin@neargrab.com');
const password = ref('admin123');

const handleLogin = async () => {
  await sessionStore.login(email.value, password.value);
};
</script>

<style scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-surface-sunken, #f4f6f8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.auth-modal {
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-logo {
  height: 48px;
  margin-bottom: 16px;
}

.auth-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.auth-header p {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color, #0f6c38);
  box-shadow: 0 0 0 3px rgba(15, 108, 56, 0.1);
}

.error-msg {
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: var(--primary-color, #0f6c38);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #0b542c;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
