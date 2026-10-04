import React, { useRef } from 'react';
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from 'react-native';
import { colors, fonts, radius } from '../theme';

interface Props {
  value: string;
  onChange: (otp: string) => void;
  length?: number;
}

export const OTPInput: React.FC<Props> = ({ value, onChange, length = 4 }) => {
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = value.padEnd(length, ' ').slice(0, length).split('');

  const handleChange = (text: string, index: number) => {
    const char = text.replace(/[^0-9]/g, '').slice(-1);
    const next = value.split('');
    while (next.length < length) next.push('');
    next[index] = char;
    const joined = next.join('').slice(0, length);
    onChange(joined.replace(/\s/g, ''));
    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index]?.trim() && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length }).map((_, index) => {
        const filled = !!digits[index]?.trim();
        return (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            value={filled ? digits[index] : ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.box, filled && styles.filled]}
            selectTextOnFocus
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  box: {
    flex: 1,
    maxWidth: 52,
    height: 58,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    textAlign: 'center',
    fontFamily: fonts.semiBold,
    fontSize: 22,
    color: colors.primary,
  },
  filled: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
});
