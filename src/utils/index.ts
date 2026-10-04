import { MembershipTier } from '../types';
import { FREE_PROFILE_LIMIT } from '../constants';

export const formatCurrency = (amount: number) => {
  if (amount === 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const isPremiumTier = (tier: MembershipTier) => tier !== 'FREE';

export const canViewProfile = (
  tier: MembershipTier,
  viewedCount: number,
) => {
  if (isPremiumTier(tier)) return true;
  return viewedCount < FREE_PROFILE_LIMIT;
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export const truncate = (text: string, length = 80) => {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trim()}…`;
};

export {
  downloadProfileResume,
  shareProfileResume,
  buildProfileResumeHtml,
} from './profileResume';
