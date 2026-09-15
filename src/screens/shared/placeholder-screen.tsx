import type { AppSymbolName, ShopperTab } from '@/components';
import {
  AppSymbol,
  AppText,
  Card,
  Screen,
  ShopperShell,
} from '@/components';
import { colors } from '@/theme';

export interface PlaceholderScreenProps {
  activeTab: ShopperTab;
  body: string;
  icon: AppSymbolName;
  title: string;
}

export function PlaceholderScreen({
  activeTab,
  body,
  icon,
  title,
}: PlaceholderScreenProps) {
  return (
    <ShopperShell activeTab={activeTab}>
      <Screen contentContainerClassName="min-h-full justify-center">
        <Card className="items-center gap-lg py-3xl" variant="highlight">
          <AppSymbol name={icon} size={34} tintColor={colors.lime} />
          <AppText className="text-center" variant="titleSmall">
            {title}
          </AppText>
          <AppText className="max-w-72 text-center" tone="secondary" variant="body">
            {body}
          </AppText>
        </Card>
      </Screen>
    </ShopperShell>
  );
}
