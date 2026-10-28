import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import {
  CustomTextInput,
  GradientHeader,
  MATCH_FRAME_RATIO,
  MatchFrameCard,
  PhotoGalleryModal,
  PremiumButton,
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
import { colors, fonts, radius, spacing, useThemeColors } from '../theme';

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
  const theme = useThemeColors();
  const {
    filters,
    setFilters,
    resetFilters,
    membership,
    viewedProfileIds,
    addViewedProfile,
    setShowPremiumPopup,
  } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState({ width: 0, height: 0 });

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

  useEffect(() => {
    setIndex(0);
    setShowGallery(false);
  }, [results]);

  const current = results[index];
  const isFree = membership === 'FREE';

  /** Height fills screen; width slightly under aspect so sides have a slim gap */
  const cardWidth = useMemo(() => {
    if (!stage.height) return 0;
    return stage.height * MATCH_FRAME_RATIO * 0.80;
  }, [stage.height]);

  const onStageLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setStage({ width, height });
  };

  const goNext = useCallback(() => {
    setShowGallery(false);
    setIndex((i) => (results.length ? (i + 1) % results.length : 0));
  }, [results.length]);

  const goPrev = useCallback(() => {
    setShowGallery(false);
    setIndex((i) =>
      results.length ? (i - 1 + results.length) % results.length : 0,
    );
  }, [results.length]);

  const goNextRef = useRef(goNext);
  const goPrevRef = useRef(goPrev);
  goNextRef.current = goNext;
  goPrevRef.current = goPrev;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 18 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dx < -40) goNextRef.current();
        else if (g.dx > 40) goPrevRef.current();
      },
    }),
  ).current;

  const openPhotos = (id: string) => {
    const alreadyViewed = viewedProfileIds.includes(id);
    if (!alreadyViewed && !canViewProfile(membership, viewedProfileIds.length)) {
      setShowPremiumPopup(true);
      return;
    }
    if (!alreadyViewed) addViewedProfile(id);
    setShowGallery(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.primaryDark }]}>
      {showFilters ? (
        <>
          <GradientHeader
            title="Filters"
            subtitle="Refine your matches"
            onBack={() => setShowFilters(false)}
            right={
              <Pressable
                style={styles.filterBtn}
                onPress={() => setShowFilters(false)}
                hitSlop={8}
              >
                <X size={20} color={colors.accent} />
              </Pressable>
            }
          />
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
        </>
      ) : (
        <View
          style={[styles.matchBody, { backgroundColor: theme.primaryDark }]}
          onLayout={onStageLayout}
          {...panResponder.panHandlers}
        >
          {current && cardWidth > 0 ? (
            <MatchFrameCard
              key={current.id}
              profile={current}
              width={cardWidth}
              height={stage.height}
              contactLocked={isFree}
              onPressPhoto={() => openPhotos(current.id)}
            />
          ) : (
            <Text style={[styles.empty, styles.emptyOnDark]}>
              No profiles match your filters.
            </Text>
          )}

          {current ? (
            <PhotoGalleryModal
              visible={showGallery}
              images={current.images}
              name={current.name}
              onClose={() => setShowGallery(false)}
            />
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  matchBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  empty: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xxxl,
  },
  emptyOnDark: {
    color: 'rgba(255,255,255,0.75)',
  },
});
