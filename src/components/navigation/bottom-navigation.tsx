import type { ReactNode } from 'react';
import {
  Pressable,
  View,
  useWindowDimensions,
  type ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  colors,
  componentMetrics,
  shadows,
  spacing,
} from '@/theme';
import { AppText } from '@/components/data-display';
import { translateUiText, useI18n } from '@/i18n';

export type BottomNavigationItem<Value extends string> = {
  accessibilityLabel?: string;
  icon: (options: { color: string; selected: boolean }) => ReactNode;
  label: string;
  value: Value;
};

export type BottomNavigationProps<Value extends string> = Omit<
  ViewProps,
  'children'
> & {
  items: readonly BottomNavigationItem<Value>[];
  onValueChange: (value: Value) => void;
  value: Value;
};

export function BottomNavigation<Value extends string>({
  className,
  items,
  onValueChange,
  style,
  value,
  ...props
}: BottomNavigationProps<Value>) {
  const { language } = useI18n();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const availableItemWidth =
    (width -
      componentMetrics.bottomNavigationSideInset * 2 -
      spacing.sm * 2) /
    Math.max(items.length, 1);
  const itemMinWidth = Math.min(
    componentMetrics.bottomNavigationItemMinWidth,
    availableItemWidth,
  );

  return (
    <View
      accessibilityRole="tablist"
      className={`absolute flex-row items-stretch rounded-navigation border border-border bg-surface px-sm ${className ?? ''}`}
      style={[
        {
          borderCurve: 'continuous',
          bottom: insets.bottom + componentMetrics.bottomNavigationBottomInset,
          boxShadow: shadows.floatingNavigation,
          height: componentMetrics.bottomNavigationHeight,
          left: componentMetrics.bottomNavigationSideInset,
          right: componentMetrics.bottomNavigationSideInset,
        },
        style,
      ]}
      {...props}
    >
      {items.map((item) => {
        const selected = item.value === value;
        const color = selected ? colors.lime : colors.textSecondary;

        return (
          <Pressable
            accessibilityLabel={translateUiText(
              item.accessibilityLabel ?? item.label,
              language,
            )}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className="flex-1 items-center justify-center gap-xs px-xs active:opacity-[0.78]"
            key={item.value}
            onPress={() => onValueChange(item.value)}
            style={{ minWidth: itemMinWidth }}
          >
            {item.icon({ color, selected })}
            <AppText
              numberOfLines={1}
              tone={selected ? 'accent' : 'secondary'}
              variant="caption"
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
