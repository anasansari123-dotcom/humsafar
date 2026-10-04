import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

interface Props {
  uri: string;
  size?: number;
  online?: boolean;
  style?: ViewStyle;
  goldRing?: boolean;
}

export const Avatar: React.FC<Props> = ({
  uri,
  size = 48,
  online,
  style,
  goldRing,
}) => (
  <View
    style={[
      {
        width: size,
        height: size,
        borderRadius: size / 2,
      },
      goldRing && styles.goldRing,
      style,
    ]}
  >
    <Image
      source={{ uri }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
      }}
    />
    {online ? (
      <View
        style={[
          styles.online,
          {
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: size * 0.14,
            right: 0,
            bottom: 0,
          },
        ]}
      />
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  goldRing: {
    borderWidth: 2,
    borderColor: colors.accent,
    padding: 2,
  },
  online: {
    position: 'absolute',
    backgroundColor: colors.online,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
