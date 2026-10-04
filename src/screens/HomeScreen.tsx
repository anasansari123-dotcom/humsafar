import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Menu } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Avatar,
  Ornament,
  PremiumCard,
  ProfileCard,
  SearchInput,
  SectionHeader,
} from '../components';
import { profiles } from '../data/profiles';
import { successStories } from '../data/successStories';
import { useAppStore } from '../store/useAppStore';
import { useProfileStore } from '../store/useProfileStore';
import { MainTabParamList, RootStackParamList } from '../navigation/types';
import { canViewProfile, getGreeting } from '../utils';
import { colors, fonts, radius, spacing, useThemeColors } from '../theme';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<HomeNav>();
  const theme = useThemeColors();
  const myProfile = useProfileStore((s) => s.myProfile);
  const {
    membership,
    viewedProfileIds,
    favouriteIds,
    toggleFavourite,
    addViewedProfile,
    setShowPremiumPopup,
  } = useAppStore();
  const [query, setQuery] = useState('');

  const recommended = useMemo(() => profiles.slice(0, 6), []);
  const newMembers = useMemo(() => profiles.slice(2, 8), []);
  const nearby = useMemo(
    () => [...profiles].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99)).slice(0, 6),
    [],
  );
  const verified = useMemo(() => profiles.filter((p) => p.isVerified).slice(0, 6), []);
  const premium = useMemo(() => profiles.filter((p) => p.isPremium).slice(0, 6), []);

  const openProfile = (id: string) => {
    const alreadyViewed = viewedProfileIds.includes(id);
    if (!alreadyViewed && !canViewProfile(membership, viewedProfileIds.length)) {
      setShowPremiumPopup(true);
      return;
    }
    if (!alreadyViewed) addViewedProfile(id);
    navigation.navigate('ProfileDetails', { profileId: id });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...theme.gradientHero]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <Ornament size={70} opacity={0.14} />
        <View style={styles.headerTop}>
          <View style={styles.leftHeader}>
            <Pressable
              style={styles.menuBtn}
              onPress={() => navigation.navigate('MyProfile')}
              hitSlop={8}
              accessibilityLabel="Open profile"
            >
              <Menu size={24} color={colors.accent} strokeWidth={2.4} />
            </Pressable>

            <Pressable
              style={styles.greetRow}
              onPress={() => navigation.navigate('MyProfile')}
            >
              <Avatar uri={myProfile.images[0]} size={46} goldRing online />
              <View style={styles.greetText}>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName} numberOfLines={1}>
                  {myProfile.name}
                </Text>
              </View>
            </Pressable>
          </View>

          <Pressable
            style={styles.bell}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Bell size={20} color={colors.accent} />
            <View style={styles.dot} />
          </Pressable>
        </View>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, city, profession…"
          onFilterPress={() => navigation.navigate('Matches')}
          style={styles.search}
        />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: spacing.xl }}
      >
        <SectionHeader
          title="Recommended Matches"
          subtitle="Curated for you"
          onAction={() => {}}
        />
        <FlatList
          horizontal
          data={recommended}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              onPress={() => openProfile(item.id)}
              onFavourite={() => toggleFavourite(item.id)}
              isFavourite={favouriteIds.includes(item.id)}
              style={{ marginRight: 14 }}
            />
          )}
        />

        <FlatList
          horizontal
          data={newMembers}
          keyExtractor={(item) => `new-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              onPress={() => openProfile(item.id)}
              style={{ marginRight: 14 }}
            />
          )}
        />

        <SectionHeader title="Nearby Profiles" subtitle="Close to you" />
        <FlatList
          horizontal
          data={nearby}
          keyExtractor={(item) => `near-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              onPress={() => openProfile(item.id)}
              style={{ marginRight: 14 }}
            />
          )}
        />

        <SectionHeader title="Verified Profiles" />
        <FlatList
          horizontal
          data={verified}
          keyExtractor={(item) => `ver-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              onPress={() => openProfile(item.id)}
              style={{ marginRight: 14 }}
            />
          )}
        />

        <SectionHeader title="Premium Members" />
        <FlatList
          horizontal
          data={premium}
          keyExtractor={(item) => `pre-${item.id}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
          renderItem={({ item }) => (
            <ProfileCard
              profile={item}
              onPress={() => openProfile(item.id)}
              style={{ marginRight: 14 }}
            />
          )}
        />

        <SectionHeader
          title="Success Stories"
          onAction={() => navigation.navigate('SuccessStories')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hList}
        >
          {successStories.map((story) => (
            <PremiumCard key={story.id} goldBorder style={styles.storyCard}>
              <Image source={{ uri: story.image }} style={styles.storyImage} />
              <Text style={styles.storyNames}>{story.coupleNames}</Text>
              <Text style={styles.storyLoc}>{story.location}</Text>
            </PremiumCard>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 0,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 2.5,
    borderTopWidth: 0,
    borderColor: colors.accent,
    borderBottomColor: colors.accentLight,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 0,
  },
  leftHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(212,175,55,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  greetRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greetText: {
    flex: 1,
    paddingRight: 4,
  },
  greeting: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  userName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.surface,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.accent,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  search: {
    marginTop: spacing.xxl + spacing.sm,
    marginHorizontal: spacing.xl,
  },
  hList: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  storyCard: {
    width: 220,
    marginRight: 14,
    padding: 12,
  },
  storyImage: {
    width: '100%',
    height: 120,
    borderRadius: radius.lg,
    marginBottom: 10,
  },
  storyNames: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  storyLoc: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
