import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { APP_NAME } from '../constants';
import { colors, fonts } from '../theme';

type Size = 'sm' | 'md' | 'lg' | 'xl';
type Variant = 'script' | 'serif';

interface Props {
  size?: Size;
  /** script = Perfect Match style (Great Vibes gold); serif = logo Cinzel */
  variant?: Variant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  align?: 'left' | 'center' | 'right';
}

/** Script needs larger sizes to match Perfect Match look */
const SCRIPT_SIZE: Record<Size, number> = {
  sm: 28,
  md: 40,
  lg: 52,
  xl: 64,
};

const SERIF_SIZE: Record<Size, number> = {
  sm: 18,
  md: 24,
  lg: 32,
  xl: 40,
};

/** Champagne / light gold — matches Perfect Match headline */
const GOLD = '#E8C96A';
const GOLD_SOFT = '#F0D78C';

/**
 * HUMSAFAR brand wordmark
 * Default: elegant gold script (same style as "Perfect Match")
 */
export const BrandTitle: React.FC<Props> = ({
  size = 'lg',
  variant = 'script',
  style,
  textStyle,
  align = 'center',
}) => {
  const isScript = variant === 'script';
  const fontSize = (isScript ? SCRIPT_SIZE : SERIF_SIZE)[size];
  const lineHeight = Math.round(fontSize * (isScript ? 1.35 : 1.2));

  /** Script looks best in title case: Humsafar */
  const label = isScript
    ? APP_NAME.charAt(0) + APP_NAME.slice(1).toLowerCase()
    : APP_NAME;

  const baseText: TextStyle = {
    fontFamily: isScript ? fonts.script : fonts.brand,
    fontSize,
    lineHeight,
    letterSpacing: isScript ? 1 : fontSize * 0.14,
    textAlign: align,
    textTransform: isScript ? 'none' : 'uppercase',
    color: isScript ? GOLD : colors.accent,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0,0,0,0.45)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: isScript ? 6 : 4,
      },
      android: {
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: isScript ? 5 : 3,
      },
      default: {},
    }),
  };

  const alignSelf =
    align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';

  return (
    <View style={[styles.wrap, { alignSelf }, style]}>
      {/* Soft depth layer */}
      <Text
        style={[
          baseText,
          styles.depth,
          { top: isScript ? 2 : 1.5, color: isScript ? '#6B4E12' : '#5C3D0A' },
          textStyle,
        ]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {label}
      </Text>
      <Text style={[baseText, { color: isScript ? GOLD_SOFT : colors.accentLight }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  depth: {
    position: 'absolute',
    left: 0.5,
    opacity: 0.45,
    zIndex: 0,
  },
});
