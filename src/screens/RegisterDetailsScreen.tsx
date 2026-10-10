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
  CITIES,
  EDUCATION_OPTIONS,
  HEIGHT_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  STATE_OPTIONS,
} from '../constants';
import { useRegisterStore } from '../store/useRegisterStore';
import { MaritalStatus } from '../types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterDetails'>;
type SheetKey =
  | 'marital'
  | 'caste'
  | 'day'
  | 'month'
  | 'year'
  | 'height'
  | 'education'
  | 'state'
  | 'city'
  | null;

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
  const [caste, setCaste] = useState(draft.caste);
  const [day, setDay] = useState(draft.dobDay);
  const [month, setMonth] = useState(draft.dobMonth);
  const [year, setYear] = useState(draft.dobYear);
  const [height, setHeight] = useState(draft.height);
  const [education, setEducation] = useState(draft.education);
  const [state, setState] = useState(draft.state);
  const [city, setCity] = useState(draft.city);
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
      : sheet === 'caste'
        ? CASTE_OPTIONS
        : sheet === 'day'
          ? days
          : sheet === 'month'
            ? MONTHS.map((m) => m.label)
            : sheet === 'year'
              ? years
              : sheet === 'height'
                ? HEIGHT_OPTIONS
                : sheet === 'education'
                  ? EDUCATION_OPTIONS
                  : sheet === 'state'
                    ? STATE_OPTIONS
                    : sheet === 'city'
                      ? CITIES
                      : [];

  const sheetTitle =
    sheet === 'marital'
      ? 'Marital Status'
      : sheet === 'caste'
        ? 'Select Caste'
        : sheet === 'day'
          ? 'Day'
          : sheet === 'month'
            ? 'Month'
            : sheet === 'year'
              ? 'Year'
              : sheet === 'height'
                ? 'Height'
                : sheet === 'education'
                  ? 'Education'
                  : sheet === 'state'
                    ? 'State'
                    : sheet === 'city'
                      ? 'City'
                      : '';

  const onContinue = () => {
    if (!marital) {
      Alert.alert('Required', 'Please select marital status');
      return;
    }
    if (!caste) {
      Alert.alert('Required', 'Please select caste');
      return;
    }
    if (!day || !month || !year) {
      Alert.alert('Required', 'Please select date of birth');
      return;
    }
    if (!height || !education || !state || !city) {
      Alert.alert('Required', 'Please complete height, education, state & city');
      return;
    }

    draft.update({
      maritalStatus: marital as MaritalStatus,
      caste,
      dobDay: day,
      dobMonth: month,
      dobYear: year,
      height,
      education,
      state,
      city,
    });
    navigation.navigate('RegisterContact');
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
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select} onPress={onPress}>
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={18} color={colors.textMuted} />
      </Pressable>
    </View>
  );

  return (
    <RegisterStepLayout
      step={2}
      total={3}
      title="Profile Details"
      subtitle="Complete your matrimony profile"
      onBack={() => navigation.goBack()}
      footer={<PremiumButton title="Continue" onPress={onContinue} />}
    >
      <Text style={styles.section}>Personal</Text>
      <SelectField
        label="Marital Status"
        value={marital}
        placeholder="Select marital status"
        onPress={() => setSheet('marital')}
      />
      <SelectField
        label="Caste"
        value={caste}
        placeholder="Select caste"
        onPress={() => setSheet('caste')}
      />

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

      <Text style={[styles.section, { marginTop: spacing.lg }]}>
        Education & Location
      </Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <SelectField
            label="Height"
            value={height}
            placeholder="Height"
            onPress={() => setSheet('height')}
          />
        </View>
        <View style={styles.half}>
          <SelectField
            label="Education"
            value={education}
            placeholder="Education"
            onPress={() => setSheet('education')}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.half}>
          <SelectField
            label="State"
            value={state}
            placeholder="State"
            onPress={() => setSheet('state')}
          />
        </View>
        <View style={styles.half}>
          <SelectField
            label="City"
            value={city}
            placeholder="City"
            onPress={() => setSheet('city')}
          />
        </View>
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
              if (sheet === 'caste') setCaste(item);
              if (sheet === 'day') setDay(item);
              if (sheet === 'month') {
                const found = MONTHS.find((m) => m.label === item);
                if (found) setMonth(found.value);
              }
              if (sheet === 'year') setYear(item);
              if (sheet === 'height') setHeight(item);
              if (sheet === 'education') setEducation(item);
              if (sheet === 'state') setState(item);
              if (sheet === 'city') setCity(item);
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
  section: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
    marginBottom: spacing.md,
  },
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
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
