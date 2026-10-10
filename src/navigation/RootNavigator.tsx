import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';
import {
  ChatScreen,
  EditProfileScreen,
  FavouritesScreen,
  HelpCenterScreen,
  MembershipUpgradeScreen,
  MyProfileScreen,
  NotificationsScreen,
  ProfileDetailsScreen,
  PrivacyScreen,
  SettingsScreen,
  SuccessStoriesScreen,
} from '../screens';
import { useAuthStore } from '../store/useAuthStore';
import { getThemeColors } from '../theme';
import { PremiumPopup, ProfileCreatedPopup } from '../components';
import { useAppStore } from '../store/useAppStore';
import { useNavigationContainerRef } from '@react-navigation/native';
import { useProfileStore } from '../store/useProfileStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showPremiumPopup = useAppStore((s) => s.showPremiumPopup);
  const setShowPremiumPopup = useAppStore((s) => s.setShowPremiumPopup);
  const showProfileCreatedPopup = useAppStore((s) => s.showProfileCreatedPopup);
  const setShowProfileCreatedPopup = useAppStore(
    (s) => s.setShowProfileCreatedPopup,
  );
  const myProfile = useProfileStore((s) => s.myProfile);
  const darkMode = useAppStore((s) => s.darkMode);
  const colors = getThemeColors(darkMode);
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  const showMain = isAuthenticated;

  const theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      primary: colors.primary,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!showMain ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
            <Stack.Screen name="MembershipUpgrade" component={MembershipUpgradeScreen} />
            <Stack.Screen name="MyProfile" component={MyProfileScreen} />
            <Stack.Screen name="ChatRoom" component={ChatScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Favourites" component={FavouritesScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
            <Stack.Screen name="SuccessStories" component={SuccessStoriesScreen} />
          </>
        )}
      </Stack.Navigator>

      <PremiumPopup
        visible={showPremiumPopup && showMain}
        onLater={() => setShowPremiumPopup(false)}
        onUpgrade={() => {
          setShowPremiumPopup(false);
          navigationRef.navigate('Main', { screen: 'Premium' });
        }}
      />

      <ProfileCreatedPopup
        visible={showProfileCreatedPopup && showMain}
        name={myProfile.name}
        onContinue={() => {
          setShowProfileCreatedPopup(false);
          navigationRef.navigate('Main', { screen: 'Matches' });
        }}
      />
    </NavigationContainer>
  );
};
