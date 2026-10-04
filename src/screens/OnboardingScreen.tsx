import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { onboardingSlides } from '../data/onboarding';
import { useAuthStore } from '../store/useAuthStore';
import { PremiumButton, Ornament } from '../components';
import { colors, fonts, radius, spacing } from '../theme';
import { OnboardingSlide } from '../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const icons = {
  heart: Heart,
  shield: ShieldCheck,
  sparkles: Sparkles,
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const finish = () => {
    completeOnboarding();
    navigation.replace('Welcome');
  };

  const next = () => {
    if (index < onboardingSlides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      setIndex(index + 1);
    } else {
      finish();
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  const renderItem = ({ item }: { item: OnboardingSlide }) => {
    const Icon = icons[item.icon];
    return (
      <View style={[styles.slide, { width }]}>
        <LinearGradient
          colors={['rgba(212,175,55,0.2)', 'rgba(75,30,131,0.35)']}
          style={styles.illustration}
        >
          <View style={styles.iconCircle}>
            <Icon size={48} color={colors.accent} strokeWidth={1.5} />
          </View>
        </LinearGradient>
        <Animated.Text entering={FadeInRight} style={styles.title}>
          {item.title.includes('Humsafar') ? (
            <>
              {item.title.replace(/Humsafar/i, '').trimEnd()}{' '}
              <Text style={styles.brandWord}>Humsafar</Text>
            </>
          ) : (
            item.title
          )}
        </Animated.Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  return (
    <LinearGradient colors={[...colors.gradientHero]} style={styles.container}>
      <Ornament size={80} opacity={0.15} />
      <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.skip} onPress={finish}>
          Skip
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.dots}>
          {onboardingSlides.map((s, i) => (
            <View key={s.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <PremiumButton
          title={index === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
          onPress={next}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
  },
  skip: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.accent,
    padding: 8,
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingTop: spacing.huge,
  },
  illustration: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(45,11,89,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  brandWord: {
    fontFamily: fonts.script,
    letterSpacing: 1,
    fontSize: 34,
    color: '#E8C96A',
    textTransform: 'none',
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.accent,
  },
});
