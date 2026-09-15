import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import {
  AppSymbol,
  AppText,
  Badge,
  Button,
  Card,
  InlineMessage,
  PressableCard,
  PriceText,
  Screen,
  SectionHeader,
  ShopperShell,
  TabList,
} from '@/components';
import {
  resolveImageSource,
  selectMallDashboardDemoData,
} from '@/data';
import { formatDateValue, localize, useI18n } from '@/i18n';
import type { CampaignStatus, DealStatus, EntityStatus } from '@/models';
import { colors, imageOverlays } from '@/theme';

import {
  DashboardHeader,
  DashboardSection,
  DetailCard,
  MetricGrid,
  MiniBarChart,
} from './dashboard-shared';

type MallTab =
  | 'overview'
  | 'mall'
  | 'stores'
  | 'deals'
  | 'events'
  | 'campaigns'
  | 'map'
  | 'analytics'
  | 'retailers';

const tabItems = [
  { label: 'Overview', value: 'overview' },
  { label: 'My Mall', value: 'mall' },
  { label: 'Stores', value: 'stores' },
  { label: 'Deals', value: 'deals' },
  { label: 'Events', value: 'events' },
  { label: 'Campaigns', value: 'campaigns' },
  { label: 'Mall Map', value: 'map' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Retailers', value: 'retailers' },
] as const;

function statusVariant(status: CampaignStatus | DealStatus | EntityStatus) {
  if (status === 'active') return 'success' as const;
  if (status === 'pending') return 'warning' as const;
  if (status === 'blocked' || status === 'rejected') return 'danger' as const;
  return 'neutral' as const;
}

export function MallDashboardScreen() {
  const router = useRouter();
  useI18n();
  const data = useMemo(() => selectMallDashboardDemoData(), []);
  const [activeTab, setActiveTab] = useState<MallTab>('overview');
  const [campaignCreated, setCampaignCreated] = useState(false);
  const preview = (kind: string, title: string) => {
    router.push({ pathname: '/preview', params: { kind, title } });
  };

  if (!data) {
    return (
      <ShopperShell activeTab="profile">
        <Screen contentContainerClassName="min-h-full justify-center">
          <InlineMessage title="Mall access unavailable" variant="warning">
            The selected demo user does not have administrator access to this mall.
          </InlineMessage>
        </Screen>
      </ShopperShell>
    );
  }

  const hero = data.mall.coverImages[0];
  const mapFloor = data.floors.find(({ mapImageUrl }) => mapImageUrl);
  const featuredDeals = data.deals.filter(({ isFeatured }) => isFeatured).slice(0, 3);
  const activeCampaigns = data.campaigns.filter(({ status }) => status === 'active');
  const paidSpend = data.payments
    .filter(({ status }) => status === 'paid')
    .reduce((total, payment) => total + payment.amount.amount, 0);
  const address = [
    data.mall.address.line1,
    data.mall.address.district,
    data.mall.address.city,
  ].filter(Boolean).join(', ');

  return (
    <ShopperShell activeTab="profile">
      <Screen contentContainerClassName="gap-xl">
        <DashboardHeader
          eyebrow="SHOPYMALLS MALL"
          onNotifications={() => preview('mall-notifications', 'Mall notifications')}
          subtitle={`${data.user.fullName} · Mall administrator`}
          title={`Welcome, ${data.mall.name}`}
        />

        {hero ? (
          <PressableCard
            accessibilityLabel={`Open ${data.mall.name} profile`}
            className="h-48 justify-end overflow-hidden"
            onPress={() => router.push({ pathname: '/malls/[id]', params: { id: data.mall.id } })}
            padding="none"
          >
            <Image
              accessibilityLabel={localize(hero.alt)}
              contentFit="cover"
              source={resolveImageSource(hero.url)}
              style={{ height: '100%', position: 'absolute', width: '100%' }}
            />
            <View className="absolute inset-0" style={{ backgroundColor: imageOverlays.strong }} />
            <View className="gap-xs p-lg">
              <AppText tone="accent" variant="eyebrow">YOUR SHOPPING ECOSYSTEM</AppText>
              <AppText variant="heroTitle">{data.mall.name.toUpperCase()}</AppText>
              <AppText tone="secondary" variant="caption">Open public mall profile</AppText>
            </View>
          </PressableCard>
        ) : null}

        <DashboardSection>
          <SectionHeader title="Mall performance" />
          <MetricGrid metrics={data.metrics} />
        </DashboardSection>

        <TabList items={tabItems} onValueChange={setActiveTab} value={activeTab} variant="pill" />

        {activeTab === 'overview' ? (
          <>
            <DashboardSection>
              <SectionHeader title="Store activity" />
              <Card className="gap-lg">
                <View className="flex-row items-end justify-between gap-md">
                  <View className="gap-xs">
                    <AppText numeric variant="title">{data.retailerSummary.total}</AppText>
                    <AppText tone="secondary" variant="caption">Store profiles</AppText>
                  </View>
                  <Badge variant="success">{`${data.retailerSummary.active} ACTIVE`}</Badge>
                </View>
                <View className="h-2 overflow-hidden rounded-full bg-surface-overlay">
                  <View
                    className="h-full rounded-full bg-lime"
                    style={{ width: `${(data.retailerSummary.active / data.retailerSummary.total) * 100}%` }}
                  />
                </View>
                <View className="flex-row justify-between gap-md">
                  <AppText numeric tone="warning" variant="caption">{`${data.retailerSummary.pending} pending`}</AppText>
                  <AppText numeric tone="secondary" variant="caption">{`${data.retailerSummary.unregistered} not registered`}</AppText>
                </View>
              </Card>
            </DashboardSection>

            <Card className="gap-lg" variant="highlight">
              <View className="gap-xs">
                <AppText tone="accent" variant="eyebrow">TODAY IN THIS MALL</AppText>
                <AppText variant="titleSmall">A living digital destination</AppText>
              </View>
              <View className="flex-row flex-wrap gap-sm">
                {[
                  ['42', 'Deals'],
                  ['8', 'Events'],
                  ['12', 'New collections'],
                  ['327', 'Store profiles'],
                ].map(([value, label]) => (
                  <View className="min-w-[45%] flex-1 rounded-control bg-surface-raised p-md" key={label}>
                    <AppText numeric tone="accent" variant="titleSmall">{value}</AppText>
                    <AppText tone="secondary" variant="caption">{label}</AppText>
                  </View>
                ))}
              </View>
            </Card>

            <DashboardSection>
              <SectionHeader actionLabel="ALL DEALS" onActionPress={() => setActiveTab('deals')} title="Featured deals" />
              {featuredDeals.map((deal) => (
                <PressableCard
                  accessibilityLabel={`${localize(deal.title)}, ${localize(deal.discountLabel)}`}
                  className="flex-row items-center gap-md"
                  key={deal.id}
                  onPress={() => router.push({ pathname: '/deals/[id]', params: { id: deal.id } })}
                  padding="compact"
                >
                  {deal.image ? (
                    <Image
                      accessibilityLabel={localize(deal.image.alt)}
                      contentFit="cover"
                      source={resolveImageSource(deal.image.url)}
                      style={{ borderRadius: 10, height: 58, width: 58 }}
                    />
                  ) : null}
                  <View className="flex-1 gap-xs">
                    <AppText numberOfLines={1} variant="subheadStrong">{localize(deal.title)}</AppText>
                    <AppText tone="accent" variant="caption">{localize(deal.discountLabel)}</AppText>
                  </View>
                  <Badge variant="success">FEATURED</Badge>
                </PressableCard>
              ))}
            </DashboardSection>

            <Card className="gap-md" variant="highlight">
              <AppText tone="accent" variant="eyebrow">MALL CAMPAIGN</AppText>
              <AppText variant="titleSmall">{activeCampaigns[0]?.name ?? 'Build the next mall campaign'}</AppText>
              <AppText tone="secondary" variant="caption">
                Reach Jakarta shoppers across Shopymalls, mall placements, and social channels.
              </AppText>
              {activeCampaigns[0] ? <PriceText value={activeCampaigns[0].budget.amount} variant="titleSmall" /> : null}
              <Button label="View campaigns" onPress={() => setActiveTab('campaigns')} />
            </Card>
          </>
        ) : null}

        {activeTab === 'mall' ? (
          <DashboardSection>
            <SectionHeader title="My Mall" />
            <DetailCard
              rows={[
                { label: 'Mall name', value: data.mall.name },
                { label: 'Address', value: address },
                { label: 'Opening hours', value: 'Mon–Sun · 10:00–22:00' },
                { label: 'Website', value: data.mall.contact.websiteUrl ?? '—' },
                { label: 'Facilities', value: data.mall.facilities.map(({ label }) => localize(label)).join(' · ') },
              ]}
            />
            <Button label="Edit mall profile" onPress={() => preview('edit-mall', 'Edit mall profile')} />
          </DashboardSection>
        ) : null}

        {activeTab === 'stores' ? (
          <DashboardSection>
            <SectionHeader
              actionLabel="ADD STORE"
              onActionPress={() => preview('add-store', 'Add store')}
              title="Stores"
            />
            {data.stores.map((store) => (
              <PressableCard
                accessibilityLabel={`Open ${store.name} profile`}
                className="flex-row items-center gap-md"
                key={store.id}
                onPress={() => router.push({ pathname: '/stores/[id]', params: { id: store.id } })}
                padding="compact"
              >
                <View className="h-12 w-12 items-center justify-center rounded-control bg-lime-surface-strong">
                  <AppText tone="accent" variant="label">{store.name.slice(0, 2).toUpperCase()}</AppText>
                </View>
                <View className="flex-1 gap-xs">
                  <AppText numberOfLines={1} variant="subheadStrong">{store.name}</AppText>
                  <AppText tone="secondary" variant="caption">{`${store.levelText ?? 'Mall level'} · Unit ${store.unitNumber ?? '—'}`}</AppText>
                </View>
                <Badge variant={statusVariant(store.status)}>{store.status.toUpperCase()}</Badge>
              </PressableCard>
            ))}
            <Button label="Invite retailer" onPress={() => preview('invite-retailer', 'Invite retailer')} />
          </DashboardSection>
        ) : null}

        {activeTab === 'deals' ? (
          <DashboardSection>
            <SectionHeader
              actionLabel="FEATURE"
              onActionPress={() => preview('feature-deal', 'Feature deal')}
              title="Deals"
            />
            {data.deals.map((deal) => (
              <PressableCard
                accessibilityLabel={`${localize(deal.title)}, ${localize(deal.discountLabel)}`}
                className="flex-row items-center gap-md"
                key={deal.id}
                onPress={() => router.push({ pathname: '/deals/[id]', params: { id: deal.id } })}
                padding="compact"
              >
                {deal.image ? (
                  <Image
                    accessibilityLabel={localize(deal.image.alt)}
                    contentFit="cover"
                    source={resolveImageSource(deal.image.url)}
                    style={{ borderRadius: 10, height: 58, width: 58 }}
                  />
                ) : null}
                <View className="flex-1 gap-xs">
                  <AppText numberOfLines={1} variant="subheadStrong">{localize(deal.title)}</AppText>
                  <AppText tone="secondary" variant="caption">{localize(deal.discountLabel)}</AppText>
                </View>
                <Badge variant={deal.isFeatured ? 'success' : statusVariant(deal.status)}>
                  {deal.isFeatured ? 'FEATURED' : deal.status.toUpperCase()}
                </Badge>
              </PressableCard>
            ))}
          </DashboardSection>
        ) : null}

        {activeTab === 'events' ? (
          <DashboardSection>
            <SectionHeader
              actionLabel="PUBLISH"
              onActionPress={() => preview('new-event', 'Publish event')}
              title="Events"
            />
            {data.events.map((event) => (
              <PressableCard
                accessibilityLabel={`Open ${localize(event.title)}`}
                className="flex-row items-center gap-md"
                key={event.id}
                onPress={() => preview('event', localize(event.title))}
              >
                <View className="h-12 w-12 items-center justify-center rounded-control bg-lime-surface-strong">
                  <AppSymbol name={{ android: 'calendar_month', ios: 'calendar' }} size={22} tintColor={colors.lime} />
                </View>
                <View className="flex-1 gap-xs">
                  <AppText numberOfLines={1} variant="subheadStrong">{localize(event.title)}</AppText>
                  <AppText tone="secondary" variant="caption">
                    {`${formatDateValue(event.startsAt, { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })} · ${localize(event.locationText)}`}
                  </AppText>
                </View>
                <Badge variant={statusVariant(event.status)}>{event.status.toUpperCase()}</Badge>
              </PressableCard>
            ))}
            <Button label="Publish event" onPress={() => preview('new-event', 'Publish event')} />
          </DashboardSection>
        ) : null}

        {activeTab === 'campaigns' ? (
          <>
            <DashboardSection>
              <SectionHeader title="Mall campaigns" />
              {data.campaigns.map((campaign) => (
                <Card className="gap-md" key={campaign.id} variant={campaign.status === 'active' ? 'highlight' : 'default'}>
                  <View className="flex-row items-start justify-between gap-md">
                    <View className="flex-1 gap-xs">
                      <AppText variant="titleSmall">{campaign.name}</AppText>
                      <AppText tone="secondary" variant="caption">
                        {`${campaign.audience.cityNames.join(', ')} · ${formatDateValue(campaign.startsAt, { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })}–${formatDateValue(campaign.endsAt, { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })}`}
                      </AppText>
                    </View>
                    <Badge variant={statusVariant(campaign.status)}>{campaign.status.toUpperCase()}</Badge>
                  </View>
                  <PriceText value={campaign.budget.amount} variant="titleSmall" />
                  <View className="flex-row flex-wrap gap-sm">
                    {data.advertisements
                      .filter(({ campaignId }) => campaignId === campaign.id)
                      .map(({ id, placement }) => (
                        <Badge key={id} variant="success">{placement.replace('_', ' ').toUpperCase()}</Badge>
                      ))}
                  </View>
                </Card>
              ))}
            </DashboardSection>
            <Button label="Create mall campaign" onPress={() => setCampaignCreated(true)} />
            {campaignCreated ? (
              <InlineMessage title="Campaign workspace ready" variant="success">
                A coordinated Shopymalls and social campaign draft is ready for the mall team.
              </InlineMessage>
            ) : null}
          </>
        ) : null}

        {activeTab === 'map' ? (
          <DashboardSection>
            <SectionHeader title="Mall Map" />
            <Card className="gap-md">
              <View className="flex-row flex-wrap gap-sm">
                {data.floors.map((floor) => (
                  <Badge key={floor.id} variant={floor.id === mapFloor?.id ? 'accent' : 'neutral'}>
                    {floor.levelCode}
                  </Badge>
                ))}
              </View>
              {mapFloor?.mapImageUrl ? (
                <Image
                  accessibilityLabel={`${data.mall.name} ${localize(mapFloor.name)} floor map`}
                  contentFit="contain"
                  source={resolveImageSource(mapFloor.mapImageUrl)}
                  style={{ borderRadius: 12, height: 260, width: '100%' }}
                />
              ) : (
                <InlineMessage variant="neutral">No floor map image is available.</InlineMessage>
              )}
              <AppText tone="secondary" variant="caption">
                Store locations, floor levels, and shopper wayfinding stay connected.
              </AppText>
            </Card>
            <Button label="Update floor map" onPress={() => preview('floor-map', 'Update floor map')} />
          </DashboardSection>
        ) : null}

        {activeTab === 'analytics' ? (
          <>
            <MiniBarChart
              heights={[50, 72, 88, 64, 104, 120, 138]}
              label="Mall views this week"
              value="128,450"
            />
            <MetricGrid
              metrics={[
                { id: 'top_category', label: 'Top category: Fashion', value: 1 },
                { id: 'top_store', label: 'Top store: Lumen Sneakers', value: 1 },
                { id: 'engagement', label: 'Deal engagement', value: 40 },
                { id: 'directions', label: 'Directions', value: 4_230 },
              ]}
            />
          </>
        ) : null}

        {activeTab === 'retailers' ? (
          <DashboardSection>
            <SectionHeader title="Retailer management" />
            <Card className="gap-lg" variant="highlight">
              <AppText numeric variant="display">{data.retailerSummary.total}</AppText>
              <AppText variant="titleSmall">Stores in your mall</AppText>
              <View className="flex-row flex-wrap gap-sm">
                <Badge variant="success">{`${data.retailerSummary.active} ACTIVE`}</Badge>
                <Badge variant="warning">{`${data.retailerSummary.pending} PENDING`}</Badge>
                <Badge>{`${data.retailerSummary.unregistered} NOT REGISTERED`}</Badge>
              </View>
            </Card>
            {data.retailerUsers.map((user) => {
              const managedStores = user.roleAssignments.flatMap((assignment) => {
                const { scope } = assignment;
                if (scope.type !== 'store') return [];
                const store = data.stores.find(({ id }) => id === scope.storeId);
                return store ? [store.name] : [];
              });
              return (
                <PressableCard
                  accessibilityLabel={`Open ${user.fullName}`}
                  className="flex-row items-center gap-md"
                  key={user.id}
                  onPress={() => preview('retailer', user.fullName)}
                >
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-lime-surface-strong">
                    <AppText tone="accent" variant="label">{user.fullName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</AppText>
                  </View>
                  <View className="flex-1 gap-xs">
                    <AppText variant="subheadStrong">{user.fullName}</AppText>
                    <AppText tone="secondary" variant="caption">{managedStores.join(' · ')}</AppText>
                  </View>
                  <Badge variant="success">ACTIVE</Badge>
                </PressableCard>
              );
            })}
            <Button label="Invite retailers" onPress={() => preview('invite-retailer', 'Invite retailers')} />
            <Card className="flex-row items-center justify-between gap-md">
              <View className="flex-1 gap-xs">
                <AppText variant="subheadStrong">Paid mall and campaign spend</AppText>
                <AppText tone="secondary" variant="caption">Demo billing total</AppText>
              </View>
              <PriceText value={paidSpend} variant="subheadStrong" />
            </Card>
          </DashboardSection>
        ) : null}
      </Screen>
    </ShopperShell>
  );
}
