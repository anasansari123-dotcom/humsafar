import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';

interface Props {
  size?: number;
  opacity?: number;
}

/** Subtle Islamic floral corner ornament */
export const Ornament: React.FC<Props> = ({ size = 64, opacity = 0.12 }) => (
  <View style={[styles.wrap, { width: size, height: size, opacity }]} pointerEvents="none">
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path
        d="M4 4 C18 8, 24 18, 28 32 C20 24, 10 18, 4 16 Z"
        fill={colors.accent}
      />
      <Path
        d="M4 4 C8 18, 18 24, 32 28 C24 20, 18 10, 16 4 Z"
        fill={colors.accent}
      />
      <Path
        d="M8 8 Q20 20 30 30"
        stroke={colors.accent}
        strokeWidth={1.5}
        fill="none"
      />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
  },
});
