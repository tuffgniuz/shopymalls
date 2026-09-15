import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

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
} from '@/components';
import {
  resolveImageSource,
  selectDealDetailsDemoData,
  type DealDetailsDemoData,
} from '@/data';
import { formatDateValue, formatNumberValue, localize, useI18n } from '@/i18n';
import type { Product } from '@/models';
import { colors, imageOverlays, spacing } from '@/theme';

function formatDateRange(startsAt: string, endsAt: string): string {
  const starts = new Date(startsAt);
  const ends = new Date(endsAt);
  const startMonth = formatDateValue(starts, { month: 'short', timeZone: 'Asia/Jakarta' });
  const endMonth = formatDateValue(ends, { month: 'short', timeZone: 'Asia/Jakarta' });
  const startYear = formatDateValue(starts, { timeZone: 'Asia/Jakarta', year: 'numeric' });
  const endYear = formatDateValue(ends, { timeZone: 'Asia/Jakarta', year: 'numeric' });
  const startDay = formatDateValue(starts, { day: 'numeric', timeZone: 'Asia/Jakarta' });
  const endDay = formatDateValue(ends, { day: 'numeric', timeZone: 'Asia/Jakarta' });

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay}–${endDay} ${endMonth} ${endYear}`;
  }

  return `${startDay} ${startMonth} ${startYear}–${endDay} ${endMonth} ${endYear}`;
}

function dealLocation(data: DealDetailsDemoData): string {
  const level = data.floor ? localize(data.floor.name) : data.store.levelText;
  return [level, data.store.unitNumber ? `Unit ${data.store.unitNumber}` : undefined]
    .filter(Boolean)
    .join(' · ');
}

function offerTitle(data: DealDetailsDemoData): string {
  const discount = localize(data.deal.discountLabel).replace(/ off$/i, '');
  const allRunners =
    data.products.length > 0 &&
    data.products.every((product) => /runner/i.test(localize(product.name)));
  const subject = allRunners ? 'selected runners' : 'selected products';
  return `${discount.replace(/^Up to/i, 'Save up to')} on ${subject}`;
}

function DealHeader({ isSaved, onBack, onSave }: { isSaved: boolean; onBack: () => void; onSave: () => void }) {
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
        Deal
      </AppText>
      <IconButton
        accessibilityLabel={isSaved ? 'Remove deal from Saved' : 'Save deal'}
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

function DealHero({ data }: { data: DealDetailsDemoData }) {
  const image = data.deal.image;

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
      <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.strong }} />
      {data.deal.isFeatured ? (
        <View className="absolute left-md top-md">
          <Badge variant="accent">FEATURED DEAL</Badge>
        </View>
      ) : null}
      <View
        className="absolute inset-x-0 bottom-0 gap-xs p-lg"
        style={{ backgroundColor: imageOverlays.bottom }}
      >
        <AppText variant="section">{data.store.name.toUpperCase()}</AppText>
        <AppText numberOfLines={2} tone="accent" variant="screenTitle">
          {localize(data.deal.discountLabel).toUpperCase()}
        </AppText>
        <AppText numberOfLines={2} variant="subhead">
          {localize(data.deal.description)}
        </AppText>
      </View>
    </Card>
  );
}

function DealMeta({ data, isSaved, onDirections, onSave, onStore }: {
  data: DealDetailsDemoData;
  isSaved: boolean;
  onDirections: () => void;
  onSave: () => void;
  onStore: () => void;
}) {
  return (
    <Card className="gap-lg">
      <View className="flex-row items-center gap-md">
        <PressableCard
          accessibilityLabel={`Open ${data.store.name} profile`}
          className="flex-1 gap-xs border-transparent bg-transparent p-0"
          onPress={onStore}
          padding="none"
        >
          <AppText variant="titleSmall">{data.store.name}</AppText>
          <View className="flex-row items-center gap-xs">
            <AppSymbol
              name={{ android: 'location_on', ios: 'location.fill' }}
              size={14}
              tintColor={colors.lime}
            />
            <AppText numberOfLines={2} tone="secondary" variant="caption">
              {`${data.mall.name} · ${dealLocation(data)}`}
            </AppText>
          </View>
        </PressableCard>
        {data.store.rating ? (
          <View className="flex-row items-center gap-xs rounded-control border border-border px-sm py-xs">
            <AppSymbol
              name={{ android: 'star', ios: 'star.fill' }}
              size={14}
              tintColor={colors.lime}
            />
            <AppText numeric variant="subheadStrong">
              {formatNumberValue(data.store.rating.average)}
            </AppText>
          </View>
        ) : null}
      </View>

      <View className="flex-row gap-sm">
        <Button
          className="flex-1"
          label="GET DIRECTIONS"
          leading={(color) => (
            <AppSymbol
              name={{ android: 'navigation', ios: 'location.north.fill' }}
              size={17}
              tintColor={color}
            />
          )}
          onPress={onDirections}
        />
        <Button
          accessibilityState={{ selected: isSaved }}
          className="flex-1"
          label={isSaved ? 'SAVED' : 'SAVE DEAL'}
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
          onPress={onSave}
          variant="secondary"
        />
      </View>
    </Card>
  );
}

function OfferCard({ data }: { data: DealDetailsDemoData }) {
  return (
    <Card className="gap-sm">
      <AppText variant="section">{offerTitle(data)}</AppText>
      <AppText tone="secondary" variant="subhead">
        {localize(data.deal.description)}
      </AppText>
      <View className="flex-row items-center gap-sm pt-xs">
        <AppSymbol
          name={{ android: 'calendar_month', ios: 'calendar' }}
          size={17}
          tintColor={colors.lime}
        />
        <AppText numeric tone="accent" variant="subheadStrong">
          {`Valid · ${formatDateRange(data.deal.startsAt, data.deal.endsAt)}`}
        </AppText>
      </View>
      <AppText tone="tertiary" variant="caption">
        {localize(data.deal.terms)}
      </AppText>
    </Card>
  );
}

function ProductCard({ included, onPress, product, width }: {
  included: boolean;
  onPress: () => void;
  product: Product;
  width: number;
}) {
  const image = product.images[0];

  return (
    <PressableCard
      accessibilityLabel={`${localize(product.name)}, included in deal`}
      className="overflow-hidden"
      onPress={onPress}
      padding="none"
      style={{ minHeight: 240, width }}
    >
      <View className="h-36">
        {image ? (
          <Image
            accessibilityLabel={localize(image.alt)}
            contentFit="cover"
            source={resolveImageSource(image.url)}
            style={StyleSheet.absoluteFill}
          />
        ) : null}
        {included ? (
          <View className="absolute right-sm top-sm">
            <Badge>INCLUDED</Badge>
          </View>
        ) : null}
      </View>
      <View className="flex-1 gap-xs p-md">
        <AppText numberOfLines={1} variant="subheadStrong">
          {localize(product.name)}
        </AppText>
        {product.salePrice ? (
          <PriceText
            className="line-through"
            locale="id-ID"
            tone="secondary"
            value={product.price.amount}
            variant="caption"
          />
        ) : null}
        <PriceText
          locale="id-ID"
          tone="accent"
          value={(product.salePrice ?? product.price).amount}
          variant="section"
        />
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

function CollectionCard({ data, onPress }: { data: DealDetailsDemoData; onPress: () => void }) {
  const image = data.products[0]?.images[0];

  return (
    <PressableCard
      accessibilityLabel="Open performance collection"
      className="h-28 flex-row items-center gap-lg overflow-hidden"
      onPress={onPress}
      padding="compact"
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ borderRadius: 12, height: 84, width: 84 }}
        />
      ) : null}
      <View className="flex-1 gap-xs">
        <AppText variant="subheadStrong">Performance collection</AppText>
        <AppText tone="accent" variant="section">
          {localize(data.deal.discountLabel)}
        </AppText>
        <AppText tone="secondary" variant="caption">
          Selected products in store.
        </AppText>
      </View>
      <AppSymbol
        name={{ android: 'chevron_right', ios: 'chevron.right' }}
        size={17}
        tintColor={colors.textPrimary}
      />
    </PressableCard>
  );
}

function LocationCard({ data, onDirections, onMall }: {
  data: DealDetailsDemoData;
  onDirections: () => void;
  onMall: () => void;
}) {
  return (
    <Card className="flex-row items-center gap-md" padding="compact">
      <PressableCard
        accessibilityLabel={`Open ${data.mall.name} profile`}
        className="flex-1 flex-row items-center gap-md border-transparent bg-transparent p-0"
        onPress={onMall}
        padding="none"
      >
        <View className="h-12 w-12 items-center justify-center rounded-control bg-lime-surface-strong">
          <AppSymbol
            name={{ android: 'apartment', ios: 'building.2' }}
            size={23}
            tintColor={colors.lime}
          />
        </View>
        <View className="flex-1 gap-xs">
          <AppText variant="subheadStrong">{data.mall.name}</AppText>
          <AppText numberOfLines={2} tone="secondary" variant="caption">
            {`${dealLocation(data)} · ${data.mall.address.city}`}
          </AppText>
        </View>
      </PressableCard>
      <IconButton
        accessibilityLabel={`Directions to ${data.store.name}`}
        icon={(color) => (
          <AppSymbol
            name={{ android: 'navigation', ios: 'location.north.fill' }}
            size={18}
            tintColor={color}
          />
        )}
        onPress={onDirections}
        size="compact"
        variant="accent"
      />
    </Card>
  );
}

function FollowCard({ data, isFollowing, onFollow }: {
  data: DealDetailsDemoData;
  isFollowing: boolean;
  onFollow: () => void;
}) {
  return (
    <Card className="flex-row items-center gap-md" padding="compact">
      <View className="h-11 w-11 items-center justify-center rounded-control bg-lime-surface-strong">
        <AppSymbol
          name={{ android: 'notifications', ios: 'bell' }}
          size={20}
          tintColor={colors.lime}
        />
      </View>
      <View className="flex-1 gap-xs">
        <AppText variant="subheadStrong">Want more deals like this?</AppText>
        <AppText tone="secondary" variant="caption">
          {`Follow ${data.store.name} for new promotions.`}
        </AppText>
      </View>
      <Button
        accessibilityState={{ selected: isFollowing }}
        label={isFollowing ? 'FOLLOWING' : 'FOLLOW'}
        onPress={onFollow}
        size="compact"
      />
    </Card>
  );
}

function SponsoredCard({ data, onPress }: { data: DealDetailsDemoData; onPress: () => void }) {
  if (!data.deal.isSponsored) return null;

  return (
    <PressableCard
      accessibilityLabel="Sponsored Featured Deal placement information"
      className="gap-sm"
      onPress={onPress}
      variant="highlight"
    >
      <View className="flex-row items-center justify-between gap-md">
        <AppText tone="accent" variant="eyebrow">
          SPONSORED
        </AppText>
        <AppText variant="micro">{data.store.name.toUpperCase()}</AppText>
      </View>
      <AppText variant="section">Featured Deal placement</AppText>
      <View className="flex-row items-end gap-md">
        <AppText className="flex-1" tone="secondary" variant="caption">
          Retailers can promote deals across Shopymalls discovery surfaces.
        </AppText>
        <AppSymbol
          name={{ android: 'chevron_right', ios: 'chevron.right' }}
          size={17}
          tintColor={colors.textPrimary}
        />
      </View>
    </PressableCard>
  );
}

export interface DealDetailsScreenProps {
  dealId: string;
}

export function DealDetailsScreen({ dealId }: DealDetailsScreenProps) {
  const router = useRouter();
  useI18n();
  const { width } = useWindowDimensions();
  const data = useMemo(() => selectDealDetailsDemoData(dealId), [dealId]);
  const [isSaved, setIsSaved] = useState(data?.isSaved ?? false);
  const [isFollowing, setIsFollowing] = useState(data?.isStoreSaved ?? false);

  if (!data) {
    return (
      <ShopperShell activeTab="explore">
        <Screen contentContainerClassName="min-h-full justify-center">
          <Card className="items-center gap-lg py-3xl" variant="highlight">
            <AppSymbol
              name={{ android: 'sell', ios: 'tag' }}
              size={34}
              tintColor={colors.lime}
            />
            <AppText variant="titleSmall">Deal not found</AppText>
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
  const openDirections = () =>
    openPreview('directions', data.store.id, `Directions to ${data.store.name}`);

  return (
    <ShopperShell activeTab="explore">
      <Screen contentContainerClassName="gap-lg">
        <DealHeader
          isSaved={isSaved}
          onBack={() => router.back()}
          onSave={() => setIsSaved((current) => !current)}
        />
        <DealHero data={data} />
        <DealMeta
          data={data}
          isSaved={isSaved}
          onDirections={openDirections}
          onSave={() => setIsSaved((current) => !current)}
          onStore={() =>
            router.push({ pathname: '/stores/[id]', params: { id: data.store.id } })
          }
        />

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'sell', ios: 'tag' }}
                size={20}
                tintColor={colors.lime}
              />
            )}
            title="The offer"
          />
          <OfferCard data={data} />
        </View>

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
                openPreview('product', data.deal.id, `${data.store.name} featured products`)
              }
              title="Featured products"
            />
            <View className="flex-row flex-wrap gap-md">
              {data.products.map((product, index) => (
                <ProductCard
                  included={index > 0}
                  key={product.id}
                  onPress={() =>
                    openPreview('product', product.id, localize(product.name))
                  }
                  product={product}
                  width={productWidth}
                />
              ))}
            </View>
            <CollectionCard
              data={data}
              onPress={() =>
                openPreview('product', data.deal.id, 'Performance collection')
              }
            />
          </View>
        ) : null}

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'location_on', ios: 'location.fill' }}
                size={20}
                tintColor={colors.lime}
              />
            )}
            title="Where to find it"
          />
          <LocationCard
            data={data}
            onDirections={openDirections}
            onMall={() =>
              router.push({ pathname: '/malls/[id]', params: { id: data.mall.id } })
            }
          />
        </View>

        <FollowCard
          data={data}
          isFollowing={isFollowing}
          onFollow={() => setIsFollowing((current) => !current)}
        />
        <SponsoredCard
          data={data}
          onPress={() =>
            openPreview('promotion', data.deal.id, 'Featured Deal placement')
          }
        />
      </Screen>
    </ShopperShell>
  );
}
