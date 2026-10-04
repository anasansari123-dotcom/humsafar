import { create } from 'zustand';
import { MembershipTier, SearchFilters } from '../types';

interface AppState {
  darkMode: boolean;
  language: string;
  membership: MembershipTier;
  viewedProfileIds: string[];
  favouriteIds: string[];
  showPremiumPopup: boolean;
  showProfileCreatedPopup: boolean;
  filters: SearchFilters;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  setMembership: (tier: MembershipTier) => void;
  addViewedProfile: (id: string) => void;
  toggleFavourite: (id: string) => void;
  setShowPremiumPopup: (show: boolean) => void;
  setShowProfileCreatedPopup: (show: boolean) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  ageMin: 21,
  ageMax: 35,
  heightMin: "5'0\"",
  heightMax: "6'2\"",
  city: '',
  state: '',
  country: 'India',
  profession: '',
  education: '',
  sect: '',
  language: '',
  maritalStatus: '',
  income: '',
};

export const useAppStore = create<AppState>((set, get) => ({
  darkMode: false,
  language: 'English',
  membership: 'FREE',
  viewedProfileIds: [],
  favouriteIds: ['p1', 'p3', 'p7'],
  showPremiumPopup: false,
  showProfileCreatedPopup: false,
  filters: defaultFilters,
  toggleDarkMode: () => set({ darkMode: !get().darkMode }),
  setLanguage: (language) => set({ language }),
  setMembership: (membership) => set({ membership }),
  addViewedProfile: (id) => {
    const current = get().viewedProfileIds;
    if (!current.includes(id)) {
      set({ viewedProfileIds: [...current, id] });
    }
  },
  toggleFavourite: (id) => {
    const current = get().favouriteIds;
    set({
      favouriteIds: current.includes(id)
        ? current.filter((f) => f !== id)
        : [...current, id],
    });
  },
  setShowPremiumPopup: (showPremiumPopup) => set({ showPremiumPopup }),
  setShowProfileCreatedPopup: (showProfileCreatedPopup) =>
    set({ showProfileCreatedPopup }),
  setFilters: (filters) =>
    set({ filters: { ...get().filters, ...filters } }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
