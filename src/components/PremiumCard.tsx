import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors, radius, shadows } from '../theme';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  goldBorder?: boolean;
  delay?: number;
}

export const PremiumCard: React.FC<Props> = ({
  children,
  style,
  goldBorder,
  delay = 0,
}) => {
  const animatedStyle = useEntranceAnimation(delay);

  return (
    <Animated.View
      style={[
        styles.card,
        shadows.card,
        goldBorder && styles.goldBorder,
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  goldBorder: {
    borderColor: colors.borderGold,
    borderWidth: 1.5,
  },
});
