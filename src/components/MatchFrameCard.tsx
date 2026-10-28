import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  ClipPath,
  Defs,
  G,
  Image as SvgImage,
  Path,
} from 'react-native-svg';
import { BadgeCheck } from 'lucide-react-native';
import { Profile } from '../types';
import { fonts, useThemeColors } from '../theme';

const frame = require('../../assets/match-frame.png');

/** Source size of match-frame.png — positions are in these pixels */
const FRAME_W = 962;
const FRAME_H = 1634;
export const MATCH_FRAME_RATIO = FRAME_W / FRAME_H;

/** Inner edge of the arch window, traced from the artwork */
const ARCH_PATH =
  'M424 546L428 546L432 533L436 524L440 517L444 512L448 507L452 503L456 500L460 497L464 494L468 492L472 489L476 488L480 486L484 485L488 484L492 484L496 474L500 458L504 448L508 441L512 434L516 429L520 424L524 420L528 416L532 412L536 409L540 406L544 403L548 400L552 398L556 395L560 393L564 391L568 389L572 387L576 385L580 382L584 381L588 378L592 376L596 374L600 372L604 370L608 368L612 365L616 363L620 360L624 357L628 354L632 351L636 348L640 344L644 341L648 337L652 336L656 340L660 344L664 347L668 350L672 354L676 357L680 359L684 362L688 365L692 367L696 369L700 372L704 374L708 376L712 378L716 380L720 382L724 383L728 385L732 387L736 389L740 391L744 394L748 396L752 398L756 401L760 403L764 407L768 410L772 413L776 417L780 421L784 426L788 431L792 436L796 444L800 452L804 464L808 483L812 484L816 485L820 486L824 488L828 490L832 491L836 494L840 496L844 499L848 502L852 505L856 509L860 514L864 519L868 526L872 535L876 549L880 549L880 1088L876 1088L872 1097L868 1103L864 1108L860 1112L856 1116L852 1120L848 1123L844 1126L840 1128L836 1130L832 1132L828 1134L824 1136L820 1137L816 1138L812 1140L808 1141L804 1142L800 1142L796 1143L792 1144L788 1145L784 1145L780 1146L776 1146L772 1146L768 1147L764 1147L760 1147L756 1149L752 1155L748 1160L744 1164L740 1168L736 1171L732 1174L728 1176L724 1178L720 1179L716 1181L712 1182L708 1183L704 1160L700 1155L696 1149L692 1146L688 1135L684 1128L680 1125L676 1124L672 1123L668 1123L664 1116L660 1113L656 1110L652 1105L648 1103L644 1108L640 1111L636 1114L632 1119L628 1123L624 1123L620 1124L616 1126L612 1130L608 1145L604 1146L600 1151L596 1157L592 1161L588 1182L584 1181L580 1180L576 1179L572 1177L568 1175L564 1172L560 1169L556 1166L552 1162L548 1157L544 1150L540 1149L536 1149L532 1148L528 1148L524 1148L520 1147L516 1147L512 1146L508 1146L504 1145L500 1144L496 1143L492 1142L488 1141L484 1140L480 1139L476 1137L472 1135L468 1133L464 1131L460 1129L456 1127L452 1124L448 1121L444 1117L440 1113L436 1108L432 1101L428 1092L424 1092Z';

const ARCH_BOX = { x: 428, y: 360, width: 448, height: 780 };

/** Value lines under printed labels: AGE → CONTACT */
const VALUE_TOPS = [545, 626, 721, 817, 916, 1009, 1111];
const VALUE_FONT = 22;
const VALUE_LEFT = 145;
const VALUE_RIGHT = 378;

const GOLD = '#F0D78C';
const GOLD_SOFT = '#E8C96A';

const pctX = (x: number) => `${(x / FRAME_W) * 100}%` as const;
const pctY = (y: number) => `${(y / FRAME_H) * 100}%` as const;

const maskPhone = (raw?: string) => {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length < 6) return 'Shared on request';
  return `${digits.slice(0, 5)} *****`;
};

interface Props {
  profile: Profile;
  width: number;
  /** Optional forced height (defaults to width / aspect) */
  height?: number;
  contactLocked: boolean;
  onPressPhoto?: () => void;
}

