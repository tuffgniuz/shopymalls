import type { ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, componentMetrics } from '@/theme';
import { translateUiText, useI18n } from '@/i18n';

export type IconButtonVariant = 'neutral' | 'accent' | 'booking' | 'ghost';
export type IconButtonSize = 'compact' | 'default';

const variants: Record<
  IconButtonVariant,
  { className: string; contentColor: string }
> = {
  neutral: {
    className: 'border-border bg-surface-raised',
    contentColor: colors.textPrimary,
  },
  accent: {
    className: 'border-lime bg-lime',
    contentColor: colors.onLime,
  },
  booking: {
    className: 'border-booking-strong bg-booking-surface',
    contentColor: colors.booking,
  },
  ghost: {
    className: 'border-transparent bg-transparent',
    contentColor: colors.textPrimary,
  },
};

export type IconButtonProps = Omit<
  PressableProps,
  'accessibilityLabel' | 'children' | 'style'
> & {
  accessibilityLabel: string;
  icon: (color: string) => ReactNode;
  size?: IconButtonSize;
  style?: StyleProp<ViewStyle>;
  variant?: IconButtonVariant;
};

export function IconButton({
  accessibilityLabel,
  accessibilityState,
  className,
  disabled = false,
  hitSlop,
  icon,
  size = 'default',
  style,
  variant = 'neutral',
  ...props
}: IconButtonProps) {
  const { language } = useI18n();
  const isDisabled = disabled === true;
  const selectedVariant = variants[variant];
  const dimension =
    size === 'compact'
      ? componentMetrics.compactIconButtonSize
      : componentMetrics.iconButtonSize;

  return (
    <Pressable
      accessibilityLabel={translateUiText(accessibilityLabel, language)}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
      className={`items-center justify-center rounded-full border ${selectedVariant.className} ${isDisabled ? 'opacity-[0.45]' : 'active:opacity-[0.78]'} ${className ?? ''}`}
      disabled={isDisabled}
      hitSlop={hitSlop ?? (size === 'compact' ? 2 : 0)}
      style={[
        {
          height: dimension,
          width: dimension,
        },
        style,
      ]}
      {...props}
    >
      {icon(selectedVariant.contentColor)}
    </Pressable>
  );
}
