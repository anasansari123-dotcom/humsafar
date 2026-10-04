import { create } from 'zustand';
import { MaritalStatus } from '../types';

export type RegisterGender = 'Male' | 'Female';

export interface RegisterDraft {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  education: string;
  height: string;
  caste: string;
  gender: RegisterGender | '';
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  maritalStatus: MaritalStatus | '';
  phoneVerified: boolean;
}

interface RegisterState extends RegisterDraft {
  update: (data: Partial<RegisterDraft>) => void;
  reset: () => void;
  fullName: () => string;
  ageFromDob: () => number;
}

const initial: RegisterDraft = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  education: '',
  height: '',
  caste: '',
  gender: '',
  dobDay: '',
  dobMonth: '',
  dobYear: '',
  maritalStatus: '',
  phoneVerified: false,
};

export const useRegisterStore = create<RegisterState>((set, get) => ({
  ...initial,
  update: (data) => set({ ...get(), ...data }),
  reset: () => set({ ...initial }),
  fullName: () => {
    const { firstName, lastName } = get();
    return `${firstName.trim()} ${lastName.trim()}`.trim();
  },
  ageFromDob: () => {
    const { dobDay, dobMonth, dobYear } = get();
    const y = Number(dobYear);
    const m = Number(dobMonth);
    const d = Number(dobDay);
    if (!y || !m || !d) return 25;
    const today = new Date();
    const birth = new Date(y, m - 1, d);
    let age = today.getFullYear() - birth.getFullYear();
    const md = today.getMonth() - birth.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age -= 1;
    return age > 0 && age < 100 ? age : 25;
  },
}));
