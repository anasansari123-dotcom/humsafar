import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SlidersHorizontal, X } from 'lucide-react-native';
import {
  CustomTextInput,
  GradientHeader,
  PremiumButton,
  ProfileCard,
} from '../components';
import { useAppStore } from '../store/useAppStore';
import { profiles } from '../data/profiles';
import {
  EDUCATION_OPTIONS,
  INCOME_OPTIONS,
  LANGUAGE_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PROFESSION_OPTIONS,
  SECT_OPTIONS,
} from '../constants';
import { canViewProfile } from '../utils';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, radius, spacing } from '../theme';

const Chip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.chip, active && styles.chipActive]}
  >
    <Text style={[styles.chipText, active && styles.chipTextActive]}>
      {label}
    </Text>
  </Pressable>
);

export const SearchScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    filters,
    setFilters,
    resetFilters,
    membership,
    viewedProfileIds,
    addViewedProfile,
    setShowPremiumPopup,
    favouriteIds,
    toggleFavourite,
  } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(() => {
    return profiles.filter((p) => {
      if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
      if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase()))
        return false;
      if (filters.state && !p.state.toLowerCase().includes(filters.state.toLowerCase()))
        return false;
      if (
        filters.country &&
        !p.country.toLowerCase().includes(filters.country.toLowerCase())
      )
        return false;
      if (filters.profession && !p.profession.includes(filters.profession))
        return false;
      if (filters.education && !p.education.includes(filters.education))
        return false;
      if (filters.sect && p.sect !== filters.sect) return false;
      if (
        filters.language &&
        !p.language.toLowerCase().includes(filters.language.toLowerCase())
      )
        return false;
      if (filters.maritalStatus && p.maritalStatus !== filters.maritalStatus)
        return false;
      if (filters.income && p.income !== filters.income) return false;
      return true;
    });
  }, [filters]);

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
        title="Matches"
        subtitle={`${results.length} profiles for you`}
        right={
          <Pressable
            style={styles.filterBtn}
            onPress={() => setShowFilters((v) => !v)}
            hitSlop={8}
          >
            {showFilters ? (
              <X size={20} color={colors.accent} />
            ) : (
              <SlidersHorizontal size={20} color={colors.accent} />
            )}
          </Pressable>
        }
      />

      {showFilters ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.section}>Age Range</Text>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <CustomTextInput
                label="Min"
                keyboardType="number-pad"
                value={String(filters.ageMin)}
                onChangeText={(t) => setFilters({ ageMin: Number(t) || 18 })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomTextInput
                label="Max"
                keyboardType="number-pad"
                value={String(filters.ageMax)}
                onChangeText={(t) => setFilters({ ageMax: Number(t) || 50 })}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <CustomTextInput
                label="Height Min"
                value={filters.heightMin}
                onChangeText={(t) => setFilters({ heightMin: t })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <CustomTextInput
                label="Height Max"
                value={filters.heightMax}
                onChangeText={(t) => setFilters({ heightMax: t })}
              />
            </View>
          </View>

          <CustomTextInput
            label="City"
            value={filters.city}
            onChangeText={(t) => setFilters({ city: t })}
            placeholder="Mumbai"
          />
          <CustomTextInput
            label="State"
            value={filters.state}
            onChangeText={(t) => setFilters({ state: t })}
            placeholder="Maharashtra"
          />
          <CustomTextInput
            label="Country"
            value={filters.country}
            onChangeText={(t) => setFilters({ country: t })}
            placeholder="India"
          />

          <Text style={styles.section}>Profession</Text>
          <View style={styles.chips}>
            {PROFESSION_OPTIONS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={filters.profession === p}
                onPress={() =>
                  setFilters({ profession: filters.profession === p ? '' : p })
                }
              />
            ))}
          </View>

          <Text style={styles.section}>Education</Text>
          <View style={styles.chips}>
            {EDUCATION_OPTIONS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={filters.education === p}
                onPress={() =>
                  setFilters({ education: filters.education === p ? '' : p })
                }
              />
            ))}
          </View>

          <Text style={styles.section}>Sect</Text>
          <View style={styles.chips}>
            {SECT_OPTIONS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={filters.sect === p}
                onPress={() =>
                  setFilters({ sect: filters.sect === p ? '' : p })
                }
              />
            ))}
          </View>

          <Text style={styles.section}>Language</Text>
          <View style={styles.chips}>
            {LANGUAGE_OPTIONS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={filters.language === p}
                onPress={() =>
                  setFilters({ language: filters.language === p ? '' : p })
                }
              />
            ))}
          </View>

          <Text style={styles.section}>Marital Status</Text>
          <View style={styles.chips}>
            {MARITAL_STATUS_OPTIONS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={filters.maritalStatus === p}
                onPress={() =>
                  setFilters({
                    maritalStatus: filters.maritalStatus === p ? '' : p,
                  })
                }
              />
            ))}
          </View>

          <Text style={styles.section}>Income</Text>
          <View style={styles.chips}>
            {INCOME_OPTIONS.map((p) => (
              <Chip
                key={p}
                label={p}
                active={filters.income === p}
                onPress={() =>
                  setFilters({ income: filters.income === p ? '' : p })
                }
              />
            ))}
          </View>

          <View style={styles.actions}>
            <PremiumButton
              title="Show Matches"
              onPress={() => setShowFilters(false)}
            />
            <PremiumButton
              title="Reset Filters"
              variant="outline"
              onPress={resetFilters}
              style={{ marginTop: 12 }}
            />
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.rowWrap}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 110 },
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No profiles match your filters. Try adjusting filters.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <ProfileCard
                profile={item}
                compact
                onPress={() => openProfile(item.id)}
                onFavourite={() => toggleFavourite(item.id)}
                isFavourite={favouriteIds.includes(item.id)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  content: {
    padding: spacing.xl,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  rowWrap: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  section: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
    marginBottom: 10,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.accent,
  },
  actions: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  gridItem: {
    width: '48%',
  },
  empty: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
});
