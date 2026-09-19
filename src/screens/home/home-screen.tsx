import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  AppSymbol,
  AppText,
  IconButton,
  PressableCard,
  Screen,
  SectionHeader,
  ShopperShell,
  TextField,
} from '@/components';
import {
  resolveImageSource,
  selectHomeDemoData,
  type HomeFeaturedDeal,
  type HomeRecommendedStore,
  type HomeUpcomingEvent,
  type NearbyMall,
} from '@/data';
import { formatDateValue, localize, useI18n } from '@/i18n';
import type { Category } from '@/models';
import { colors, imageOverlays, spacing } from '@/theme';

const cardMetrics = {
  mallHeight: 205,
  dealHeight: 225,
  eventHeight: 180,
  storeHeight: 150,
  categoryHeight: 82,
} as const;

const imageStyle = StyleSheet.absoluteFill;

function RailCardFrame({
  children,
  height,
  width,
}: {
  children: React.ReactNode;
  height: number;
  width: number;
}) {
  return <View style={{ flexShrink: 0, height, width }}>{children}</View>;
}

function BrandMark() {
  return (
    <Image
      accessibilityLabel="Shopymalls logo"
      accessible
      contentFit="contain"
      source={require('../../../assets/images/logo.png')}
      style={{ height: 48, width: 48 }}
    />
  );
}

function HomeHeader({
  fullName,
  onNotificationsPress,
  unreadCount,
}: {
  fullName: string;
  onNotificationsPress: () => void;
  unreadCount: number;
}) {
  const firstName = fullName.split(' ')[0] ?? fullName;

  return (
    <View className="flex-row items-center justify-between gap-lg">
      <View className="flex-1 flex-row items-center gap-md">
        <BrandMark />
        <View className="flex-1 gap-hairline">
          <AppText numberOfLines={1} variant="title">
            shopy<AppText tone="accent" variant="title">malls</AppText>
          </AppText>
          <AppText numberOfLines={1} variant="subheadStrong">
            {`Good morning, ${firstName}`}
          </AppText>
          <View className="flex-row items-center gap-xs">
            <AppSymbol
              name={{ android: 'location_on', ios: 'location.fill' }}
              size={13}
              tintColor={colors.textSecondary}
            />
            <AppText tone="secondary" variant="caption">
              Jakarta Pusat
            </AppText>
          </View>
        </View>
      </View>

      <View>
        <IconButton
          accessibilityLabel={`Notifications, ${unreadCount} unread`}
          icon={(color) => (
            <AppSymbol
              name={{ android: 'notifications', ios: 'bell' }}
              size={21}
              tintColor={color}
            />
          )}
          onPress={onNotificationsPress}
        />
        {unreadCount > 0 ? (
          <View className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border border-canvas bg-lime" />
        ) : null}
      </View>
    </View>
  );
}

const categorySymbols = {
  beauty: { android: 'spa', ios: 'sparkles' },
  dining: { android: 'restaurant', ios: 'fork.knife' },
  entertainment: { android: 'confirmation_number', ios: 'ticket' },
  fashion: { android: 'checkroom', ios: 'tshirt' },
} as const;

function CategoryShortcut({
  category,
  onPress,
  width,
}: {
  category: Category;
  onPress: () => void;
  width: number;
}) {
  const icon = categorySymbols[category.slug as keyof typeof categorySymbols] ?? {
    android: 'category' as const,
    ios: 'square.grid.2x2' as const,
  };

  return (
    <PressableCard
      accessibilityLabel={`Explore ${localize(category.name)} category`}
      className="items-center justify-center gap-sm rounded-feature"
      onPress={onPress}
      padding="compact"
      style={{ height: cardMetrics.categoryHeight, width }}
    >
      <AppSymbol name={icon} size={25} tintColor={colors.textPrimary} />
      <AppText numberOfLines={1} variant="caption">
        {localize(category.name)}
      </AppText>
    </PressableCard>
  );
}

function MallCard({ item, onPress, width }: { item: NearbyMall; onPress: () => void; width: number }) {
  const { locale } = useI18n();
  const image = item.mall.coverImages[0];

  return (
    <RailCardFrame height={cardMetrics.mallHeight} width={width}>
      <PressableCard
        accessibilityLabel={`${item.mall.name}, ${item.distanceKm} kilometers away`}
        className="h-full w-full overflow-hidden rounded-feature"
        onPress={onPress}
        padding="none"
      >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={imageStyle}
        />
      ) : null}
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.soft }} />
      <View className="absolute inset-x-0 bottom-0 gap-xs p-lg" style={{ backgroundColor: imageOverlays.bottom }}>
        <AppText numberOfLines={1} variant="titleSmall">
          {item.mall.name}
        </AppText>
        <View className="flex-row items-center gap-xs">
          <AppSymbol
            name={{ android: 'location_on', ios: 'location.fill' }}
            size={13}
            tintColor={colors.textPrimary}
          />
          <AppText tone="secondary" variant="caption">
            {item.mall.address.city}
          </AppText>
          <AppText tone="secondary" variant="caption">·</AppText>
          <AppText numeric variant="caption">{`${item.distanceKm.toLocaleString(locale)} km`}</AppText>
        </View>
        <AppText tone="secondary" variant="caption">
          {`${item.activeStoreCount} stores · ${item.activeDealCount} deals`}
        </AppText>
      </View>
      <View className="absolute bottom-lg right-lg h-10 w-10 items-center justify-center rounded-full bg-surface-overlay/90">
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={17}
          tintColor={colors.textPrimary}
        />
      </View>
      </PressableCard>
    </RailCardFrame>
  );
}

