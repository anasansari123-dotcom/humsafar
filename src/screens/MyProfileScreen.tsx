import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  BadgeCheck,
  Camera,
  ChevronRight,
  Crown,
  Download,
  Heart,
  HelpCircle,
  Moon,
  Settings,
  Share2,
  Shield,
  Sun,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PremiumButton, ProfileBadge } from '../components';
import { useProfileStore } from '../store/useProfileStore';
import { useAppStore } from '../store/useAppStore';
import { RootStackParamList } from '../navigation/types';
import { downloadProfileResume, shareProfileResume } from '../utils';
import { colors, fonts, radius, shadows, spacing, useThemeColors } from '../theme';

const MenuItem = ({
  icon: Icon,
  label,
  onPress,
  value,
  accent,
  text,
}: {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  onPress: () => void;
  value?: string;
  accent: string;
  text: string;
}) => (
  <Pressable style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <View
        style={[
          styles.menuIcon,
          { borderColor: accent, backgroundColor: 'rgba(212,175,55,0.12)' },
        ]}
      >
        <Icon size={18} color={accent} />
      </View>
      <Text style={[styles.menuLabel, { color: text }]}>{label}</Text>
    </View>
    <View style={styles.menuRight}>
      {value ? (
        <Text style={[styles.menuValue, { color: accent }]}>{value}</Text>
      ) : null}
      <ChevronRight size={18} color={accent} />
    </View>
  </Pressable>
);

export const MyProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const myProfile = useProfileStore((s) => s.myProfile);
  const membership = useAppStore((s) => s.membership);
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const theme = useThemeColors();
  const [exporting, setExporting] = useState<'download' | 'share' | null>(null);

  const handleDownloadResume = async () => {
    setExporting('download');
    await downloadProfileResume(myProfile, membership);
    setExporting(null);
  };

  const handleShareResume = async () => {
    setExporting('share');
    await shareProfileResume(myProfile, membership);
    setExporting(null);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[...theme.gradientHero]}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.topBar}>
          {navigation.canGoBack() ? (
            <Pressable
              style={styles.iconBtn}
              onPress={() => navigation.goBack()}
              hitSlop={10}
            >
              <ArrowLeft size={22} color={theme.accent} />
            </Pressable>
          ) : (
            <View style={styles.iconBtnPlaceholder} />
          )}

          <Pressable
            style={styles.iconBtn}
            onPress={toggleDarkMode}
            hitSlop={10}
            accessibilityLabel={
              darkMode ? 'Switch to purple theme' : 'Switch to green theme'
            }
          >
            {darkMode ? (
              <Sun size={20} color={theme.accent} />
            ) : (
              <Moon size={20} color={theme.accent} />
            )}
          </Pressable>
        </View>

        <View style={styles.avatarWrap}>
          <Image source={{ uri: myProfile.images[0] }} style={styles.avatar} />
          <Pressable style={styles.camera}>
            <Camera size={16} color={theme.primary} />
          </Pressable>
        </View>
        <Text style={styles.name}>{myProfile.name}</Text>
        <Text style={styles.meta}>
          {myProfile.age} · {myProfile.city} · {myProfile.profession}
        </Text>
        <View style={styles.badges}>
          {myProfile.isVerified && (
            <ProfileBadge type="verified" label="Verified" />
          )}
          <ProfileBadge type="premium" label={membership} />
        </View>

        <View style={styles.completionBox}>
          <Text style={styles.completionText}>
            Profile {myProfile.profileCompletion}% complete
          </Text>
          <View style={styles.track}>
            <View
              style={[
                styles.fill,
                { width: `${myProfile.profileCompletion}%` },
              ]}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <PremiumButton
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
          style={{ marginBottom: spacing.lg }}
        />

        <View
          style={[styles.menuCard, shadows.soft, { borderColor: theme.border }]}
        >
          <MenuItem
            icon={Crown}
            label="Membership Status"
            value={membership}
            onPress={() => navigation.navigate('MembershipUpgrade')}
            accent={theme.accent}
            text={theme.text}
          />
          <MenuItem
            icon={Heart}
            label="Favourite Profiles"
            onPress={() => navigation.navigate('Favourites')}
            accent={theme.accent}
            text={theme.text}
          />
          <MenuItem
            icon={BadgeCheck}
            label="Verification Status"
            value="Verified"
            onPress={() => {}}
            accent={theme.accent}
            text={theme.text}
          />
          <MenuItem
            icon={Shield}
            label="Privacy"
            onPress={() => navigation.navigate('Privacy')}
            accent={theme.accent}
            text={theme.text}
          />
          <MenuItem
            icon={Camera}
            label="Upload Photos"
            onPress={() =>
              navigation.navigate('EditProfile', { section: 'Gallery' })
            }
            accent={theme.accent}
            text={theme.text}
          />
          <View
            style={[styles.actionRow, { borderBottomColor: theme.border }]}
          >
            <Pressable
              style={[styles.actionBtn, styles.actionBtnLeft]}
              onPress={handleDownloadResume}
              disabled={!!exporting}
            >
              {exporting === 'download' ? (
                <ActivityIndicator size="small" color={theme.accent} />
              ) : (
                <Download size={18} color={theme.accent} />
              )}
              <Text style={[styles.actionLabel, { color: theme.text }]}>
                Download
              </Text>
            </Pressable>
            <View
              style={[styles.actionDivider, { backgroundColor: theme.border }]}
            />
            <Pressable
              style={styles.actionBtn}
              onPress={handleShareResume}
              disabled={!!exporting}
            >
              {exporting === 'share' ? (
                <ActivityIndicator size="small" color={theme.accent} />
              ) : (
                <Share2 size={18} color={theme.accent} />
              )}
              <Text style={[styles.actionLabel, { color: theme.text }]}>
                Share
              </Text>
            </Pressable>
          </View>
          <MenuItem
            icon={Settings}
            label="Settings"
            onPress={() => navigation.navigate('Settings')}
            accent={theme.accent}
            text={theme.text}
          />
          <MenuItem
            icon={HelpCircle}
            label="Help Center"
            onPress={() => navigation.navigate('HelpCenter')}
            accent={theme.accent}
            text={theme.text}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: spacing.xl,
    borderWidth: 2.5,
    borderTopWidth: 0,
    borderColor: colors.accent,
    borderBottomColor: colors.accentLight,
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  iconBtnPlaceholder: {
    width: 42,
    height: 42,
  },
  avatarWrap: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  camera: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.surface,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  completionBox: {
    marginTop: spacing.xl,
    width: '85%',
  },
  completionText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.accentLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
  },
  body: {
    padding: spacing.xl,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  menuLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuValue: {
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  actionBtnLeft: {
    borderRightWidth: 0,
  },
  actionDivider: {
    width: 1,
    alignSelf: 'stretch',
  },
  actionLabel: {
    fontFamily: fonts.medium,
    fontSize: 15,
  },
});
