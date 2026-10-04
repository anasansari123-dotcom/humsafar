import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Mic,
  Paperclip,
  Send,
  Smile,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, GradientHeader } from '../components';
import { conversations } from '../data/chats';
import { RootStackParamList } from '../navigation/types';
import { ChatMessage } from '../types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatRoom'>;

export const ChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const conversation = useMemo(
    () => conversations.find((c) => c.id === route.params.conversationId),
    [route.params.conversationId],
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    conversation?.messages ?? [],
  );
  const [text, setText] = useState('');

  if (!conversation) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Conversation not found</Text>
      </View>
    );
  }

  const send = () => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: `local-${Date.now()}`,
      senderId: 'me',
      text: text.trim(),
      timestamp: 'Now',
      type: 'text',
      read: true,
    };
    setMessages((prev) => [...prev, msg]);
    setText('');
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title={conversation.name}
        subtitle={conversation.online ? 'Online' : 'Last seen recently'}
        onBack={() => navigation.goBack()}
        right={<Avatar uri={conversation.avatar} size={36} online={conversation.online} />}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={10}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const mine = item.senderId === 'me';
            return (
              <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}>
                <Text style={[styles.bubbleText, mine && styles.mineText]}>
                  {item.text}
                </Text>
                <Text style={[styles.time, mine && styles.mineTime]}>
                  {item.timestamp}
                </Text>
              </View>
            );
          }}
          ListFooterComponent={
            conversation.typing ? (
              <View style={[styles.bubble, styles.theirs]}>
                <Text style={styles.typing}>Typing…</Text>
              </View>
            ) : null
          }
        />

        <View style={[styles.composer, { paddingBottom: insets.bottom + 10 }]}>
          <Pressable style={styles.tool}>
            <Paperclip size={20} color={colors.secondary} />
          </Pressable>
          <Pressable style={styles.tool}>
            <Smile size={20} color={colors.secondary} />
          </Pressable>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message…"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <Pressable style={styles.tool}>
            <Mic size={20} color={colors.secondary} />
          </Pressable>
          <Pressable style={styles.send} onPress={send}>
            <Send size={18} color={colors.primary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  list: {
    padding: spacing.xl,
    paddingBottom: 20,
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  mine: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 6,
  },
  theirs: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 6,
  },
  bubbleText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  mineText: {
    color: colors.surface,
  },
  time: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  mineTime: {
    color: 'rgba(255,255,255,0.65)',
  },
  typing: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.accentDark,
    fontStyle: 'italic',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tool: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: radius.xl,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
