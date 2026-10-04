import { useAppStore } from '../store/useAppStore';
import { getThemeColors } from './colors';

/** Live brand colors — purple by default, green when darkMode/theme is on */
export const useThemeColors = () => {
  const greenTheme = useAppStore((s) => s.darkMode);
  return getThemeColors(greenTheme);
};
