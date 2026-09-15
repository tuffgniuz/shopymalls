import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import {
  AppSymbol,
  AppText,
  Button,
  Card,
  IconButton,
  PressableCard,
  Screen,
  ShopperShell,
  TabList,
} from '@/components';
import {
  resolveImageSource,
  selectSavedDemoData,
  type ExploreDeal,
  type ExploreStore,
  type SavedMall,
} from '@/data';
import { formatDateValue, localize, useI18n } from '@/i18n';
import { colors } from '@/theme';

type SavedTab = 'deals' | 'stores' | 'malls';

function formatEndDate(value: string): string {
  return formatDateValue(value, {
    day: 'numeric',
    month: 'short',
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
  });
}

function pluralize(value: number, singular: string): string {
  return `${value} ${value === 1 ? singular : `${singular}s`}`;
}

function SavedHeader({ onSettings }: { onSettings: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-lg">
      <View className="gap-xs">
        <AppText className="tracking-widest" tone="accent" variant="eyebrow">
          SHOPYMALLS
        </AppText>
        <AppText variant="screenTitle">Saved</AppText>
      </View>
      <IconButton
        accessibilityLabel="Open Saved settings"
        icon={(color) => (
          <AppSymbol
            name={{ android: 'tune', ios: 'slider.horizontal.3' }}
            size={21}
            tintColor={color}
          />
        )}
        onPress={onSettings}
      />
    </View>
  );
}

function SavedDealRow({ item, onPress }: { item: ExploreDeal; onPress: () => void }) {
  const image = item.deal.image;

  return (
    <PressableCard
      accessibilityLabel={`Open saved deal from ${item.store.name}`}
      className="min-h-28 flex-row overflow-hidden"
      onPress={onPress}
      padding="none"
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ minHeight: 112, width: 106 }}
        />
      ) : null}
      <View className="flex-1 justify-center gap-xs px-md py-sm">
        <AppText numberOfLines={1} variant="subheadStrong">
          {item.store.name}
        </AppText>
        <AppText numberOfLines={1} tone="accent" variant="section">
          {localize(item.deal.discountLabel).toUpperCase()}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {item.mall.name}
        </AppText>
        <AppText numeric tone="tertiary" variant="caption">
          {`Ends ${formatEndDate(item.deal.endsAt)}`}
        </AppText>
      </View>
      <View className="items-center justify-center gap-md pr-md">
        <AppSymbol
          name={{ android: 'bookmark', ios: 'bookmark.fill' }}
          size={18}
          tintColor={colors.lime}
        />
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={17}
          tintColor={colors.textSecondary}
        />
      </View>
    </PressableCard>
  );
}

function SavedStoreRow({ item, onPress }: { item: ExploreStore; onPress: () => void }) {
  const image = item.store.coverImages[0];

  return (
    <PressableCard
      accessibilityLabel={`Open saved store ${item.store.name}`}
      className="min-h-24 flex-row overflow-hidden"
      onPress={onPress}
      padding="none"
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ minHeight: 96, width: 106 }}
        />
      ) : null}
      <View className="flex-1 justify-center gap-xs px-md py-sm">
        <AppText numberOfLines={1} variant="subheadStrong">
          {item.store.name}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {item.mall.name}
        </AppText>
        <AppText numberOfLines={1} tone="accent" variant="caption">
          Follow new deals and updates
        </AppText>
      </View>
      <View className="items-center justify-center gap-md pr-md">
        <AppSymbol
          name={{ android: 'bookmark', ios: 'bookmark.fill' }}
          size={18}
          tintColor={colors.lime}
        />
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={17}
          tintColor={colors.textSecondary}
        />
      </View>
    </PressableCard>
  );
}

function SavedMallRow({ item, onPress }: { item: SavedMall; onPress: () => void }) {
  const image = item.mall.coverImages[0];

  return (
    <PressableCard
      accessibilityLabel={`Open saved mall ${item.mall.name}`}
      className="min-h-28 flex-row overflow-hidden"
      onPress={onPress}
      padding="none"
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ minHeight: 112, width: 106 }}
        />
      ) : null}
      <View className="flex-1 justify-center gap-xs px-md py-sm">
        <AppText numberOfLines={1} variant="subheadStrong">
          {item.mall.name}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {item.mall.address.city}
        </AppText>
        <AppText numberOfLines={1} tone="accent" variant="caption">
          {`${pluralize(item.activeStoreCount, 'store')} · ${pluralize(item.activeDealCount, 'deal')}`}
        </AppText>
        <AppText numberOfLines={1} tone="tertiary" variant="caption">
          Deals, events, and store updates
        </AppText>
      </View>
      <View className="items-center justify-center gap-md pr-md">
        <AppSymbol
          name={{ android: 'bookmark', ios: 'bookmark.fill' }}
          size={18}
          tintColor={colors.lime}
        />
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={17}
          tintColor={colors.textSecondary}
        />
      </View>
    </PressableCard>
  );
}

