import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Keyboard, View, useWindowDimensions } from 'react-native';

import {
  AppSymbol,
  AppText,
  Card,
  Chip,
  IconButton,
  PressableCard,
  Screen,
  SectionHeader,
  ShopperShell,
  TextField,
} from '@/components';
import {
  resolveImageSource,
  selectExploreDemoData,
  type ExploreDeal,
  type ExploreEvent,
  type ExploreStore,
  type NearbyMall,
} from '@/data';
import { formatDateValue, formatNumberValue, localize, useI18n } from '@/i18n';
import type { Category } from '@/models';
import { colors, spacing } from '@/theme';

type ExploreFilter = 'malls' | 'stores' | 'deals' | 'events';

const filters: readonly { label: string; value: ExploreFilter }[] = [
  { label: 'Malls', value: 'malls' },
  { label: 'Stores', value: 'stores' },
  { label: 'Deals', value: 'deals' },
  { label: 'Events', value: 'events' },
];

const categorySymbols = {
  beauty: { android: 'spa', ios: 'sparkles' },
  dining: { android: 'restaurant', ios: 'fork.knife' },
  electronics: { android: 'devices', ios: 'laptopcomputer' },
  entertainment: { android: 'confirmation_number', ios: 'ticket' },
  fashion: { android: 'checkroom', ios: 'tshirt' },
  fitness: { android: 'fitness_center', ios: 'dumbbell' },
  lifestyle: { android: 'home', ios: 'house' },
  services: { android: 'content_cut', ios: 'scissors' },
} as const;

function parseFilter(section?: string): ExploreFilter {
  return filters.some(({ value }) => value === section)
    ? (section as ExploreFilter)
    : 'malls';
}

function pluralize(value: number, singular: string): string {
  return `${value} ${value === 1 ? singular : `${singular}s`}`;
}

function includesQuery(query: string, values: readonly (string | undefined)[]) {
  if (!query) return true;
  return values.some((value) => value?.toLocaleLowerCase().includes(query));
}

function ExploreHeader({ onReset }: { onReset: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-lg">
      <View className="gap-xs">
        <AppText className="tracking-widest" tone="accent" variant="eyebrow">
          SHOPYMALLS
        </AppText>
        <AppText variant="screenTitle">Explore</AppText>
      </View>
      <IconButton
        accessibilityLabel="Reset Explore filters"
        icon={(color) => (
          <AppSymbol
            name={{ android: 'tune', ios: 'slider.horizontal.3' }}
            size={21}
            tintColor={color}
          />
        )}
        onPress={onReset}
      />
    </View>
  );
}

function MallGridCard({
  item,
  onPress,
  width,
}: {
  item: NearbyMall;
  onPress: () => void;
  width: number;
}) {
  const image = item.mall.coverImages[0];

  return (
    <PressableCard
      accessibilityLabel={`${item.mall.name}, ${item.mall.address.city}`}
      className="overflow-hidden rounded-feature"
      onPress={onPress}
      padding="none"
      style={{ height: 190, width }}
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ height: 108, width: '100%' }}
        />
      ) : null}
      <View className="flex-1 gap-xs p-md">
        <AppText numberOfLines={1} variant="subheadStrong">
          {item.mall.name}
        </AppText>
        <View className="flex-row items-center gap-xs">
          <AppSymbol
            name={{ android: 'location_on', ios: 'location.fill' }}
            size={12}
            tintColor={colors.textSecondary}
          />
          <AppText numberOfLines={1} tone="secondary" variant="caption">
            {item.mall.address.city}
          </AppText>
        </View>
        <AppText numberOfLines={1} tone="accent" variant="caption">
          {`${pluralize(item.activeStoreCount, 'store')} · ${pluralize(item.activeDealCount, 'deal')}`}
        </AppText>
      </View>
    </PressableCard>
  );
}

function CategoryCard({
  category,
  onPress,
  selected,
  width,
}: {
  category: Category;
  onPress: () => void;
  selected: boolean;
  width: number;
}) {
  const symbol = categorySymbols[
    category.slug as keyof typeof categorySymbols
  ] ?? { android: 'category' as const, ios: 'square.grid.2x2' as const };

  return (
    <PressableCard
      accessibilityLabel={`${localize(category.name)} category`}
      accessibilityState={{ selected }}
      className="items-center justify-center gap-sm rounded-feature"
      onPress={onPress}
      padding="compact"
      style={{ height: 82, width }}
      variant={selected ? 'highlight' : 'default'}
    >
      <AppSymbol
        name={symbol}
        size={24}
        tintColor={selected ? colors.lime : colors.textPrimary}
      />
      <AppText numberOfLines={1} tone={selected ? 'accent' : 'primary'} variant="caption">
        {localize(category.name)}
      </AppText>
    </PressableCard>
  );
}

