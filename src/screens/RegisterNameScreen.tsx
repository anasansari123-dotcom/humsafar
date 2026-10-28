import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import {
  BottomSheet,
  CustomTextInput,
  PremiumButton,
  RegisterStepLayout,
} from '../components';
import { CASTE_OPTIONS, GENDER_OPTIONS } from '../constants';
import { useRegisterStore, RegisterGender } from '../store/useRegisterStore';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterName'>;

const CASTE_LIST = CASTE_OPTIONS.includes('Other')
  ? CASTE_OPTIONS
  : [...CASTE_OPTIONS, 'Other'];

export const RegisterNameScreen: React.FC<Props> = ({ navigation }) => {
  const { firstName, gender, caste, update, reset } = useRegisterStore();

  const [fName, setFName] = useState(firstName);
  const [selectedCaste, setSelectedCaste] = useState(
    caste && CASTE_LIST.includes(caste) ? caste : caste === 'Other' ? 'Other' : '',
  );
  const [selectedGender, setSelectedGender] = useState<RegisterGender | ''>(
    gender,
  );
  const [showCaste, setShowCaste] = useState(false);

  const onContinue = () => {
    if (!fName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      return;
    }
    if (!selectedGender) {
      Alert.alert('Required', 'Please select your gender');
      return;
    }

    update({
      firstName: fName.trim(),
      lastName: '',
      gender: selectedGender,
      caste: selectedCaste,
    });
    navigation.navigate('RegisterDetails');
  };

  return (
    <RegisterStepLayout
      step={1}
      total={4}
      title="Basic Info"
      subtitle="Name & gender"
      onBack={() => {
        reset();
        navigation.goBack();
      }}
      footer={<PremiumButton title="Continue" onPress={onContinue} />}
    >
      <View style={styles.column}>
        <CustomTextInput
          label="First Name"
          value={fName}
          onChangeText={setFName}
          placeholder="Enter first name"
          autoCapitalize="words"
          containerStyle={styles.fieldGap}
        />

        <Text style={styles.label}>Last Name (optional)</Text>
        <Pressable style={styles.select} onPress={() => setShowCaste(true)}>
          <Text
            style={[styles.selectText, !selectedCaste && styles.placeholder]}
          >
            {selectedCaste || 'Select last name'}
          </Text>
          <ChevronDown size={18} color={colors.textMuted} />
        </Pressable>

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radioRow}>
          {GENDER_OPTIONS.map((g) => {
            const active = selectedGender === g;
            return (
              <Pressable
                key={g}
                style={[styles.radio, active && styles.radioActive]}
                onPress={() => setSelectedGender(g)}
              >
                <View style={[styles.radioDot, active && styles.radioDotOn]} />
                <Text
                  style={[styles.radioText, active && styles.radioTextActive]}
                >
                  {g}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <BottomSheet
        visible={showCaste}
        onClose={() => setShowCaste(false)}
        title="Select Last Name"
      >
        <Pressable
          style={styles.option}
          onPress={() => {
            setSelectedCaste('');
            setShowCaste(false);
          }}
        >
          <Text style={[styles.optionText, styles.placeholder]}>
            Prefer not to say
          </Text>
        </Pressable>
        {CASTE_LIST.map((item) => (
          <Pressable
            key={item}
            style={styles.option}
            onPress={() => {
              setSelectedCaste(item);
              setShowCaste(false);
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
  fieldGap: {
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
    marginBottom: spacing.md,
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
    borderColor: colors.accent,
  },
  radioDotOn: {
    borderColor: colors.accent,
    backgroundColor: colors.primary,
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
