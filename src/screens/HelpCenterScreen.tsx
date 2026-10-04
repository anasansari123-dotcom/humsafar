import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown, ChevronUp, Flag, Mail, MessageSquare } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  CustomTextInput,
  GradientHeader,
  PremiumButton,
  PremiumCard,
} from '../components';
import { faqs } from '../data/faqs';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpCenter'>;

export const HelpCenterScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [openId, setOpenId] = useState<string | null>('f1');
  const [message, setMessage] = useState('');
  const [report, setReport] = useState('');

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Help Center"
        subtitle="We’re here for you"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => {
          const open = openId === faq.id;
          return (
            <Animated.View key={faq.id} entering={FadeInDown.delay(index * 40)}>
              <Pressable
                style={styles.faq}
                onPress={() => setOpenId(open ? null : faq.id)}
              >
                <View style={styles.faqTop}>
                  <Text style={styles.question}>{faq.question}</Text>
                  {open ? (
                    <ChevronUp size={18} color={colors.accent} />
                  ) : (
                    <ChevronDown size={18} color={colors.textMuted} />
                  )}
                </View>
                {open && <Text style={styles.answer}>{faq.answer}</Text>}
              </Pressable>
            </Animated.View>
          );
        })}

        <PremiumCard goldBorder style={styles.supportCard}>
          <View style={styles.supportHeader}>
            <Mail size={20} color={colors.accent} />
            <Text style={styles.supportTitle}>Contact Support</Text>
          </View>
          <CustomTextInput
            label="How can we help?"
            value={message}
            onChangeText={setMessage}
            placeholder="Describe your issue…"
            multiline
          />
          <PremiumButton
            title="Send Message"
            icon={<MessageSquare size={16} color={colors.primary} />}
            onPress={() => {
              Alert.alert('Sent', 'Support request submitted (demo).');
              setMessage('');
            }}
          />
        </PremiumCard>

        <PremiumCard style={styles.supportCard}>
          <View style={styles.supportHeader}>
            <Flag size={20} color={colors.error} />
            <Text style={styles.supportTitle}>Report a User</Text>
          </View>
          <CustomTextInput
            label="Report details"
            value={report}
            onChangeText={setReport}
            placeholder="Profile ID / reason…"
            multiline
          />
          <PremiumButton
            title="Submit Report"
            variant="primary"
            onPress={() => {
              Alert.alert('Reported', 'Thank you. Our team will review this.');
              setReport('');
            }}
          />
        </PremiumCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
  },
  heading: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  faq: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  question: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  answer: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 10,
    lineHeight: 20,
  },
  supportCard: {
    marginTop: spacing.xl,
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.lg,
  },
  supportTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
});
