import type { ReactNode } from 'react';
import { View } from 'react-native';

import {
  AppSymbol,
  AppText,
  Card,
  IconButton,
  type AppSymbolName,
} from '@/components';
import type { DashboardMetric } from '@/data';
import { formatNumberValue } from '@/i18n';
import { colors } from '@/theme';

export const dashboardMetricIcons: Record<string, AppSymbolName> = {
  active_deals: { android: 'local_fire_department', ios: 'flame' },
  deal_save: { android: 'bookmark', ios: 'bookmark' },
  deal_view: { android: 'sell', ios: 'tag' },
  directions: { android: 'near_me', ios: 'location' },
  directions_tap: { android: 'near_me', ios: 'location' },
  events: { android: 'calendar_month', ios: 'calendar' },
  mall_view: { android: 'visibility', ios: 'eye' },
  saves: { android: 'bookmark', ios: 'bookmark' },
  store_profiles: { android: 'storefront', ios: 'storefront' },
  store_view: { android: 'analytics', ios: 'chart.bar' },
};

export function DashboardHeader({
  eyebrow,
  onNotifications,
  subtitle,
  title,
}: {
  eyebrow: string;
  onNotifications: () => void;
  subtitle: string;
  title: string;
}) {
  return (
    <View className="flex-row items-start justify-between gap-lg">
      <View className="flex-1 gap-xs">
        <AppText className="tracking-widest" tone="accent" variant="eyebrow">
          {eyebrow}
        </AppText>
        <AppText variant="screenTitle">{title}</AppText>
        <AppText tone="secondary" variant="caption">{subtitle}</AppText>
      </View>
      <IconButton
        accessibilityLabel="Open business notifications"
        icon={(color) => (
          <AppSymbol
            name={{ android: 'notifications_none', ios: 'bell' }}
            size={21}
            tintColor={color}
          />
        )}
        onPress={onNotifications}
      />
    </View>
  );
}

export function MetricGrid({ metrics }: { metrics: readonly DashboardMetric[] }) {
  return (
    <View className="flex-row flex-wrap gap-sm">
      {metrics.map((metric) => (
        <Card className="min-w-[47%] flex-1 gap-sm" key={metric.id} padding="compact">
          <View className="h-9 w-9 items-center justify-center rounded-control bg-lime-surface-strong">
            <AppSymbol
              name={dashboardMetricIcons[metric.id] ?? { android: 'analytics', ios: 'chart.bar' }}
              size={18}
              tintColor={colors.lime}
            />
          </View>
          <AppText numeric variant="titleSmall">
            {formatNumberValue(metric.value, { notation: metric.value >= 10_000 ? 'compact' : 'standard' })}
          </AppText>
          <AppText tone="secondary" variant="caption">{metric.label}</AppText>
        </Card>
      ))}
    </View>
  );
}

export function DetailCard({ rows }: { rows: readonly { label: string; value: string }[] }) {
  return (
    <Card className="px-lg py-xs" padding="none">
      {rows.map(({ label, value }, index) => (
        <View
          className={`flex-row items-start justify-between gap-lg py-md ${index > 0 ? 'border-t border-border' : ''}`}
          key={label}
        >
          <AppText tone="secondary" variant="caption">{label}</AppText>
          <AppText className="max-w-[65%] text-right" selectable variant="subheadStrong">
            {value}
          </AppText>
        </View>
      ))}
    </Card>
  );
}

export function MiniBarChart({
  heights,
  label,
  value,
}: {
  heights: readonly number[];
  label: string;
  value: string;
}) {
  return (
    <Card className="gap-lg" variant="highlight">
      <View className="gap-xs">
        <AppText tone="accent" variant="eyebrow">PERFORMANCE</AppText>
        <AppText numeric variant="display">{value}</AppText>
        <AppText tone="secondary" variant="caption">{label}</AppText>
      </View>
      <View className="h-36 flex-row items-end gap-sm border-b border-lime-border px-xs">
        {heights.map((height, index) => (
          <View
            className="flex-1 rounded-t-sm bg-lime"
            key={`${height}-${index}`}
            style={{ height }}
          />
        ))}
      </View>
      <View className="flex-row justify-between">
        <AppText tone="tertiary" variant="micro">MON</AppText>
        <AppText tone="tertiary" variant="micro">TODAY</AppText>
      </View>
    </Card>
  );
}

export function DashboardSection({ children }: { children: ReactNode }) {
  return <View className="gap-md">{children}</View>;
}
