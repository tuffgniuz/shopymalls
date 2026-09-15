import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import {
  AppSymbol,
  AppText,
  Button,
  Card,
  Chip,
  IconButton,
  ListRow,
  PressableCard,
  Screen,
  SectionHeader,
  ShopperShell,
  TabList,
  type TabItem,
} from '@/components';
import {
  resolveImageSource,
  selectMallProfileDemoData,
  type ExploreDeal,
  type MallProfileDemoData,
} from '@/data';
import { formatDateValue, formatNumberValue, localize, useI18n } from '@/i18n';
import type { MallEvent, Store } from '@/models';
import { colors, imageOverlays, spacing } from '@/theme';

type MallProfileTab = 'overview' | 'stores' | 'deals' | 'events' | 'map';

const profileTabs: readonly TabItem<MallProfileTab>[] = [
  { label: 'Overview', value: 'overview' },
  { label: 'Stores', value: 'stores' },
  { label: 'Deals', value: 'deals' },
  { label: 'Events', value: 'events' },
  { label: 'Map', value: 'map' },
];

function formatDateRange(startsAt: string, endsAt: string): string {
  const starts = new Date(startsAt);
  const ends = new Date(endsAt);
  const startMonth = formatDateValue(starts, { month: 'short' });
  const endMonth = formatDateValue(ends, { month: 'short' });

  if (startMonth === endMonth) {
    return `${starts.getDate()}–${ends.getDate()} ${endMonth}`;
  }
  return `${formatDateValue(starts, { day: 'numeric', month: 'short' })}–${formatDateValue(ends, { day: 'numeric', month: 'short' })}`;
}

function storeLocation(store: Store, data: MallProfileDemoData): string {
  const floor = data.floors.find(({ id }) => id === store.floorId);
  const level = floor ? localize(floor.name) : store.levelText;
  return [level, store.unitNumber ? `Unit ${store.unitNumber}` : undefined]
    .filter(Boolean)
    .join(' · ');
}

function ProfileHeader({
  isSaved,
  onBack,
  onSave,
}: {
  isSaved: boolean;
  onBack: () => void;
  onSave: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between gap-lg">
      <IconButton
        accessibilityLabel="Back to Explore"
        icon={(color) => (
          <AppSymbol
            name={{ android: 'arrow_back', ios: 'chevron.left' }}
            size={21}
            tintColor={color}
          />
        )}
        onPress={onBack}
      />
      <AppText className="flex-1 text-center" variant="section">
        Mall Profile
      </AppText>
      <IconButton
        accessibilityLabel={isSaved ? 'Remove mall from Saved' : 'Save mall'}
        accessibilityState={{ selected: isSaved }}
        icon={(color) => (
          <AppSymbol
            name={{
              android: 'bookmark',
              ios: isSaved ? 'bookmark.fill' : 'bookmark',
            }}
            size={21}
            tintColor={color}
          />
        )}
        onPress={onSave}
        variant={isSaved ? 'accent' : 'neutral'}
      />
    </View>
  );
}

function MallHero({ data }: { data: MallProfileDemoData }) {
  const image = data.mall.coverImages[0];
  const location = [data.mall.address.district, data.mall.address.city]
    .filter(Boolean)
    .join(' · ');

  return (
    <Card className="h-64 overflow-hidden rounded-feature" padding="none">
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.soft }} />
      {data.mall.isFeatured ? (
        <View className="absolute left-md top-md rounded-control bg-lime px-md py-sm">
          <AppText tone="onAccent" variant="micro">
            FEATURED MALL
          </AppText>
        </View>
      ) : null}
      <View
        className="absolute inset-x-0 bottom-0 gap-xs p-lg"
        style={{ backgroundColor: imageOverlays.bottom }}
      >
        <AppText numberOfLines={1} variant="heroTitle">
          {data.mall.name}
        </AppText>
        <View className="flex-row items-center gap-xs">
          <AppSymbol
            name={{ android: 'location_on', ios: 'location.fill' }}
            size={14}
            tintColor={colors.lime}
          />
          <AppText numberOfLines={1} tone="secondary" variant="subhead">
            {location}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

