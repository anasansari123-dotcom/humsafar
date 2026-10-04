import { create } from 'zustand';
import { Profile } from '../types';
import { currentUserProfile } from '../data/profiles';

interface ProfileState {
  myProfile: Profile;
  updateProfile: (data: Partial<Profile>) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  myProfile: currentUserProfile,
  updateProfile: (data) =>
    set({ myProfile: { ...get().myProfile, ...data } }),
}));
