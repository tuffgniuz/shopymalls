import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, componentMetrics } from '@/theme';
import { AppText, type AppTextTone } from '@/components/data-display';
import { translateUiText, useI18n } from '@/i18n';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'booking'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'compact' | 'default';

const variants: Record<
  ButtonVariant,
  { className: string; contentColor: string; textTone: AppTextTone }
> = {
  primary: {
    className: 'border-lime bg-lime',
    contentColor: colors.onLime,
    textTone: 'onAccent',
  },
  secondary: {
    className: 'border-lime-border bg-surface',
    contentColor: colors.lime,
    textTone: 'accent',
  },
  booking: {
    className: 'border-booking-strong bg-booking-strong',
    contentColor: colors.onBooking,
    textTone: 'onBooking',
  },
  ghost: {
    className: 'border-transparent bg-transparent',
    contentColor: colors.textPrimary,
    textTone: 'primary',
  },
  danger: {
    className: 'border-danger bg-danger',
    contentColor: colors.canvas,
    textTone: 'onAccent',
  },
};

const sizeClassNames: Record<ButtonSize, string> = {
  compact: 'px-md',
  default: 'px-lg',
};

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  leading?: (color: string) => ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  trailing?: (color: string) => ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  accessibilityLabel,
  accessibilityState,
  className,
  disabled = false,
  label,
  leading,
  loading = false,
  size = 'default',
  style,
  trailing,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const { language } = useI18n();
  const isDisabled = disabled === true || loading;
  const selectedVariant = variants[variant];
  const resolvedAccessibilityLabel = translateUiText(
    accessibilityLabel ?? label,
    language,
  );

  return (
    <Pressable
      accessibilityLabel={resolvedAccessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{
        ...accessibilityState,
        busy: loading,
        disabled: isDisabled,
      }}
      className={`flex-row items-center justify-center gap-sm rounded-control border ${selectedVariant.className} ${sizeClassNames[size]} ${isDisabled ? 'opacity-[0.45]' : 'active:opacity-[0.78]'} ${className ?? ''}`}
      disabled={isDisabled}
      style={[
        {
          borderCurve: 'continuous',
          minHeight:
            size === 'compact'
              ? componentMetrics.compactButtonHeight
              : componentMetrics.buttonHeight,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={selectedVariant.contentColor} size="small" />
      ) : (
        <>
          {leading?.(selectedVariant.contentColor)}
          <AppText className="text-center" tone={selectedVariant.textTone} variant="label">
            {label}
          </AppText>
          {trailing?.(selectedVariant.contentColor)}
        </>
      )}
    </Pressable>
  );
}
