import React, { useState } from 'react';
import { Alert, FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { MessageCircle, Phone } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Avatar, GradientHeader, PremiumButton } from '../components';
import { conversations, interests } from '../data/chats';
import { useAppStore } from '../store/useAppStore';
import { isPremiumTier } from '../utils';
import { RootStackParamList } from '../navigation/types';
import { Profile } from '../types';
import { colors, fonts, radius, spacing } from '../theme';

const tabs = ['received', 'sent', 'accepted'] as const;

export const InterestScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const membership = useAppStore((s) => s.membership);
  const [tab, setTab] = useState<(typeof tabs)[number]>('received');
  const data = interests.filter((i) => i.status === tab);

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
            navigation.navigate('ChatRoom', {
              conversationId: conv?.id ?? 'c1',
            }),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader title="Interests" subtitle="People who matter" />
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <Pressable
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No {tab} interests yet.</Text>
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
                goldRing={item.profile.isPremium}
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
                style={styles.contactIcon}
                onPress={() => openContact(item.profile)}
                hitSlop={8}
              >
                <Phone size={18} color={colors.accent} />
              </Pressable>
            </Pressable>

            {tab === 'received' && (
              <View style={styles.actions}>
                <PremiumButton title="Accept" style={styles.btn} />
                <PremiumButton title="Decline" variant="outline" style={styles.btn} />
                <PremiumButton
                  title="Contact"
                  variant="primary"
                  style={styles.btn}
                  icon={<MessageCircle size={16} color={colors.surface} />}
                  onPress={() => openContact(item.profile)}
                />
              </View>
            )}

            {(tab === 'accepted' || tab === 'sent') && (
              <View style={styles.actions}>
                <PremiumButton
                  title="Contact"
                  style={styles.fullBtn}
                  icon={<Phone size={16} color={colors.primary} />}
                  onPress={() => openContact(item.profile)}
                />
                <PremiumButton
                  title="View Profile"
                  variant="outline"
                  style={styles.fullBtn}
                  onPress={() =>
                    navigation.navigate('ProfileDetails', {
                      profileId: item.profile.id,
                    })
                  }
                />
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
    flexDirection: 'row',
    margin: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.lg,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
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
    paddingBottom: 100,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  btn: {
    flex: 1,
    paddingHorizontal: 8,
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
