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
import { authService } from '../services/api';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterContact'>;

export const RegisterContactScreen: React.FC<Props> = ({ navigation }) => {
  const { email, phone, update } = useRegisterStore();
  const { countryCode, setCountryCode, setPhone } = useAuthStore();
  const [mail, setMail] = useState(email);
  const [mobile, setMobile] = useState(phone);
  const [showCodes, setShowCodes] = useState(false);
  const [loading, setLoading] = useState(false);

  const onContinue = async () => {
    if (!mail.trim() || !/\S+@\S+\.\S+/.test(mail)) {
      Alert.alert('Required', 'Please enter a valid email');
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      Alert.alert('Required', 'Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    update({ email: mail.trim(), phone: mobile.trim(), phoneVerified: false });
    setPhone(mobile.trim());
    await authService.sendOtp(mobile.trim(), countryCode);
    setLoading(false);
    navigation.navigate('OTP', { mode: 'register' });
  };

  return (
    <RegisterStepLayout
      step={2}
      title="Contact Details"
      subtitle="Email & mobile verification"
      onBack={() => navigation.goBack()}
      footer={
        <PremiumButton
          title="Verify Mobile with OTP"
          onPress={onContinue}
          loading={loading}
        />
      }
    >
      <CustomTextInput
        label="Email"
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