function MallStats({ data }: { data: MallProfileDemoData }) {
  const stats = [
    { label: 'Stores', value: String(data.stores.length) },
    { label: 'Deals', value: String(data.deals.length) },
    { label: 'Events', value: String(data.events.length) },
    {
      label: 'Rating',
      value: data.mall.rating ? formatNumberValue(data.mall.rating.average) : '—',
    },
  ];

  return (
    <Card className="flex-row items-stretch py-lg" padding="none">
      {stats.map((stat, index) => (
        <View className="flex-1 flex-row items-stretch" key={stat.label}>
          <View className="flex-1 items-center gap-xs">
            <AppText numeric variant="titleSmall">
              {stat.value}
            </AppText>
            <AppText tone="secondary" variant="caption">
              {stat.label}
            </AppText>
          </View>
          {index < stats.length - 1 ? <View className="w-px bg-border" /> : null}
        </View>
      ))}
    </Card>
  );
}

function DealRow({
  data,
  item,
  onPress,
}: {
  data: MallProfileDemoData;
  item: ExploreDeal;
  onPress: () => void;
}) {
  const image = item.deal.image;

  return (
    <ListRow
      accessibilityLabel={`${item.store.name}, ${localize(item.deal.discountLabel)}`}
      className="overflow-hidden p-sm"
      leading={
        image ? (
          <Image
            accessibilityLabel={localize(image.alt)}
            contentFit="cover"
            source={resolveImageSource(image.url)}
            style={{ borderRadius: 12, height: 78, width: 78 }}
          />
        ) : undefined
      }
      onPress={onPress}
      trailing={
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={18}
          tintColor={colors.textPrimary}
        />
      }
    >
      <View className="flex-1 gap-xs">
        <AppText numberOfLines={1} variant="subheadStrong">
          {item.store.name}
        </AppText>
        <AppText numberOfLines={1} tone="accent" variant="section">
          {localize(item.deal.discountLabel)}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {storeLocation(item.store, data)}
        </AppText>
      </View>
    </ListRow>
  );
}

function StoreTile({
  data,
  onPress,
  store,
  width,
}: {
  data: MallProfileDemoData;
  onPress: () => void;
  store: Store;
  width: number;
}) {
  const image = store.coverImages[0];

  return (
    <PressableCard
      accessibilityLabel={`${store.name}, ${storeLocation(store, data)}`}
      className="h-20 flex-row items-center gap-sm overflow-hidden"
      onPress={onPress}
      padding="compact"
      style={{ width }}
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ borderRadius: 8, height: 52, width: 52 }}
        />
      ) : null}
      <View className="flex-1 gap-xs">
        <AppText numberOfLines={2} variant="caption">
          {store.name}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="micro">
          {storeLocation(store, data)}
        </AppText>
      </View>
      <AppSymbol
        name={{ android: 'chevron_right', ios: 'chevron.right' }}
        size={14}
        tintColor={colors.textSecondary}
      />
    </PressableCard>
  );
}

function EventCard({ event, onPress }: { event: MallEvent; onPress: () => void }) {
  const image = event.image;

  return (
    <PressableCard
      accessibilityLabel={localize(event.title)}
      className="h-40 overflow-hidden rounded-feature"
      onPress={onPress}
      padding="none"
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.soft }} />
      <View
        className="absolute inset-x-0 bottom-0 flex-row items-end gap-md p-lg"
        style={{ backgroundColor: imageOverlays.bottom }}
      >
        <View className="flex-1 gap-xs">
          <AppText numberOfLines={1} variant="section">
            {localize(event.title)}
          </AppText>
          <AppText numberOfLines={1} tone="secondary" variant="caption">
            {`${formatDateRange(event.startsAt, event.endsAt)} · ${localize(event.locationText)}`}
          </AppText>
        </View>
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={18}
          tintColor={colors.textPrimary}
        />
      </View>
    </PressableCard>
  );
}

function EmptySection({ label }: { label: string }) {
  return (
    <Card className="items-center gap-sm py-xl" variant="highlight">
      <AppSymbol
        name={{ android: 'info', ios: 'info.circle' }}
        size={25}
        tintColor={colors.lime}
      />
      <AppText variant="subheadStrong">No {label} available</AppText>
    </Card>
  );
}

function StoreGrid({
  data,
  onStorePress,
  stores,
}: {
  data: MallProfileDemoData;
  onStorePress: (store: Store) => void;
  stores: readonly Store[];
}) {
  const { width } = useWindowDimensions();
  const tileWidth = (width - spacing.screen * 2 - spacing.md) / 2;

  return (
    <View className="flex-row flex-wrap gap-md">
      {stores.map((store) => (
        <StoreTile
          data={data}
          key={store.id}
          onPress={() => onStorePress(store)}
          store={store}
          width={tileWidth}
        />
      ))}
    </View>
  );
}

