import usersData from '../data/user.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Keep a local mutable copy for the frontend-only phase
let localUsers = [...usersData.users];
let localMetrics = { ...usersData.metrics };

export const userService = {
  async listUsers(filters = {}) {
    await delay(500);
    let filtered = [...localUsers];
    
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.username.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q)
      );
    }
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(u => u.role === filters.role);
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(u => u.status === filters.status);
    }
    if (filters.city && filters.city !== 'all') {
      filtered = filtered.filter(u => u.city === filters.city);
    }

    const total = filtered.length;
    // Simple pagination mock
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return { data: paginated, total };
  },

  async updateUser(userId, patch) {
    await delay(400);
    const index = localUsers.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    
    localUsers[index] = { ...localUsers[index], ...patch };
    return { success: true, user: localUsers[index] };
  },

  async deleteUser(userId) {
    await delay(600);
    localUsers = localUsers.filter(u => u.id !== userId);
    return { success: true };
  },

  async getMetrics() {
    await delay(300);
    return localMetrics;
  }
};
