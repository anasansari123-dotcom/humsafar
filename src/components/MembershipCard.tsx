import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown } from 'lucide-react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MembershipPlan, MembershipTier } from '../types';
import { colors, fonts, radius, spacing } from '../theme';
import { formatCurrency } from '../utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PlanId = Exclude<MembershipTier, 'FREE'>;

const PLAN_THEME: Record<
  PlanId,
  {
    gradient: readonly [string, string, string, string];
    border: string;
    glow: string;
    accent: string;
    shimmer: readonly [string, string, string];
    lightText?: boolean;
  }
> = {
  SILVER: {
    gradient: ['#FFFFFF', '#E8E8EA', '#C0C0C4', '#9A9A9E'],
    border: '#D0D0D4',
    glow: '#C0C0C0',
    accent: '#6E6E72',
    shimmer: [
      'transparent',
      'rgba(255,255,255,0.75)',
      'transparent',
    ],
  },
  GOLD: {
    gradient: ['#4B1E83', '#2D0B59', '#1A0538', '#3A1568'],
    border: '#D4AF37',
    glow: '#D4AF37',
    accent: '#E8C96A',
    shimmer: [
      'transparent',
      'rgba(232,201,106,0.55)',
      'transparent',
    ],
    lightText: true,
  },
  PLATINUM: {
    gradient: ['#4A5568', '#2D3748', '#1A202C', '#718096'],
    border: '#F7FAFC',
    glow: '#E2E8F0',
    accent: '#E2E8F0',
    shimmer: [
      'transparent',
      'rgba(255,255,255,0.65)',
      'transparent',
    ],
    lightText: true,
  },
};

interface Props {
  plan: MembershipPlan;
  selected: boolean;
  onSelect: () => void;
}

export const MembershipCard: React.FC<Props> = ({
  plan,
  selected,
  onSelect,
}) => {
  const scale = useSharedValue(1);
  const pulse = useSharedValue(0);
  const shimmer = useSharedValue(0);
  const theme =
    plan.id === 'FREE' ? null : PLAN_THEME[plan.id as PlanId];

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    shimmer.value = withDelay(
      plan.id === 'GOLD' ? 200 : plan.id === 'PLATINUM' ? 400 : 0,
      withRepeat(
        withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
        -1,
        false,
      ),
    );
  }, [pulse, shimmer, plan.id]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => {
    if (!theme) return {};
    const intensity = selected ? 1 : 0.55;
    return {
      borderColor: theme.glow,
      shadowColor: theme.glow,
      shadowOpacity:
        interpolate(pulse.value, [0, 1], [0.25, 0.85]) * intensity,
      shadowRadius: interpolate(pulse.value, [0, 1], [8, 22]) * intensity,
      elevation: selected ? 12 : 5,
      transform: [
        {
          scale: interpolate(
            pulse.value,
            [0, 1],
            [1, selected ? 1.015 : 1.008],
          ),
        },
      ],
      borderWidth: selected ? 3 : 2,
    };
  });

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [0, 1], [-220, 320]),
      },
    ],
    opacity: interpolate(shimmer.value, [0, 0.2, 0.5, 0.8, 1], [0, 0.4, 0.9, 0.4, 0]),
  }));

  if (!theme) {
    return (
      <AnimatedPressable
        onPress={onSelect}
        onPressIn={() => {
          scale.value = withSpring(0.98);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[pressStyle, styles.wrapper]}
      >
        <View
          style={[
            styles.card,
            styles.freeCard,
            selected && styles.freeSelected,
          ]}
        >
          <PlanBody plan={plan} selected={selected} />
        </View>
      </AnimatedPressable>
    );
  }

  const light = !!theme.lightText;

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[pressStyle, styles.wrapper]}
    >
      <Animated.View
        style={[
          styles.glowRing,
          { borderColor: theme.border },
          ringStyle,
        ]}
      >
        <LinearGradient
          colors={[...theme.gradient]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <Animated.View pointerEvents="none" style={[styles.shimmerWrap, shimmerStyle]}>
            <LinearGradient
              colors={[...theme.shimmer]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.shimmer}
            />
          </Animated.View>

          {plan.highlighted && (
            <View style={[styles.badge, { backgroundColor: theme.accent }]}>
              <Crown size={12} color={colors.primary} />
              <Text style={styles.badgeText}>MOST POPULAR</Text>
            </View>
          )}

          <PlanBody
            plan={plan}
            selected={selected}
            light={light}
            accent={theme.accent}
            border={theme.border}
          />
        </LinearGradient>
      </Animated.View>
    </AnimatedPressable>
  );
};

const PlanBody = ({
  plan,
  selected,
  light,
  accent = colors.accent,
  border = colors.border,
}: {
  plan: MembershipPlan;
  selected: boolean;
  light?: boolean;
  accent?: string;
  border?: string;
}) => (
  <>
    <View style={styles.headerRow}>
      <View style={{ flex: 1, paddingRight: 8 }}>
        <Text
          style={[
            styles.name,
            { color: light ? accent : colors.primary },
          ]}
        >
          {plan.name}
        </Text>
        <Text
          style={[
            styles.tagline,
            light ? styles.taglineLight : { color: accent },
          ]}
        >
          {plan.tagline}
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          { borderColor: border },
          selected && { borderColor: accent },
        ]}
      >
        {selected && (
          <View style={[styles.radioDot, { backgroundColor: accent }]} />
        )}
      </View>
    </View>

    <View style={styles.priceRow}>
      <Text
        style={[
          styles.price,
          { color: light ? colors.surface : colors.text },
        ]}
      >
        {formatCurrency(plan.price)}
      </Text>
      {plan.price > 0 && (
        <Text style={[styles.period, light && styles.taglineLight]}>
          {plan.period}
        </Text>
      )}
    </View>

    <View style={styles.features}>
      {plan.features.map((feature) => (
        <View key={feature} style={styles.featureRow}>
          <View
            style={[
              styles.check,
              {
                backgroundColor: light
                  ? accent
                  : 'rgba(168,169,173,0.28)',
              },
            ]}
          >
            <Check size={12} color={light ? colors.primary : accent} />
          </View>
          <Text style={[styles.feature, light && styles.featureLight]}>
            {feature}
          </Text>
        </View>
      ))}
    </View>
  </>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  glowRing: {
    borderRadius: radius.xl + 4,
    borderWidth: 2,
    padding: 3,
    backgroundColor: 'transparent',
  },
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  freeCard: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  freeSelected: {
    borderColor: colors.accent,
  },
  shimmerWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 90,
    zIndex: 1,
  },
  shimmer: {
    flex: 1,
    width: 90,
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 2,
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    zIndex: 2,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 22,
    letterSpacing: 1.2,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 13,
    marginTop: 2,
  },
  taglineLight: {
    color: 'rgba(255,255,255,0.72)',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    gap: 6,
    zIndex: 2,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 28,
  },
  period: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 6,
  },
  features: {
    gap: 10,
    zIndex: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feature: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  featureLight: {
    color: 'rgba(255,255,255,0.9)',
  },
});
