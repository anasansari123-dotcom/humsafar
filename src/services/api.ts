import axios from 'axios';
import { profiles } from '../data/profiles';
import { membershipPlans } from '../data/membership';
import { conversations, interests } from '../data/chats';
import { notifications } from '../data/notifications';
import { successStories } from '../data/successStories';
import { faqs } from '../data/faqs';

/** Dummy Axios client — no real backend */
const api = axios.create({
  baseURL: 'https://api.humsafar.app/v1',
  timeout: 8000,
});

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  sendOtp: async (phone: string, countryCode: string) => {
    await delay();
    return { success: true, phone, countryCode, message: 'OTP sent' };
  },
  verifyOtp: async (otp: string) => {
    await delay();
    return { success: otp.length === 4, token: 'dummy-jwt-token' };
  },
  /** Dummy password login — any password with 6+ chars succeeds */
  loginWithPassword: async (phone: string, password: string) => {
    await delay();
    return {
      success: phone.length >= 10 && password.length >= 6,
      token: 'dummy-jwt-token',
      message:
        password.length >= 6
          ? 'Login successful'
          : 'Password must be at least 6 characters',
    };
  },
};

export const profileService = {
  getProfiles: async () => {
    await delay();
    return profiles;
  },
  getProfileById: async (id: string) => {
    await delay(200);
    return profiles.find((p) => p.id === id) ?? null;
  },
};

export const membershipService = {
  getPlans: async () => {
    await delay();
    return membershipPlans;
  },
};

export const chatService = {
  getConversations: async () => {
    await delay();
    return conversations;
  },
  getInterests: async () => {
    await delay();
    return interests;
  },
};

export const notificationService = {
  getAll: async () => {
    await delay();
    return notifications;
  },
};

export const contentService = {
  getSuccessStories: async () => {
    await delay();
    return successStories;
  },
  getFaqs: async () => {
    await delay();
    return faqs;
  },
};

export default api;
