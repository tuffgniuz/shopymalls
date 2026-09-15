import type { ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, componentMetrics, spacing } from '@/theme';
import { AppText, type AppTextTone } from '@/components/data-display';
import { translateUiText, useI18n } from '@/i18n';

export type ChipVariant = 'accent' | 'booking';

const selectedVariants: Record<
  ChipVariant,
  { className: string; contentColor: string; textTone: AppTextTone }
> = {
  accent: {
    className: 'border-lime bg-lime',
    contentColor: colors.onLime,
    textTone: 'onAccent',
  },
  booking: {
    className: 'border-booking-strong bg-booking-strong',
    contentColor: colors.onBooking,
    textTone: 'onBooking',
  },
};

const unselectedVariant = {
  className: 'border-border bg-surface',
  contentColor: colors.textSecondary,
  textTone: 'secondary' as const,
};

export type ChipProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  leading?: (color: string) => ReactNode;
  selected?: boolean;
  style?: StyleProp<ViewStyle>;
  variant?: ChipVariant;
};

export function Chip({
  accessibilityLabel,
  accessibilityState,
  className,
  disabled = false,
  label,
  leading,
  selected = false,
  style,
  variant = 'accent',
  ...props
}: ChipProps) {
  const { language } = useI18n();
  const isDisabled = disabled === true;
  const selectedStyle = selected ? selectedVariants[variant] : unselectedVariant;

  return (
    <Pressable
      accessibilityLabel={translateUiText(accessibilityLabel ?? label, language)}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        disabled: isDisabled,
        selected,
      }}
      className={`self-start flex-row items-center justify-center gap-xs rounded-full border px-md ${selectedStyle.className} ${isDisabled ? 'opacity-[0.45]' : 'active:opacity-[0.78]'} ${className ?? ''}`}
      disabled={isDisabled}
      hitSlop={spacing.xs}
      style={[{ minHeight: componentMetrics.chipHeight }, style]}
      {...props}
    >
      {leading?.(selectedStyle.contentColor)}
      <AppText tone={selectedStyle.textTone} variant="subheadStrong">
        {label}
      </AppText>
    </Pressable>
  );
}
