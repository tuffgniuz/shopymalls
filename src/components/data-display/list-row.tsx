import type { ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { translateUiText, useI18n } from '@/i18n';

export type ListRowProps = Omit<PressableProps, 'children' | 'style'> & {
  children: ReactNode;
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
  trailing?: ReactNode;
};

export function ListRow({
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  children,
  className,
  disabled = false,
  leading,
  onPress,
  style,
  trailing,
  ...props
}: ListRowProps) {
  const { language } = useI18n();
  const isDisabled = disabled === true;

  return (
    <Pressable
      accessibilityLabel={
        accessibilityLabel
          ? translateUiText(accessibilityLabel, language)
          : undefined
      }
      accessibilityRole={onPress ? (accessibilityRole ?? 'button') : accessibilityRole}
      accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
      className={`flex-row items-center gap-md rounded-card border border-border bg-surface p-md ${isDisabled ? 'opacity-[0.45]' : 'active:opacity-[0.78]'} ${className ?? ''}`}
      disabled={isDisabled}
      onPress={onPress}
      style={[{ borderCurve: 'continuous' }, style]}
      {...props}
    >
      {leading}
      {children}
      {trailing}
    </Pressable>
  );
}
