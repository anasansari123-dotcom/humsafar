import { MembershipPlan } from '../types';
import { colors } from '../theme';

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'FREE',
    name: 'FREE',
    price: 0,
    period: 'forever',
    tagline: 'Start your journey',
    color: colors.textMuted,
    features: [
      'Only 4 profiles free',
      'Basic search filters',
      'Send 2 interests / day',
      'Limited chat access',
    ],
  },
  {
    id: 'SILVER',
    name: 'SILVER',
    price: 999,
    period: '/ month',
    tagline: 'Essential premium',
    color: '#A8A9AD',
    features: [
      'View 50 profiles / month',
      'Advanced filters',
      'Unlimited interests',
      'Chat with matches',
      'See who viewed you',
    ],
  },
  {
    id: 'GOLD',
    name: 'GOLD',
    price: 1999,
    period: '/ month',
    tagline: 'Most popular choice',
    highlighted: true,
    color: colors.accent,
    features: [
      'Unlimited profiles',
      'Unlimited chat',
      'Contact number access',
      'Priority in search',
      'Verified badge boost',
      'Voice messages',
    ],
  },
  {
    id: 'PLATINUM',
    name: 'PLATINUM',
    price: 3999,
    period: '/ month',
    tagline: 'Ultimate luxury matchmaking',
    color: '#E5E4E2',
    features: [
      'Everything in Gold',
      'Video call access',
      'Dedicated matchmaker',
      'Profile spotlight',
      'Incognito browsing',
      'Priority support',
    ],
  },
];
