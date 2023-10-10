// userStore.ts
import { create } from 'zustand';
import { User } from '../types/types';

interface UserState {
  user: User | null;
  setUser: (newUser: User | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (newUser) => set({ user: newUser }),
}));

export default useUserStore;
