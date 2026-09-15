import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { colors } from '@/theme';
import { AppText, type AppTextTone } from '@/components/data-display';

export type InlineMessageVariant =
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger'
  | 'booking';

const variants: Record<
  InlineMessageVariant,
  { className: string; iconColor: string; textTone: AppTextTone }
> = {
  neutral: {
    className: 'border-border bg-surface-raised',
    iconColor: colors.textSecondary,
    textTone: 'secondary',
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
  booking: {
    className: 'border-booking-strong bg-booking-surface',
    iconColor: colors.booking,
    textTone: 'booking',
  },
};

export type InlineMessageProps = Omit<ViewProps, 'children'> & {
  children: ReactNode;
  icon?: (color: string) => ReactNode;
  title?: string;
  variant?: InlineMessageVariant;
};

export function InlineMessage({
  children,
  className,
  icon,
  style,
  title,
  variant = 'neutral',
  ...props
}: InlineMessageProps) {
  const selectedVariant = variants[variant];

  return (
    <View
      accessibilityRole="alert"
      className={`flex-row items-start gap-md rounded-card border p-md ${selectedVariant.className} ${className ?? ''}`}
      style={[{ borderCurve: 'continuous' }, style]}
      {...props}
    >
      {icon?.(selectedVariant.iconColor)}
      <View className="flex-1 gap-xs">
        {title ? (
          <AppText tone={selectedVariant.textTone} variant="subheadStrong">
            {title}
          </AppText>
        ) : null}
        <AppText selectable tone="primary" variant="subhead">
          {children}
        </AppText>
      </View>
    </View>
  );
}
