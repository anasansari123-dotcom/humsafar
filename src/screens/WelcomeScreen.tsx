import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, ChevronDown, Globe, ShieldCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { BottomSheet } from '../components';
import { useAppStore } from '../store/useAppStore';
import { colors, fonts, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

const LANGUAGES = ['English', 'Hindi'] as const;

const slidesByLang = {
  English: [
    { id: '1', line1: 'Find your', line2: 'Perfect Match' },
    { id: '2', line1: 'Meet your', line2: 'True Humsafar' },
    { id: '3', line1: 'Begin a', line2: 'Blessed Journey' },
  ],
  Hindi: [
    { id: '1', line1: 'पाएं अपना', line2: 'परफेक्ट मैच' },
    { id: '2', line1: 'मिलें अपने', line2: 'सच्चे हमसफ़र' },
    { id: '3', line1: 'शुरू करें', line2: 'बरकत भरी यात्रा' },
  ],
};

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const [langOpen, setLangOpen] = useState(false);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  const activeLang = language === 'Hindi' ? 'Hindi' : 'English';
  const slides = slidesByLang[activeLang];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/welcome-bg.png')}
        style={styles.bg}
        resizeMode="cover"
      >
        <LinearGradient
          colors={[
            'rgba(26,5,56,0.55)',
            'rgba(45,11,89,0.72)',
            'rgba(26,5,56,0.92)',
          ]}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
            }}
            hitSlop={10}
          >
            <ArrowLeft size={22} color="#fff" />
          </Pressable>

          <Pressable
            style={styles.langBtn}
            onPress={() => setLangOpen(true)}
            hitSlop={8}
          >
            <Globe size={16} color={colors.accent} />
            <Text style={styles.langText}>{activeLang}</Text>
            <ChevronDown size={16} color={colors.accent} />
          </Pressable>
        </View>

        <View style={styles.center}>
          <FlatList
            ref={listRef}
            data={slides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            keyExtractor={(item) => item.id}
            style={styles.slider}
            renderItem={({ item }) => (
              <View style={[styles.slide, { width }]}>
                <Text style={styles.line1}>{item.line1}</Text>
                <Text style={styles.line2}>{item.line2}</Text>
              </View>
            )}
          />
        </View>

        <Animated.View
          entering={FadeInUp.delay(250)}
          style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}
        >
          <Pressable
            style={styles.registerBtn}
            onPress={() => navigation.navigate('RegisterName')}
          >
            <LinearGradient
              colors={[...colors.gradientGold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.registerGradient}
            >
              <Text style={styles.registerText}>
                {activeLang === 'Hindi' ? 'मुफ़्त रजिस्टर करें' : 'Register Free'}
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginText}>
              {activeLang === 'Hindi' ? 'अभी लॉग इन करें' : 'Log In Now'}
            </Text>
          </Pressable>

          <View style={styles.dots}>
            {slides.map((s, i) => (
              <View
                key={s.id}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ))}
          </View>

          <View style={styles.trust}>
            <ShieldCheck size={14} color={colors.accentLight} />
            <Text style={styles.trustText}>
              {activeLang === 'Hindi'
                ? '100% विश्वसनीय और सुरक्षित ऐप'
                : '100% Trusted & Secure App'}
            </Text>
          </View>
        </Animated.View>
      </ImageBackground>

      <BottomSheet
        visible={langOpen}
        onClose={() => setLangOpen(false)}
        title={activeLang === 'Hindi' ? 'भाषा चुनें' : 'Choose Language'}
      >
        {LANGUAGES.map((lang) => {
          const selected = activeLang === lang;
          return (
            <Pressable
              key={lang}
              style={[styles.langItem, selected && styles.langItemActive]}
              onPress={() => {
                setLanguage(lang);
                setLangOpen(false);
              }}
            >
              <Text
                style={[styles.langItemText, selected && styles.langItemTextActive]}
              >
                {lang === 'Hindi' ? 'हिंदी (Hindi)' : 'English'}
              </Text>
              {selected ? <Check size={18} color={colors.accent} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  bg: {
    flex: 1,
    width,
    height,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: 'rgba(45,11,89,0.45)',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  langText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.accentLight,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 72,
  },
  slider: {
    flexGrow: 0,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  line1: {
    fontFamily: fonts.script,
    fontSize: 42,
    color: '#F0D78C',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  line2: {
    fontFamily: fonts.script,
    fontSize: 46,
    color: '#E8C96A',
    textAlign: 'center',
    marginTop: -4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  footer: {
    paddingHorizontal: spacing.xxxl,
    gap: 14,
  },
  registerBtn: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  registerGradient: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.primary,
  },
  loginBtn: {
    height: 54,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45,11,89,0.25)',
  },
  loginText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.accent,
  },
  trust: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  trustText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  langItemActive: {
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderRadius: radius.lg,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
    marginBottom: 6,
  },
  langItemText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
  },
  langItemTextActive: {
    color: colors.primary,
    fontFamily: fonts.semiBold,
  },
});
