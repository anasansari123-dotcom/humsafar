import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Phone, Star } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar, GradientHeader } from '../components';
import { conversations, interests } from '../data/chats';
import { profiles } from '../data/profiles';
import { useAppStore } from '../store/useAppStore';
import { isPremiumTier } from '../utils';
import { RootStackParamList } from '../navigation/types';
import { InterestItem, Profile } from '../types';
import { colors, fonts, radius, spacing } from '../theme';

const tabs = [
  'received',
  'sent',
  'accepted',
  'shortlisted',
  'contacted',
] as const;
type Tab = (typeof tabs)[number];

const TAB_LABELS: Record<Tab, string> = {
  received: 'Received',
  sent: 'Sent',
  accepted: 'Accepted',
  shortlisted: 'Shortlisted',
  contacted: 'Contacted',
};

/** Shortlist / contacted lists are plain profile ids — show them as rows */
const toItems = (ids: string[], time: string): InterestItem[] =>
  ids
    .map((id) => profiles.find((p) => p.id === id))
    .filter((p): p is Profile => !!p)
    .map((profile) => ({
      id: `${time}-${profile.id}`,
      profile,
      status: 'accepted',
      time,
    }));

export const InterestScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const membership = useAppStore((s) => s.membership);
  const favouriteIds = useAppStore((s) => s.favouriteIds);
  const toggleFavourite = useAppStore((s) => s.toggleFavourite);
  const contactedIds = useAppStore((s) => s.contactedIds);
  const addContacted = useAppStore((s) => s.addContacted);
  const [tab, setTab] = useState<Tab>('received');

  const data = useMemo(() => {
    if (tab === 'shortlisted') return toItems(favouriteIds, 'Shortlisted');
    if (tab === 'contacted') return toItems(contactedIds, 'Contacted');
    return interests.filter((i) => i.status === tab);
  }, [tab, favouriteIds, contactedIds]);

  const counts: Record<Tab, number> = {
    received: interests.filter((i) => i.status === 'received').length,
    sent: interests.filter((i) => i.status === 'sent').length,
    accepted: interests.filter((i) => i.status === 'accepted').length,
    shortlisted: favouriteIds.length,
    contacted: contactedIds.length,
  };

  const openContact = (profile: Profile) => {
    if (!isPremiumTier(membership)) {
      Alert.alert(
        'Unlock Contact',
        'Upgrade to Premium to view contact number and connect directly.',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Upgrade',
            onPress: () => navigation.navigate('MembershipUpgrade'),
          },
        ],
      );
      return;
    }

    const conv = conversations.find((c) => c.profileId === profile.id);
    const demoPhone = '+91 98765 43210';
    addContacted(profile.id);

    Alert.alert(
      `Contact ${profile.name}`,
      `Phone: ${demoPhone}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => Linking.openURL(`tel:${demoPhone.replace(/\s/g, '')}`),
        },
        {
          text: 'Chat',
          onPress: () =>
            navigation.navigate(
              'ChatRoom',
              conv ? { conversationId: conv.id } : { profileId: profile.id },
            ),
        },
      ],
    );
  };

  // Chat directly with an interest (premium, like Profile Details)
  const openChat = (profile: Profile) => {
    if (!isPremiumTier(membership)) {
      navigation.navigate('MembershipUpgrade');
      return;
    }
    const conv = conversations.find((c) => c.profileId === profile.id);
    navigation.navigate(
      'ChatRoom',
      conv ? { conversationId: conv.id } : { profileId: profile.id },
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Interests" subtitle="People who matter" />
      <View style={styles.tabs}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {tabs.map((t) => (
            <Pressable
              key={t}
              style={[styles.tab, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {TAB_LABELS[t]} ({counts[t]})
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + 110 },
        ]}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {tab === 'shortlisted'
              ? 'No shortlisted profiles yet. Tap the star on a profile to shortlist it.'
              : tab === 'contacted'
                ? 'You have not contacted anyone yet.'
                : `No ${tab} interests yet.`}
          </Text>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50)} style={styles.card}>
            <Pressable
              style={styles.row}
              onPress={() =>
                navigation.navigate('ProfileDetails', {
                  profileId: item.profile.id,
                })
              }
            >
              <Avatar
                uri={item.profile.images[0]}
                size={58}
                goldRing
              />
              <View style={styles.info}>
                <Text style={styles.name}>
                  {item.profile.name}, {item.profile.age}
                </Text>
                <Text style={styles.meta}>
                  {item.profile.city} · {item.time}
                </Text>
              </View>
              <Pressable
                style={[
                  styles.shortlistIcon,
                  favouriteIds.includes(item.profile.id) &&
                    styles.shortlistIconOn,
                ]}
                onPress={() => toggleFavourite(item.profile.id)}
                hitSlop={8}
                accessibilityLabel={
                  favouriteIds.includes(item.profile.id)
                    ? 'Remove from shortlist'
                    : 'Add to shortlist'
                }
              >
                <Star
                  size={18}
                  color={
                    favouriteIds.includes(item.profile.id)
                      ? colors.primary
                      : colors.accent
                  }
                  fill={
                    favouriteIds.includes(item.profile.id)
                      ? colors.primary
                      : 'transparent'
                  }
                />
              </Pressable>
              <Pressable
                style={styles.contactIcon}
                onPress={() => openContact(item.profile)}
                hitSlop={8}
              >
                <Phone size={18} color={colors.online} />
              </Pressable>
            </Pressable>

            {tab === 'received' && (
              <View style={styles.actions}>
                <Pressable style={[styles.actionBtn, styles.acceptBtn]}>
                  <LinearGradient
                    colors={[...colors.gradientGold]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionFill}
                  >
                    <Text style={styles.acceptText}>Accept</Text>
                  </LinearGradient>
                </Pressable>

                <Pressable style={[styles.actionBtn, styles.declineBtn]}>
                  <Text style={styles.declineText}>Decline</Text>
                </Pressable>

                <Pressable
                  style={[styles.actionBtn, styles.contactBtn]}
                  onPress={() => openChat(item.profile)}
                >
                  <MessageCircle size={14} color={colors.surface} />
                  <Text style={styles.contactText}>Chat</Text>
                </Pressable>
              </View>
            )}

            {tab !== 'received' && (
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionBtn, styles.acceptBtn, styles.fullBtn]}
                  onPress={() => openChat(item.profile)}
                >
                  <LinearGradient
                    colors={[...colors.gradientGold]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.actionFill}
                  >
                    <MessageCircle size={14} color={colors.primary} />
                    <Text style={styles.acceptText}>Chat</Text>
                  </LinearGradient>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, styles.declineBtn, styles.fullBtn]}
                  onPress={() =>
                    navigation.navigate('ProfileDetails', {
                      profileId: item.profile.id,
                    })
                  }
                >
                  <Text style={styles.declineText}>View Profile</Text>
                </Pressable>
              </View>
            )}
          </Animated.View>
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
  tabs: {
    margin: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 4,
    borderWidth: 2.5,
    borderColor: colors.accent,
  },
  tabsScroll: {
    gap: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.lg,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
  },
  tabText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.accent,
  },
  list: {
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34,197,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.online,
  },
  shortlistIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(214,169,40,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  /** Gold fill + purple rim once shortlisted */
  shortlistIconOn: {
    backgroundColor: colors.accent,
    borderColor: colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    height: 42,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
  },
  actionFill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtn: {
    borderColor: colors.primary,
  },
  declineBtn: {
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBtn: {
    borderColor: colors.accent,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 4,
  },
  acceptText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
  declineText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
  contactText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.surface,
  },
  fullBtn: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    color: colors.textMuted,
    marginTop: 40,
  },
});
