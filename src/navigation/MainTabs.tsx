import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Crown,
  Heart,
  Home,
  MessageCircle,
  Users,
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { MainTabParamList } from './types';
import {
  ChatListScreen,
  HomeScreen,
  InterestScreen,
  PremiumScreen,
  SearchScreen,
} from '../screens';
import { fonts, useThemeColors } from '../theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TabIcon = ({
  Icon,
  focused,
  accent,
}: {
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  focused: boolean;
  accent: string;
}) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
    <Icon
      size={22}
      color={focused ? accent : 'rgba(255,255,255,0.55)'}
      strokeWidth={focused ? 2.2 : 1.8}
    />
  </View>
);

export const MainTabs = () => {
  const colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
            <View
              style={[
                styles.tabBg,
                {
                  backgroundColor: colors.tabBarBg,
                  borderColor: colors.accent,
                },
              ]}
            />
          </BlurView>
        ),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Home} focused={focused} accent={colors.accent} />
          ),
        }}
      />
      <Tab.Screen
        name="Matches"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Matches',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Users} focused={focused} accent={colors.accent} />
          ),
        }}
      />
      <Tab.Screen
        name="Interest"
        component={InterestScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Heart} focused={focused} accent={colors.accent} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={MessageCircle} focused={focused} accent={colors.accent} />
          ),
        }}
      />
      <Tab.Screen
        name="Premium"
        component={PremiumScreen}
        options={{
          tabBarLabel: 'Premium',
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Crown} focused={focused} accent={colors.accent} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    height: 70,
    borderRadius: 24,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
    borderWidth: 2.5,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 11,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    transform: [{ scale: 1.05 }],
  },
});
