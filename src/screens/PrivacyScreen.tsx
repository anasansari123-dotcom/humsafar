import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronRight,
  Eye,
  EyeOff,
  Image,
  Lock,
  Shield,
  UserX,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GradientHeader } from '../components';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Privacy'>;

export const PrivacyScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [hideProfile, setHideProfile] = useState(false);
  const [incognito, setIncognito] = useState(false);
  const [showOnline, setShowOnline] = useState(true);
  const [photoGuard, setPhotoGuard] = useState(true);
  const [contactOnlyMatches, setContactOnlyMatches] = useState(true);

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Privacy"
        subtitle="Control who sees your profile"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.section}>Profile visibility</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.left}>
              <EyeOff size={18} color={colors.accent} />
              <View style={styles.textCol}>
                <Text style={styles.label}>Hide my profile</Text>
                <Text style={styles.hint}>Not shown in search results</Text>
              </View>
            </View>
            <Switch
              value={hideProfile}
              onValueChange={setHideProfile}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.left}>
              <Eye size={18} color={colors.accent} />
              <View style={styles.textCol}>
                <Text style={styles.label}>Incognito browsing</Text>
                <Text style={styles.hint}>Browse without being noticed</Text>
              </View>
            </View>
            <Switch
              value={incognito}
              onValueChange={setIncognito}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.row, styles.rowLast]}>
            <View style={styles.left}>
              <Shield size={18} color={colors.accent} />
              <View style={styles.textCol}>
                <Text style={styles.label}>Show online status</Text>
                <Text style={styles.hint}>Let others see when you're online</Text>
              </View>
            </View>
            <Switch
              value={showOnline}
              onValueChange={setShowOnline}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        <Text style={styles.section}>Photos & contact</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.left}>
              <Image size={18} color={colors.accent} />
              <View style={styles.textCol}>
                <Text style={styles.label}>Photo privacy</Text>
                <Text style={styles.hint}>Only matches can view album</Text>
              </View>
            </View>
            <Switch
              value={photoGuard}
              onValueChange={setPhotoGuard}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.row, styles.rowLast]}>
            <View style={styles.left}>
              <Lock size={18} color={colors.accent} />
              <View style={styles.textCol}>
                <Text style={styles.label}>Contact requests</Text>
                <Text style={styles.hint}>Only accepted matches can contact</Text>
              </View>
            </View>
            <Switch
              value={contactOnlyMatches}
              onValueChange={setContactOnlyMatches}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        <Text style={styles.section}>Safety</Text>
        <View style={styles.card}>
          <Pressable style={[styles.row, styles.rowLast]}>
            <View style={styles.left}>
              <UserX size={18} color={colors.accent} />
              <Text style={styles.label}>Blocked profiles</Text>
            </View>
            <ChevronRight size={18} color={colors.textMuted} />
          </Pressable>
        </View>
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
  section: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 8,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textCol: {
    flex: 1,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
});
