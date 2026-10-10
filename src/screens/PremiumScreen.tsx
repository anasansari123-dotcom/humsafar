import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Crown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GradientHeader, MembershipCard } from '../components';
import { membershipPlans } from '../data/membership';
import { useAppStore } from '../store/useAppStore';
import { MembershipTier } from '../types';
import { colors, fonts, spacing } from '../theme';

const PREMIUM_TIERS: MembershipTier[] = ['SILVER', 'GOLD', 'PLATINUM'];

/** Bottom-tab Premium — Silver / Gold / Platinum with themed glow */
export const PremiumScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<MembershipTier>('GOLD');
  const membership = useAppStore((s) => s.membership);
  const setMembership = useAppStore((s) => s.setMembership);

  const plans = useMemo(
    () => membershipPlans.filter((p) => PREMIUM_TIERS.includes(p.id)),
    [],
  );

  const onSelectPlan = (tier: MembershipTier) => {
    setSelected(tier);
    setMembership(tier);
    Alert.alert(
      'Plan Activated',
      `${tier} plan selected (demo). Enjoy premium features!`,
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
          { paddingBottom: insets.bottom + 110 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Choose Your Plan</Text>
        <Text style={styles.hint}>Tap a plan to activate</Text>
        {plans.map((plan, i) => (
          <Animated.View key={plan.id} entering={FadeInDown.delay(i * 80)}>
            <MembershipCard
              plan={plan}
              selected={selected === plan.id}
              onSelect={() => onSelectPlan(plan.id)}
            />
          </Animated.View>
        ))}
      </ScrollView>
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
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.primary,
    marginBottom: 4,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
});
