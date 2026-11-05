import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, fonts, radius, shadows, useThemeColors } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variant = 'gold' | 'primary' | 'outline' | 'ghost';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  /** Shorter button (44 instead of 54) */
  compact?: boolean;
}

export const PremiumButton: React.FC<Props> = ({
  title,
  onPress,
  variant = 'gold',
  loading,
  disabled,
  style,
  textStyle,
  icon,
  compact,
}) => {
  const theme = useThemeColors();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.accent : colors.primary}
        />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              compact && styles.textCompact,
              variant === 'primary' && styles.textOnPrimary,
              variant === 'outline' && styles.textOutline,
              variant === 'ghost' && styles.textGhost,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </>
  );

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[animatedStyle, style, (disabled || loading) && styles.disabled]}
    >
      {variant === 'gold' ? (
        <LinearGradient
          colors={[...colors.gradientGold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            styles.goldBorder,
            { borderColor: theme.primary },
            compact && styles.compact,
            shadows.gold,
          ]}
        >
          {content}
        </LinearGradient>
      ) : variant === 'primary' ? (
        <LinearGradient
          colors={[...colors.gradientPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.base,
            styles.primaryBorder,
            compact && styles.compact,
            shadows.medium,
          ]}
        >
          {content}
        </LinearGradient>
      ) : (
        <Animated.View
          style={[
            styles.base,
            compact && styles.compact,
            variant === 'outline' && styles.outline,
            variant === 'ghost' && styles.ghost,
          ]}
        >
          {content}
        </Animated.View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  compact: {
    minHeight: 44,
  },
  text: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textOnAccent,
  },
  textCompact: {
    fontSize: 15,
  },
  textOnPrimary: {
    color: colors.textOnPrimary,
  },
  textOutline: {
    color: colors.primary,
  },
  textGhost: {
    color: colors.accent,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: 'transparent',
  },
  ghost: {
    borderWidth: 1,
    borderColor: 'rgba(214,169,40,0.55)',
    backgroundColor: 'transparent',
  },
  /** Gold buttons get a brand-colour rim (purple, or green in green theme) */
  goldBorder: {
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  primaryBorder: {
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  disabled: {
    opacity: 0.55,
  },
});