function DealRow({ item, onPress }: { item: ExploreDeal; onPress: () => void }) {
  const image = item.deal.image;

  return (
    <PressableCard
      accessibilityLabel={`${item.store.name}, ${localize(item.deal.discountLabel)}`}
      className="h-24 flex-row overflow-hidden"
      onPress={onPress}
      padding="none"
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ height: '100%', width: 118 }}
        />
      ) : null}
      <View className="flex-1 justify-center gap-xs px-md">
        <AppText numberOfLines={1} variant="subheadStrong">
          {item.store.name}
        </AppText>
        <AppText numberOfLines={1} tone="accent" variant="section">
          {localize(item.deal.discountLabel)}
        </AppText>
        <View className="flex-row items-center gap-xs">
          <AppSymbol
            name={{ android: 'location_on', ios: 'location.fill' }}
            size={12}
            tintColor={colors.textSecondary}
          />
          <AppText numberOfLines={1} tone="secondary" variant="caption">
            {item.mall.name}
          </AppText>
        </View>
      </View>
      <View className="justify-center pr-md">
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={18}
          tintColor={colors.textPrimary}
        />
      </View>
    </PressableCard>
  );
}

function StoreRow({ item, onPress }: { item: ExploreStore; onPress: () => void }) {
  const image = item.store.coverImages[0];

  return (
    <PressableCard
      accessibilityLabel={`${item.store.name} at ${item.mall.name}`}
      className="h-24 flex-row overflow-hidden"
      onPress={onPress}
      padding="none"
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ height: '100%', width: 104 }}
        />
      ) : null}
      <View className="flex-1 justify-center gap-xs px-md">
        <AppText numberOfLines={1} variant="subheadStrong">
          {item.store.name}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {item.mall.name}
        </AppText>
        {item.store.rating ? (
          <View className="flex-row items-center gap-xs">
            <AppSymbol
              name={{ android: 'star', ios: 'star.fill' }}
              size={12}
              tintColor={colors.lime}
            />
            <AppText numeric tone="accent" variant="caption">
              {formatNumberValue(item.store.rating.average)}
            </AppText>
          </View>
        ) : null}
      </View>
      <View className="justify-center pr-md">
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={18}
          tintColor={colors.textPrimary}
        />
      </View>
    </PressableCard>
  );
}

function EventRow({ item, onPress }: { item: ExploreEvent; onPress: () => void }) {
  const image = item.event.image;

  return (
    <PressableCard
      accessibilityLabel={`${localize(item.event.title)} at ${item.mall.name}`}
      className="h-28 flex-row overflow-hidden"
      onPress={onPress}
      padding="none"
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ height: '100%', width: 118 }}
        />
      ) : null}
      <View className="flex-1 justify-center gap-xs px-md">
        <AppText numberOfLines={2} variant="subheadStrong">
          {localize(item.event.title)}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {item.mall.name}
        </AppText>
        <AppText numeric tone="accent" variant="caption">
          {formatDateValue(item.event.startsAt, { day: 'numeric', month: 'short' })}
        </AppText>
      </View>
      <View className="justify-center pr-md">
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={18}
          tintColor={colors.textPrimary}
        />
      </View>
    </PressableCard>
  );
}

function EmptyResults() {
  return (
    <Card className="items-center gap-sm py-xl" variant="highlight">
      <AppSymbol
        name={{ android: 'search_off', ios: 'magnifyingglass' }}
        size={28}
        tintColor={colors.lime}
      />
      <AppText variant="subheadStrong">No matches found</AppText>
      <AppText className="text-center" tone="secondary" variant="caption">
        Try another search or clear the selected category.
      </AppText>
    </Card>
  );
}

const mapLines = [
  { left: '-8%', top: '23%', width: '118%', rotate: '-11deg' },
  { left: '-10%', top: '50%', width: '120%', rotate: '8deg' },
  { left: '2%', top: '72%', width: '105%', rotate: '-18deg' },
  { left: '18%', top: '-6%', width: '92%', rotate: '72deg' },
  { left: '50%', top: '-10%', width: '100%', rotate: '98deg' },
] as const;

