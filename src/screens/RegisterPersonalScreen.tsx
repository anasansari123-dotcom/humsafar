import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import {
  BottomSheet,
  PremiumButton,
  RegisterStepLayout,
} from '../components';
import {
  CASTE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
} from '../constants';
import { useRegisterStore } from '../store/useRegisterStore';
import { useProfileStore } from '../store/useProfileStore';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';
import { MaritalStatus } from '../types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterPersonal'>;
type SheetKey = 'caste' | 'day' | 'month' | 'year' | 'marital' | null;

const MONTHS = [
  { label: 'Jan', value: '1' },
  { label: 'Feb', value: '2' },
  { label: 'Mar', value: '3' },
  { label: 'Apr', value: '4' },
  { label: 'May', value: '5' },
  { label: 'Jun', value: '6' },
  { label: 'Jul', value: '7' },
  { label: 'Aug', value: '8' },
  { label: 'Sep', value: '9' },
  { label: 'Oct', value: '10' },
  { label: 'Nov', value: '11' },
  { label: 'Dec', value: '12' },
];

export const RegisterPersonalScreen: React.FC<Props> = ({ navigation }) => {
  const draft = useRegisterStore();
  const updateProfile = useProfileStore((s) => s.updateProfile);
  const { login, setHasSeenMembership } = useAuthStore();
  const setShowProfileCreatedPopup = useAppStore(
    (s) => s.setShowProfileCreatedPopup,
  );

  const [caste, setCaste] = useState(draft.caste);
  const [gender, setGender] = useState(draft.gender);
  const [day, setDay] = useState(draft.dobDay);
  const [month, setMonth] = useState(draft.dobMonth);
  const [year, setYear] = useState(draft.dobYear);
  const [marital, setMarital] = useState(draft.maritalStatus);
  const [sheet, setSheet] = useState<SheetKey>(null);
  const [loading, setLoading] = useState(false);

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => String(now - 18 - i));
  }, []);

  const days = useMemo(
    () => Array.from({ length: 31 }, (_, i) => String(i + 1)),
    [],
  );

  const monthLabel = MONTHS.find((m) => m.value === month)?.label || '';

  const onCreate = async () => {
    if (!caste) {
      Alert.alert('Required', 'Please select your caste');
      return;
    }
    if (!gender) {
      Alert.alert('Required', 'Please select gender');
      return;
    }
    if (!day || !month || !year) {
      Alert.alert('Required', 'Please select date of birth');
      return;
    }
    if (!marital) {
      Alert.alert('Required', 'Please select marital status');
      return;
    }

    setLoading(true);
    draft.update({
      caste,
      gender,
      dobDay: day,
      dobMonth: month,
      dobYear: year,
      maritalStatus: marital as MaritalStatus,
    });

    const name = `${draft.firstName} ${draft.lastName}`.trim();
    const age = (() => {
      const today = new Date();
      const birth = new Date(Number(year), Number(month) - 1, Number(day));
      let a = today.getFullYear() - birth.getFullYear();
      const md = today.getMonth() - birth.getMonth();
      if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) a -= 1;
      return a > 0 && a < 100 ? a : 25;
    })();

    updateProfile({
      name,
      age,
      gender: gender as 'Male' | 'Female',
      height: draft.height,
      city: draft.city,
      state: draft.state,
      education: draft.education,
      caste,
      maritalStatus: marital as MaritalStatus,
      profileCompletion: 70,
      isPremium: false,
      membership: 'FREE',
    });

    await new Promise((r) => setTimeout(r, 500));
    draft.reset();
    setLoading(false);
    setHasSeenMembership(true);
    setShowProfileCreatedPopup(true);
    login();
  };

  const SelectField = ({
    label,
    value,
    placeholder,
    onPress,
  }: {
    label: string;
    value: string;
    placeholder: string;
    onPress: () => void;
  }) => (
    <View style={styles.selectWrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select} onPress={onPress}>
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );

  const sheetOptions =
    sheet === 'caste'
      ? CASTE_OPTIONS
      : sheet === 'day'
        ? days
        : sheet === 'month'
          ? MONTHS.map((m) => m.label)
          : sheet === 'year'
            ? years
            : sheet === 'marital'
              ? [...MARITAL_STATUS_OPTIONS]
              : [];

  return (
    <RegisterStepLayout
      step={4}
      title="Personal Info"
      subtitle="Almost done — complete your profile"
      onBack={() => navigation.goBack()}
      footer={
        <PremiumButton
          title="Create Profile"
          onPress={onCreate}
          loading={loading}
        />
      }
    >
      <View style={styles.column}>
        <SelectField
          label="Caste"
          value={caste}
          placeholder="Select caste"
          onPress={() => setSheet('caste')}
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioRow}>
          {GENDER_OPTIONS.map((g) => (
            <Pressable
              key={g}
              style={[styles.radio, gender === g && styles.radioActive]}
              onPress={() => setGender(g)}
            >
              <View
                style={[styles.radioDot, gender === g && styles.radioDotOn]}
              />
              <Text
                style={[
                  styles.radioText,
                  gender === g && styles.radioTextActive,
                ]}
              >
                {g}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>
          Date of Birth
        </Text>
        <View style={styles.dobColumn}>
          <SelectField
            label="Day"
            value={day}
            placeholder="Day"
            onPress={() => setSheet('day')}
          />
          <SelectField
            label="Month"
            value={monthLabel}
            placeholder="Month"
            onPress={() => setSheet('month')}
          />
          <SelectField
            label="Year"
            value={year}
            placeholder="Year"
            onPress={() => setSheet('year')}
          />
        </View>

        <SelectField
          label="Marital Status"
          value={marital}
          placeholder="Select marital status"
          onPress={() => setSheet('marital')}
        />
      </View>

      <BottomSheet
        visible={!!sheet}
        onClose={() => setSheet(null)}
        title={
          sheet === 'caste'
            ? 'Select Caste'
            : sheet === 'day'
              ? 'Select Day'
              : sheet === 'month'
                ? 'Select Month'
                : sheet === 'year'
                  ? 'Select Year'
                  : 'Marital Status'
        }
      >
        {sheetOptions.map((item) => (
          <Pressable
            key={item}
            style={styles.option}
            onPress={() => {
              if (sheet === 'caste') setCaste(item);
              if (sheet === 'day') setDay(item);
              if (sheet === 'month') {
                const found = MONTHS.find((m) => m.label === item);
                if (found) setMonth(found.value);
              }
              if (sheet === 'year') setYear(item);
              if (sheet === 'marital') setMarital(item as MaritalStatus);
              setSheet(null);
            }}
          >
            <Text style={styles.optionText}>{item}</Text>
          </Pressable>
        ))}
      </BottomSheet>
    </RegisterStepLayout>
  );
};

const styles = StyleSheet.create({
  column: {
    gap: spacing.xs,
  },
  dobColumn: {
    gap: spacing.xs,
  },
  selectWrap: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
    marginBottom: 8,
  },
  select: {
    minHeight: 54,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  placeholder: {
    color: colors.textMuted,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  radio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 54,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 14,
    backgroundColor: colors.surface,
  },
  radioActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioDotOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  radioText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  radioTextActive: {
    color: colors.primary,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionText: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
});
