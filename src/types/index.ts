export type MembershipTier = 'FREE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export type MaritalStatus =
  | 'Never Married'
  | 'Divorced'
  | 'Widowed'
  | 'Awaiting Divorce';

export type Sect = 'Sunni' | 'Shia' | 'Bohra' | 'Other';

export interface Profile {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  height: string;
  city: string;
  state: string;
  country: string;
  profession: string;
  education: string;
  sect: Sect;
  language: string;
  maritalStatus: MaritalStatus;
  caste?: string;
  income: string;
  about: string;
  family: string;
  lifestyle: string;
  partnerPreference: string;
  images: string[];
  isVerified: boolean;
  isPremium: boolean;
  membership: MembershipTier;
  profileCompletion: number;
  distanceKm?: number;
  online?: boolean;
  lastSeen?: string;
}

export interface MembershipPlan {
  id: MembershipTier;
  name: string;
  price: number;
  period: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
  color: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice';
  read: boolean;
}

export interface Conversation {
  id: string;
  profileId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  typing?: boolean;
  messages: ChatMessage[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: 'interest' | 'match' | 'message' | 'premium' | 'system';
  read: boolean;
}

export interface SuccessStory {
  id: string;
  coupleNames: string;
  location: string;
  story: string;
  image: string;
  marriedYear: string;
}

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: 'heart' | 'shield' | 'sparkles';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface InterestItem {
  id: string;
  profile: Profile;
  status: 'received' | 'sent' | 'accepted';
  time: string;
}

export interface SearchFilters {
  ageMin: number;
  ageMax: number;
  heightMin: string;
  heightMax: string;
  city: string;
  state: string;
  country: string;
  profession: string;
  education: string;
  sect: string;
  language: string;
  maritalStatus: string;
  income: string;
}
