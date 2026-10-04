import { TextStyle } from 'react-native';

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  /** Cinematic serif — HUMSAFAR brand wordmark (logo style) */
  brand: 'Cinzel_700Bold',
  brandRegular: 'Cinzel_400Regular',
  brandSemiBold: 'Cinzel_600SemiBold',
  /** Elegant script for welcome headlines */
  script: 'GreatVibes_400Regular',
  scriptAlt: 'DancingScript_700Bold',
};

export const brandTitleStyle: TextStyle = {
  fontFamily: fonts.script,
  letterSpacing: 1,
  color: '#E8C96A',
};

export const typography: Record<string, TextStyle> = {
  hero: {
    fontFamily: fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: 1.2,
  },
  h1: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0.4,
  },
  h2: {
    fontFamily: fonts.semiBold,
    fontSize: 22,
    lineHeight: 30,
  },
  h3: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    lineHeight: 26,
  },
  h4: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 22,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  small: {
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
  },
  button: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.3,
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.6,
  },
};