function DealCard({ item, onPress, width }: { item: HomeFeaturedDeal; onPress: () => void; width: number }) {
  const image = item.deal.image;

  return (
    <RailCardFrame height={cardMetrics.dealHeight} width={width}>
      <PressableCard
        accessibilityLabel={`${localize(item.deal.title)}, ${localize(item.deal.discountLabel)}`}
        className="h-full w-full overflow-hidden rounded-feature"
        onPress={onPress}
        padding="none"
      >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={imageStyle}
        />
      ) : null}
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.strong }} />
      <View className="absolute inset-0 justify-between p-lg">
        <View className="gap-xs">
          <AppText variant="subheadStrong">{item.store.name.toUpperCase()}</AppText>
          <AppText numberOfLines={2} tone="accent" variant="heroTitle">
            {localize(item.deal.discountLabel).toUpperCase()}
          </AppText>
          <View className="flex-row items-center gap-xs">
            <AppSymbol
              name={{ android: 'location_on', ios: 'location.fill' }}
              size={13}
              tintColor={colors.textPrimary}
            />
            <AppText variant="caption">{item.mall.name}</AppText>
          </View>
        </View>
        <View className="self-start flex-row items-center gap-sm rounded-control bg-lime px-md py-sm">
          <AppText tone="onAccent" variant="label">VIEW DEAL</AppText>
          <AppSymbol
            name={{ android: 'arrow_forward', ios: 'arrow.right' }}
            size={14}
            tintColor={colors.onLime}
          />
        </View>
      </View>
      </PressableCard>
    </RailCardFrame>
  );
}

function StoreCard({ item, onPress, width }: { item: HomeRecommendedStore; onPress: () => void; width: number }) {
  const image = item.store.coverImages[0];

  return (
    <RailCardFrame height={cardMetrics.storeHeight} width={width}>
      <PressableCard
        accessibilityLabel={`${item.store.name} at ${item.mall.name}`}
        className="h-full w-full overflow-hidden rounded-feature"
        onPress={onPress}
        padding="none"
      >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={imageStyle}
        />
      ) : null}
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.soft }} />
      <View className="absolute inset-x-0 bottom-0 gap-xs p-md" style={{ backgroundColor: imageOverlays.bottom }}>
        <AppText numberOfLines={1} variant="subheadStrong">{item.store.name}</AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">{item.mall.name}</AppText>
      </View>
      </PressableCard>
    </RailCardFrame>
  );
}

function EventCard({ item, onPress, width }: { item: HomeUpcomingEvent; onPress: () => void; width: number }) {
  const image = item.event.image;

  return (
    <RailCardFrame height={cardMetrics.eventHeight} width={width}>
      <PressableCard
        accessibilityLabel={`${localize(item.event.title)} at ${item.mall.name}`}
        className="h-full w-full overflow-hidden rounded-feature"
        onPress={onPress}
        padding="none"
      >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={imageStyle}
        />
      ) : null}
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.soft }} />
      <View className="absolute inset-x-0 bottom-0 gap-xs p-md" style={{ backgroundColor: imageOverlays.bottom }}>
        <AppText numberOfLines={1} variant="section">{localize(item.event.title)}</AppText>
        <AppText numberOfLines={1} tone="secondary" variant="caption">{item.mall.name}</AppText>
        <AppText numeric tone="accent" variant="caption">
          {formatDateValue(item.event.startsAt, { day: 'numeric', month: 'short' })}
        </AppText>
      </View>
      </PressableCard>
    </RailCardFrame>
  );
}

function Rail({ children, height }: { children: React.ReactNode; height: number }) {
  return (
    <ScrollView
      contentContainerStyle={{ gap: spacing.md, paddingRight: spacing.screen }}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ height }}
    >
      {children}
    </ScrollView>
  );
}