function MapPreview({ onPress }: { onPress: () => void }) {
  return (
    <PressableCard
      accessibilityLabel="Open nearby mall preview"
      className="h-64 overflow-hidden rounded-feature"
      onPress={onPress}
      padding="none"
    >
      <View className="absolute inset-0 bg-surface-raised">
        {mapLines.map((line, index) => (
          <View
            className="absolute h-1 rounded-full bg-border"
            key={index}
            style={{
              left: line.left,
              top: line.top,
              transform: [{ rotate: line.rotate }],
              width: line.width,
            }}
          />
        ))}
        <View className="absolute left-[24%] top-[45%]">
          <AppSymbol
            name={{ android: 'location_on', ios: 'mappin.circle.fill' }}
            size={28}
            tintColor={colors.lime}
          />
        </View>
        <View className="absolute left-[54%] top-[64%]">
          <AppSymbol
            name={{ android: 'location_on', ios: 'mappin.circle.fill' }}
            size={28}
            tintColor={colors.lime}
          />
        </View>
        <View className="absolute right-[13%] top-[30%]">
          <AppSymbol
            name={{ android: 'location_on', ios: 'mappin.circle.fill' }}
            size={28}
            tintColor={colors.lime}
          />
        </View>
      </View>
      <View className="absolute inset-x-0 top-0 gap-xs bg-canvas/75 p-lg">
        <View className="flex-row items-center gap-sm">
          <AppSymbol
            name={{ android: 'location_on', ios: 'mappin.and.ellipse' }}
            size={21}
            tintColor={colors.lime}
          />
          <AppText variant="section">Malls around you</AppText>
        </View>
        <AppText tone="secondary" variant="caption">
          Discover shopping destinations nearby
        </AppText>
      </View>
      <View className="absolute inset-x-0 bottom-0 bg-canvas/75 p-lg">
        <AppText tone="secondary" variant="caption">
          Tap a mall to open its profile.
        </AppText>
      </View>
    </PressableCard>
  );
}

