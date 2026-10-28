import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import {
  BottomSheet,
  PremiumButton,
  RegisterStepLayout,
} from '../components';
import {
  CITIES,
  EDUCATION_OPTIONS,
  PROFESSION_OPTIONS,
  STATE_OPTIONS,
} from '../constants';
import { useRegisterStore } from '../store/useRegisterStore';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterCareer'>;
type SheetKey = 'education' | 'profession' | 'state' | 'city' | null;

export const RegisterCareerScreen: React.FC<Props> = ({ navigation }) => {
  const draft = useRegisterStore();

  const [education, setEducation] = useState(draft.education);
  const [profession, setProfession] = useState(draft.profession);
  const [state, setState] = useState(draft.state);
  const [city, setCity] = useState(draft.city);
  const [sheet, setSheet] = useState<SheetKey>(null);

  const sheetOptions =
    sheet === 'education'
      ? EDUCATION_OPTIONS
      : sheet === 'profession'
        ? PROFESSION_OPTIONS
        : sheet === 'state'
          ? STATE_OPTIONS
          : sheet === 'city'
            ? CITIES
            : [];

  const sheetTitle =
    sheet === 'education'
      ? 'Education'
      : sheet === 'profession'
        ? 'Job Details'
        : sheet === 'state'
          ? 'State'
          : sheet === 'city'
            ? 'City'
            : '';

  const onContinue = () => {
    if (!education) {
      Alert.alert('Required', 'Please select education');
      return;
    }
    if (!profession) {
      Alert.alert('Required', 'Please select job details');
      return;
    }
    if (!state || !city) {
      Alert.alert('Required', 'Please select state and city');
      return;
    }

    draft.update({
      education,
      profession,
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
      step={3}
      total={4}
      title="Education & Location"
      subtitle="Education, job, state & city"
      onBack={() => navigation.goBack()}
      footer={<PremiumButton title="Continue" onPress={onContinue} />}
    >
      <SelectField
        label="Education"
        value={education}
        placeholder="Select education"
        onPress={() => setSheet('education')}
      />
      <SelectField
        label="Job Details"
        value={profession}
        placeholder="Select profession"
        onPress={() => setSheet('profession')}
      />
      <SelectField
        label="State"
        value={state}
        placeholder="Select state"
        onPress={() => setSheet('state')}
      />
      <SelectField
        label="City"
        value={city}
        placeholder="Select city"
        onPress={() => setSheet('city')}
      />

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
              if (sheet === 'education') setEducation(item);
              if (sheet === 'profession') setProfession(item);
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
