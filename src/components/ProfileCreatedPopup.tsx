import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { PremiumButton } from './PremiumButton';
import { BrandTitle } from './BrandTitle';

interface Props {
  visible: boolean;
  name?: string;
  onContinue: () => void;
}

export const ProfileCreatedPopup: React.FC<Props> = ({
  visible,
  name,
  onContinue,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onContinue}
  >
    <View style={styles.overlay}>
      <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />
      <Animated.View
        entering={ZoomIn.duration(320)}
        style={[styles.card, shadows.premium]}
      >
        <LinearGradient
          colors={[...colors.gradientHero]}
          style={styles.iconWrap}
        >
          <Sparkles size={28} color={colors.accent} />
        </LinearGradient>

        <BrandTitle size="sm" />
        <Text style={styles.headline}>Profile Created!</Text>
        <Text style={styles.sub}>
          {name
            ? `Welcome ${name}. Your HUMSAFAR profile is ready.`
            : 'Your HUMSAFAR profile is ready. Start exploring matches.'}
        </Text>

        <PremiumButton
          title="Explore Matches"
          onPress={onContinue}
          style={styles.btn}
        />
        <Pressable onPress={onContinue} style={styles.later}>
          <Text style={styles.laterText}>Go to Home</Text>
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
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  headline: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    marginBottom: spacing.xl,
  },
  btn: {
    width: '100%',
  },
  later: {
    marginTop: spacing.lg,
    padding: 6,
  },
  laterText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.accentDark,
  },
});
