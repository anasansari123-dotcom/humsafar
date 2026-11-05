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
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Star,
  X,
} from 'lucide-react-native';
import { Profile } from '../types';
import { fonts, useThemeColors } from '../theme';

/** Transparent-background profile frame (title drawn in code: Bride / Groom) */
const frame = require('../../assets/match-frame-profile.png');

/** Source size of match-frame-profile.png — positions are in these pixels */
const FRAME_W = 962;
const FRAME_H = 1634;
export const MATCH_FRAME_RATIO = FRAME_W / FRAME_H;
/**
 * Share of the frame below the Decline / Connect buttons (the gold lattice
 * border). The tab bar may sit over this part without hiding anything.
 */
export const MATCH_FRAME_UNDER_BAR = (FRAME_H - 1440) / FRAME_H;

/** Inner edge of the arch window, traced from the artwork */
const ARCH_PATH =
  'M424 546L428 546L432 533L436 524L440 517L444 512L448 507L452 503L456 500L460 497L464 494L468 492L472 489L476 488L480 486L484 485L488 484L492 484L496 474L500 458L504 448L508 441L512 434L516 429L520 424L524 420L528 416L532 412L536 409L540 406L544 403L548 400L552 398L556 395L560 393L564 391L568 389L572 387L576 385L580 382L584 381L588 378L592 376L596 374L600 372L604 370L608 368L612 365L616 363L620 360L624 357L628 354L632 351L636 348L640 344L644 341L648 337L652 336L656 340L660 344L664 347L668 350L672 354L676 357L680 359L684 362L688 365L692 367L696 369L700 372L704 374L708 376L712 378L716 380L720 382L724 383L728 385L732 387L736 389L740 391L744 394L748 396L752 398L756 401L760 403L764 407L768 410L772 413L776 417L780 421L784 426L788 431L792 436L796 444L800 452L804 464L808 483L812 484L816 485L820 486L824 488L828 490L832 491L836 494L840 496L844 499L848 502L852 505L856 509L860 514L864 519L868 526L872 535L876 549L880 549L880 1088L876 1088L872 1097L868 1103L864 1108L860 1112L856 1116L852 1120L848 1123L844 1126L840 1128L836 1130L832 1132L828 1134L824 1136L820 1137L816 1138L812 1140L808 1141L804 1142L800 1142L796 1143L792 1144L788 1145L784 1145L780 1146L776 1146L772 1146L768 1147L764 1147L760 1147L756 1149L752 1155L748 1160L744 1164L740 1168L736 1171L732 1174L728 1176L724 1178L720 1179L716 1181L712 1182L708 1183L704 1160L700 1155L696 1149L692 1146L688 1135L684 1128L680 1125L676 1124L672 1123L668 1123L664 1116L660 1113L656 1110L652 1105L648 1103L644 1108L640 1111L636 1114L632 1119L628 1123L624 1123L620 1124L616 1126L612 1130L608 1145L604 1146L600 1151L596 1157L592 1161L588 1182L584 1181L580 1180L576 1179L572 1177L568 1175L564 1172L560 1169L556 1166L552 1162L548 1157L544 1150L540 1149L536 1149L532 1148L528 1148L524 1148L520 1147L516 1147L512 1146L508 1146L504 1145L500 1144L496 1143L492 1142L488 1141L484 1140L480 1139L476 1137L472 1135L468 1133L464 1131L460 1129L456 1127L452 1124L448 1121L444 1117L440 1113L436 1108L432 1101L428 1092L424 1092Z';

