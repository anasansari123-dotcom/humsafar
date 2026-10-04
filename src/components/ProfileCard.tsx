import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Heart, MapPin, BadgeCheck } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Profile } from '../types';
import { colors, fonts, radius, shadows, spacing } from '../theme';
import { ProfileBadge } from './ProfileBadge';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  profile: Profile;
  onPress: () => void;
  onFavourite?: () => void;
  isFavourite?: boolean;
  compact?: boolean;
  style?: ViewStyle;
}

export const ProfileCard: React.FC<Props> = ({
  profile,
  onPress,
  onFavourite,
  isFavourite,
  compact,
  style,
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.card,
        compact ? styles.compact : styles.regular,
        shadows.card,
        animatedStyle,
        style,
      ]}
    >
      <Image
        source={{ uri: profile.images[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(26,5,56,0.85)']}
        style={styles.overlay}
      />

      {onFavourite && (
        <Pressable
          style={styles.heart}
          onPress={(e) => {
            e.stopPropagation?.();
            onFavourite();
          }}
          hitSlop={10}
        >
          <Heart
            size={18}
            color={isFavourite ? colors.error : colors.surface}
            fill={isFavourite ? colors.error : 'transparent'}
          />
        </Pressable>
      )}

      <View style={styles.badges}>
        {profile.isVerified && <ProfileBadge type="verified" />}
        {profile.isPremium && <ProfileBadge type="premium" />}
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {profile.name}, {profile.age}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {profile.profession}
        </Text>
        <View style={styles.location}>
          <MapPin size={12} color={colors.accentLight} />
          <Text style={styles.city} numberOfLines={1}>
            {profile.city}
          </Text>
          {profile.isVerified && (
            <BadgeCheck size={12} color={colors.accent} />
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  regular: {
    width: 180,
    height: 240,
  },
  compact: {
    width: '100%',
    aspectRatio: 0.78,
  },
  image: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  heart: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badges: {
    position: 'absolute',
    top: 12,
    left: 12,
    gap: 6,
  },
  info: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.surface,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  city: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.accentLight,
    flex: 1,
  },
});
