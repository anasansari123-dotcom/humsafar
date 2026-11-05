const shared = {
  // Richer, more saturated gold — crisper edges and text on both themes
  accent: '#D6A928',
  accentLight: '#EDC757',
  accentDark: '#A97F0C',
  background: '#F3F2F7',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  textMuted: '#76678A',
  textOnPrimary: '#FFFFFF',
  borderGold: 'rgba(214, 169, 40, 0.7)',
  success: '#1B8A5A',
  error: '#C62828',
  warning: '#E6A817',
  glass: 'rgba(255, 255, 255, 0.72)',
  // Metallic gold: warm base → bright highlight → rich mid → deep edge
  gradientGold: ['#E4B83F', '#FFEDB0', '#D6A928', '#9E7409'] as const,
  gradientGoldSoft: ['#EDC757', '#D6A928'] as const,
  online: '#22C55E',
  blur: 'rgba(248, 248, 248, 0.85)',
};

type ThemePalette = typeof shared & {
  primary: string;
  primaryDark: string;
  secondary: string;
  text: string;
  textSecondary: string;
  textOnAccent: string;
  border: string;
  overlay: string;
  glassDark: string;
  gradientPrimary: readonly [string, string];
  gradientHero: readonly [string, string, string];
  shadow: string;
  tabBarBg: string;
};

/** Default brand — deep purple */
export const purpleColors: ThemePalette = {
  ...shared,
  primary: '#2D0B59',
  primaryDark: '#12022A',
  secondary: '#5B2A9E',
  text: '#12061F',
  textSecondary: '#4D3D60',
  textOnAccent: '#2D0B59',
  border: '#D6C9E6',
  overlay: 'rgba(45, 11, 89, 0.55)',
  glassDark: 'rgba(45, 11, 89, 0.35)',
  gradientPrimary: ['#2D0B59', '#5B2A9E'],
  gradientHero: ['#12022A', '#2D0B59', '#5B2A9E'],
  shadow: '#2D0B59',
  tabBarBg: 'rgba(36,8,72,0.97)',
};

/** Alternate brand — deep green (replaces purple when theme toggled) */
export const greenColors: ThemePalette = {
  ...shared,
  primary: '#0B5C3E',
  primaryDark: '#022519',
  secondary: '#15895D',
  text: '#04150E',
  textSecondary: '#38584A',
  textMuted: '#5E7A6D',
  textOnAccent: '#0B5C3E',
  border: '#C2DACD',
  overlay: 'rgba(11, 92, 62, 0.55)',
  glassDark: 'rgba(11, 92, 62, 0.35)',
  gradientPrimary: ['#0B5C3E', '#15895D'],
  gradientHero: ['#022519', '#0B5C3E', '#15895D'],
  shadow: '#0B5C3E',
  tabBarBg: 'rgba(8,74,50,0.97)',
};

export type AppColors = ThemePalette;

/** Default export keeps purple for static StyleSheets */
export const colors = purpleColors;

export const getThemeColors = (greenTheme: boolean): AppColors =>
  greenTheme ? greenColors : purpleColors;

export type ColorKey = keyof typeof colors;
