import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import {
  Bell,
  Crown,
  Heart,
  MessageCircle,
  Sparkles,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientHeader, PremiumCard } from '../components';
import { notifications } from '../data/notifications';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

const iconMap = {
  interest: Heart,
  match: Sparkles,
  message: MessageCircle,
  premium: Crown,
  system: Bell,
};

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => (
  <View style={styles.container}>
    <GradientHeader
      title="Notifications"
      subtitle="Stay updated"
      onBack={() => navigation.goBack()}
    />
    <FlatList
      data={notifications}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item, index }) => {
        const Icon = iconMap[item.type];
        return (
          <Animated.View entering={FadeInDown.delay(index * 50)}>
            <PremiumCard
              goldBorder={!item.read}
              style={!item.read ? { ...styles.card, ...styles.unread } : styles.card}
            >
              <View style={styles.iconWrap}>
                <Icon size={18} color={colors.accent} />
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </PremiumCard>
          </Animated.View>
        );
      }}
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
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },
  unread: {
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.primary,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 19,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
  },
});
