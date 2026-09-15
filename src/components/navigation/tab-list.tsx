import { Pressable, ScrollView, type ScrollViewProps } from 'react-native';

import { componentMetrics } from '@/theme';
import { AppText, type AppTextTone } from '@/components/data-display';
import { translateUiText, useI18n } from '@/i18n';

export type TabTone = 'accent' | 'booking';
export type TabVariant = 'underline' | 'pill';

export type TabItem<Value extends string> = {
  accessibilityLabel?: string;
  label: string;
  value: Value;
};

export type TabListProps<Value extends string> = Omit<
  ScrollViewProps,
  'children' | 'horizontal'
> & {
  fill?: boolean;
  items: readonly TabItem<Value>[];
  onValueChange: (value: Value) => void;
  tone?: TabTone;
  value: Value;
  variant?: TabVariant;
};

const activeTones: Record<
  TabTone,
  { borderClassName: string; textTone: AppTextTone }
> = {
  accent: {
    borderClassName: 'border-lime',
    textTone: 'accent',
  },
  booking: {
    borderClassName: 'border-booking',
    textTone: 'booking',
  },
};

const pillTones: Record<
  TabTone,
  { className: string; textTone: AppTextTone }
> = {
  accent: {
    className: 'border-lime bg-lime',
    textTone: 'onAccent',
  },
  booking: {
    className: 'border-booking-strong bg-booking-strong',
    textTone: 'onBooking',
  },
};

export function TabList<Value extends string>({
  className,
  contentContainerClassName,
  fill = false,
  items,
  onValueChange,
  showsHorizontalScrollIndicator = false,
  tone = 'accent',
  value,
  variant = 'underline',
  ...props
}: TabListProps<Value>) {
  const { language } = useI18n();
  const activeTone = activeTones[tone];
  const pillTone = pillTones[tone];

  return (
    <ScrollView
      className={className}
      contentContainerClassName={`flex-row ${variant === 'pill' ? 'gap-sm' : 'border-b border-border'} ${fill ? 'grow' : ''} ${contentContainerClassName ?? ''}`}
      horizontal
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      {...props}
    >
      {items.map((item) => {
        const selected = item.value === value;

        return (
          <Pressable
            accessibilityLabel={translateUiText(
              item.accessibilityLabel ?? item.label,
              language,
            )}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={`items-center justify-center px-md active:opacity-[0.78] ${fill ? 'flex-1' : ''} ${
              variant === 'pill'
                ? `rounded-full border ${selected ? pillTone.className : 'border-border bg-surface'}`
                : `border-b-2 ${selected ? activeTone.borderClassName : 'border-transparent'}`
            }`}
            key={item.value}
            onPress={() => onValueChange(item.value)}
            style={{
              minHeight:
                variant === 'pill'
                  ? componentMetrics.chipHeight
                  : componentMetrics.iconButtonSize,
            }}
          >
            <AppText
              tone={
                selected
                  ? variant === 'pill'
                    ? pillTone.textTone
                    : activeTone.textTone
                  : 'secondary'
              }
              variant="subheadStrong"
            >
              {item.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
