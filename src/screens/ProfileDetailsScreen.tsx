import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Phone,
  Share2,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  PremiumButton,
  PremiumCard,
  ProfileBadge,
} from '../components';
import { profiles } from '../data/profiles';
import { useAppStore } from '../store/useAppStore';
import { isPremiumTier } from '../utils';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, radius, shadows, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileDetails'>;

const { width } = Dimensions.get('window');

export const ProfileDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { profileId } = route.params;
  const profile = useMemo(
    () => profiles.find((p) => p.id === profileId),
    [profileId],
  );
  const { membership, favouriteIds, toggleFavourite } = useAppStore();
  const [imageIndex, setImageIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const isFree = !isPremiumTier(membership);

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Profile not found</Text>
      </View>
    );
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setImageIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const Section = ({ title, body }: { title: string; body: string }) => (
    <PremiumCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{body}</Text>
    </PremiumCard>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.carousel}>
          <FlatList
            ref={listRef}
            data={profile.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.heroImage} />
            )}
          />
          <LinearGradient
            colors={['rgba(26,5,56,0.55)', 'transparent', 'rgba(26,5,56,0.75)']}
            style={StyleSheet.absoluteFill}
          />

          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <Pressable style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <ArrowLeft size={20} color={colors.accent} />
            </Pressable>
            <View style={styles.topRight}>
              <Pressable
                style={styles.iconBtn}
                onPress={() => toggleFavourite(profile.id)}
              >
                <Heart
                  size={20}
                  color={
                    favouriteIds.includes(profile.id) ? colors.error : colors.accent
                  }
                  fill={
                    favouriteIds.includes(profile.id) ? colors.error : 'transparent'
                  }
                />
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Share2 size={18} color={colors.accent} />
              </Pressable>
            </View>
          </View>

          <View style={styles.dots}>
            {profile.images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === imageIndex && styles.dotActive]}
              />
            ))}
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {profile.name}, {profile.age}
              </Text>
              <Text style={styles.meta}>
                {profile.profession} · {profile.city}
              </Text>
            </View>
            <View style={styles.badges}>
              {profile.isVerified && (
                <ProfileBadge type="verified" label="Verified" />
              )}
              {profile.isPremium && <ProfileBadge type="premium" />}
            </View>
          </View>

          <View style={styles.completion}>
            <Text style={styles.completionLabel}>Profile Completion</Text>
            <Text style={styles.completionValue}>{profile.profileCompletion}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${profile.profileCompletion}%` },
              ]}
            />
          </View>

          <View style={styles.quickFacts}>
            {[
              ['Height', profile.height],
              ['Education', profile.education.split(',')[0]],
              ['Sect', profile.sect],
              ['Status', profile.maritalStatus],
            ].map(([label, value]) => (
              <View key={label} style={styles.fact}>
                <Text style={styles.factLabel}>{label}</Text>
                <Text style={styles.factValue} numberOfLines={1}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <View style={isFree ? styles.blurred : undefined}>
            <Section title="About" body={profile.about} />
            <Section title="Education" body={profile.education} />
            <Section title="Profession" body={`${profile.profession} · ${profile.income}`} />
            <Section title="Family" body={profile.family} />
            <Section title="Lifestyle" body={profile.lifestyle} />
            <Section title="Partner Preference" body={profile.partnerPreference} />
          </View>

          {isFree && (
            <View style={styles.unlockOverlay}>
              <BlurView intensity={35} tint="light" style={styles.blurBox}>
                <Text style={styles.unlockTitle}>Unlock Full Profile</Text>
                <Text style={styles.unlockSub}>
                  Upgrade to Premium to view complete details, contact & chat.
                </Text>
                <PremiumButton
                  title="Unlock Premium"
                  onPress={() => navigation.navigate('MembershipUpgrade')}
                />
              </BlurView>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.actions, { paddingBottom: insets.bottom + 12 }, shadows.medium]}>
        <PremiumButton
          title="Interest"
          variant="outline"
          style={styles.actionBtn}
          icon={<Heart size={18} color={colors.primary} />}
        />
        <PremiumButton
          title="Chat"
          style={styles.actionBtn}
          icon={<MessageCircle size={18} color={colors.primary} />}
          onPress={() => {
            if (isFree) {
              navigation.navigate('MembershipUpgrade');
              return;
            }
            navigation.navigate('ChatRoom', { conversationId: 'c1' });
          }}
        />
        <Pressable
          style={styles.callBtn}
          onPress={() => {
            if (isFree) navigation.navigate('MembershipUpgrade');
          }}
        >
          <Phone size={20} color={colors.accent} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missing: {
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  carousel: {
    height: 420,
    backgroundColor: colors.primary,
  },
  heroImage: {
    width,
    height: 420,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  topRight: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(26,5,56,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  dots: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.accent,
  },
  body: {
    padding: spacing.xl,
    paddingBottom: 120,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.lg,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 26,
    color: colors.primary,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  badges: {
    gap: 6,
    alignItems: 'flex-end',
  },
  completion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  completionLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  completionValue: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.accentDark,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  quickFacts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.lg,
  },
  fact: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  factLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  factValue: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  sectionBody: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  blurred: {
    opacity: 0.35,
  },
  unlockOverlay: {
    marginTop: -180,
    marginBottom: 20,
  },
  blurBox: {
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.borderGold,
    alignItems: 'center',
  },
  unlockTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
    marginBottom: 8,
  },
  unlockSub: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  actions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
  },
  callBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
});
