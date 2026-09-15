import type { ReactNode } from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

import { componentMetrics, spacing } from '@/theme';
import { AppText } from '@/components/data-display';
import { translateUiText, useI18n } from '@/i18n';

export type SectionHeaderProps = Omit<ViewProps, 'children'> & {
  actionAccessibilityLabel?: string;
  actionLabel?: string;
  icon?: ReactNode;
  onActionPress?: () => void;
  title: string;
};

export function SectionHeader({
  actionAccessibilityLabel,
  actionLabel,
  className,
  icon,
  onActionPress,
  title,
  ...props
}: SectionHeaderProps) {
  const { language } = useI18n();

  return (
    <View
      className={`flex-row items-center justify-between gap-md ${className ?? ''}`}
      {...props}
    >
      <View className="flex-1 flex-row items-center gap-sm">
        {icon}
        <AppText variant="section">{title}</AppText>
      </View>

      {actionLabel && onActionPress ? (
        <Pressable
          accessibilityLabel={translateUiText(
            actionAccessibilityLabel ?? actionLabel,
            language,
          )}
          accessibilityRole="button"
          className="items-center justify-center px-sm active:opacity-[0.78]"
          hitSlop={spacing.xs}
          onPress={onActionPress}
          style={{ minHeight: componentMetrics.iconButtonSize }}
        >
          <AppText tone="accent" variant="label">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