function MallMap({
  data,
  onDirectionsPress,
}: {
  data: MallProfileDemoData;
  onDirectionsPress: () => void;
}) {
  const initialFloor = data.floors.find(({ mapImageUrl }) => mapImageUrl) ?? data.floors[0];
  const [selectedFloorId, setSelectedFloorId] = useState(initialFloor?.id);
  const selectedFloor =
    data.floors.find(({ id }) => id === selectedFloorId) ?? initialFloor;

  return (
    <View className="gap-md">
      <SectionHeader
        icon={(
          <AppSymbol
            name={{ android: 'map', ios: 'map' }}
            size={20}
            tintColor={colors.lime}
          />
        )}
        title="Mall map"
      />
      <ScrollView
        contentContainerStyle={{ gap: spacing.sm, paddingRight: spacing.screen }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {data.floors.map((floor) => (
          <Chip
            key={floor.id}
            label={localize(floor.name)}
            onPress={() => setSelectedFloorId(floor.id)}
            selected={floor.id === selectedFloor?.id}
          />
        ))}
      </ScrollView>
      {selectedFloor?.mapImageUrl ? (
        <Card className="h-72 overflow-hidden rounded-feature" padding="none">
          <Image
            accessibilityLabel={`${localize(selectedFloor.name)} map`}
            contentFit="contain"
            source={resolveImageSource(selectedFloor.mapImageUrl)}
            style={StyleSheet.absoluteFill}
          />
        </Card>
      ) : (
        <Card className="h-56 items-center justify-center gap-md" variant="highlight">
          <AppSymbol
            name={{ android: 'map', ios: 'map' }}
            size={32}
            tintColor={colors.lime}
          />
          <AppText tone="secondary" variant="caption">
            Map preview is not available for this floor.
          </AppText>
        </Card>
      )}
      <Button
        label="Get directions"
        leading={(color) => (
          <AppSymbol
            name={{ android: 'navigation', ios: 'location.north.fill' }}
            size={17}
            tintColor={color}
          />
        )}
        onPress={onDirectionsPress}
      />
    </View>
  );
}

export interface MallProfileScreenProps {
  mallId: string;
}

export function MallProfileScreen({ mallId }: MallProfileScreenProps) {
  const router = useRouter();
  useI18n();
  const data = useMemo(() => selectMallProfileDemoData(mallId), [mallId]);
  const [activeTab, setActiveTab] = useState<MallProfileTab>('overview');
  const [isSaved, setIsSaved] = useState(data?.isSaved ?? false);

  if (!data) {
    return (
      <ShopperShell activeTab="explore">
        <Screen contentContainerClassName="min-h-full justify-center">
          <Card className="items-center gap-lg py-3xl" variant="highlight">
            <AppSymbol
              name={{ android: 'apartment', ios: 'building.2' }}
              size={34}
              tintColor={colors.lime}
            />
            <AppText variant="titleSmall">Mall not found</AppText>
            <Button label="Back to Explore" onPress={() => router.replace('/explore')} />
          </Card>
        </Screen>
      </ShopperShell>
    );
  }

  const openPreview = (kind: string, id: string, title: string) => {
    router.push({ pathname: '/preview', params: { id, kind, title } });
  };
  const openDirections = () =>
    openPreview('directions', data.mall.id, `Directions to ${data.mall.name}`);
  const openStore = (store: Store) => {
    router.push({ pathname: '/stores/[id]', params: { id: store.id } });
  };
  const openDeal = (id: string) => {
    router.push({ pathname: '/deals/[id]', params: { id } });
  };

  return (
    <ShopperShell activeTab="explore">
      <Screen contentContainerClassName="gap-lg">
        <ProfileHeader
          isSaved={isSaved}
          onBack={() => router.back()}
          onSave={() => setIsSaved((current) => !current)}
        />
        <MallHero data={data} />
        <MallStats data={data} />

        <View className="flex-row gap-sm">
          <Button
            accessibilityState={{ selected: isSaved }}
            className="flex-1"
            label={isSaved ? 'Following' : 'Follow mall'}
            leading={(color) => (
              <AppSymbol
                name={{
                  android: 'bookmark',
                  ios: isSaved ? 'bookmark.fill' : 'bookmark',
                }}
                size={17}
                tintColor={color}
              />
            )}
            onPress={() => setIsSaved((current) => !current)}
          />
          <Button
            className="flex-1"
            label="Directions"
            leading={(color) => (
              <AppSymbol
                name={{ android: 'navigation', ios: 'location.north.fill' }}
                size={17}
                tintColor={color}
              />
            )}
            onPress={openDirections}
            variant="secondary"
          />
        </View>

        <TabList
          items={profileTabs}
          onValueChange={setActiveTab}
          value={activeTab}
          variant="pill"
        />

        {activeTab === 'overview' ? (
          <View className="gap-xl">
            <View className="gap-md">
              <SectionHeader
                actionLabel="See all"
                icon={(
                  <AppSymbol
                    name={{ android: 'local_fire_department', ios: 'flame.fill' }}
                    size={20}
                    tintColor={colors.lime}
                  />
                )}
                onActionPress={() => setActiveTab('deals')}
                title="Today’s deals"
              />
              {data.deals.slice(0, 2).map((item) => (
                <DealRow
                  data={data}
                  item={item}
                  key={item.deal.id}
                  onPress={() => openDeal(item.deal.id)}
                />
              ))}
            </View>

            <View className="gap-md">
              <SectionHeader
                actionLabel="See all"
                icon={(
                  <AppSymbol
                    name={{ android: 'storefront', ios: 'storefront' }}
                    size={20}
                    tintColor={colors.lime}
                  />
                )}
                onActionPress={() => setActiveTab('stores')}
                title="Popular stores"
              />
              <StoreGrid data={data} onStorePress={openStore} stores={data.stores.slice(0, 4)} />
            </View>

            <View className="gap-md">
              <SectionHeader
                actionLabel="See all"
                icon={(
                  <AppSymbol
                    name={{ android: 'calendar_month', ios: 'calendar' }}
                    size={20}
                    tintColor={colors.lime}
                  />
                )}
                onActionPress={() => setActiveTab('events')}
                title="What’s happening"
              />
              {data.events[0] ? (
                <EventCard
                  event={data.events[0]}
                  onPress={() =>
                    openPreview(
                      'event',
                      data.events[0].id,
                      localize(data.events[0].title),
                    )
                  }
                />
              ) : (
                <EmptySection label="events" />
              )}
            </View>

            <View className="gap-md">
              <SectionHeader
                icon={(
                  <AppSymbol
                    name={{ android: 'verified', ios: 'checkmark.seal' }}
                    size={20}
                    tintColor={colors.lime}
                  />
                )}
                title="Facilities"
              />
              <View className="flex-row flex-wrap gap-sm">
                {data.mall.facilities.map((facility) => (
                  <Chip
                    key={facility.id}
                    label={localize(facility.label)}
                    leading={(color) => (
                      <AppSymbol
                        name={{ android: 'check_circle', ios: 'checkmark.circle.fill' }}
                        size={14}
                        tintColor={color}
                      />
                    )}
                  />
                ))}
              </View>
            </View>
          </View>
        ) : null}

        {activeTab === 'stores' ? (
          <View className="gap-md">
            <SectionHeader
              icon={(
                <AppSymbol
                  name={{ android: 'storefront', ios: 'storefront' }}
                  size={20}
                  tintColor={colors.lime}
                />
              )}
              title="Store directory"
            />
            {data.stores.length > 0 ? (
              <StoreGrid data={data} onStorePress={openStore} stores={data.stores} />
            ) : (
              <EmptySection label="stores" />
            )}
          </View>
        ) : null}

        {activeTab === 'deals' ? (
          <View className="gap-md">
            <SectionHeader
              icon={(
                <AppSymbol
                  name={{ android: 'local_fire_department', ios: 'flame.fill' }}
                  size={20}
                  tintColor={colors.lime}
                />
              )}
              title="Active deals"
            />
            {data.deals.length > 0 ? (
              data.deals.map((item) => (
                <DealRow
                  data={data}
                  item={item}
                  key={item.deal.id}
                  onPress={() => openDeal(item.deal.id)}
                />
              ))
            ) : (
              <EmptySection label="deals" />
            )}
          </View>
        ) : null}

        {activeTab === 'events' ? (
          <View className="gap-md">
            <SectionHeader
              icon={(
                <AppSymbol
                  name={{ android: 'calendar_month', ios: 'calendar' }}
                  size={20}
                  tintColor={colors.lime}
                />
              )}
              title="Upcoming events"
            />
            {data.events.length > 0 ? (
              data.events.map((event) => (
                <EventCard
                  event={event}
                  key={event.id}
                  onPress={() =>
                    openPreview('event', event.id, localize(event.title))
                  }
                />
              ))
            ) : (
              <EmptySection label="events" />
            )}
          </View>
        ) : null}

        {activeTab === 'map' ? (
          <MallMap data={data} onDirectionsPress={openDirections} />
        ) : null}
      </Screen>
    </ShopperShell>
  );
}
