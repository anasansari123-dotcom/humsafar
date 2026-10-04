import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientHeader, ProfileCard } from '../components';
import { profiles } from '../data/profiles';
import { useAppStore } from '../store/useAppStore';
import { canViewProfile } from '../utils';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, spacing } from '../theme';
import { useResponsive } from '../hooks/useResponsive';

type Props = NativeStackScreenProps<RootStackParamList, 'Favourites'>;

export const FavouritesScreen: React.FC<Props> = ({ navigation }) => {
  const { columns, horizontalPadding } = useResponsive();
  const {
    favouriteIds,
    toggleFavourite,
    membership,
    viewedProfileIds,
    addViewedProfile,
    setShowPremiumPopup,
  } = useAppStore();

  const favourites = useMemo(
    () => profiles.filter((p) => favouriteIds.includes(p.id)),
    [favouriteIds],
  );

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
      <GradientHeader
        title="Favourite Profiles"
        subtitle={`${favourites.length} saved`}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={favourites}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        key={columns}
        contentContainerStyle={{
          padding: horizontalPadding,
          gap: 12,
        }}
        columnWrapperStyle={{ gap: 12 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No favourites yet. Start saving profiles you like.</Text>
        }
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <ProfileCard
              profile={item}
              compact
              onPress={() => openProfile(item.id)}
              onFavourite={() => toggleFavourite(item.id)}
              isFavourite
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.massive,
    paddingHorizontal: spacing.xxl,
  },
});
