import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import {
  CustomTextInput,
  PremiumButton,
  RegisterStepLayout,
} from '../components';
import { GENDER_OPTIONS } from '../constants';
import { useRegisterStore, RegisterGender } from '../store/useRegisterStore';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterName'>;

export const RegisterNameScreen: React.FC<Props> = ({ navigation }) => {
  const { firstName, lastName, gender, update, reset } = useRegisterStore();
  const [fName, setFName] = useState(firstName);
  const [lName, setLName] = useState(lastName);
  const [selectedGender, setSelectedGender] = useState<RegisterGender | ''>(
    gender,
  );

  const onContinue = () => {
    if (!fName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      return;
    }
    if (!lName.trim()) {
      Alert.alert('Required', 'Please enter your last name');
      return;
    }
    if (!selectedGender) {
      Alert.alert('Required', 'Please select your gender');
      return;
    }
    update({
      firstName: fName.trim(),
      lastName: lName.trim(),
      gender: selectedGender,
    });
    navigation.navigate('RegisterDetails');
  };

  return (
    <RegisterStepLayout
      step={1}
      total={3}
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
        <CustomTextInput
          label="Last Name"
          value={lName}
          onChangeText={setLName}
          placeholder="Enter last name"
          autoCapitalize="words"
          containerStyle={styles.fieldGap}
        />

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
                <Text style={[styles.radioText, active && styles.radioTextActive]}>
                  {g}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
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
});
