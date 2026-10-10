import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  OTP: { mode?: 'login' | 'register' } | undefined;
  Membership: undefined;
  RegisterName: undefined;
  RegisterContact: undefined;
  RegisterDetails: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Matches: undefined;
  Interest: undefined;
  Chat: undefined;
  Premium: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  ProfileDetails: { profileId: string };
  MembershipUpgrade: undefined;
  MyProfile: undefined;
  ChatRoom: { conversationId: string };
  Notifications: undefined;
  Favourites: undefined;
  EditProfile: { section?: string } | undefined;
  Settings: undefined;
  Privacy: undefined;
  HelpCenter: undefined;
  SuccessStories: undefined;
};
