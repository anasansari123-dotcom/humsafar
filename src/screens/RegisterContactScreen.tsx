import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Mail, Phone, Users } from 'lucide-react-native';
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
import { generateAccountId } from '../utils';
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
  const [parentMobile, setParentMobile] = useState(draft.parentPhone);
  const [showCodes, setShowCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const finishProfile = async (
    email: string,
    phone: string,
    parentPhone: string,
  ) => {
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
    const accountId = generateAccountId();

    updateProfile({
      id: accountId,
      accountId,
      name,
      age,
      gender: (draft.gender || 'Male') as 'Male' | 'Female',
      height: draft.height,
      city: draft.city,
      state: draft.state,
      education: draft.education,
      profession: draft.profession || 'Other',
      caste: draft.caste,
      parentPhone,
      maritalStatus: (draft.maritalStatus || 'Never Married') as MaritalStatus,
      profileCompletion: 85,
      isPremium: false,
      membership: 'FREE',
    });

    setPhone(phone);

    await new Promise((r) => setTimeout(r, 400));
    draft.reset();
    setLoading(false);
    setHasSeenMembership(true);
    setShowProfileCreatedPopup(true);
    login();
  };

  const onCreate = async () => {
    const email = mail.trim();
    const phone = mobile.trim().replace(/\s/g, '');
    const parentPhone = parentMobile.trim().replace(/\s/g, '');

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid email', 'Please enter a valid email or leave it empty');
      return;
    }
    if (!phone) {
      Alert.alert('Required', 'Please enter your mobile number');
      return;
    }
    if (phone.length < 10) {
      Alert.alert('Invalid mobile', 'Please enter a valid 10-digit number');
      return;
    }
    if (!parentPhone) {
      Alert.alert('Required', "Please enter your parent's mobile number");
      return;
    }
    if (parentPhone.length < 10) {
      Alert.alert('Invalid parent number', 'Please enter a valid 10-digit number');
      return;
    }
    if (!agreed) {
      Alert.alert(
        'Terms & Conditions',
        'Please accept the Terms & Conditions to create your account',
      );
      return;
    }

    draft.update({
      email,
      phone,
      parentPhone,
      phoneVerified: false,
    });
    await finishProfile(email, phone, parentPhone);
  };

  return (
    <RegisterStepLayout
      step={4}
      total={4}
      title="Contact Details"
      subtitle="Mobile & parent number required · Email optional"
      onBack={() => navigation.goBack()}
      footer={
        <>
          <Pressable
            style={styles.termsRow}
            onPress={() => setAgreed((v) => !v)}
            hitSlop={6}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: agreed }}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
              {agreed && <Check size={13} color={colors.accent} strokeWidth={3} />}
            </View>
            <Text style={styles.termsText}>
              I agree to the{' '}
              <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text> of HUMSAFAR
            </Text>
          </Pressable>
          <PremiumButton
            title="Create Profile"
            onPress={onCreate}
            loading={loading}
          />
        </>
      }
    >
      <CustomTextInput
        label="Email (optional)"
        value={mail}
        onChangeText={setMail}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        left={<Mail size={18} color={colors.textMuted} />}
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

      <CustomTextInput
        label="Parent's Mobile Number"
        value={parentMobile}
        onChangeText={setParentMobile}
        placeholder="Father / Mother mobile number"
        keyboardType="phone-pad"
        maxLength={12}
        left={<Users size={18} color={colors.textMuted} />}
      />

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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: spacing.md,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxOn: {
    backgroundColor: colors.primary,
  },
  termsText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 12.5,
    lineHeight: 19,
    color: colors.textSecondary,
  },
  termsLink: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
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
