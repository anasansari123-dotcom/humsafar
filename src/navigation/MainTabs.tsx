import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Crown,
  Heart,
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
import { TAB_BAR_CONTENT_HEIGHT, getTabBarBottom } from '../constants';

const Tab = createBottomTabNavigator<MainTabParamList>();

const humsafarHLogo = require('../../assets/humsafar-h-logo.png');

export { TAB_BAR_CONTENT_HEIGHT };

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

const HomeLogoIcon = ({ focused }: { focused: boolean }) => (
  <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
    <Image
      source={humsafarHLogo}
      style={[styles.homeLogo, !focused && styles.homeLogoDim]}
      resizeMode="contain"
    />
  </View>
);

export const MainTabs = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: getTabBarBottom(insets.bottom),
            height: TAB_BAR_CONTENT_HEIGHT,
          },
        ],
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
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
          </View>
        ),
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.55)',
        tabBarLabelStyle: styles.label,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <HomeLogoIcon focused={focused} />,
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
    borderRadius: 24,
    borderTopWidth: 0,
    backgroundColor: 'transparent',
    elevation: 12,
    zIndex: 100,
    paddingBottom: 6,
    paddingTop: 6,
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
  tabItem: {
    paddingVertical: 2,
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
  homeLogo: {
    width: 28,
    height: 28,
  },
  homeLogoDim: {
    opacity: 0.55,
  },
});
