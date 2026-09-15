import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  AppSymbol,
  AppText,
  Badge,
  Button,
  Card,
  Chip,
  InlineMessage,
  PressableCard,
  PriceText,
  Screen,
  SectionHeader,
  ShopperShell,
  TabList,
} from '@/components';
import {
  DEMO_NOW,
  resolveImageSource,
  selectRetailerDashboardDemoData,
} from '@/data';
import { formatNumberValue, localize, useI18n } from '@/i18n';
import type {
  CampaignGoal,
  CampaignStatus,
  DailyOpeningHours,
  DealStatus,
} from '@/models';
import { colors } from '@/theme';

import {
  DashboardHeader,
  DashboardSection,
  DetailCard,
  MetricGrid,
  MiniBarChart,
} from './dashboard-shared';

type RetailerTab =
  | 'dashboard'
  | 'store'
  | 'deals'
  | 'products'
  | 'advertise'
  | 'analytics'
  | 'billing';

const tabItems = [
  { label: 'Dashboard', value: 'dashboard' },
  { label: 'My Store', value: 'store' },
  { label: 'Deals', value: 'deals' },
  { label: 'Products', value: 'products' },
  { label: 'Advertise', value: 'advertise' },
  { label: 'Analytics', value: 'analytics' },
  { label: 'Billing', value: 'billing' },
] as const;

const campaignGoals: readonly { goal: CampaignGoal; label: string }[] = [
  { goal: 'awareness', label: 'Get more views' },
  { goal: 'store_visits', label: 'Get more store visits' },
  { goal: 'deal_redemptions', label: 'Promote a deal' },
  { goal: 'bookings', label: 'Get more bookings' },
  { goal: 'sales', label: 'Drive sales' },
];

function statusVariant(status: CampaignStatus | DealStatus) {
  if (status === 'active') return 'success' as const;
  if (status === 'pending') return 'warning' as const;
  if (status === 'rejected') return 'danger' as const;
  return 'neutral' as const;
}

function openingHoursText(openingHours: readonly DailyOpeningHours[]): string {
  const openDays = openingHours.filter(({ isClosed, periods }) => !isClosed && periods.length > 0);
  const firstPeriod = openDays[0]?.periods[0];
  if (!firstPeriod) return 'Hours unavailable';
  return `Mon–Sun · ${firstPeriod.opensAt}–${firstPeriod.closesAt}`;
}

function StoreIdentity({
  onOpen,
  data,
}: {
  data: NonNullable<ReturnType<typeof selectRetailerDashboardDemoData>>;
  onOpen: () => void;
}) {
  const image = data.store.coverImages[0];
  return (
    <PressableCard
      accessibilityLabel={`Open ${data.store.name} profile`}
      className="flex-row items-center gap-md"
      onPress={onOpen}
    >
      {image ? (
        <Image
          accessibilityLabel={localize(image.alt)}
          contentFit="cover"
          source={resolveImageSource(image.url)}
          style={{ borderRadius: 12, height: 68, width: 68 }}
        />
      ) : null}
      <View className="flex-1 gap-xs">
        <View className="flex-row items-center gap-sm">
          <AppText className="flex-1" numberOfLines={1} variant="titleSmall">
            {data.store.name}
          </AppText>
          <Badge variant="success">ACTIVE</Badge>
        </View>
        <AppText tone="secondary" variant="caption">
          {`${data.mall.name} · ${data.store.levelText ?? localize(data.floor?.name ?? { en: 'Mall level', id: 'Lantai mall' })} · Unit ${data.store.unitNumber ?? '—'}`}
        </AppText>
        <AppText numberOfLines={2} tone="secondary" variant="caption">
          {localize(data.store.description)}
        </AppText>
      </View>
      <AppSymbol
        name={{ android: 'chevron_right', ios: 'chevron.right' }}
        size={18}
        tintColor={colors.textPrimary}
      />
    </PressableCard>
  );
}

