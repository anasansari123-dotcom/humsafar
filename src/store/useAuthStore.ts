import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  hasSeenMembership: boolean;
  phone: string;
  countryCode: string;
  setPhone: (phone: string) => void;
  setCountryCode: (code: string) => void;
  completeOnboarding: () => void;
  login: () => void;
  logout: () => void;
  setHasSeenMembership: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasOnboarded: false,
  hasSeenMembership: false,
  phone: '',
  countryCode: '+91',
  setPhone: (phone) => set({ phone }),
  setCountryCode: (countryCode) => set({ countryCode }),
  completeOnboarding: () => set({ hasOnboarded: true }),
  login: () => set({ isAuthenticated: true }),
  logout: () =>
    set({
      isAuthenticated: false,
      hasSeenMembership: false,
      phone: '',
    }),
  setHasSeenMembership: (hasSeenMembership) => set({ hasSeenMembership }),
}));
