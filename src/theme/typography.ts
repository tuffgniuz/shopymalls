import type { TextStyle } from 'react-native';

/**
 * Font names must match the names used when the two static Open Sans font
 * files are loaded. Keeping each weight as its own family prevents React
 * Native from synthesizing a weight that was not delivered in the brief.
 */
export const fontFamilies = {
  regular: 'OpenSans-Regular',
  bold: 'OpenSans-Bold',
} as const;

export const fontWeights = {
  regular: '400',
  bold: '700',
} as const satisfies Record<string, NonNullable<TextStyle['fontWeight']>>;

type TypographyStyle = Readonly<
  Pick<TextStyle, 'fontFamily' | 'fontSize' | 'letterSpacing' | 'lineHeight'>
>;

export const typography = {
  display: {
    fontFamily: fontFamilies.bold,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.6,
  },
  screenTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  heroTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  title: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  titleSmall: {
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  section: {
    fontFamily: fontFamilies.bold,
    fontSize: 17,
    lineHeight: 23,
    letterSpacing: 0,
  },
  body: {
    fontFamily: fontFamilies.regular,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  bodyStrong: {
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0,
  },
  subhead: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  subheadStrong: {
    fontFamily: fontFamilies.bold,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  label: {
    fontFamily: fontFamilies.bold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  caption: {
    fontFamily: fontFamilies.regular,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0,
  },
  eyebrow: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
  },
  micro: {
    fontFamily: fontFamilies.bold,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: 0.5,
  },
} as const satisfies Record<string, TypographyStyle>;

/** NativeWind class pairs that apply the matching static font and type scale. */
export const typographyClassNames = {
  display: 'font-open-sans-bold text-display',
  screenTitle: 'font-open-sans-bold text-screen-title',
  heroTitle: 'font-open-sans-bold text-hero-title',
  title: 'font-open-sans-bold text-title',
  titleSmall: 'font-open-sans-bold text-title-small',
  section: 'font-open-sans-bold text-section',
  body: 'font-open-sans text-body',
  bodyStrong: 'font-open-sans-bold text-body-strong',
  subhead: 'font-open-sans text-subhead',
  subheadStrong: 'font-open-sans-bold text-subhead-strong',
  label: 'font-open-sans-bold text-label',
  caption: 'font-open-sans text-caption',
  eyebrow: 'font-open-sans-bold text-eyebrow',
  micro: 'font-open-sans-bold text-micro',
} as const satisfies Record<keyof typeof typography, string>;

export const tabularNumbers = {
  fontVariant: ['tabular-nums'],
} as const satisfies TextStyle;

export const tabularNumbersClassName = 'tabular-nums' as const;

export type TypographyToken = keyof typeof typography;
