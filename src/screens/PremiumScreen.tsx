import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Check,
  Crown,
  Infinity,
  MessageCircle,
  Phone,
  Video,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  GradientHeader,
  MembershipCard,
  PremiumButton,
} from '../components';
import { membershipPlans } from '../data/membership';
import { useAppStore } from '../store/useAppStore';
import { MembershipTier } from '../types';
import { colors, fonts, radius, spacing } from '../theme';

const benefits = [
  { icon: Infinity, label: 'Unlimited Profiles' },
  { icon: MessageCircle, label: 'Unlimited Chat' },
  { icon: Phone, label: 'Contact Number' },
  { icon: Video, label: 'Video Call' },
  { icon: Crown, label: 'Priority Profile' },
];

/** Bottom-tab Premium section — shows membership plans */
export const PremiumScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<MembershipTier>('GOLD');
  const membership = useAppStore((s) => s.membership);
  const setMembership = useAppStore((s) => s.setMembership);

  const purchase = () => {
    setMembership(selected);
    Alert.alert(
      'Plan Selected',
      `${selected} plan activated (demo). Enjoy premium features!`,
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Premium Plans"
        subtitle={`Current plan: ${membership}`}
        tall
      >
        <View style={styles.crownBadge}>
          <Crown size={16} color={colors.primary} />
          <Text style={styles.crownText}>HUMSAFAR PREMIUM</Text>
        </View>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 130 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown} style={styles.benefits}>
          {benefits.map((b) => (
            <View key={b.label} style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <b.icon size={18} color={colors.accent} />
              </View>
              <Text style={styles.benefitText}>{b.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Text style={styles.heading}>Choose Your Plan</Text>
        {membershipPlans.map((plan, i) => (
          <Animated.View key={plan.id} entering={FadeInDown.delay(i * 70)}>
            <MembershipCard
              plan={plan}
              selected={selected === plan.id}
              onSelect={() => setSelected(plan.id)}
            />
          </Animated.View>
        ))}

        <View style={styles.compare}>
          <Text style={styles.compareTitle}>Why go Premium?</Text>
          {[
            'Connect with verified Muslim profiles worldwide',
            'Stand out with priority visibility',
            'Unlock contact details instantly',
            'Enjoy a private, dignified experience',
          ].map((item) => (
            <View key={item} style={styles.compareRow}>
              <Check size={16} color={colors.accent} />
              <Text style={styles.compareText}>{item}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.sticky, { paddingBottom: insets.bottom + 90 }]}>
        <PremiumButton title={`Select ${selected}`} onPress={purchase} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  crownBadge: {
    marginTop: spacing.lg,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  crownText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 0.6,
  },
  content: {
    padding: spacing.xl,
  },
  benefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.xxl,
  },
  benefitItem: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderGold,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.primary,
    flex: 1,
  },
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  compare: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    marginBottom: spacing.xl,
  },
  compareTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  compareText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  sticky: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