export const MatchFrameCard: React.FC<Props> = ({
  profile,
  width,
  height: heightProp,
  contactLocked,
  onPressPhoto,
}) => {
  const theme = useThemeColors();
  const height = heightProp ?? width / MATCH_FRAME_RATIO;
  const scale = width / FRAME_W;
  const isBride = profile.gender === 'Female';
  const profileTitle = isBride ? 'Bride' : 'Groom';

  const values = useMemo(
    () => [
      `${profile.age} Years`,
      profile.maritalStatus,
      profile.height || 'Prefer not to disclose',
      profile.education,
      profile.profession,
      `${profile.city}, ${profile.state}`,
      contactLocked ? 'Upgrade to view' : maskPhone(profile.parentPhone),
    ],
    [profile, contactLocked],
  );

  return (
    <View style={[styles.card, { width, height }]}>
      {/* Theme background (purple / green) shows through transparent frame */}
      <LinearGradient
        colors={[...theme.gradientHero]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <Pressable style={StyleSheet.absoluteFill} onPress={onPressPhoto}>
        <Svg
          width={width}
          height={height}
          viewBox={`0 0 ${FRAME_W} ${FRAME_H}`}
        >
          <Defs>
            <ClipPath id={`arch-${profile.id}`}>
              <Path d={ARCH_PATH} />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#arch-${profile.id})`}>
            <SvgImage
              href={{ uri: profile.images[0] }}
              {...ARCH_BOX}
              preserveAspectRatio="xMidYMid slice"
            />
          </G>
        </Svg>
      </Pressable>

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image source={frame} style={{ width, height }} resizeMode="stretch" />
      </View>

      {/* Bride / Groom PROFILE — left of arch, like reference */}
      <View
        pointerEvents="none"
        style={[
          styles.titleBlock,
          {
            top: pctY(360),
            left: pctX(90),
            width: pctX(300),
          },
        ]}
      >
        <Text
          style={[
            styles.titleScript,
            { fontSize: Math.max(22, 58 * scale), lineHeight: Math.max(26, 66 * scale) },
          ]}
        >
          {profileTitle}
        </Text>
        <Text
          style={[
            styles.titleCaps,
            { fontSize: Math.max(11, 34 * scale), letterSpacing: 3 * scale },
          ]}
        >
          PROFILE
        </Text>
      </View>

      {VALUE_TOPS.map((top, i) => (
        <Text
          key={i}
          numberOfLines={i === 1 || i === 5 ? 2 : 1}
          style={[
            styles.value,
            {
              left: pctX(VALUE_LEFT),
              width: pctX(VALUE_RIGHT - VALUE_LEFT),
              top: pctY(top),
              fontSize: VALUE_FONT * scale,
              lineHeight: VALUE_FONT * 1.15 * scale,
            },
            i === VALUE_TOPS.length - 1 && contactLocked && styles.locked,
          ]}
        >
          {values[i]}
        </Text>
      ))}

      <View
        pointerEvents="none"
        style={[
          styles.namePlate,
          { top: pctY(1225), left: pctX(160), right: pctX(160) },
        ]}
      >
        <View style={styles.nameRow}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[styles.name, { fontSize: Math.max(15, 52 * scale) }]}
          >
            {profile.name}
          </Text>
          {profile.isVerified ? (
            <BadgeCheck size={Math.max(14, 42 * scale)} color={GOLD} />
          ) : null}
        </View>
        <Text style={[styles.meta, { fontSize: Math.max(9, 26 * scale) }]}>
          {profile.sect} • {profile.language.split(',')[0].trim()}
        </Text>
        <Text style={[styles.accountId, { fontSize: Math.max(8, 24 * scale) }]}>
          ID: {profile.accountId}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  titleBlock: {
    position: 'absolute',
  },
  titleScript: {
    fontFamily: fonts.script,
    color: GOLD,
    textShadowColor: 'rgba(212,175,55,0.55)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleCaps: {
    fontFamily: fonts.brand,
    color: '#FFFFFF',
    marginTop: -2,
  },
  value: {
    position: 'absolute',
    fontFamily: fonts.medium,
    color: '#FFFFFF',
  },
  locked: {
    color: GOLD_SOFT,
    fontFamily: fonts.regular,
    fontStyle: 'italic',
  },
  namePlate: {
    position: 'absolute',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontFamily: fonts.brand,
    color: GOLD,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  meta: {
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 2,
  },
  accountId: {
    fontFamily: fonts.regular,
    color: 'rgba(232,201,106,0.9)',
    marginTop: 2,
    letterSpacing: 0.5,
  },
});
