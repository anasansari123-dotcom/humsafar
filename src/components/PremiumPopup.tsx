import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Lock } from 'lucide-react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { PremiumButton } from './PremiumButton';

interface Props {
  visible: boolean;
  onUpgrade: () => void;
  onLater: () => void;
}

const benefits = [
  'Unlimited Muslim profiles',
  'Unlimited chat & interests',
  'Contact number unlock',
  'Priority profile visibility',
];

export const PremiumPopup: React.FC<Props> = ({
  visible,
  onUpgrade,
  onLater,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onLater}>
    <View style={styles.overlay}>
      <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
      <Animated.View entering={ZoomIn.duration(320)} style={[styles.card, shadows.premium]}>
        <LinearGradient
          colors={[...colors.gradientHero]}
          style={styles.iconWrap}
        >
          <Lock size={28} color={colors.accent} />
        </LinearGradient>

        <Text style={styles.headline}>Unlock Unlimited Muslim Profiles</Text>
        <Text style={styles.sub}>
          You have reached the free limit of 4 profiles. Upgrade to continue your journey.
        </Text>

        <View style={styles.benefits}>
          {benefits.map((item, index) => (
            <Animated.View
              key={item}
              entering={FadeIn.delay(120 + index * 60)}
              style={styles.benefitRow}
            >
              <View style={styles.check}>
                <Check size={14} color={colors.primary} />
              </View>
              <Text style={styles.benefit}>{item}</Text>
            </Animated.View>
          ))}
        </View>

        <PremiumButton title="Upgrade Now" onPress={onUpgrade} style={styles.btn} />
        <Pressable onPress={onLater} style={styles.later}>
          <Text style={styles.laterText}>Maybe Later</Text>
        </Pressable>
      </Animated.View>
    </View>
  </Modal>
);

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
    borderWidth: 1.5,
    borderColor: colors.borderGold,
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  headline: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: spacing.xl,
  },
  benefits: {
    alignSelf: 'stretch',
    gap: 12,
    marginBottom: spacing.xxl,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefit: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  btn: {
    alignSelf: 'stretch',
  },
  later: {
    marginTop: spacing.lg,
    padding: 8,
  },
  laterText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
});