function SavedSummary({ counts }: { counts: Record<SavedTab, number> }) {
  const items = [
    { label: 'Deals', value: counts.deals },
    { label: 'Stores', value: counts.stores },
    { label: 'Malls', value: counts.malls },
  ] as const;

  return (
    <Card className="gap-lg" variant="raised">
      <AppText variant="section">Your saved places</AppText>
      <View className="flex-row">
        {items.map((item, index) => (
          <View
            className={`flex-1 items-center gap-xs ${index > 0 ? 'border-l border-border' : ''}`}
            key={item.label}
          >
            <AppText numeric tone="accent" variant="title">
              {item.value}
            </AppText>
            <AppText tone="secondary" variant="caption">
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

export function SavedScreen() {
  const router = useRouter();
  useI18n();
  const data = useMemo(() => selectSavedDemoData(), []);
  const [activeTab, setActiveTab] = useState<SavedTab>('deals');
  const counts = {
    deals: data.deals.length,
    stores: data.stores.length,
    malls: data.malls.length,
  };
  const tabs = [
    { label: `Deals ${counts.deals}`, value: 'deals' },
    { label: `Stores ${counts.stores}`, value: 'stores' },
    { label: `Malls ${counts.malls}`, value: 'malls' },
  ] as const;
  const section = {
    deals: { helper: 'Tap a saved deal to see its full offer.', title: 'My deals' },
    stores: { helper: 'Tap a saved store to see its profile and current deals.', title: 'My stores' },
    malls: { helper: 'Tap a saved mall to explore its stores, deals, and events.', title: 'My malls' },
  }[activeTab];
  const openSettings = () => {
    router.push({ pathname: '/preview', params: { kind: 'notifications', title: 'Notification settings' } });
  };

  return (
    <ShopperShell activeTab="saved">
      <Screen contentContainerClassName="gap-xl">
        <SavedHeader onSettings={openSettings} />

        <AppText tone="secondary" variant="subhead">
          Keep deals, stores, and malls you want to revisit in one place.
        </AppText>

        <TabList fill items={tabs} onValueChange={setActiveTab} value={activeTab} variant="pill" />

        <View className="gap-md">
          <View className="flex-row items-center justify-between gap-md">
            <AppText variant="section">{section.title}</AppText>
            <AppText numeric tone="secondary" variant="label">
              {`${counts[activeTab]} saved`}
            </AppText>
          </View>

          {activeTab === 'deals' ? (
            <View className="gap-sm">
              {data.deals.map((item) => (
                <SavedDealRow
                  item={item}
                  key={item.deal.id}
                  onPress={() => router.push({ pathname: '/deals/[id]', params: { id: item.deal.id } })}
                />
              ))}
            </View>
          ) : null}

          {activeTab === 'stores' ? (
            <View className="gap-sm">
              {data.stores.map((item) => (
                <SavedStoreRow
                  item={item}
                  key={item.store.id}
                  onPress={() => router.push({ pathname: '/stores/[id]', params: { id: item.store.id } })}
                />
              ))}
            </View>
          ) : null}

          {activeTab === 'malls' ? (
            <View className="gap-sm">
              {data.malls.map((item) => (
                <SavedMallRow
                  item={item}
                  key={item.mall.id}
                  onPress={() => router.push({ pathname: '/malls/[id]', params: { id: item.mall.id } })}
                />
              ))}
            </View>
          ) : null}

          <View className="flex-row items-center justify-center gap-sm py-xs">
            <AppSymbol
              name={{ android: 'touch_app', ios: 'hand.tap' }}
              size={15}
              tintColor={colors.textTertiary}
            />
            <AppText className="flex-1" tone="tertiary" variant="caption">
              {section.helper}
            </AppText>
          </View>
        </View>

        <Card className="flex-row items-center gap-md" variant="highlight">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-lime-surface-strong">
            <AppSymbol
              name={{ android: 'notifications', ios: 'bell.fill' }}
              size={21}
              tintColor={colors.lime}
            />
          </View>
          <View className="flex-1 gap-xs">
            <AppText variant="subheadStrong">Stay in the loop</AppText>
            <AppText tone="secondary" variant="caption">
              Get timely updates from places and offers you save.
            </AppText>
          </View>
          <Button label="Manage alerts" onPress={openSettings} size="compact" variant="secondary" />
        </Card>

        <SavedSummary counts={counts} />
      </Screen>
    </ShopperShell>
  );
}
