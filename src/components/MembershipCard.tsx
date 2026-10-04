import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MembershipPlan } from '../types';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { formatCurrency } from '../utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isGold = plan.id === 'GOLD' || plan.highlighted;

  return (
    <AnimatedPressable
      onPress={onSelect}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[animatedStyle, styles.wrapper]}
    >
      {isGold ? (
        <LinearGradient
          colors={['#3A1568', '#2D0B59', '#4B1E83']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            selected && styles.selectedGold,
            shadows.premium,
          ]}
        >
          {plan.highlighted && (
            <View style={styles.badge}>
              <Crown size={12} color={colors.primary} />
              <Text style={styles.badgeText}>MOST POPULAR</Text>
            </View>
          )}
          <CardBody plan={plan} light selected={selected} />
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.card,
            styles.lightCard,
            selected && styles.selected,
            shadows.soft,
          ]}
        >
          <CardBody plan={plan} selected={selected} />
        </View>
      )}
    </AnimatedPressable>
  );
};

const CardBody = ({
  plan,
  light,
  selected,
}: {
  plan: MembershipPlan;
  light?: boolean;
  selected: boolean;
}) => (
  <>
    <View style={styles.headerRow}>
      <View>
        <Text style={[styles.name, light && styles.textLight]}>{plan.name}</Text>
        <Text style={[styles.tagline, light && styles.taglineLight]}>
          {plan.tagline}
        </Text>
      </View>
      <View style={[styles.radio, selected && styles.radioActive]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </View>

    <View style={styles.priceRow}>
      <Text style={[styles.price, light && styles.textLight]}>
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
          <View style={[styles.check, light && styles.checkGold]}>
            <Check size={12} color={light ? colors.primary : colors.accent} />
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
  card: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1.5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  lightCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  selected: {
    borderColor: colors.accent,
  },
  selectedGold: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  taglineLight: {
    color: 'rgba(255,255,255,0.7)',
  },
  textLight: {
    color: colors.accentLight,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
    gap: 6,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.text,
  },
  period: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 6,
  },
  features: {
    gap: 10,
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
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkGold: {
    backgroundColor: colors.accent,
  },
  feature: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  featureLight: {
    color: 'rgba(255,255,255,0.88)',
  },
});
