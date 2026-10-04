const shared = {
  accent: '#D4AF37',
  accentLight: '#E8C96A',
  accentDark: '#B8941F',
  background: '#F8F8F8',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  textMuted: '#9B8BA8',
  textOnPrimary: '#FFFFFF',
  borderGold: 'rgba(212, 175, 55, 0.45)',
  success: '#1B8A5A',
  error: '#C62828',
  warning: '#E6A817',
  glass: 'rgba(255, 255, 255, 0.72)',
  gradientGold: ['#D4AF37', '#F0D78C', '#B8941F'] as const,
  gradientGoldSoft: ['#E8C96A', '#D4AF37'] as const,
  online: '#22C55E',
  blur: 'rgba(248, 248, 248, 0.85)',
};

/** Default brand — deep purple */
export const purpleColors = {
  ...shared,
  primary: '#2D0B59',
  primaryDark: '#1A0538',
  secondary: '#4B1E83',
  text: '#1A0A2E',
  textSecondary: '#6B5B7A',
  textOnAccent: '#2D0B59',
  border: '#E8E0F0',
  overlay: 'rgba(45, 11, 89, 0.55)',
  glassDark: 'rgba(45, 11, 89, 0.35)',
  gradientPrimary: ['#2D0B59', '#4B1E83'] as const,
  gradientHero: ['#1A0538', '#2D0B59', '#4B1E83'] as const,
  shadow: '#2D0B59',
  tabBarBg: 'rgba(45,11,89,0.92)',
};

/** Alternate brand — deep green (replaces purple when theme toggled) */
export const greenColors = {
  ...shared,
  primary: '#0B5C3E',
  primaryDark: '#063528',
  secondary: '#1A7A55',
  text: '#0A1F18',
  textSecondary: '#5B7A6B',
  textOnAccent: '#0B5C3E',
  border: '#D8E8E0',
  overlay: 'rgba(11, 92, 62, 0.55)',
  glassDark: 'rgba(11, 92, 62, 0.35)',
  gradientPrimary: ['#0B5C3E', '#1A7A55'] as const,
  gradientHero: ['#063528', '#0B5C3E', '#1A7A55'] as const,
  shadow: '#0B5C3E',
  tabBarBg: 'rgba(11,92,62,0.92)',
};

export type AppColors = typeof purpleColors;

/** Default export keeps purple for static StyleSheets */
export const colors = purpleColors;

export const getThemeColors = (greenTheme: boolean): AppColors =>
  greenTheme ? greenColors : purpleColors;

export type ColorKey = keyof typeof colors;
