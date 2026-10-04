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
import { colors, fonts, radius, shadows } from '../theme';

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
}) => {
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
          style={[styles.base, shadows.gold]}
        >
          {content}
        </LinearGradient>
      ) : variant === 'primary' ? (
        <LinearGradient
          colors={[...colors.gradientPrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, shadows.medium]}
        >
          {content}
        </LinearGradient>
      ) : (
        <Animated.View
          style={[
            styles.base,
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
  text: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.textOnAccent,
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
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.55,
  },
});
