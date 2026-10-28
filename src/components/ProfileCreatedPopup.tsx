import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Copy, X } from 'lucide-react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { PremiumButton } from './PremiumButton';
import { BrandTitle } from './BrandTitle';

interface Props {
  visible: boolean;
  name?: string;
  accountId?: string;
  onContinue: () => void;
}

export const ProfileCreatedPopup: React.FC<Props> = ({
  visible,
  name,
  accountId,
  onContinue,
}) => {
  const copyId = async () => {
    if (!accountId) return;
    try {
      await Clipboard.setStringAsync(accountId);
    } catch {
      /* ignore */
    }
  };

  return (
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
          <Pressable
            style={styles.close}
            onPress={onContinue}
            hitSlop={12}
            accessibilityLabel="Close"
          >
            <X size={18} color={colors.textMuted} />
          </Pressable>

          <LinearGradient
            colors={[...colors.gradientGold]}
            style={styles.iconWrap}
          >
            <Check size={28} color={colors.primary} strokeWidth={3} />
          </LinearGradient>

          <BrandTitle size="sm" />
          <Text style={styles.headline}>Account Created!</Text>
          <Text style={styles.sub}>
            {name
              ? `Welcome ${name}. Your unique HUMSAFAR ID is ready.`
              : 'Your HUMSAFAR profile is ready. Save your unique ID.'}
          </Text>

          {accountId ? (
            <View style={styles.idBox}>
              <Text style={styles.idLabel}>Your Account ID</Text>
              <View style={styles.idRow}>
                <Text style={styles.idValue} selectable>
                  {accountId}
                </Text>
                <Pressable
                  style={styles.copyBtn}
                  onPress={copyId}
                  hitSlop={8}
                  accessibilityLabel="Copy account ID"
                >
                  <Copy size={16} color={colors.primary} />
                </Pressable>
              </View>
              <Text style={styles.idHint}>
                Keep this ID safe — use it for login help & support
              </Text>
            </View>
          ) : null}

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
    marginBottom: spacing.lg,
  },
  idBox: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  idLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  idValue: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  copyBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idHint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
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
