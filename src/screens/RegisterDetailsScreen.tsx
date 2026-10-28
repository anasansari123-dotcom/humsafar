import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import {
  BottomSheet,
  PremiumButton,
  RegisterStepLayout,
} from '../components';
import { HEIGHT_OPTIONS, MARITAL_STATUS_OPTIONS } from '../constants';
import { useRegisterStore } from '../store/useRegisterStore';
import { MaritalStatus } from '../types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterDetails'>;
type SheetKey = 'marital' | 'day' | 'month' | 'year' | 'height' | null;

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

export const RegisterDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const draft = useRegisterStore();

  const [marital, setMarital] = useState(draft.maritalStatus);
  const [day, setDay] = useState(draft.dobDay);
  const [month, setMonth] = useState(draft.dobMonth);
  const [year, setYear] = useState(draft.dobYear);
  const [height, setHeight] = useState(draft.height);
  const [sheet, setSheet] = useState<SheetKey>(null);

  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: 50 }, (_, i) => String(now - 18 - i));
  }, []);
  const days = useMemo(
    () => Array.from({ length: 31 }, (_, i) => String(i + 1)),
    [],
  );
  const monthLabel = MONTHS.find((m) => m.value === month)?.label || '';

  const sheetOptions =
    sheet === 'marital'
      ? [...MARITAL_STATUS_OPTIONS]
      : sheet === 'day'
        ? days
        : sheet === 'month'
          ? MONTHS.map((m) => m.label)
          : sheet === 'year'
            ? years
            : sheet === 'height'
              ? HEIGHT_OPTIONS
              : [];

  const sheetTitle =
    sheet === 'marital'
      ? 'Marital Status'
      : sheet === 'day'
        ? 'Day'
        : sheet === 'month'
          ? 'Month'
          : sheet === 'year'
            ? 'Year'
            : sheet === 'height'
              ? 'Height'
              : '';

  const onContinue = () => {
    if (!marital) {
      Alert.alert('Required', 'Please select marital status');
      return;
    }
    if (!day || !month || !year) {
      Alert.alert('Required', 'Please select date of birth');
      return;
    }
    if (!height) {
      Alert.alert('Required', 'Please select height');
      return;
    }

    draft.update({
      maritalStatus: marital as MaritalStatus,
      dobDay: day,
      dobMonth: month,
      dobYear: year,
      height,
    });
    navigation.navigate('RegisterCareer');
  };

  return (
    <RegisterStepLayout
      step={2}
      total={4}
      title="Personal Details"
      subtitle="Marital status, DOB & height"
      onBack={() => navigation.goBack()}
      footer={<PremiumButton title="Continue" onPress={onContinue} />}
    >
      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Marital Status</Text>
        <Pressable style={styles.select} onPress={() => setSheet('marital')}>
          <Text style={[styles.selectText, !marital && styles.placeholder]}>
            {marital || 'Select marital status'}
          </Text>
          <ChevronDown size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <Text style={styles.label}>Date of Birth</Text>
      <View style={styles.dobBox}>
        <Pressable style={styles.dobPart} onPress={() => setSheet('day')}>
          <Text style={styles.dobHint}>Day</Text>
          <Text style={[styles.dobValue, !day && styles.placeholder]}>
            {day || 'DD'}
          </Text>
        </Pressable>
        <View style={styles.dobDivider} />
        <Pressable style={styles.dobPart} onPress={() => setSheet('month')}>
          <Text style={styles.dobHint}>Month</Text>
          <Text style={[styles.dobValue, !monthLabel && styles.placeholder]}>
            {monthLabel || 'MM'}
          </Text>
        </Pressable>
        <View style={styles.dobDivider} />
        <Pressable style={styles.dobPart} onPress={() => setSheet('year')}>
          <Text style={styles.dobHint}>Year</Text>
          <Text style={[styles.dobValue, !year && styles.placeholder]}>
            {year || 'YYYY'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.fieldBlock}>
        <Text style={styles.label}>Height</Text>
        <Pressable style={styles.select} onPress={() => setSheet('height')}>
          <Text style={[styles.selectText, !height && styles.placeholder]}>
            {height || 'Select height'}
          </Text>
          <ChevronDown size={18} color={colors.textMuted} />
        </Pressable>
      </View>

      <BottomSheet
        visible={!!sheet}
        onClose={() => setSheet(null)}
        title={sheetTitle}
      >
        {sheetOptions.map((item) => (
          <Pressable
            key={item}
            style={styles.option}
            onPress={() => {
              if (sheet === 'marital') setMarital(item as MaritalStatus);
              if (sheet === 'day') setDay(item);
              if (sheet === 'month') {
                const found = MONTHS.find((m) => m.label === item);
                if (found) setMonth(found.value);
              }
              if (sheet === 'year') setYear(item);
              if (sheet === 'height') setHeight(item);
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
  fieldBlock: {
    marginBottom: spacing.md,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
    marginBottom: 8,
  },
  select: {
    minHeight: 52,
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
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  placeholder: {
    color: colors.textMuted,
  },
  dobBox: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 64,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  dobPart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dobHint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  dobValue: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.text,
  },
  dobDivider: {
    width: 1,
    backgroundColor: colors.border,
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