/** Arch path in on-screen pixels for a card stretched by sx / sy */
const scalePath = (sx: number, sy: number) =>
  ARCH_PATH.replace(
    /(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g,
    (_, x, y) => `${(+x * sx).toFixed(1)} ${(+y * sy).toFixed(1)}`,
  );

/** Bounding box of the arch window — the photo covers all of it */
const ARCH_BOX = { x: 424, y: 336, width: 456, height: 848 };

/** Value lines just under each printed label: NAME → CONTACT */
const VALUE_TOPS = [545, 634, 716, 809, 903, 1000, 1091, 1183];
/** Rows tall enough for a second line of text */
const TWO_LINE_ROWS = new Set([2, 3, 4, 5, 6, 7]);
const VALUE_FONT = 22;
const VALUE_LEFT = 145;
const VALUE_RIGHT = 378;

const GOLD = '#F2D57A';
const GOLD_SOFT = '#EDC757';

const pctX = (x: number) => `${(x / FRAME_W) * 100}%` as const;
const pctY = (y: number) => `${(y / FRAME_H) * 100}%` as const;

const maskPhone = (raw?: string) => {
  const digits = (raw || '').replace(/\D/g, '');
  if (digits.length < 6) return 'Shared on request';
  return `${digits.slice(0, 5)} *****`;
};

interface Props {
  profile: Profile;
  /** Rendered width */
  width: number;
  /** Rendered height; taller than the artwork stretches the frame vertically */
  height?: number;
  contactLocked: boolean;
  isShortlisted: boolean;
  onPressPhoto?: () => void;
  onToggleShortlist: () => void;
  onPrev: () => void;
  onNext: () => void;
  onDecline: () => void;
  onConnect: () => void;
}

export const MatchFrameCard: React.FC<Props> = ({
  profile,
  width,
  height: heightProp,
  contactLocked,
  isShortlisted,
  onPressPhoto,
  onToggleShortlist,
  onPrev,
  onNext,
  onDecline,
  onConnect,
}) => {
  const theme = useThemeColors();
  const height = heightProp ?? width / MATCH_FRAME_RATIO;
  // Text and buttons size off the width; vertical positions use sy
  const scale = width / FRAME_W;
  const sy = height / FRAME_H;
  const archPath = useMemo(() => scalePath(scale, sy), [scale, sy]);
  const profileTitle = profile.gender === 'Female' ? 'Bride' : 'Groom';

  // Touch targets never drop below 36dp on small phones
  const roundBtn = Math.max(36, 110 * scale);
  const actionHeight = Math.max(36, 96 * scale);
  const starSize = roundBtn * 0.72;
  const arrowBtn = Math.max(34, 96 * scale);
  const arrowStyle = {
    width: arrowBtn,
    height: arrowBtn,
    borderRadius: arrowBtn / 2,
  };

  const values = useMemo(
    () => [
      profile.name,
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

  const roundStyle = {
    width: roundBtn,
    height: roundBtn,
    borderRadius: roundBtn / 2,
  };

  return (
    <View style={[styles.card, { width, height }]}>
      {/* Theme background (purple / green) shows through the transparent frame */}
      <LinearGradient
        colors={[...theme.gradientHero]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Photo fills the whole arch; tap opens the gallery */}
      <Pressable style={StyleSheet.absoluteFill} onPress={onPressPhoto}>
        <Svg width={width} height={height}>
          <Defs>
            <ClipPath id={`arch-${profile.id}`}>
              <Path d={archPath} />
            </ClipPath>
          </Defs>
          <G clipPath={`url(#arch-${profile.id})`}>
            <SvgImage
              href={{ uri: profile.images[0] }}
              x={ARCH_BOX.x * scale}
              y={ARCH_BOX.y * sy}
              width={ARCH_BOX.width * scale}
              height={ARCH_BOX.height * sy}
              preserveAspectRatio="xMidYMin slice"
            />
          </G>
        </Svg>
      </Pressable>

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image source={frame} style={{ width, height }} resizeMode="stretch" />
      </View>

      {/* Bride / Groom PROFILE — sits where the artwork's title was */}
      <View
        pointerEvents="none"
        style={[
          styles.titleBlock,
          { top: pctY(350), left: pctX(112), width: pctX(260) },
        ]}
      >
        <Text
          style={[
            styles.titleScript,
            { fontSize: 58 * scale, lineHeight: 64 * scale },
          ]}
        >
          {profileTitle}
        </Text>
        <Text
          style={[
            styles.titleCaps,
            { fontSize: 36 * scale, letterSpacing: 3 * scale },
          ]}
        >
          PROFILE
        </Text>
      </View>

      {VALUE_TOPS.map((top, i) => (
        <Text
          key={i}
          numberOfLines={TWO_LINE_ROWS.has(i) ? 2 : 1}
          style={[
            styles.value,
            {
              left: pctX(VALUE_LEFT),
              width: pctX(VALUE_RIGHT - VALUE_LEFT),
              top: pctY(top),
              fontSize: VALUE_FONT * scale,
              lineHeight: VALUE_FONT * 1.15 * scale,
            },
            i === 0 && styles.valueName,
            i === VALUE_TOPS.length - 1 && contactLocked && styles.locked,
          ]}
        >
          {values[i]}
        </Text>
      ))}

      {/* Shortlist — bare star at the top-right corner of the photo */}
      <Pressable
        onPress={onToggleShortlist}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={isShortlisted ? 'Remove from shortlist' : 'Shortlist'}
        style={({ pressed }) => [
          styles.starBtn,
          roundStyle,
          {
            left: (822 * scale) - roundBtn / 2,
            top: (532 * sy) - roundBtn / 2,
          },
          pressed && styles.pressed,
        ]}
      >
        {/* Icons ignore touches so the whole circle area triggers the press */}
        <View pointerEvents="none" style={styles.starIcons}>
          {/* Dark halo behind the star keeps it readable on light photos */}
          <Star
            size={starSize}
            color="rgba(0,0,0,0.45)"
            strokeWidth={4}
            style={styles.starHalo}
          />
          <Star
            size={starSize}
            color={GOLD}
            strokeWidth={2}
            fill={isShortlisted ? GOLD : 'transparent'}
          />
        </View>
      </Pressable>

      {/* Previous / next — under the photo frame, flanking the medallion */}
      <Pressable
        onPress={onPrev}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Previous profile"
        style={({ pressed }) => [
          styles.glassBtn,
          arrowStyle,
          { left: (500 * scale) - arrowBtn / 2, top: (1224 * sy) - arrowBtn / 2 },
          pressed && styles.pressed,
        ]}
      >
        <ChevronLeft size={arrowBtn * 0.6} color={GOLD} strokeWidth={2.4} />
      </Pressable>
      <Pressable
        onPress={onNext}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Next profile"
        style={({ pressed }) => [
          styles.glassBtn,
          arrowStyle,
          { left: (804 * scale) - arrowBtn / 2, top: (1224 * sy) - arrowBtn / 2 },
          pressed && styles.pressed,
        ]}
      >
        <ChevronRight size={arrowBtn * 0.6} color={GOLD} strokeWidth={2.4} />
      </Pressable>

      {/* Below the arch: community line + Decline / Connect between the minarets */}
      <View
        style={[
          styles.footer,
          { top: pctY(1284), left: pctX(205), right: pctX(205) },
        ]}
      >
        <View style={styles.metaRow} pointerEvents="none">
          <Text
            numberOfLines={1}
            style={[styles.meta, { fontSize: Math.max(10, 26 * scale) }]}
          >
            {profile.sect} • {profile.language.split(',')[0].trim()} • ID:{' '}
            {profile.accountId}
          </Text>
          {profile.isVerified ? (
            <BadgeCheck size={Math.max(12, 30 * scale)} color={GOLD} />
          ) : null}
        </View>

        <View style={[styles.actions, { marginTop: 14 * sy }]}>
          <Pressable
            onPress={onDecline}
            style={[
              styles.actionBtn,
              styles.declineBtn,
              { height: actionHeight, borderRadius: actionHeight / 2 },
            ]}
            accessibilityLabel="Decline"
          >
            <X size={Math.max(14, 34 * scale)} color={GOLD} strokeWidth={2.4} />
            <Text style={[styles.actionText, styles.declineText]}>Decline</Text>
          </Pressable>

          <Pressable
            onPress={onConnect}
            style={[styles.actionBtn, { height: actionHeight }]}
            accessibilityLabel="Connect"
          >
            <LinearGradient
              colors={['#E4B83F', '#FFEDB0', '#D6A928', '#9E7409']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.connectFill,
                {
                  borderRadius: actionHeight / 2,
                  borderColor: theme.primary,
                },
              ]}
            >
              <Heart
                size={Math.max(14, 32 * scale)}
                color={theme.primary}
                fill={theme.primary}
              />
              <Text style={[styles.actionText, { color: theme.primary }]}>
                Connect
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
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
    textShadowColor: 'rgba(214,169,40,0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleCaps: {
    fontFamily: fonts.brand,
    color: '#FFFFFF',
    marginTop: -2,
    textShadowColor: 'rgba(214,169,40,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  value: {
    position: 'absolute',
    fontFamily: fonts.medium,
    color: '#FFFFFF',
  },
  valueName: {
    fontFamily: fonts.semiBold,
    color: GOLD,
  },
  locked: {
    color: GOLD_SOFT,
    fontFamily: fonts.regular,
    fontStyle: 'italic',
  },
  /** Dark glass circle with gold rim — readable over any photo */
  glassBtn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,2,24,0.55)',
    borderWidth: 1.5,
    borderColor: GOLD_SOFT,
  },
  starBtn: {
    position: 'absolute',
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcons: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starHalo: {
    position: 'absolute',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.92 }],
  },
  footer: {
    position: 'absolute',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    maxWidth: '100%',
  },
  meta: {
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,0.9)',
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  actionBtn: {
    flex: 1,
  },
  declineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: GOLD_SOFT,
    backgroundColor: 'rgba(10,2,24,0.45)',
  },
  connectFill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1.5,
  },
  actionText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  declineText: {
    color: GOLD,
  },
});
