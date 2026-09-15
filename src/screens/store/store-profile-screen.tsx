import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Share, StyleSheet, View, useWindowDimensions } from 'react-native';

import {
  AppSymbol,
  AppText,
  Badge,
  Button,
  Card,
  IconButton,
  PressableCard,
  PriceText,
  Screen,
  SectionHeader,
  ShopperShell,
  type AppSymbolName,
} from '@/components';
import {
  resolveImageSource,
  selectStoreProfileDemoData,
  type StoreProfileDemoData,
} from '@/data';
import { formatNumberValue, localize, useI18n } from '@/i18n';
import type { Product } from '@/models';
import { colors, imageOverlays, spacing } from '@/theme';

function storeLocation(data: StoreProfileDemoData): string {
  const level = data.floor ? localize(data.floor.name) : data.store.levelText;
  return [level, data.store.unitNumber ? `Unit ${data.store.unitNumber}` : undefined]
    .filter(Boolean)
    .join(' · ');
}

function openingHoursSummary(data: StoreProfileDemoData): string {
  const openDays = data.store.openingHours.filter(
    ({ isClosed, periods }) => !isClosed && periods[0],
  );
  const firstPeriod = openDays[0]?.periods[0];
  const sameHours = openDays.every(
    ({ periods }) =>
      periods[0]?.opensAt === firstPeriod?.opensAt &&
      periods[0]?.closesAt === firstPeriod?.closesAt,
  );

  if (openDays.length === 7 && firstPeriod && sameHours) {
    return `Mon–Sun · ${firstPeriod.opensAt}–${firstPeriod.closesAt}`;
  }

  return firstPeriod
    ? `${openDays.length} days weekly · ${firstPeriod.opensAt}–${firstPeriod.closesAt}`
    : 'Temporarily closed';
}

function StoreHeader({ onBack, onShare }: { onBack: () => void; onShare: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-lg">
      <IconButton
        accessibilityLabel="Back"
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
        Store Profile
      </AppText>
      <IconButton
        accessibilityLabel="Share store"
        icon={(color) => (
          <AppSymbol
            name={{ android: 'share', ios: 'square.and.arrow.up' }}
            size={20}
            tintColor={color}
          />
        )}
        onPress={onShare}
      />
    </View>
  );
}

function StoreHero({ data }: { data: StoreProfileDemoData }) {
  const image = data.store.coverImages[0];
  const rating = data.store.rating;

  return (
    <Card className="h-72 overflow-hidden rounded-feature" padding="none">
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.soft }} />
      <View className="absolute left-md top-md">
        <Badge variant={data.isOpenNow ? 'accent' : 'neutral'}>
          {data.isOpenNow ? 'OPEN NOW' : 'CLOSED'}
        </Badge>
      </View>
      <View
        className="absolute inset-x-0 bottom-0 flex-row items-end gap-md p-lg"
        style={{ backgroundColor: imageOverlays.bottom }}
      >
        <View className="flex-1 gap-xs">
          <AppText numberOfLines={1} variant="heroTitle">
            {data.store.name}
          </AppText>
          <View className="flex-row items-center gap-xs">
            <AppSymbol
              name={{ android: 'location_on', ios: 'location.fill' }}
              size={14}
              tintColor={colors.lime}
            />
            <AppText numberOfLines={1} variant="subheadStrong">
              {data.mall.name}
            </AppText>
          </View>
          <AppText numberOfLines={1} tone="secondary" variant="caption">
            {storeLocation(data)}
          </AppText>
        </View>
        {rating ? (
          <View className="items-end gap-xs">
            <View className="flex-row items-center gap-xs">
              <AppSymbol
                name={{ android: 'star', ios: 'star.fill' }}
                size={20}
                tintColor={colors.lime}
              />
              <AppText numeric variant="titleSmall">
                {formatNumberValue(rating.average)}
              </AppText>
            </View>
            <AppText numeric tone="secondary" variant="caption">
              {`${formatNumberValue(rating.count)} reviews`}
            </AppText>
          </View>
        ) : null}
      </View>
    </Card>
  );
}

