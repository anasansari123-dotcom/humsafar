import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { APP_TAGLINE } from '../constants';
import { colors, fonts, spacing } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { BrandTitle, Ornament } from '../components';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { hasOnboarded, isAuthenticated } = useAuthStore();
  const logoScale = useSharedValue(0.85);
  const logoOpacity = useSharedValue(0);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, {
      duration: 900,
      easing: Easing.out(Easing.cubic),
    });

    const timer = setTimeout(() => {
      if (!hasOnboarded) {
        navigation.replace('Onboarding');
      } else if (!isAuthenticated) {
        navigation.replace('Welcome');
      }
      // When authenticated, RootNavigator switches to Main (plans page skipped)
    }, 2800);

    return () => clearTimeout(timer);
  }, [hasOnboarded, isAuthenticated, logoOpacity, logoScale, navigation]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <LinearGradient colors={[...colors.gradientHero]} style={styles.container}>
      <Ornament size={90} opacity={0.18} />
      <View style={[styles.ornamentBR, { transform: [{ rotate: '180deg' }] }]}>
        <Ornament size={90} opacity={0.18} />
      </View>

      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(400).duration(700)}>
        <BrandTitle size="xl" />
        <Text style={styles.tagline}>{APP_TAGLINE}</Text>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(900)} style={styles.lottieWrap}>
        <LottieView
          source={require('../../assets/animations/heart.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  ornamentBR: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  logoWrap: {
    width: 220,
    height: 220,
    marginBottom: spacing.xl,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 0.4,
  },
  lottieWrap: {
    position: 'absolute',
    bottom: 60,
  },
  lottie: {
    width: 72,
    height: 72,
  },
});
