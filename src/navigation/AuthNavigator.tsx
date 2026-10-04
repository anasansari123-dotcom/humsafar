import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import {
  LoginScreen,
  MembershipScreen,
  OnboardingScreen,
  OTPScreen,
  RegisterContactScreen,
  RegisterDetailsScreen,
  RegisterNameScreen,
  RegisterPersonalScreen,
  SignupScreen,
  SplashScreen,
  WelcomeScreen,
} from '../screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: '#F8F8F8' },
    }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="RegisterName" component={RegisterNameScreen} />
    <Stack.Screen name="RegisterContact" component={RegisterContactScreen} />
    <Stack.Screen name="RegisterDetails" component={RegisterDetailsScreen} />
    <Stack.Screen name="RegisterPersonal" component={RegisterPersonalScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
    <Stack.Screen name="Membership" component={MembershipScreen} />
  </Stack.Navigator>
);
