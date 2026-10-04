import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { fonts, spacing, useThemeColors } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  tall?: boolean;
  children?: React.ReactNode;
}

export const GradientHeader: React.FC<Props> = ({
  title,
  subtitle,
  onBack,
  right,
  tall,
  children,
}) => {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <LinearGradient
      colors={[...colors.gradientHero]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
          borderColor: colors.accent,
          borderBottomColor: colors.accentLight,
        },
        tall && styles.tall,
      ]}
    >
      <View style={styles.topRow}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={[
              styles.back,
              {
                borderColor: colors.accent,
                backgroundColor: 'rgba(212,175,55,0.12)',
              },
            ]}
            hitSlop={10}
          >
            <ArrowLeft size={22} color={colors.accent} />
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.titles}>
          <Text style={[styles.title, { color: colors.surface }]}>{title}</Text>
          {subtitle ? (
            <Text style={styles.subtitle}>{subtitle}</Text>
          ) : null}
        </View>
        <View style={styles.right}>{right}</View>
      </View>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 2.5,
    borderTopWidth: 0,
  },
  tall: {
    paddingBottom: spacing.xxxl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  backPlaceholder: {
    width: 40,
  },
  titles: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 2,
  },
  right: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
});
