import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Gift, X } from 'lucide-react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { MembershipPlan } from '../types';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { formatCurrency, getDiscountPercent } from '../utils';
import { PremiumButton } from './PremiumButton';

interface Props {
  visible: boolean;
  plans: MembershipPlan[];
  onClose: () => void;
  /** CTA action; defaults to closing the popup */
  onGrab?: () => void;
}

/** Limited-time offer announcement, shown on first Premium visit per login */
export const PremiumOfferPopup: React.FC<Props> = ({
  visible,
  plans,
  onClose,
  onGrab,
}) => {
  const maxDiscount = Math.max(
    0,
    ...plans.map((p) => getDiscountPercent(p.price, p.originalPrice)),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
        <Animated.View
          entering={ZoomIn.duration(320)}
          style={[styles.card, shadows.premium]}
        >
          <Pressable
            style={styles.close}
            onPress={onClose}
            hitSlop={12}
            accessibilityLabel="Close"
          >
            <X size={18} color={colors.textMuted} />
          </Pressable>

          <LinearGradient
            colors={[...colors.gradientGold]}
            style={styles.iconWrap}
          >
            <Gift size={28} color={colors.primary} strokeWidth={2.5} />
          </LinearGradient>

          <Text style={styles.eyebrow}>LIMITED TIME OFFER</Text>
          <Text style={styles.headline}>Flat {maxDiscount}% OFF</Text>
          <Text style={styles.sub}>
            on all HUMSAFAR Premium plans. Find your perfect match faster.
          </Text>

          <View style={styles.planList}>
            {plans.map((plan) => (
              <View key={plan.id} style={styles.planRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPeriod}>
                    {plan.period.replace('/', '').trim()}
                  </Text>
                </View>
                {plan.originalPrice ? (
                  <Text style={styles.planOriginal}>
                    {formatCurrency(plan.originalPrice)}
                  </Text>
                ) : null}
                <Text style={styles.planPrice}>
                  {formatCurrency(plan.price)}
                </Text>
              </View>
            ))}
          </View>

          <PremiumButton
            title="Grab the Offer"
            onPress={onGrab ?? onClose}
            style={styles.btn}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: 'rgba(26,5,56,0.45)',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    borderWidth: 2.5,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  close: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  eyebrow: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.accentDark,
    letterSpacing: 1.2,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.primary,
    textAlign: 'center',
    marginTop: 4,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 6,
    marginBottom: spacing.lg,
  },
  planList: {
    width: '100%',
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    marginBottom: spacing.xl,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  planName: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 0.6,
  },
  planPeriod: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  planOriginal: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  planPrice: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
  btn: {
    width: '100%',
  },
});
