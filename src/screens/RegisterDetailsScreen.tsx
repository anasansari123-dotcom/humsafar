import React, { useState } from 'react';
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
  CITIES,
  EDUCATION_OPTIONS,
  HEIGHT_OPTIONS,
  STATE_OPTIONS,
} from '../constants';
import { useRegisterStore } from '../store/useRegisterStore';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterDetails'>;
type SheetKey = 'city' | 'state' | 'education' | 'height' | null;

export const RegisterDetailsScreen: React.FC<Props> = ({ navigation }) => {
  const draft = useRegisterStore();
  const [city, setCity] = useState(draft.city);
  const [state, setState] = useState(draft.state);
  const [education, setEducation] = useState(draft.education);
  const [height, setHeight] = useState(draft.height);
  const [sheet, setSheet] = useState<SheetKey>(null);

  const onContinue = () => {
    if (!city.trim() || !state.trim() || !education.trim() || !height.trim()) {
      Alert.alert('Required', 'Please fill city, state, education and height');
      return;
    }
    draft.update({
      city: city.trim(),
      state: state.trim(),
      education: education.trim(),
      height: height.trim(),
    });
    navigation.navigate('RegisterPersonal');
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
    sheet === 'city'
      ? CITIES
      : sheet === 'state'
        ? STATE_OPTIONS
        : sheet === 'education'
          ? EDUCATION_OPTIONS
          : sheet === 'height'
            ? HEIGHT_OPTIONS
            : [];

  return (
    <RegisterStepLayout
      step={3}
      title="Profile Details"
      subtitle="City, education & height"
      onBack={() => navigation.goBack()}
      footer={<PremiumButton title="Continue" onPress={onContinue} />}
    >
      <View style={styles.column}>
        <SelectField
          label="City"
          value={city}
          placeholder="Select city"
          onPress={() => setSheet('city')}
        />
        <SelectField
          label="State"
          value={state}
          placeholder="Select state"
          onPress={() => setSheet('state')}
        />
        <SelectField
          label="Education"
          value={education}
          placeholder="Select education"
          onPress={() => setSheet('education')}
        />
        <SelectField
          label="Height"
          value={height}
          placeholder="Select height"
          onPress={() => setSheet('height')}
        />
      </View>

      <BottomSheet
        visible={!!sheet}
        onClose={() => setSheet(null)}
        title={
          sheet === 'city'
            ? 'Select City'
            : sheet === 'state'
              ? 'Select State'
              : sheet === 'education'
                ? 'Select Education'
                : 'Select Height'
        }
      >
        {sheetOptions.map((item) => (
          <Pressable
            key={item}
            style={styles.option}
            onPress={() => {
              if (sheet === 'city') setCity(item);
              if (sheet === 'state') setState(item);
              if (sheet === 'education') setEducation(item);
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
  column: {
    gap: spacing.sm,
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