function StoreStats({ data }: { data: StoreProfileDemoData }) {
  const categoryLabel = data.categories.map(({ name }) => localize(name)).join(' · ');
  const stats = [
    { label: 'Products', value: String(data.products.length) },
    { label: 'Active deal', value: String(data.deals.length) },
    { label: 'Category', value: categoryLabel || 'Retail' },
  ];

  return (
    <Card className="flex-row items-stretch py-lg" padding="none">
      {stats.map((stat, index) => (
        <View className="flex-1 flex-row items-stretch" key={stat.label}>
          <View className="flex-1 items-center justify-center gap-xs px-xs">
            <AppText
              className="text-center"
              numberOfLines={2}
              numeric={index < 2}
              variant={index < 2 ? 'titleSmall' : 'subheadStrong'}
            >
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

function DealFeature({ data, onPress }: { data: StoreProfileDemoData; onPress: () => void }) {
  const deal = data.deals[0];
  if (!deal) return null;
  const image = deal.image;

  return (
    <PressableCard
      accessibilityLabel={`${localize(deal.title)}, ${localize(deal.discountLabel)}`}
      className="h-52 overflow-hidden rounded-feature"
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
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.strong }} />
      <View className="absolute inset-0 justify-between p-lg">
        <View className="gap-xs">
          <AppText variant="subheadStrong">{localize(deal.title).toUpperCase()}</AppText>
          <AppText numberOfLines={2} tone="accent" variant="screenTitle">
            {localize(deal.discountLabel).toUpperCase()}
          </AppText>
          <AppText numberOfLines={2} variant="caption">
            {localize(deal.description)}
          </AppText>
        </View>
        <View className="self-start flex-row items-center gap-sm rounded-control bg-lime px-md py-sm">
          <AppText tone="onAccent" variant="label">
            VIEW DEAL
          </AppText>
          <AppSymbol
            name={{ android: 'arrow_forward', ios: 'arrow.right' }}
            size={14}
            tintColor={colors.onLime}
          />
        </View>
      </View>
    </PressableCard>
  );
}

function ProductCard({ onPress, product, width }: { onPress: () => void; product: Product; width: number }) {
  const image = product.images[0];

  return (
    <PressableCard
      accessibilityLabel={localize(product.name)}
      className="overflow-hidden"
      onPress={onPress}
      padding="none"
      style={{ minHeight: 220, width }}
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ height: 132, width: '100%' }}
        />
      ) : null}
      <View className="flex-1 gap-xs p-md">
        <AppText numberOfLines={1} variant="subheadStrong">
          {localize(product.name)}
        </AppText>
        <PriceText
          locale="id-ID"
          tone="accent"
          value={(product.salePrice ?? product.price).amount}
          variant="section"
        />
        {product.salePrice ? (
          <PriceText
            className="line-through"
            locale="id-ID"
            tone="secondary"
            value={product.price.amount}
            variant="caption"
          />
        ) : null}
      </View>
      <View className="absolute bottom-md right-md h-9 w-9 items-center justify-center rounded-full bg-surface-overlay">
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={15}
          tintColor={colors.textPrimary}
        />
      </View>
    </PressableCard>
  );
}

function StoreInformation({ data }: { data: StoreProfileDemoData }) {
  const rows = [
    {
      icon: { android: 'schedule', ios: 'clock' } as AppSymbolName,
      label: 'Opening hours',
      value: openingHoursSummary(data),
    },
    {
      icon: { android: 'location_on', ios: 'location.fill' } as AppSymbolName,
      label: 'Location',
      value: `${data.mall.name} · ${storeLocation(data)}`,
    },
  ];

  return (
    <Card padding="none">
      {rows.map((row, index) => (
        <View key={row.label}>
          <View className="flex-row items-center gap-md p-lg">
            <AppSymbol name={row.icon} size={20} tintColor={colors.lime} />
            <View className="flex-1 gap-xs">
              <AppText variant="subheadStrong">{row.label}</AppText>
              <AppText numberOfLines={2} tone="secondary" variant="caption">
                {row.value}
              </AppText>
            </View>
          </View>
          {index < rows.length - 1 ? <View className="mx-lg h-px bg-border" /> : null}
        </View>
      ))}
    </Card>
  );
}

function SocialActions({ data, onPress }: { data: StoreProfileDemoData; onPress: (name: string) => void }) {
  const actions = [
    data.store.socialLinks.instagramUrl ? 'Instagram' : undefined,
    data.store.socialLinks.tiktokUrl ? 'TikTok' : undefined,
    data.store.socialLinks.facebookUrl ? 'Facebook' : undefined,
  ].filter((name): name is string => Boolean(name));

  if (actions.length === 0) return null;

  return (
    <View className="flex-row gap-sm">
      {actions.map((name) => (
        <Button
          className="flex-1"
          key={name}
          label={name}
          onPress={() => onPress(name)}
          size="compact"
          variant="secondary"
        />
      ))}
    </View>
  );
}

