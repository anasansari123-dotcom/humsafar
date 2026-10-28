import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  containerStyle?: ViewStyle;
  compact?: boolean;
}

export const CustomTextInput: React.FC<Props> = ({
  label,
  error,
  left,
  right,
  style,
  containerStyle,
  compact,
  ...rest
}) => (
  <View style={[styles.wrapper, containerStyle]}>
    {label ? (
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
    ) : null}
    <View
      style={[
        styles.field,
        compact && styles.fieldCompact,
        error ? styles.fieldError : null,
      ]}
    >
      {left}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, compact && styles.inputCompact, style]}
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
  fieldCompact: {
    minHeight: 42,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    gap: 8,
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
  inputCompact: {
    fontSize: 14,
    paddingVertical: 8,
  },
  labelCompact: {
    fontSize: 12,
    marginBottom: 6,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: 6,
  },
});