export function HomeScreen() {
  const router = useRouter();
  useI18n();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const data = useMemo(() => selectHomeDemoData(), []);
  const categoryWidth = Math.max(70, (width - spacing.screen * 2 - spacing.sm * 3) / 4);
  const mallWidth = Math.min(292, width - spacing.screen * 4);
  const dealWidth = Math.min(330, width - spacing.screen * 2.5);
  const storeWidth = Math.min(180, width - spacing.screen * 7);
  const eventWidth = Math.min(240, width - spacing.screen * 5);

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
  const openExplore = (section?: string) => {
    router.push({ pathname: '/explore', params: section ? { section } : {} });
  };
  const submitSearch = () => {
    router.push({ pathname: '/explore', params: query.trim() ? { q: query.trim() } : {} });
  };

  return (
    <ShopperShell activeTab="home">
      <Screen contentContainerClassName="gap-xl">
        <HomeHeader
          fullName={data.currentUser.fullName}
          onNotificationsPress={() =>
            router.push({
              pathname: '/preview',
              params: { kind: 'notification', title: 'Notifications' },
            })
          }
          unreadCount={data.unreadNotificationCount}
        />

        <TextField
          accessibilityLabel="Search Shopymalls"
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
          onSubmitEditing={submitSearch}
          placeholder="Search malls, stores, brands & deals"
          returnKeyType="search"
          trailing={(
            <IconButton
              accessibilityLabel="Submit search"
              icon={(color) => (
                <AppSymbol
                  name={{ android: 'search', ios: 'magnifyingglass' }}
                  size={19}
                  tintColor={color}
                />
              )}
              onPress={submitSearch}
              size="compact"
              variant="accent"
            />
          )}
          value={query}
          variant="search"
        />

        <View className="flex-row gap-sm">
          {data.categories.slice(0, 4).map((category) => (
            <CategoryShortcut
              category={category}
              key={category.id}
              onPress={() => openExplore(category.slug)}
              width={categoryWidth}
            />
          ))}
        </View>

        <View className="gap-md">
          <SectionHeader
            actionLabel="See all"
            icon={(
              <AppSymbol
                name={{ android: 'location_on', ios: 'mappin.and.ellipse' }}
                size={19}
                tintColor={colors.lime}
              />
            )}
            onActionPress={() => openExplore('malls')}
            title="Malls near you"
          />
          <Rail height={cardMetrics.mallHeight}>
            {data.nearbyMalls.map((item) => (
              <MallCard
                item={item}
                key={item.mall.id}
                onPress={() => openMall(item.mall.id)}
                width={mallWidth}
              />
            ))}
          </Rail>
        </View>

        <View className="gap-md">
          <SectionHeader
            actionLabel="See all"
            icon={(
              <AppSymbol
                name={{ android: 'local_fire_department', ios: 'flame.fill' }}
                size={19}
                tintColor={colors.lime}
              />
            )}
            onActionPress={() => openExplore('deals')}
            title="Featured deals"
          />
          <Rail height={cardMetrics.dealHeight}>
            {data.featuredDeals.map((item) => (
              <DealCard
                item={item}
                key={item.deal.id}
                onPress={() => openDeal(item.deal.id)}
                width={dealWidth}
              />
            ))}
          </Rail>
        </View>

        <View className="gap-md">
          <SectionHeader
            actionLabel="See all"
            icon={(
              <AppSymbol
                name={{ android: 'storefront', ios: 'storefront' }}
                size={19}
                tintColor={colors.lime}
              />
            )}
            onActionPress={() => openExplore('stores')}
            title="Stores for you"
          />
          <Rail height={cardMetrics.storeHeight}>
            {data.recommendedStores.map((item) => (
              <StoreCard
                item={item}
                key={item.store.id}
                onPress={() => openStore(item.store.id)}
                width={storeWidth}
              />
            ))}
          </Rail>
        </View>

        <View className="gap-md">
          <SectionHeader
            actionLabel="See all"
            icon={(
              <AppSymbol
                name={{ android: 'calendar_month', ios: 'calendar' }}
                size={19}
                tintColor={colors.lime}
              />
            )}
            onActionPress={() => openExplore('events')}
            title="Upcoming events"
          />
          <Rail height={cardMetrics.eventHeight}>
            {data.upcomingEvents.map((item) => (
              <EventCard
                item={item}
                key={item.event.id}
                onPress={() => openPreview('event', item.event.id, localize(item.event.title))}
                width={eventWidth}
              />
            ))}
          </Rail>
        </View>

        <Pressable
          accessibilityLabel="Explore today’s activity"
          accessibilityRole="button"
          className="flex-row items-center gap-md rounded-feature border border-border bg-surface p-md active:opacity-[0.78]"
          onPress={() => openExplore('today')}
          style={{ borderCurve: 'continuous' }}
        >
          <View className="h-11 w-11 items-center justify-center rounded-control bg-lime-surface-strong">
            <AppSymbol
              name={{ android: 'navigation', ios: 'location.north.line.fill' }}
              size={22}
              tintColor={colors.lime}
            />
          </View>
          <View className="flex-1 gap-xs">
            <AppText variant="subheadStrong">Discover what’s happening today</AppText>
            <AppText tone="secondary" variant="caption">Deals, stores, events, and malls in one place.</AppText>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-control bg-lime">
            <AppSymbol
              name={{ android: 'arrow_forward', ios: 'arrow.right' }}
              size={17}
              tintColor={colors.onLime}
            />
          </View>
        </Pressable>
      </Screen>
    </ShopperShell>
  );
}
