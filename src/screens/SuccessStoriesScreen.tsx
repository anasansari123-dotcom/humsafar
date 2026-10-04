import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientHeader, PremiumCard } from '../components';
import { successStories } from '../data/successStories';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SuccessStories'>;

export const SuccessStoriesScreen: React.FC<Props> = ({ navigation }) => (
  <View style={styles.container}>
    <GradientHeader
      title="Success Stories"
      subtitle="Love that found its way"
      onBack={() => navigation.goBack()}
    />
    <FlatList
      data={successStories}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => (
        <Animated.View entering={FadeInUp.delay(index * 80)}>
          <PremiumCard goldBorder style={styles.card}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <LinearGradient
                colors={['transparent', 'rgba(26,5,56,0.85)']}
                style={styles.overlay}
              />
              <View style={styles.yearBadge}>
                <Text style={styles.year}>{item.marriedYear}</Text>
              </View>
            </View>
            <Text style={styles.names}>{item.coupleNames}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <Text style={styles.story}>{item.story}</Text>
          </PremiumCard>
        </Animated.View>
      )}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.xl,
  },
  card: {
    marginBottom: spacing.lg,
    padding: 12,
  },
  imageWrap: {
    height: 200,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  yearBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  year: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
  names: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
  },
  location: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.accentDark,
    marginTop: 4,
    marginBottom: 10,
  },
  story: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
