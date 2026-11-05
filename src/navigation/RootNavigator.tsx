import React, { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
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
import {
  HomePromoPopup,
  PremiumPopup,
  ProfileCreatedPopup,
} from '../components';
import { useAppStore } from '../store/useAppStore';
import { useNavigationContainerRef } from '@react-navigation/native';
import { useProfileStore } from '../store/useProfileStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const showLoginOffer = useAuthStore((s) => s.showLoginOffer);
  const setShowLoginOffer = useAuthStore((s) => s.setShowLoginOffer);
  const appState = useRef(AppState.currentState);

  // Show the home promo again whenever the app comes back from the background
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      if (
        appState.current === 'background' &&
        next === 'active' &&
        useAuthStore.getState().isAuthenticated
      ) {
        setShowLoginOffer(true);
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, [setShowLoginOffer]);
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
        accountId={myProfile.accountId}
        onContinue={() => {
          setShowProfileCreatedPopup(false);
          navigationRef.navigate('Main', { screen: 'Matches' });
        }}
      />

      {/* After login and on every reopen; waits for the account-created popup */}
      <HomePromoPopup
        visible={showLoginOffer && showMain && !showProfileCreatedPopup}
        onClose={() => setShowLoginOffer(false)}
        onCta={() => {
          setShowLoginOffer(false);
          navigationRef.navigate('Main', { screen: 'Premium' });
        }}
      />
    </NavigationContainer>
  );
};
