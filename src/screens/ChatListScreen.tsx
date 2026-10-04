import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Avatar, GradientHeader } from '../components';
import { conversations } from '../data/chats';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, spacing } from '../theme';

export const ChatListScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <GradientHeader title="Messages" subtitle="Your conversations" />
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInRight.delay(index * 60)}>
            <Pressable
              style={styles.row}
              onPress={() =>
                navigation.navigate('ChatRoom', { conversationId: item.id })
              }
            >
              <Avatar uri={item.avatar} size={56} online={item.online} goldRing />
              <View style={styles.info}>
                <View style={styles.top}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.time}>{item.timestamp}</Text>
                </View>
                <View style={styles.bottom}>
                  <Text style={styles.message} numberOfLines={1}>
                    {item.typing ? 'Typing…' : item.lastMessage}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
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
  list: {
    padding: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.textMuted,
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  message: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
    color: colors.primary,
  },
});
