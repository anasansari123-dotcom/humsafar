import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmall = width < 360;
  const contentMaxWidth = isTablet ? 720 : width;
  const columns = isTablet ? 3 : 2;
  const horizontalPadding = isTablet ? 32 : 20;

  return {
    width,
    height,
    isTablet,
    isSmall,
    contentMaxWidth,
    columns,
    horizontalPadding,
  };
};
