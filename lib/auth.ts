import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthStore {
  users: User[];
  currentUser: User | null;
  addUser: (user: Omit<User, 'id'>) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  users: [],
  currentUser: null,
  addUser: (userData) => {
    let success = false;
    set((state) => {
      const exists = state.users.some(user => user.email === userData.email);
      if (!exists) {
        success = true;
        return {
          users: [...state.users, { ...userData, id: Math.random().toString(36).slice(2) }]
        };
      }
      return state;
    });
    return success;
  },
  login: (email, password) => {
    let success = false;
    set((state) => {
      const user = state.users.find(u => u.email === email);
      if (user) {
        success = true;
        return { currentUser: user };
      }
      return state;
    });
    return success;
  },
  logout: () => set({ currentUser: null })
}));