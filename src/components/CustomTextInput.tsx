import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export const CustomTextInput: React.FC<Props> = ({
  label,
  error,
  left,
  right,
  style,
  ...rest
}) => (
  <View style={styles.wrapper}>
    {label ? <Text style={styles.label}>{label}</Text> : null}
    <View style={[styles.field, error ? styles.fieldError : null]}>
      {left}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, style]}
        {...rest}
      />
      {right}
    </View>
    {error ? <Text style={styles.error}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
    marginBottom: 8,
  },
  field: {
    minHeight: 54,
    borderRadius: radius.xl,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 14,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
  },
});
