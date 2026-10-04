import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Plus } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  CustomTextInput,
  GradientHeader,
  PremiumButton,
} from '../components';
import { useProfileStore } from '../store/useProfileStore';
import { RootStackParamList } from '../navigation/types';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

const sections = [
  'Personal',
  'Education',
  'Occupation',
  'Family',
  'Religion',
  'Partner Preference',
  'Gallery',
] as const;

export const EditProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { myProfile, updateProfile } = useProfileStore();
  const initialSection = (route.params?.section as (typeof sections)[number]) || 'Personal';
  const [section, setSection] = useState<(typeof sections)[number]>(
    sections.includes(initialSection) ? initialSection : 'Personal',
  );
  const [form, setForm] = useState({
    name: myProfile.name,
    age: String(myProfile.age),
    height: myProfile.height,
    city: myProfile.city,
    state: myProfile.state,
    country: myProfile.country,
    education: myProfile.education,
    profession: myProfile.profession,
    income: myProfile.income,
    family: myProfile.family,
    sect: myProfile.sect,
    language: myProfile.language,
    about: myProfile.about,
    partnerPreference: myProfile.partnerPreference,
    lifestyle: myProfile.lifestyle,
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const save = () => {
    updateProfile({
      name: form.name,
      age: Number(form.age) || myProfile.age,
      height: form.height,
      city: form.city,
      state: form.state,
      country: form.country,
      education: form.education,
      profession: form.profession,
      income: form.income,
      family: form.family,
      sect: form.sect as typeof myProfile.sect,
      language: form.language,
      about: form.about,
      partnerPreference: form.partnerPreference,
      lifestyle: form.lifestyle,
      profileCompletion: Math.min(100, myProfile.profileCompletion + 5),
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Edit Profile"
        subtitle="Keep your profile fresh"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.tabsWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabs}
        >
          {sections.map((s) => (
            <Pressable
              key={s}
              style={[styles.tab, section === s && styles.tabActive]}
              onPress={() => setSection(s)}
            >
              <Text style={[styles.tabText, section === s && styles.tabTextActive]}>
                {s}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {section === 'Personal' && (
          <>
            <CustomTextInput label="Full Name" value={form.name} onChangeText={(t) => set('name', t)} />
            <CustomTextInput label="Age" value={form.age} keyboardType="number-pad" onChangeText={(t) => set('age', t)} />
            <CustomTextInput label="Height" value={form.height} onChangeText={(t) => set('height', t)} />
            <CustomTextInput label="City" value={form.city} onChangeText={(t) => set('city', t)} />
            <CustomTextInput label="State" value={form.state} onChangeText={(t) => set('state', t)} />
            <CustomTextInput label="Country" value={form.country} onChangeText={(t) => set('country', t)} />
            <CustomTextInput label="About" value={form.about} onChangeText={(t) => set('about', t)} multiline />
          </>
        )}

        {section === 'Education' && (
          <CustomTextInput
            label="Education"
            value={form.education}
            onChangeText={(t) => set('education', t)}
            multiline
          />
        )}

        {section === 'Occupation' && (
          <>
            <CustomTextInput label="Profession" value={form.profession} onChangeText={(t) => set('profession', t)} />
            <CustomTextInput label="Income" value={form.income} onChangeText={(t) => set('income', t)} />
          </>
        )}

        {section === 'Family' && (
          <CustomTextInput
            label="Family Details"
            value={form.family}
            onChangeText={(t) => set('family', t)}
            multiline
          />
        )}

        {section === 'Religion' && (
          <>
            <CustomTextInput label="Sect" value={form.sect} onChangeText={(t) => set('sect', t)} />
            <CustomTextInput label="Languages" value={form.language} onChangeText={(t) => set('language', t)} />
            <CustomTextInput label="Lifestyle" value={form.lifestyle} onChangeText={(t) => set('lifestyle', t)} multiline />
          </>
        )}

        {section === 'Partner Preference' && (
          <CustomTextInput
            label="Partner Preference"
            value={form.partnerPreference}
            onChangeText={(t) => set('partnerPreference', t)}
            multiline
          />
        )}

        {section === 'Gallery' && (
          <View style={styles.gallery}>
            {myProfile.images.map((uri, i) => (
              <View key={uri} style={styles.photo}>
                <Image source={{ uri }} style={styles.photoImg} />
                <View style={styles.photoBadge}>
                  <Camera size={12} color={colors.primary} />
                  <Text style={styles.photoBadgeText}>{i + 1}</Text>
                </View>
              </View>
            ))}
            <Pressable style={styles.addPhoto}>
              <Plus size={28} color={colors.accent} />
              <Text style={styles.addText}>Add Photo</Text>
            </Pressable>
          </View>
        )}

        <PremiumButton title="Save Changes" onPress={save} style={{ marginTop: 8 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabsWrap: {
    backgroundColor: colors.background,
  },
  tabsScroll: {
    flexGrow: 0,
  },
  tabs: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  formScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: spacing.xl,
  },
  photo: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  photoImg: {
    width: '100%',
    height: '100%',
  },
  photoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  photoBadgeText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.primary,
  },
  addPhoto: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.borderGold,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    gap: 8,
  },
  addText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.accentDark,
  },
});