export function ExploreScreen() {
  const router = useRouter();
  useI18n();
  const params = useLocalSearchParams<{ q?: string; section?: string }>();
  const { width } = useWindowDimensions();
  const data = useMemo(() => selectExploreDemoData(), []);
  const initialCategorySlug = data.categories.find(
    ({ slug }) => slug === params.section,
  )?.slug;
  const [query, setQuery] = useState(params.q ?? '');
  const [activeFilter, setActiveFilter] = useState<ExploreFilter>(() =>
    initialCategorySlug ? 'stores' : parseFilter(params.section),
  );
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | undefined
  >(initialCategorySlug);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const selectedCategory = data.categories.find(
    ({ slug }) => slug === selectedCategorySlug,
  );
  const mallCardWidth = Math.max(
    142,
    (width - spacing.screen * 2 - spacing.md) / 2,
  );
  const categoryCardWidth = Math.max(
    70,
    (width - spacing.screen * 2 - spacing.sm * 3) / 4,
  );

  const malls = data.malls.filter(({ mall }) =>
    includesQuery(normalizedQuery, [
      mall.name,
      mall.address.city,
      mall.address.district,
      localize(mall.description),
    ]),
  );
  const stores = data.stores.filter(({ mall, store }) => {
    const matchesCategory =
      !selectedCategory || store.categoryIds.includes(selectedCategory.id);
    return (
      matchesCategory &&
      includesQuery(normalizedQuery, [
        store.name,
        store.brandName,
        mall.name,
        localize(store.description),
      ])
    );
  });
  const deals = data.deals.filter(({ deal, mall, store }) => {
    const matchesCategory =
      !selectedCategory || store.categoryIds.includes(selectedCategory.id);
    return (
      matchesCategory &&
      includesQuery(normalizedQuery, [
        localize(deal.title),
        localize(deal.description),
        localize(deal.discountLabel),
        store.name,
        mall.name,
      ])
    );
  });
  const events = data.events.filter(({ event, mall }) =>
    includesQuery(normalizedQuery, [
      localize(event.title),
      localize(event.description),
      localize(event.locationText),
      mall.name,
    ]),
  );

  const openPreview = (kind: string, id: string, title: string) => {
    router.push({ pathname: '/preview', params: { id, kind, title } });
  };
  const openMall = (id: string) => {
    router.push({ pathname: '/malls/[id]', params: { id } });
  };
  const openStore = (id: string) => {
    router.push({ pathname: '/stores/[id]', params: { id } });
  };
  const openDeal = (id: string) => {
    router.push({ pathname: '/deals/[id]', params: { id } });
  };
  const resetFilters = () => {
    setQuery('');
    setActiveFilter('malls');
    setSelectedCategorySlug(undefined);
  };

  const sectionTitle = {
    deals: "Today's deals",
    events: 'Upcoming events',
    malls: 'Explore malls',
    stores: 'Explore stores',
  }[activeFilter];
  const sectionIcon = ({
    deals: { android: 'sell', ios: 'tag' },
    events: { android: 'calendar_month', ios: 'calendar' },
    malls: { android: 'apartment', ios: 'building.2' },
    stores: { android: 'storefront', ios: 'storefront' },
  } as const)[activeFilter];
  const resultCount = {
    deals: deals.length,
    events: events.length,
    malls: malls.length,
    stores: stores.length,
  }[activeFilter];

  return (
    <ShopperShell activeTab="explore">
      <Screen contentContainerClassName="gap-xl">
        <ExploreHeader onReset={resetFilters} />

        <TextField
          accessibilityLabel="Search malls, stores, brands, and deals"
          autoCapitalize="none"
          enterKeyHint="search"
          leading={(
            <AppSymbol
              name={{ android: 'search', ios: 'magnifyingglass' }}
              size={23}
              tintColor={colors.textSecondary}
            />
          )}
          onChangeText={setQuery}
          onSubmitEditing={() => Keyboard.dismiss()}
          placeholder="Search malls, stores, brands & deals"
          returnKeyType="search"
          trailing={(
            <IconButton
              accessibilityLabel="Search"
              icon={(color) => (
                <AppSymbol
                  name={{ android: 'search', ios: 'magnifyingglass' }}
                  size={19}
                  tintColor={color}
                />
              )}
              onPress={() => Keyboard.dismiss()}
              size="compact"
              variant="accent"
            />
          )}
          value={query}
          variant="search"
        />

        <View className="flex-row gap-sm">
          {filters.map((filter) => (
            <View className="flex-1" key={filter.value}>
              <Chip
                className="w-full"
                label={filter.label}
                onPress={() => setActiveFilter(filter.value)}
                selected={activeFilter === filter.value}
              />
            </View>
          ))}
        </View>

        <View className="gap-md">
          <SectionHeader
            actionLabel={query || selectedCategory ? 'Clear' : 'See all'}
            icon={<AppSymbol name={sectionIcon} size={20} tintColor={colors.lime} />}
            onActionPress={() => {
              setQuery('');
              setSelectedCategorySlug(undefined);
            }}
            title={sectionTitle}
          />

          {resultCount === 0 ? <EmptyResults /> : null}

          {activeFilter === 'malls' && resultCount > 0 ? (
            <View className="flex-row flex-wrap gap-md">
              {malls.map((item) => (
                <MallGridCard
                  item={item}
                  key={item.mall.id}
                  onPress={() => openMall(item.mall.id)}
                  width={mallCardWidth}
                />
              ))}
            </View>
          ) : null}

          {activeFilter === 'stores' && resultCount > 0 ? (
            <View className="gap-sm">
              {stores.map((item) => (
                <StoreRow
                  item={item}
                  key={item.store.id}
                  onPress={() => openStore(item.store.id)}
                />
              ))}
            </View>
          ) : null}

          {activeFilter === 'deals' && resultCount > 0 ? (
            <View className="gap-sm">
              {deals.map((item) => (
                <DealRow
                  item={item}
                  key={item.deal.id}
                  onPress={() => openDeal(item.deal.id)}
                />
              ))}
            </View>
          ) : null}

          {activeFilter === 'events' && resultCount > 0 ? (
            <View className="gap-sm">
              {events.map((item) => (
                <EventRow
                  item={item}
                  key={item.event.id}
                  onPress={() =>
                    openPreview('event', item.event.id, localize(item.event.title))
                  }
                />
              ))}
            </View>
          ) : null}
        </View>

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'grid_view', ios: 'square.grid.2x2' }}
                size={20}
                tintColor={colors.lime}
              />
            )}
            title="Explore by category"
          />
          <View className="flex-row gap-sm">
            {data.categories.slice(0, 4).map((category) => (
              <CategoryCard
                category={category}
                key={category.id}
                onPress={() => {
                  setSelectedCategorySlug((current) =>
                    current === category.slug ? undefined : category.slug,
                  );
                  setActiveFilter('stores');
                }}
                selected={selectedCategorySlug === category.slug}
                width={categoryCardWidth}
              />
            ))}
          </View>
        </View>

        {activeFilter === 'malls' && deals.length > 0 ? (
          <View className="gap-md">
            <SectionHeader
              actionLabel="See all"
              icon={(
                <AppSymbol
                  name={{ android: 'sell', ios: 'tag' }}
                  size={20}
                  tintColor={colors.lime}
                />
              )}
              onActionPress={() => setActiveFilter('deals')}
              title="Today’s deals"
            />
            <View className="gap-sm">
              {deals.slice(0, 2).map((item) => (
                <DealRow
                  item={item}
                  key={item.deal.id}
                  onPress={() => openDeal(item.deal.id)}
                />
              ))}
            </View>
          </View>
        ) : null}

        <MapPreview
          onPress={() => {
            const closestMall = data.malls[0];
            if (closestMall) {
              openMall(closestMall.mall.id);
            }
          }}
        />
      </Screen>
    </ShopperShell>
  );
}
