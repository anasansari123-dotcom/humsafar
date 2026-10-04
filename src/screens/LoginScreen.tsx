import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import {
  AppleLogo,
  BottomSheet,
  BrandTitle,
  CustomTextInput,
  GoogleLogo,
  GradientHeader,
  Ornament,
  PremiumButton,
} from '../components';
import { COUNTRY_CODES } from '../constants';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/api';
import { colors, fonts, radius, shadows, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;
type LoginMode = 'otp' | 'password';

type FormValues = {
  phone: string;
  password: string;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { countryCode, setCountryCode, setPhone, login, setHasSeenMembership } =
    useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showCodes, setShowCodes] = useState(false);
  const [loginMode, setLoginMode] = useState<LoginMode>('otp');
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { phone: '', password: '' },
  });

  const onOtpLogin = async (data: FormValues) => {
    setLoading(true);
    setPhone(data.phone);
    await authService.sendOtp(data.phone, countryCode);
    setLoading(false);
    navigation.navigate('OTP', { mode: 'login' });
  };

  const onPasswordLogin = async (data: FormValues) => {
    setLoading(true);
    setPhone(data.phone);
    const res = await authService.loginWithPassword(data.phone, data.password);
    setLoading(false);
    if (!res.success) {
      Alert.alert('Login Failed', res.message || 'Invalid credentials');
      return;
    }
    login();
    setHasSeenMembership(true);
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Welcome Back"
        subtitle="Login to continue your journey"
        onBack={() => {
          if (navigation.canGoBack()) navigation.goBack();
          else navigation.navigate('Welcome');
        }}
      />
      <Ornament size={60} opacity={0.08} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.delay(150).duration(500)}
            style={[styles.card, shadows.card]}
          >
            <View style={styles.brandInCard}>
              <BrandTitle size="md" />
            </View>
            <Text style={styles.heading}>
              {loginMode === 'otp' ? 'OTP Login' : 'Password Login'}
            </Text>
            <Text style={styles.sub}>
              {loginMode === 'otp'
                ? 'Login with your mobile number'
                : 'Login with mobile number & password'}
            </Text>

            <View style={styles.modeTabs}>
              <Pressable
                style={[styles.modeTab, loginMode === 'otp' && styles.modeTabActive]}
                onPress={() => setLoginMode('otp')}
              >
                <Text
                  style={[
                    styles.modeTabText,
                    loginMode === 'otp' && styles.modeTabTextActive,
                  ]}
                >
                  OTP
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modeTab,
                  loginMode === 'password' && styles.modeTabActive,
                ]}
                onPress={() => setLoginMode('password')}
              >
                <Text
                  style={[
                    styles.modeTabText,
                    loginMode === 'password' && styles.modeTabTextActive,
                  ]}
                >
                  Password
                </Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.phoneRow}>
              <Pressable style={styles.codeBtn} onPress={() => setShowCodes(true)}>
                <Text style={styles.codeText}>
                  {COUNTRY_CODES.find((c) => c.code === countryCode)?.flag}{' '}
                  {countryCode}
                </Text>
              </Pressable>
              <View style={{ flex: 1 }}>
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: 'Mobile number is required',
                    minLength: { value: 10, message: 'Enter a valid number' },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <CustomTextInput
                      value={value}
                      onChangeText={onChange}
                      keyboardType="phone-pad"
                      placeholder="98765 43210"
                      maxLength={12}
                      error={errors.phone?.message}
                      style={{ marginBottom: 0 }}
                    />
                  )}
                />
              </View>
            </View>

            {loginMode === 'password' && (
              <Animated.View entering={FadeInDown.duration(280)}>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 characters',
                    },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <CustomTextInput
                      label="Password"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      error={errors.password?.message}
                      left={<Lock size={18} color={colors.textMuted} />}
                      right={
                        <Pressable
                          onPress={() => setShowPassword((v) => !v)}
                          hitSlop={10}
                        >
                          {showPassword ? (
                            <EyeOff size={18} color={colors.textMuted} />
                          ) : (
                            <Eye size={18} color={colors.textMuted} />
                          )}
                        </Pressable>
                      }
                    />
                  )}
                />
              </Animated.View>
            )}

            <Pressable style={styles.help}>
              <Text style={styles.helpText}>Forgot login? Get Help</Text>
            </Pressable>

            {loginMode === 'otp' ? (
              <PremiumButton
                title="Continue with OTP"
                onPress={handleSubmit(onOtpLogin)}
                loading={loading}
              />
            ) : (
              <>
                <PremiumButton
                  title="Login with Password"
                  onPress={handleSubmit(onPasswordLogin)}
                  loading={loading}
                  icon={<Lock size={18} color={colors.primary} />}
                />
                <Pressable
                  style={styles.switchMode}
                  onPress={() => setLoginMode('otp')}
                >
                  <Text style={styles.switchModeText}>
                    Prefer OTP? Continue with OTP
                  </Text>
                </Pressable>
              </>
            )}

            <Text style={styles.or}>or continue with</Text>

            <View style={styles.socialRow}>
              <Pressable style={styles.socialBtn}>
                <GoogleLogo size={22} />
                <Text style={styles.socialText}>Google</Text>
              </Pressable>
              <Pressable style={styles.socialBtn}>
                <AppleLogo size={22} />
                <Text style={styles.socialText}>Apple</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.signupLink}
              onPress={() => navigation.navigate('RegisterName')}
            >
              <Text style={styles.helpText}>
                New to HUMSAFAR?{' '}
                <Text style={styles.signupText}>Register Free</Text>
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomSheet
        visible={showCodes}
        onClose={() => setShowCodes(false)}
        title="Select Country Code"
      >
        {COUNTRY_CODES.map((item) => (
          <Pressable
            key={item.code}
            style={styles.codeItem}
            onPress={() => {
              setCountryCode(item.code);
              setShowCodes(false);
            }}
          >
            <Text style={styles.codeItemText}>
              {item.flag}  {item.country}  {item.code}
            </Text>
          </Pressable>
        ))}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.massive + spacing.xl,
  },
  brandInCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    borderWidth: 2.5,
    borderColor: colors.primary,
  },
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.primary,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    marginTop: 4,
  },
  modeTabs: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: radius.xl,
    padding: 4,
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: colors.primary,
  },
  modeTabText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  modeTabTextActive: {
    color: colors.accent,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  codeBtn: {
    height: 54,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  codeText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  switchMode: {
    marginTop: spacing.lg,
    alignItems: 'center',
    padding: 6,
  },
  switchModeText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.accentDark,
  },
  or: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginVertical: spacing.lg,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 50,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
  },
  socialText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primary,
  },
  help: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    alignItems: 'flex-start',
  },
  helpText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.secondary,
  },
  signupLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  signupText: {
    color: colors.accentDark,
    fontFamily: fonts.semiBold,
  },
  codeItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  codeItemText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
});
