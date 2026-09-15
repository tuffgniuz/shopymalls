import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { colors, componentMetrics } from '@/theme';

import { AppText, type AppTextTone } from './app-text';

export type BadgeVariant =
  | 'neutral'
  | 'accent'
  | 'booking'
  | 'success'
  | 'warning'
  | 'danger';

const variants: Record<
  BadgeVariant,
  { className: string; iconColor: string; textTone: AppTextTone }
> = {
  neutral: {
    className: 'border-border bg-surface-raised',
    iconColor: colors.textSecondary,
    textTone: 'secondary',
  },
  accent: {
    className: 'border-lime bg-lime',
    iconColor: colors.onLime,
    textTone: 'onAccent',
  },
  booking: {
    className: 'border-booking-strong bg-booking-surface',
    iconColor: colors.booking,
    textTone: 'booking',
  },
  success: {
    className: 'border-lime-border bg-lime-surface',
    iconColor: colors.success,
    textTone: 'accent',
  },
  warning: {
    className: 'border-warning bg-warning-surface',
    iconColor: colors.warning,
    textTone: 'warning',
  },
  danger: {
    className: 'border-danger bg-danger-surface',
    iconColor: colors.danger,
    textTone: 'danger',
  },
};

export type BadgeProps = Omit<ViewProps, 'children'> & {
  children: ReactNode;
  icon?: (color: string) => ReactNode;
  variant?: BadgeVariant;
};

export function Badge({
  children,
  className,
  icon,
  style,
  variant = 'neutral',
  ...props
}: BadgeProps) {
  const selectedVariant = variants[variant];

  return (
    <View
      className={`self-start flex-row items-center gap-xs rounded-full border px-sm ${selectedVariant.className} ${className ?? ''}`}
      style={[
        { minHeight: componentMetrics.badgeHeight },
        style,
      ]}
      {...props}
    >
      {icon?.(selectedVariant.iconColor)}
      <AppText tone={selectedVariant.textTone} variant="micro">
        {children}
      </AppText>
    </View>
  );
}
