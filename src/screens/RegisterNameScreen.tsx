import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { CustomTextInput, PremiumButton, RegisterStepLayout } from '../components';
import { useRegisterStore } from '../store/useRegisterStore';
import { spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'RegisterName'>;

export const RegisterNameScreen: React.FC<Props> = ({ navigation }) => {
  const { firstName, lastName, update, reset } = useRegisterStore();
  const [fName, setFName] = useState(firstName);
  const [lName, setLName] = useState(lastName);

  const onContinue = () => {
    if (!fName.trim()) {
      Alert.alert('Required', 'Please enter your first name');
      return;
    }
    if (!lName.trim()) {
      Alert.alert('Required', 'Please enter your last name');
      return;
    }
    update({ firstName: fName.trim(), lastName: lName.trim() });
    navigation.navigate('RegisterContact');
  };

  return (
    <RegisterStepLayout
      step={1}
      title="Your Name"
      subtitle="Let's start with your name"
      onBack={() => {
        reset();
        navigation.goBack();
      }}
      footer={
        <PremiumButton title="Continue" onPress={onContinue} />
      }
    >
      <View style={styles.column}>
        <CustomTextInput
          label="First Name"
          value={fName}
          onChangeText={setFName}
          placeholder="Enter first name"
          autoCapitalize="words"
        />
        <CustomTextInput
          label="Last Name"
          value={lName}
          onChangeText={setLName}
          placeholder="Enter last name"
          autoCapitalize="words"
        />
      </View>
    </RegisterStepLayout>
  );
};

const styles = StyleSheet.create({
  column: {
    gap: spacing.sm,
  },
});
