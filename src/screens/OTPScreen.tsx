import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { GradientHeader, OTPInput, PremiumButton } from '../components';
import { useAuthStore } from '../store/useAuthStore';
import { useRegisterStore } from '../store/useRegisterStore';
import { authService } from '../services/api';
import { colors, fonts, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTP'>;

export const OTPScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const mode = route.params?.mode ?? 'login';
  const { phone, countryCode, login, setHasSeenMembership } = useAuthStore();
  const updateRegister = useRegisterStore((s) => s.update);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const verify = async () => {
    setLoading(true);
    const res = await authService.verifyOtp(otp);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Invalid OTP', res.message || 'Please try again');
      return;
    }

    if (mode === 'register') {
      updateRegister({ phoneVerified: true });
      navigation.navigate('RegisterDetails');
      return;
    }

    login();
    setHasSeenMembership(true);
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="OTP Verification"
        subtitle="Enter the 4-digit code"
        onBack={() => navigation.goBack()}
      />

      <Animated.View
        entering={FadeInDown.duration(450)}
        style={[styles.content, { paddingBottom: insets.bottom + 20 }]}
      >
        <Text style={styles.info}>
          Code sent to{' '}
          <Text style={styles.phone}>
            {countryCode} {phone}
          </Text>
        </Text>

        <OTPInput value={otp} onChange={setOtp} length={4} />

        <View style={styles.resendRow}>
          {timer > 0 ? (
            <Text style={styles.timer}>
              Resend code in 00:{timer.toString().padStart(2, '0')}
            </Text>
          ) : (
            <Pressable onPress={() => setTimer(30)}>
              <Text style={styles.resend}>Resend OTP</Text>
            </Pressable>
          )}
        </View>

        <PremiumButton
          title={mode === 'register' ? 'Verify & Continue' : 'Verify & Login'}
          onPress={verify}
          loading={loading}
          disabled={otp.length < 4}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    marginTop: spacing.xxl,
  },
  info: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  phone: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  resendRow: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  timer: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textMuted,
  },
  resend: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.accentDark,
  },
});
