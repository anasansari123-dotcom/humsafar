import { MembershipTier } from '../types';
import { FREE_PROFILE_LIMIT } from '../constants';

export const formatCurrency = (amount: number) => {
  if (amount === 0) return 'Free';
  return `₹${amount.toLocaleString('en-IN')}`;
};

/** Whole-number % off between original and offer price (0 if no offer) */
export const getDiscountPercent = (price: number, originalPrice?: number) => {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
};

export const isPremiumTier =(tier: MembershipTier) => tier !== 'FREE';

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

/** Unique public ID like HSq1899086 */
export const generateAccountId = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const digits = String(Math.floor(1000000 + Math.random() * 9000000));
  return `HS${letter}${digits}`;
};

export {
  downloadProfileResume,
  shareProfileResume,
  buildProfileResumeHtml,
} from './profileResume';
