import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Mail, Phone } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import {
  BottomSheet,
  CustomTextInput,
  PremiumButton,
  RegisterStepLayout,
} from '../components';
import { COUNTRY_CODES } from '../constants';
import { useAuthStore } from '../store/useAuthStore';
import { useRegisterStore } from '../store/useRegisterStore';
import { useProfileStore } from '../store/useProfileStore';
import { useAppStore } from '../store/useAppStore';
import { MaritalStatus } from '../types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterContact'>;

export const RegisterContactScreen: React.FC<Props> = ({ navigation }) => {
  const draft = useRegisterStore();
  const { countryCode, setCountryCode, setPhone, login, setHasSeenMembership } =
    useAuthStore();
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const setShowProfileCreatedPopup = useAppStore(
    (s) => s.setShowProfileCreatedPopup,
  );

  const [mail, setMail] = useState(draft.email);
  const [mobile, setMobile] = useState(draft.phone);
  const [showCodes, setShowCodes] = useState(false);
  const [loading, setLoading] = useState(false);

  const finishProfile = async (email: string, phone: string) => {
    setLoading(true);

    const birth = new Date(
      Number(draft.dobYear),
      Number(draft.dobMonth) - 1,
      Number(draft.dobDay),
    );
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const md = today.getMonth() - birth.getMonth();
    if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age -= 1;
    if (age <= 0 || age >= 100) age = 25;

    const name = `${draft.firstName} ${draft.lastName}`.trim();

    updateProfile({
      name,
      age,
      gender: (draft.gender || 'Male') as 'Male' | 'Female',
      height: draft.height,
      city: draft.city,
      state: draft.state,
      education: draft.education,
      caste: draft.caste,
      maritalStatus: (draft.maritalStatus || 'Never Married') as MaritalStatus,
      profileCompletion: email || phone ? 80 : 70,
      isPremium: false,
      membership: 'FREE',
    });

    if (phone) setPhone(phone);

    await new Promise((r) => setTimeout(r, 400));
    draft.reset();
    setLoading(false);
    setHasSeenMembership(true);
    setShowProfileCreatedPopup(true);
    login();
  };

  const onCreate = async () => {
    const email = mail.trim();
    const phone = mobile.trim();

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email or leave it empty');
      return;
    }
    if (phone && phone.length < 10) {
      Alert.alert(
        'Invalid mobile',
        'Please enter a valid 10-digit number or leave it empty',
      );
      return;
    }

    draft.update({
      email,
      phone,
      phoneVerified: false,
    });
    await finishProfile(email, phone);
  };

  return (
    <RegisterStepLayout
      step={3}
      total={3}
      title="Contact (Optional)"
      subtitle="You can skip and add later"
      onBack={() => navigation.goBack()}
      footer={
        <View style={styles.footerBtns}>
          <PremiumButton
            title="Create Profile"
            onPress={onCreate}
            loading={loading}
          />
          <Pressable
            style={styles.skip}
            onPress={() => finishProfile('', '')}
            disabled={loading}
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </Pressable>
        </View>
      }
    >
      <Text style={styles.hint}>
        Email and mobile are optional. Add them now or skip to finish registration.
      </Text>

      <CustomTextInput
        label="Email (optional)"
        value={mail}
        onChangeText={setMail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        left={<Mail size={18} color={colors.textMuted} />}
      />

      <Text style={styles.label}>Mobile Number (optional)</Text>
      <View style={styles.phoneRow}>
        <Pressable style={styles.codeBtn} onPress={() => setShowCodes(true)}>
          <Text style={styles.codeText}>
            {COUNTRY_CODES.find((c) => c.code === countryCode)?.flag}{' '}
            {countryCode}
          </Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <CustomTextInput
            value={mobile}
            onChangeText={setMobile}
            placeholder="Mobile number"
            keyboardType="phone-pad"
            maxLength={12}
            left={<Phone size={18} color={colors.textMuted} />}
          />
        </View>
      </View>

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
    </RegisterStepLayout>
  );
};

const styles = StyleSheet.create({
  hint: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.lg,
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
  footerBtns: {
    gap: 4,
  },
  skip: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.accentDark,
  },
  codeItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  codeItemText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
});
