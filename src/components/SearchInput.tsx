import React from 'react';
import { Pressable, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { colors, fonts, radius, shadows, spacing } from '../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  style?: ViewStyle;
}

export const SearchInput: React.FC<Props> = ({
  value,
  onChangeText,
  placeholder = 'Search profiles…',
  onFilterPress,
  style,
}) => (
  <View style={[styles.container, shadows.soft, style]}>
    <Search size={18} color={colors.textMuted} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      style={styles.input}
    />
    {onFilterPress ? (
      <Pressable onPress={onFilterPress} style={styles.filter} hitSlop={8}>
        <SlidersHorizontal size={18} color={colors.accent} />
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    height: 52,
    borderWidth: 2.5,
    borderColor: colors.accent,
    gap: 10,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
  },
  filter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
});