function PromotedContent({ data, onPress }: { data: StoreProfileDemoData; onPress: () => void }) {
  const promotion = data.promotion;
  if (!promotion) return null;
  const imageUrl = promotion.advertisement.creativeUrl;

  return (
    <PressableCard
      accessibilityLabel={`Promoted content, ${localize(promotion.advertisement.headline)}`}
      className="h-36 justify-end overflow-hidden rounded-feature"
      onPress={onPress}
      padding="none"
      variant="highlight"
    >
      {imageUrl ? (
        <Image
          accessibilityLabel="Lumen Sneakers promoted content"
          contentFit="cover"
          source={resolveImageSource(imageUrl)}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View className="absolute inset-0 bg-lime-surface/80" />
      <View className="flex-row items-end gap-md p-lg">
        <View className="flex-1 gap-xs">
          <AppText tone="accent" variant="eyebrow">
            PROMOTED CONTENT
          </AppText>
          <AppText numberOfLines={1} variant="titleSmall">
            {localize(promotion.advertisement.headline).toUpperCase()}
          </AppText>
          <AppText numberOfLines={2} variant="caption">
            {localize(promotion.advertisement.body)}
          </AppText>
        </View>
        <View className="rounded-control bg-lime px-md py-sm">
          <AppText tone="onAccent" variant="label">
            LEARN MORE
          </AppText>
        </View>
      </View>
    </PressableCard>
  );
}

export interface StoreProfileScreenProps {
  storeId: string;
}

export function StoreProfileScreen({ storeId }: StoreProfileScreenProps) {
  const router = useRouter();
  useI18n();
  const { width } = useWindowDimensions();
  const data = useMemo(() => selectStoreProfileDemoData(storeId), [storeId]);
  const [isSaved, setIsSaved] = useState(data?.isSaved ?? false);

  if (!data) {
    return (
      <ShopperShell activeTab="explore">
        <Screen contentContainerClassName="min-h-full justify-center">
          <Card className="items-center gap-lg py-3xl" variant="highlight">
            <AppSymbol
              name={{ android: 'storefront', ios: 'storefront' }}
              size={34}
              tintColor={colors.lime}
            />
            <AppText variant="titleSmall">Store not found</AppText>
            <Button label="Back to Explore" onPress={() => router.replace('/explore')} />
          </Card>
        </Screen>
      </ShopperShell>
    );
  }

  const productWidth = Math.min(220, (width - spacing.screen * 2 - spacing.md) / 2);
  const openPreview = (kind: string, id: string, title: string) => {
    router.push({ pathname: '/preview', params: { id, kind, title } });
  };
  const openDeal = (id: string) => {
    router.push({ pathname: '/deals/[id]', params: { id } });
  };
  const deal = data.deals[0];
  const bookingService = data.bookingServices[0];
  const shareStore = () => {
    void Share.share({
      message: `Discover ${data.store.name} at ${data.mall.name} on Shopymalls.`,
      title: data.store.name,
    });
  };

  return (
    <ShopperShell activeTab="explore">
      <Screen contentContainerClassName="gap-lg">
        <StoreHeader onBack={() => router.back()} onShare={shareStore} />
        <StoreHero data={data} />

        {bookingService ? (
          <Button
            label={`Book ${localize(bookingService.name)}`}
            leading={(color) => (
              <AppSymbol
                name={{ android: 'calendar_month', ios: 'calendar.badge.plus' }}
                size={18}
                tintColor={color}
              />
            )}
            onPress={() => router.push({
              pathname: '/book/[serviceId]',
              params: { serviceId: bookingService.id },
            })}
            variant="booking"
          />
        ) : null}

        <View className="flex-row gap-sm">
          <Button
            accessibilityState={{ selected: isSaved }}
            className="flex-1"
            label={isSaved ? 'Following' : 'Follow store'}
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
            onPress={() =>
              openPreview('directions', data.store.id, `Directions to ${data.store.name}`)
            }
            variant="secondary"
          />
        </View>

        <StoreStats data={data} />

        {deal ? (
          <View className="gap-md">
            <SectionHeader
              actionLabel="See deal"
              icon={(
                <AppSymbol
                  name={{ android: 'local_fire_department', ios: 'flame.fill' }}
                  size={20}
                  tintColor={colors.lime}
                />
              )}
              onActionPress={() => openDeal(deal.id)}
              title="Today’s deal"
            />
            <DealFeature
              data={data}
              onPress={() => openDeal(deal.id)}
            />
          </View>
        ) : null}

        {data.products.length > 0 ? (
          <View className="gap-md">
            <SectionHeader
              actionLabel="See all"
              icon={(
                <AppSymbol
                  name={{ android: 'auto_awesome', ios: 'sparkles' }}
                  size={20}
                  tintColor={colors.lime}
                />
              )}
              onActionPress={() =>
                openPreview('product', data.store.id, `${data.store.name} products`)
              }
              title="New & trending"
            />
            <View className="flex-row flex-wrap gap-md">
              {data.products.map((product) => (
                <ProductCard
                  key={product.id}
                  onPress={() =>
                    openPreview('product', product.id, localize(product.name))
                  }
                  product={product}
                  width={productWidth}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'schedule', ios: 'clock' }}
                size={20}
                tintColor={colors.lime}
              />
            )}
            title="Store information"
          />
          <StoreInformation data={data} />
        </View>

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'group', ios: 'person.2' }}
                size={20}
                tintColor={colors.lime}
              />
            )}
            title={`Follow ${data.store.name}`}
          />
          <SocialActions
            data={data}
            onPress={(name) => openPreview('social', data.store.id, `${data.store.name} on ${name}`)}
          />
        </View>

        <PromotedContent
          data={data}
          onPress={() =>
            data.promotion
              ? openPreview(
                  'promotion',
                  data.promotion.advertisement.id,
                  localize(data.promotion.advertisement.headline),
                )
              : undefined
          }
        />
      </Screen>
    </ShopperShell>
  );
}
