import { ScrollView, type ScrollViewProps } from 'react-native';

import { componentMetrics, spacing } from '@/theme';

export type ScreenProps = ScrollViewProps & {
  padded?: boolean;
  reserveBottomNavigation?: boolean;
};

export function Screen({
  children,
  className,
  contentContainerClassName,
  contentContainerStyle,
  contentInsetAdjustmentBehavior = 'automatic',
  padded = true,
  reserveBottomNavigation = true,
  showsVerticalScrollIndicator = false,
  ...props
}: ScreenProps) {
  return (
    <ScrollView
      className={`flex-1 bg-canvas ${className ?? ''}`}
      contentContainerClassName={`gap-xl pt-lg ${padded ? 'px-screen' : ''} ${contentContainerClassName ?? ''}`}
      contentContainerStyle={[
        {
          paddingBottom: reserveBottomNavigation
            ? componentMetrics.screenBottomClearance
            : spacing.xl,
        },
        contentContainerStyle,
      ]}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
