import React from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { fonts, radius, shadows, spacing, useThemeColors } from '../theme';
import { PremiumButton } from './PremiumButton';

const couple = require('../../assets/welcome-couple.webp');
const wordmark = require('../../assets/humsafar-wordmark-removebg-preview.png');

interface Props {
  visible: boolean;
  onClose: () => void;
  onCta: () => void;
}

/** Full-bleed promo card shown on login and whenever the app is reopened */
export const HomePromoPopup: React.FC<Props> = ({ visible, onClose, onCta }) => {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={45} tint="dark" style={StyleSheet.absoluteFill} />

        <Animated.View entering={ZoomIn.duration(320)} style={styles.wrap}>
          <View
            style={[
              styles.card,
              shadows.premium,
              { borderColor: colors.accent },
            ]}
          >
            <ImageBackground
              source={couple}
              style={styles.photo}
              imageStyle={styles.photoImage}
              resizeMode="cover"
            >
              {/* Soft cream top for the headline, theme colour at the base */}
              <LinearGradient
                colors={['#FFFCF5', 'rgba(255,252,245,0.85)', 'rgba(255,252,245,0)']}
                locations={[0, 0.45, 1]}
                style={styles.topFade}
              />
              <LinearGradient
                colors={['transparent', colors.overlay, colors.primaryDark]}
                locations={[0, 0.45, 1]}
                style={styles.bottomFade}
              />

              <View style={styles.headBlock}>
                <Text style={styles.title}>Trusted by Families,</Text>
                <Text style={[styles.titleAccent, { color: colors.primary }]}>
                  Led by Experts
                </Text>
                <View style={styles.statRow}>
                  <Text style={styles.stat}>5× Faster Matches</Text>
                  <View style={[styles.statDivider, { backgroundColor: colors.accent }]} />
                  <Text style={styles.stat}>100% Privacy</Text>
                </View>
                <Text style={styles.stat}>Verified Muslim Profiles</Text>
              </View>

              <View style={styles.footer}>
                <Image
                  source={wordmark}
                  style={styles.wordmark}
                  resizeMode="contain"
                />
                <PremiumButton
                  title="Get Premium Access"
                  onPress={onCta}
                  style={styles.cta}
                  textStyle={{ color: colors.primary }}
                />
              </View>
            </ImageBackground>
          </View>

          <Pressable
            style={[styles.close, { borderColor: colors.accent }]}
            onPress={onClose}
            hitSlop={12}
            accessibilityLabel="Close"
          >
            <X size={18} color="#1A0A2E" strokeWidth={2.5} />
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
    paddingHorizontal: spacing.xxl,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  wrap: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
  },
  card: {
    borderRadius: radius.xl,
    borderWidth: 2.5,
    overflow: 'hidden',
    backgroundColor: '#FFFCF5',
  },
  photo: {
    width: '100%',
    aspectRatio: 0.62,
    justifyContent: 'space-between',
  },
  photoImage: {
    // Keep the couple's faces below the headline
    top: 70,
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
  },
  bottomFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  headBlock: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontFamily: fonts.brandSemiBold,
    fontSize: 22,
    color: '#2A2A2A',
    textAlign: 'center',
  },
  titleAccent: {
    fontFamily: fonts.brand,
    fontSize: 24,
    textAlign: 'center',
    marginTop: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.md,
  },
  statDivider: {
    width: 1.5,
    height: 16,
  },
  stat: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: '#3A3A3A',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  wordmark: {
    width: '78%',
    height: 64,
    marginBottom: spacing.md,
  },
  cta: {
    width: '100%',
  },
  close: {
    position: 'absolute',
    top: -14,
    right: -14,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    ...shadows.medium,
  },
});
