import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Crown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { GradientHeader, MembershipCard, PremiumButton } from '../components';
import { membershipPlans } from '../data/membership';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { MembershipTier } from '../types';
import { colors, fonts, spacing } from '../theme';
import { FREE_PROFILE_LIMIT } from '../constants';

type Props = NativeStackScreenProps<AuthStackParamList, 'Membership'>;

export const MembershipScreen: React.FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<MembershipTier>('GOLD');
  const setMembership = useAppStore((s) => s.setMembership);
  const setHasSeenMembership = useAuthStore((s) => s.setHasSeenMembership);

  const goToMain = () => {
    // RootNavigator switches to Main when hasSeenMembership becomes true
    setHasSeenMembership(true);
  };

  const continueWithPlan = () => {
    setMembership(selected);
    goToMain();
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Choose Your Plan"
        subtitle="Begin your premium journey"
        tall
      >
        <View style={styles.limitBanner}>
          <Crown size={16} color={colors.primary} />
          <Text style={styles.limitText}>
            Only {FREE_PROFILE_LIMIT} Profiles Free
          </Text>
        </View>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 120 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.Text entering={FadeInDown} style={styles.intro}>
          Unlock meaningful connections with a plan that matches your journey.
        </Animated.Text>

        {membershipPlans.map((plan, i) => (
          <Animated.View key={plan.id} entering={FadeInDown.delay(80 * i)}>
            <MembershipCard
              plan={plan}
              selected={selected === plan.id}
              onSelect={() => setSelected(plan.id)}
            />
          </Animated.View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PremiumButton title="Continue" onPress={continueWithPlan} />
        <PremiumButton
          title="Skip for now"
          variant="ghost"
          onPress={() => {
            setMembership('FREE');
            goToMain();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  limitBanner: {
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
  limitText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  content: {
    padding: spacing.xl,
  },
  intro: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
});
