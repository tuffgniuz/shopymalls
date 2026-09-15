import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { AppText } from '@/components/data-display';

export type EmptyStateProps = Omit<ViewProps, 'children'> & {
  action?: ReactNode;
  description: string;
  graphic?: ReactNode;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  graphic,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <View
      className={`items-center gap-md px-xl py-3xl ${className ?? ''}`}
      {...props}
    >
      {graphic}
      <View className="items-center gap-xs">
        <AppText className="text-center" variant="titleSmall">
          {title}
        </AppText>
        <AppText className="text-center" tone="secondary" variant="body">
          {description}
        </AppText>
      </View>
      {action}
    </View>
  );
}
