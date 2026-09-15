import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, componentMetrics, interaction } from '@/theme';
import { AppText } from '@/components/data-display';
import { translateUiText, useI18n } from '@/i18n';

export type TextFieldVariant = 'default' | 'search';

export type TextFieldProps = TextInputProps & {
  containerClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  errorMessage?: string;
  helperText?: string;
  label?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  variant?: TextFieldVariant;
};

export function TextField({
  accessibilityLabel,
  className,
  containerClassName,
  containerStyle,
  editable = true,
  errorMessage,
  helperText,
  label,
  leading,
  onBlur,
  onFocus,
  placeholder,
  placeholderTextColor,
  selectionColor,
  style,
  trailing,
  variant = 'default',
  ...props
}: TextFieldProps) {
  const { language } = useI18n();
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(errorMessage);
  const fieldHeight =
    variant === 'search'
      ? componentMetrics.searchFieldHeight
      : componentMetrics.textFieldHeight;
  const radiusClassName = variant === 'search' ? 'rounded-feature' : 'rounded-control';
  const borderClassName = hasError
    ? 'border-danger'
    : focused
      ? 'border-lime'
      : 'border-border';

  return (
    <View className={`gap-sm ${containerClassName ?? ''}`} style={containerStyle}>
      {label ? (
        <AppText variant="label">{label}</AppText>
      ) : null}

      <View
        className={`flex-row items-center gap-sm border bg-surface-raised px-lg ${radiusClassName} ${borderClassName}`}
        style={{
          borderCurve: 'continuous',
          minHeight: fieldHeight,
          opacity: editable ? 1 : interaction.disabledOpacity,
        }}
      >
        {leading}
        <TextInput
          accessibilityLabel={
            accessibilityLabel || label
              ? translateUiText(accessibilityLabel ?? label ?? '', language)
              : undefined
          }
          className={`flex-1 p-0 font-open-sans text-body text-text-primary ${className ?? ''}`}
          editable={editable}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          placeholder={placeholder ? translateUiText(placeholder, language) : undefined}
          placeholderTextColor={placeholderTextColor ?? colors.textSecondary}
          selectionColor={selectionColor ?? colors.lime}
          style={style}
          {...props}
        />
        {trailing}
      </View>

      {errorMessage ? (
        <AppText accessibilityRole="alert" tone="danger" variant="caption">
          {errorMessage}
        </AppText>
      ) : helperText ? (
        <AppText tone="secondary" variant="caption">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}
