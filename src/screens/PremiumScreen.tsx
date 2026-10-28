import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Crown } from 'lucide-react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import {
  GradientHeader,
  MembershipCard,
  PremiumButton,
  PremiumOfferPopup,
} from '../components';
import { TAB_BAR_CONTENT_HEIGHT, getTabBarBottom } from '../constants';
import { formatCurrency } from '../utils';
import { membershipPlans } from '../data/membership';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { MembershipTier } from '../types';
import { colors, fonts, spacing } from '../theme';

const PREMIUM_TIERS: MembershipTier[] = ['SILVER', 'GOLD', 'PLATINUM'];

/** Bottom-tab Premium — Silver / Gold / Platinum with themed glow */
export const PremiumScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<MembershipTier | null>(null);
  const membership = useAppStore((s) => s.membership);
  const setMembership = useAppStore((s) => s.setMembership);

  const plans = useMemo(
    () => membershipPlans.filter((p) => PREMIUM_TIERS.includes(p.id)),
    [],
  );

  const hasSeenPremiumOffer = useAuthStore((s) => s.hasSeenPremiumOffer);
  const setHasSeenPremiumOffer = useAuthStore((s) => s.setHasSeenPremiumOffer);
  const [showOffer, setShowOffer] = useState(false);

  // First Premium visit after login → announce the running offer
  useFocusEffect(
    useCallback(() => {
      if (!hasSeenPremiumOffer) {
        setShowOffer(true);
        setHasSeenPremiumOffer(true);
      }
    }, [hasSeenPremiumOffer, setHasSeenPremiumOffer]),
  );

  const selectedPlan = plans.find((p) => p.id === selected);

  // Top edge of the floating tab bar (same sizing as MainTabs)
  const tabBarTop = getTabBarBottom(insets.bottom) + TAB_BAR_CONTENT_HEIGHT;

  const onPay = () => {
    if (!selectedPlan) return;
    setMembership(selectedPlan.id);
    Alert.alert(
      'Payment Successful',
      `${selectedPlan.name} plan activated for ${selectedPlan.period
        .replace('/', '')
        .trim()} (demo). Enjoy premium features!`,
    );
    setSelected(null);
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
          { paddingBottom: tabBarTop + (selectedPlan ? 96 : 24) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Choose Your Plan</Text>
        <Text style={styles.hint}>Tap a plan to continue</Text>
        {plans.map((plan, i) => (
          <Animated.View key={plan.id} entering={FadeInDown.delay(i * 80)}>
            <MembershipCard
              plan={plan}
              selected={selected === plan.id}
              onSelect={() => setSelected(plan.id)}
            />
          </Animated.View>
        ))}
      </ScrollView>

      {selectedPlan ? (
        <Animated.View
          key={selectedPlan.id}
          entering={FadeInDown.duration(220)}
          exiting={FadeOutDown.duration(180)}
          style={[styles.payBar, { bottom: tabBarTop + 12 }]}
        >
          <PremiumButton
            title={`Pay ${formatCurrency(selectedPlan.price)} · ${
              selectedPlan.name
            }`}
            onPress={onPay}
          />
        </Animated.View>
      ) : null}

      <PremiumOfferPopup
        visible={showOffer}
        plans={plans}
        onClose={() => setShowOffer(false)}
      />
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
  payBar: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
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
