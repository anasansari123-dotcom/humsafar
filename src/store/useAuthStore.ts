import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  hasOnboarded: boolean;
  hasSeenMembership: boolean;
  /** Premium offer popup shown once per login session */
  hasSeenPremiumOffer: boolean;
  /** Offer popup queued right after a successful login */
  showLoginOffer: boolean;
  phone: string;
  countryCode: string;
  setPhone: (phone: string) => void;
  setCountryCode: (code: string) => void;
  completeOnboarding: () => void;
  login: () => void;
  logout: () => void;
  setHasSeenMembership: (value: boolean) => void;
  setHasSeenPremiumOffer: (value: boolean) => void;
  setShowLoginOffer: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  hasOnboarded: false,
  hasSeenMembership: false,
  hasSeenPremiumOffer: false,
  showLoginOffer: false,
  phone: '',
  countryCode: '+91',
  setPhone: (phone) => set({ phone }),
  setCountryCode: (countryCode) => set({ countryCode }),
  completeOnboarding: () => set({ hasOnboarded: true }),
  login: () =>
    set({
      isAuthenticated: true,
      hasSeenPremiumOffer: false,
      showLoginOffer: true,
    }),
  logout: () =>
    set({
      isAuthenticated: false,
      hasSeenMembership: false,
      hasSeenPremiumOffer: false,
      showLoginOffer: false,
      phone: '',
    }),
  setHasSeenMembership: (hasSeenMembership) => set({ hasSeenMembership }),
  setHasSeenPremiumOffer: (hasSeenPremiumOffer) => set({ hasSeenPremiumOffer }),
  setShowLoginOffer: (showLoginOffer) => set({ showLoginOffer }),
}));
