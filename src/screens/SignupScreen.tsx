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
import {
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import {
  BottomSheet,
  BrandTitle,
  CustomTextInput,
  GradientHeader,
  Ornament,
  PremiumButton,
} from '../components';
import { COUNTRY_CODES } from '../constants';
import { useAuthStore } from '../store/useAuthStore';
import { colors, fonts, radius, shadows, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { countryCode, setCountryCode, setPhone, login, setHasSeenMembership } =
    useAuthStore();
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCodes, setShowCodes] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: FormValues) => {
    if (!accepted) {
      Alert.alert('Required', 'Please accept Terms & Privacy Policy');
      return;
    }
    setLoading(true);
    setPhone(data.phone);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    login();
    setHasSeenMembership(true);
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Create Account"
        subtitle="Join HUMSAFAR free today"
        onBack={() => navigation.goBack()}
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
            entering={FadeInDown.delay(100)}
            style={[styles.card, shadows.card]}
          >
            <View style={styles.brandInCard}>
              <BrandTitle size="md" />
            </View>
            <Controller
              control={control}
              name="fullName"
              rules={{ required: 'Full name is required' }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Full Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Your full name"
                  error={errors.fullName?.message}
                  left={<User size={18} color={colors.textMuted} />}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Enter a valid email',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  left={<Mail size={18} color={colors.textMuted} />}
                />
              )}
            />

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
                    />
                  )}
                />
              </View>
            </View>

            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Create password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  error={errors.password?.message}
                  left={<Lock size={18} color={colors.textMuted} />}
                  right={
                    <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
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

            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: 'Confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              }}
              render={({ field: { onChange, value } }) => (
                <CustomTextInput
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Re-enter password"
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  error={errors.confirmPassword?.message}
                  left={<Lock size={18} color={colors.textMuted} />}
                  right={
                    <Pressable onPress={() => setShowConfirm((v) => !v)} hitSlop={10}>
                      {showConfirm ? (
                        <EyeOff size={18} color={colors.textMuted} />
                      ) : (
                        <Eye size={18} color={colors.textMuted} />
                      )}
                    </Pressable>
                  }
                />
              )}
            />

            <Pressable
              style={styles.terms}
              onPress={() => setAccepted((v) => !v)}
            >
              <View style={[styles.checkbox, accepted && styles.checkboxOn]}>
                {accepted && <Check size={14} color={colors.primary} />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.link}>Terms of Service</Text> and{' '}
                <Text style={styles.link}>Privacy Policy</Text>
              </Text>
            </Pressable>

            <PremiumButton
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={!accepted}
            />

            <Pressable
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account?{' '}
                <Text style={styles.link}>Log In</Text>
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
  terms: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: spacing.xl,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  termsText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  link: {
    color: colors.accentDark,
    fontFamily: fonts.medium,
  },
  loginLink: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  loginLinkText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
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
