import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  Easing,
} from 'react-native-reanimated';

export const useEntranceAnimation = (delay = 0) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  const scale = useSharedValue(0.96);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) }),
    );
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 18, stiffness: 120 }),
    );
    scale.value = withDelay(
      delay,
      withSpring(1, { damping: 16, stiffness: 140 }),
    );
  }, [delay, opacity, scale, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return animatedStyle;
};
