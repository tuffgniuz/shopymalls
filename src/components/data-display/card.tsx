import {
  Pressable,
  View,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { translateUiText, useI18n } from '@/i18n';

export type CardVariant = 'default' | 'raised' | 'highlight' | 'booking';
export type CardPadding = 'none' | 'compact' | 'default';

const variantClassNames: Record<CardVariant, string> = {
  default: 'border-border bg-surface',
  raised: 'border-border bg-surface-raised',
  highlight: 'border-lime-border bg-lime-surface',
  booking: 'border-booking-strong bg-booking-surface',
};

const paddingClassNames: Record<CardPadding, string> = {
  none: 'p-0',
  compact: 'p-md',
  default: 'p-lg',
};

export type CardProps = ViewProps & {
  padding?: CardPadding;
  variant?: CardVariant;
};

export function Card({
  className,
  padding = 'default',
  style,
  variant = 'default',
  ...props
}: CardProps) {
  return (
    <View
      className={`rounded-card border ${variantClassNames[variant]} ${paddingClassNames[padding]} ${className ?? ''}`}
      style={[{ borderCurve: 'continuous' }, style]}
      {...props}
    />
  );
}

export type PressableCardProps = Omit<PressableProps, 'style'> & {
  padding?: CardPadding;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
};

export function PressableCard({
  accessibilityLabel,
  accessibilityRole = 'button',
  accessibilityState,
  className,
  disabled = false,
  padding = 'default',
  style,
  variant = 'default',
  ...props
}: PressableCardProps) {
  const { language } = useI18n();
  const isDisabled = disabled === true;

  return (
    <Pressable
      accessibilityLabel={
        accessibilityLabel
          ? translateUiText(accessibilityLabel, language)
          : undefined
      }
      accessibilityRole={accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
      className={`rounded-card border ${variantClassNames[variant]} ${paddingClassNames[padding]} ${isDisabled ? 'opacity-[0.45]' : 'active:opacity-[0.78]'} ${className ?? ''}`}
      disabled={isDisabled}
      style={[{ borderCurve: 'continuous' }, style]}
      {...props}
    />
  );
}
