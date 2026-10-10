import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Bell,
  ChevronRight,
  Globe,
  LogOut,
  Moon,
  Trash2,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomSheet, GradientHeader, PremiumButton } from '../components';
import { useAppStore } from '../store/useAppStore';
import { useAuthStore } from '../store/useAuthStore';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, radius, spacing, useThemeColors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { darkMode, toggleDarkMode, language, setLanguage } = useAppStore();
  const logout = useAuthStore((s) => s.logout);
  const colorsTheme = useThemeColors();
  const [notif, setNotif] = useState(true);
  const [langOpen, setLangOpen] = useState(false);

  const handleLogout = () => {
    // RootNavigator returns to Auth when isAuthenticated becomes false
    logout();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Account',
      'This is a frontend demo. Account deletion is simulated.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleLogout },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Settings"
        subtitle="Personalize your experience"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.left}>
              <Moon size={18} color={colorsTheme.accent} />
              <Text style={styles.label}>Green Theme</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.border, true: colorsTheme.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <Pressable style={styles.row} onPress={() => setLangOpen(true)}>
            <View style={styles.left}>
              <Globe size={18} color={colors.accent} />
              <Text style={styles.label}>Language</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.value}>{language}</Text>
              <ChevronRight size={18} color={colors.textMuted} />
            </View>
          </Pressable>

          <View style={[styles.row, styles.rowLast]}>
            <View style={styles.left}>
              <Bell size={18} color={colors.accent} />
              <Text style={styles.label}>Notifications</Text>
            </View>
            <Switch
              value={notif}
              onValueChange={setNotif}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        <PremiumButton
          title="Logout"
          variant="outline"
          onPress={handleLogout}
          icon={<LogOut size={18} color={colors.primary} />}
          style={{ marginTop: spacing.xl }}
        />

        <Pressable style={styles.delete} onPress={handleDelete}>
          <Trash2 size={16} color={colors.error} />
          <Text style={styles.deleteText}>Delete Account</Text>
        </Pressable>
      </ScrollView>

      <BottomSheet
        visible={langOpen}
        onClose={() => setLangOpen(false)}
        title="Choose Language"
      >
        {['English', 'Urdu', 'Hindi', 'Arabic'].map((lang) => (
          <Pressable
            key={lang}
            style={styles.langItem}
            onPress={() => {
              setLanguage(lang);
              setLangOpen(false);
            }}
          >
            <Text style={styles.langText}>{lang}</Text>
          </Pressable>
        ))}
      </BottomSheet>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.accentDark,
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.xxl,
    padding: 12,
  },
  deleteText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.error,
  },
  langItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  langText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
});
