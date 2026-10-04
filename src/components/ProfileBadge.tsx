import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BadgeCheck, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radius } from '../theme';

interface Props {
  type: 'verified' | 'premium';
  label?: string;
}

export const ProfileBadge: React.FC<Props> = ({ type, label }) => {
  if (type === 'verified') {
    return (
      <View style={styles.verified}>
        <BadgeCheck size={12} color={colors.surface} />
        {label ? <Text style={styles.text}>{label}</Text> : null}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[...colors.gradientGold]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.premium}
    >
      <Crown size={11} color={colors.primary} />
      <Text style={styles.premiumText}>{label || 'PREMIUM'}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  premium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.surface,
  },
  premiumText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.4,
  },
});