function CustomerJourney({
  journey,
}: {
  journey: NonNullable<ReturnType<typeof selectRetailerDashboardDemoData>>['journey'];
}) {
  return (
    <Card className="gap-lg">
      <View className="gap-xs">
        <AppText tone="accent" variant="eyebrow">CONNECTED CUSTOMER JOURNEY</AppText>
        <AppText variant="titleSmall">From discovery to sale</AppText>
        <AppText tone="secondary" variant="caption">
          One view of how Shopymalls activity turns into physical-store outcomes.
        </AppText>
      </View>
      <View className="flex-row flex-wrap gap-sm">
        {journey.map((step, index) => (
          <View className="min-w-[30%] flex-1 gap-xs rounded-control bg-surface-raised p-md" key={step.id}>
            <View className="flex-row items-center justify-between">
              <AppText tone="tertiary" variant="micro">{String(index + 1).padStart(2, '0')}</AppText>
              {step.changePercent ? (
                <AppText numeric tone="accent" variant="micro">{`+${step.changePercent}%`}</AppText>
              ) : null}
            </View>
            <AppText numeric variant="section">
              {formatNumberValue(step.value, { notation: step.value >= 10_000 ? 'compact' : 'standard' })}
            </AppText>
            <AppText tone="secondary" variant="caption">{step.label}</AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

export function RetailerDashboardScreen() {
  const router = useRouter();
  useI18n();
  const data = useMemo(() => selectRetailerDashboardDemoData(), []);
  const [activeTab, setActiveTab] = useState<RetailerTab>('dashboard');
  const [selectedGoal, setSelectedGoal] = useState<CampaignGoal>('store_visits');
  const [campaignGenerated, setCampaignGenerated] = useState(false);
  const preview = (kind: string, title: string) => {
    router.push({ pathname: '/preview', params: { kind, title } });
  };

  if (!data) {
    return (
      <ShopperShell activeTab="profile">
        <Screen contentContainerClassName="min-h-full justify-center">
          <InlineMessage title="Retailer access unavailable" variant="warning">
            The selected demo user does not have retailer access to this store.
          </InlineMessage>
        </Screen>
      </ShopperShell>
    );
  }

  const activeDeals = data.deals.filter(
    ({ endsAt, startsAt, status }) =>
      status === 'active' &&
      Date.parse(startsAt) <= Date.parse(DEMO_NOW) &&
      Date.parse(endsAt) >= Date.parse(DEMO_NOW),
  );
  const activeCampaign = data.campaigns.find(({ status }) => status === 'active');
  const paidSpend = data.payments
    .filter(({ status }) => status === 'paid')
    .reduce((total, payment) => total + payment.amount.amount, 0);

  return (
    <ShopperShell activeTab="profile">
      <Screen contentContainerClassName="gap-xl">
        <DashboardHeader
          eyebrow="SHOPYMALLS BUSINESS"
          onNotifications={() => preview('business-notifications', 'Business notifications')}
          subtitle={`${data.mall.name} · ${data.store.levelText ?? 'Mall level'} · Unit ${data.store.unitNumber ?? '—'}`}
          title={`Welcome, ${data.store.name}`}
        />

        <Card className="flex-row items-center gap-md" variant="highlight">
          <View className="flex-1 gap-xs">
            <Badge variant="accent">{`${data.subscription?.plan.toUpperCase() ?? 'FREE'} ACCOUNT`}</Badge>
            <AppText variant="titleSmall">Grow your store on Shopymalls</AppText>
            <AppText tone="secondary" variant="caption">
              Manage content, offers, campaigns, bookings, and results.
            </AppText>
          </View>
          <View className="h-14 w-14 items-center justify-center rounded-control bg-lime-surface-strong">
            <AppSymbol name={{ android: 'rocket_launch', ios: 'paperplane' }} size={26} tintColor={colors.lime} />
          </View>
        </Card>

        <DashboardSection>
          <SectionHeader title="Your performance" />
          <MetricGrid metrics={data.metrics} />
        </DashboardSection>

        <TabList
          items={tabItems}
          onValueChange={setActiveTab}
          value={activeTab}
          variant="pill"
        />

        {activeTab === 'dashboard' ? (
          <>
            <DashboardSection>
              <SectionHeader
                actionLabel="OPEN"
                onActionPress={() => router.push({ pathname: '/stores/[id]', params: { id: data.store.id } })}
                title="My Store"
              />
              <StoreIdentity
                data={data}
                onOpen={() => router.push({ pathname: '/stores/[id]', params: { id: data.store.id } })}
              />
            </DashboardSection>

            <DashboardSection>
              <SectionHeader title="Customer journey" />
              <CustomerJourney journey={data.journey} />
            </DashboardSection>

            <DashboardSection>
              <SectionHeader title="Active deals" />
              {activeDeals.map((deal) => (
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
                    <AppText tone="accent" variant="subheadStrong">{localize(deal.discountLabel)}</AppText>
                    <AppText numberOfLines={1} variant="caption">{localize(deal.title)}</AppText>
                  </View>
                  <Badge variant="success">ACTIVE</Badge>
                </PressableCard>
              ))}
            </DashboardSection>

            <Card className="gap-md" variant="highlight">
              <View className="flex-row items-start gap-md">
                <View className="h-12 w-12 items-center justify-center rounded-control bg-lime-surface-strong">
                  <AppSymbol name={{ android: 'auto_awesome', ios: 'sparkles' }} size={23} tintColor={colors.lime} />
                </View>
                <View className="flex-1 gap-xs">
                  <AppText tone="accent" variant="eyebrow">ONE OFFER, EVERY CHANNEL</AppText>
                  <AppText variant="titleSmall">Turn your next offer into a campaign</AppText>
                  <AppText tone="secondary" variant="caption">
                    Prepare Shopymalls placements, push copy, and social concepts from one brief.
                  </AppText>
                </View>
              </View>
              <View className="flex-row flex-wrap gap-sm">
                {['Home', 'Mall', 'Push', 'Instagram', 'TikTok'].map((channel) => (
                  <Badge key={channel} variant="success">{channel.toUpperCase()}</Badge>
                ))}
              </View>
              <Button label="Create campaign" onPress={() => setActiveTab('advertise')} />
            </Card>
          </>
        ) : null}

        {activeTab === 'store' ? (
          <DashboardSection>
            <SectionHeader title="Store profile" />
            <DetailCard
              rows={[
                { label: 'Store name', value: data.store.name },
                { label: 'Mall', value: data.mall.name },
                { label: 'Floor / unit', value: `${data.store.levelText ?? '—'} · Unit ${data.store.unitNumber ?? '—'}` },
                { label: 'Opening hours', value: openingHoursText(data.store.openingHours) },
                { label: 'Email', value: data.store.contact.email ?? '—' },
                { label: 'Instagram', value: data.store.socialLinks.instagramUrl?.replace('https://instagram.com/', '@') ?? '—' },
                { label: 'TikTok', value: data.store.socialLinks.tiktokUrl?.replace('https://tiktok.com/', '') ?? '—' },
              ]}
            />
            <Button label="Edit store profile" onPress={() => preview('edit-store', 'Edit store profile')} />
          </DashboardSection>
        ) : null}

        {activeTab === 'deals' ? (
          <DashboardSection>
            <SectionHeader
              actionLabel="NEW DEAL"
              onActionPress={() => preview('new-deal', 'Create deal')}
              title={`${activeDeals.length} active deal${activeDeals.length === 1 ? '' : 's'}`}
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
                    style={{ borderRadius: 10, height: 64, width: 64 }}
                  />
                ) : null}
                <View className="flex-1 gap-xs">
                  <AppText tone="accent" variant="subheadStrong">{localize(deal.discountLabel)}</AppText>
                  <AppText numberOfLines={1} variant="caption">{localize(deal.title)}</AppText>
                </View>
                <Badge variant={statusVariant(deal.status)}>{deal.status.toUpperCase()}</Badge>
              </PressableCard>
            ))}
            <Button label="Create new deal" onPress={() => preview('new-deal', 'Create deal')} />
          </DashboardSection>
        ) : null}

        {activeTab === 'products' ? (
          <DashboardSection>
            <SectionHeader
              actionLabel="ADD"
              onActionPress={() => preview('new-product', 'Add product')}
              title="Products"
            />
            <ScrollView contentContainerClassName="gap-sm" horizontal showsHorizontalScrollIndicator={false}>
              {data.products.map((product) => (
                <PressableCard
                  accessibilityLabel={`Open ${localize(product.name)}`}
                  className="w-44 gap-md"
                  key={product.id}
                  onPress={() => preview('product', localize(product.name))}
                  padding="compact"
                >
                  {product.images[0] ? (
                    <Image
                      accessibilityLabel={localize(product.images[0].alt)}
                      contentFit="cover"
                      source={resolveImageSource(product.images[0].url)}
                      style={{ borderRadius: 10, height: 120, width: '100%' }}
                    />
                  ) : null}
                  <View className="gap-xs">
                    <AppText numberOfLines={1} variant="subheadStrong">{localize(product.name)}</AppText>
                    <PriceText value={product.salePrice?.amount ?? product.price.amount} variant="caption" />
                    <Badge variant={product.status === 'active' ? 'success' : 'warning'}>
                      {product.status.toUpperCase()}
                    </Badge>
                  </View>
                </PressableCard>
              ))}
            </ScrollView>
            <Button label="Add product" onPress={() => preview('new-product', 'Add product')} />
          </DashboardSection>
        ) : null}

        {activeTab === 'advertise' ? (
          <>
            <DashboardSection>
              <SectionHeader title="Campaign goal" />
              <Card className="gap-md">
                <AppText variant="titleSmall">What do you want to achieve?</AppText>
                <View className="flex-row flex-wrap gap-sm">
                  {campaignGoals.map(({ goal, label }) => (
                    <Chip
                      key={goal}
                      label={label}
                      onPress={() => {
                        setSelectedGoal(goal);
                        setCampaignGenerated(false);
                      }}
                      selected={selectedGoal === goal}
                    />
                  ))}
                </View>
              </Card>
            </DashboardSection>
            <Card className="gap-md">
              <AppText tone="accent" variant="eyebrow">AUTOMATIC CAMPAIGN KIT</AppText>
              {['Shopymalls post', 'Mall placement', 'Push notification', 'Instagram caption', 'TikTok concept', 'Target audience'].map((item) => (
                <View className="flex-row items-center gap-sm" key={item}>
                  <AppSymbol name={{ android: 'check_circle', ios: 'checkmark.circle.fill' }} size={18} tintColor={colors.lime} />
                  <AppText className="flex-1" variant="subheadStrong">{item}</AppText>
                </View>
              ))}
            </Card>
            <Card className="gap-md" variant="highlight">
              <AppText tone="accent" variant="eyebrow">SUGGESTED BUDGET</AppText>
              <PriceText value={12_000_000} variant="title" />
              <AppText tone="secondary" variant="caption">7 days · Estimated reach 25K–50K shoppers</AppText>
              <Button
                label="Generate campaign kit"
                onPress={() => setCampaignGenerated(true)}
                trailing={(color) => <AppSymbol name={{ android: 'auto_awesome', ios: 'sparkles' }} size={17} tintColor={color} />}
              />
            </Card>
            {campaignGenerated ? (
              <InlineMessage title="Campaign kit ready" variant="success">
                Six coordinated draft assets are ready for review in this prototype.
              </InlineMessage>
            ) : null}
          </>
        ) : null}

        {activeTab === 'analytics' ? (
          <>
            <MiniBarChart
              heights={[46, 72, 58, 94, 80, 116, 132]}
              label="Profile views this week"
              value="24,580"
            />
            <CustomerJourney journey={data.journey} />
          </>
        ) : null}

        {activeTab === 'billing' ? (
          <DashboardSection>
            <SectionHeader title="Billing" />
            <Card className="gap-lg" variant="highlight">
              <View className="flex-row items-center justify-between gap-md">
                <View className="gap-xs">
                  <AppText tone="accent" variant="eyebrow">CURRENT PLAN</AppText>
                  <AppText variant="title">{data.subscription?.plan.toUpperCase() ?? 'FREE'}</AppText>
                  <AppText tone="secondary" variant="caption">Retailer tools and coordinated promotions</AppText>
                </View>
                <Badge variant="success">{data.subscription?.status.toUpperCase() ?? 'ACTIVE'}</Badge>
              </View>
              <View className="border-t border-lime-border pt-md">
                <AppText tone="secondary" variant="caption">Paid subscription and campaign spend</AppText>
                <PriceText value={paidSpend} variant="titleSmall" />
              </View>
              <Button label="Manage billing" onPress={() => preview('billing', 'Manage billing')} />
            </Card>
            {activeCampaign ? (
              <Card className="flex-row items-center justify-between gap-md">
                <View className="flex-1 gap-xs">
                  <AppText variant="subheadStrong">{activeCampaign.name}</AppText>
                  <AppText tone="secondary" variant="caption">Active campaign budget</AppText>
                </View>
                <PriceText value={activeCampaign.budget.amount} variant="subheadStrong" />
              </Card>
            ) : null}
          </DashboardSection>
        ) : null}
      </Screen>
    </ShopperShell>
  );
}
