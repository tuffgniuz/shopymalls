import { Text, type TextProps } from 'react-native';

import { translateUiText, useI18n } from '@/i18n';
import { typographyClassNames, type TypographyToken } from '@/theme';

export type AppTextTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'accent'
  | 'booking'
  | 'warning'
  | 'danger'
  | 'onAccent'
  | 'onBooking';

const toneClassNames: Record<AppTextTone, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
  disabled: 'text-text-disabled',
  accent: 'text-lime',
  booking: 'text-booking',
  warning: 'text-warning',
  danger: 'text-danger',
  onAccent: 'text-on-lime',
  onBooking: 'text-on-booking',
};

export type AppTextProps = TextProps & {
  numeric?: boolean;
  tone?: AppTextTone;
  variant?: TypographyToken;
};

export function AppText({
  children,
  className,
  numeric = false,
  tone = 'primary',
  variant = 'body',
  ...props
}: AppTextProps) {
  const { language } = useI18n();
  const translatedChildren = typeof children === 'string'
    ? translateUiText(children, language)
    : children;

  return (
    <Text
      className={`${typographyClassNames[variant]} ${toneClassNames[tone]} ${numeric ? 'tabular-nums' : ''} ${className ?? ''}`}
      {...props}
    >
      {translatedChildren}
    </Text>
  );
}
