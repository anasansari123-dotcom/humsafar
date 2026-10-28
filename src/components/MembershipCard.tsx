import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, Tag } from 'lucide-react-native';
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
import { formatCurrency, getDiscountPercent } from '../utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PlanId = Exclude<MembershipTier, 'FREE'>;

const GOLD_DOT = '#D4AF37';
/** Brand purple — fill for every radio / check circle */
const PURPLE = '#2D0B59';

const PLAN_THEME: Record<
  PlanId,
  {
    gradient: readonly [string, string, string, string];
    border: string;
    glow: string;
    accent: string;
    /** Fixed radio / check dot color */
    dot: string;
    shimmer: readonly [string, string, string];
    lightText?: boolean;
  }
> = {
  SILVER: {
    // Light metallic silver
    gradient: ['#FBFBFC', '#ECECEF', '#DCDCE1', '#F4F4F6'],
    border: '#C7C8CD',
    glow: '#D0D0D5',
    accent: '#4A4A52',
    dot: GOLD_DOT,
    shimmer: [
      'transparent',
      'rgba(255,255,255,0.95)',
      'transparent',
    ],
  },
  GOLD: {
    gradient: ['#4B1E83', '#2D0B59', '#1A0538', '#3A1568'],
    border: GOLD_DOT,
    glow: GOLD_DOT,
    accent: '#E8C96A',
    dot: GOLD_DOT,
    shimmer: [
      'transparent',
      'rgba(232,201,106,0.55)',
      'transparent',
    ],
    lightText: true,
  },
  PLATINUM: {
    gradient: ['#063528', '#0B5C3E', '#1A7A55', '#0B5C3E'],
    border: GOLD_DOT,
    glow: GOLD_DOT,
    accent: '#E8C96A',
    dot: GOLD_DOT,
    shimmer: [
      'transparent',
      'rgba(232,201,106,0.4)',
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
        withTiming(1, {
          duration: plan.id === 'SILVER' ? 2000 : 2400,
          easing: Easing.inOut(Easing.quad),
        }),
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
      borderColor: theme.border,
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
      borderWidth: selected ? 3 : 2.5,
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
          locations={
            plan.id === 'SILVER' ? [0, 0.28, 0.62, 1] : undefined
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {plan.id === 'SILVER' ? (
            <>
              <LinearGradient
                pointerEvents="none"
                colors={[
                  'rgba(255,255,255,0.7)',
                  'rgba(220,220,225,0.12)',
                  'rgba(190,190,196,0.15)',
                  'rgba(255,255,255,0.55)',
                ]}
                locations={[0, 0.35, 0.7, 1]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.silverSheen}
              />
              <LinearGradient
                pointerEvents="none"
                colors={[
                  'rgba(255,255,255,0.45)',
                  'transparent',
                  'rgba(0,0,0,0.05)',
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.silverSheen}
              />
            </>
          ) : null}

          <Animated.View
            pointerEvents="none"
            style={[
              styles.shimmerWrap,
              plan.id === 'SILVER' && styles.shimmerWrapWide,
              shimmerStyle,
            ]}
          >
            <LinearGradient
              colors={[...theme.shimmer]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.shimmer}
            />
          </Animated.View>

          <PlanBody
            plan={plan}
            selected={selected}
            light={light}
            accent={theme.accent}
            badgeColor={theme.accent}
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
  badgeColor = colors.accent,
}: {
  plan: MembershipPlan;
  selected: boolean;
  light?: boolean;
  accent?: string;
  badgeColor?: string;
}) => {
  const discount = getDiscountPercent(plan.price, plan.originalPrice);
  return (
  <>
    {discount > 0 ? (
      <View style={styles.discountChit}>
        <Tag size={11} color={PURPLE} />
        <Text style={styles.discountText}>{discount}% OFF</Text>
      </View>
    ) : null}

    {plan.highlighted ? (
      <View style={[styles.badgeInline, { backgroundColor: badgeColor }]}>
        <Crown size={12} color={colors.primary} />
        <Text style={styles.badgeText}>MOST POPULAR</Text>
      </View>
    ) : null}

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
      <View style={[styles.selectCol, discount > 0 && styles.selectColBelowTag]}>
        <View style={[styles.radio, selected && styles.radioOn]}>
          {selected && <Check size={13} color={GOLD_DOT} strokeWidth={3} />}
        </View>
      </View>
    </View>

    <View style={styles.priceRow}>
      {discount > 0 && plan.originalPrice ? (
        <Text
          style={[
            styles.originalPrice,
            light ? styles.taglineLight : { color: colors.textMuted },
          ]}
        >
          {formatCurrency(plan.originalPrice)}
        </Text>
      ) : null}
      <Text
        style={[
          styles.price,
          { color: light ? colors.surface : colors.text },
        ]}
      >
        {formatCurrency(plan.price)}
      </Text>
      {plan.price > 0 && (
        <Text
          style={[
            styles.period,
            light ? styles.taglineLight : { color: accent },
          ]}
        >
          {plan.period}
        </Text>
      )}
    </View>

    <View style={styles.features}>
      {plan.features.map((feature) => (
        <View key={feature} style={styles.featureRow}>
          <View style={styles.check}>
            <Check size={12} color={GOLD_DOT} strokeWidth={3} />
          </View>
          <Text style={[styles.feature, light && styles.featureLight]}>
            {feature}
          </Text>
        </View>
      ))}
    </View>
  </>
  );
};

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
  shimmerWrapWide: {
    width: 120,
  },
  silverSheen: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.xl,
    zIndex: 0,
  },
  shimmer: {
    flex: 1,
    width: 90,
  },
  badgeInline: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
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
    zIndex: 3,
  },
  selectCol: {
    alignItems: 'flex-end',
    zIndex: 4,
  },
  /** Keeps the radio clear of the corner offer tag */
  selectColBelowTag: {
    marginTop: 14,
  },
  /** Corner ribbon pinned to the card's top-right edge */
  discountChit: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: GOLD_DOT,
    borderBottomLeftRadius: radius.lg,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 12,
    paddingVertical: 5,
    zIndex: 5,
  },
  discountText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: PURPLE,
    letterSpacing: 0.4,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GOLD_DOT,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    backgroundColor: PURPLE,
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
  priceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    gap: 6,
    zIndex: 2,
  },
  originalPrice: {
    fontFamily: fonts.medium,
    fontSize: 16,
    textDecorationLine: 'line-through',
    marginBottom: 5,
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
    borderWidth: 1.5,
    borderColor: GOLD_DOT,
    backgroundColor: PURPLE,
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
