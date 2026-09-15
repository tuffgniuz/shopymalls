import {
  can,
  type Advertisement,
  type Booking,
  type Campaign,
  type Deal,
  type Mall,
  type MallEvent,
  type MallFloor,
  type Payment,
  type Product,
  type Store,
  type Subscription,
  type User,
} from '../../models';
import type { DemoDatabase } from './database';
import { demoDatabase } from './database';
import { demoIds } from './ids';

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
}

export interface JourneyMetric extends DashboardMetric {
  changePercent?: number;
}

export interface RetailerDashboardDemoData {
  advertisements: readonly Advertisement[];
  bookings: readonly Booking[];
  campaigns: readonly Campaign[];
  deals: readonly Deal[];
  floor?: MallFloor;
  journey: readonly JourneyMetric[];
  mall: Mall;
  metrics: readonly DashboardMetric[];
  payments: readonly Payment[];
  products: readonly Product[];
  store: Store;
  subscription?: Subscription;
  user: User;
}

export interface MallRetailerSummary {
  active: number;
  pending: number;
  total: number;
  unregistered: number;
}

export interface MallDashboardDemoData {
  advertisements: readonly Advertisement[];
  bookings: readonly Booking[];
  campaigns: readonly Campaign[];
  deals: readonly Deal[];
  events: readonly MallEvent[];
  floors: readonly MallFloor[];
  mall: Mall;
  metrics: readonly DashboardMetric[];
  payments: readonly Payment[];
  retailerSummary: MallRetailerSummary;
  retailerUsers: readonly User[];
  stores: readonly Store[];
  subscription?: Subscription;
  user: User;
}

const retailerMetrics: readonly DashboardMetric[] = [
  { id: 'store_view', label: 'Profile views', value: 24_580 },
  { id: 'deal_view', label: 'Deal views', value: 8_420 },
  { id: 'deal_save', label: 'Saves', value: 1_284 },
  { id: 'directions_tap', label: 'Directions', value: 637 },
];

const retailerJourney: readonly JourneyMetric[] = [
  { id: 'views', label: 'Views', value: 24_580, changePercent: 18 },
  { id: 'saves', label: 'Saves', value: 1_284, changePercent: 12 },
  { id: 'directions', label: 'Directions', value: 637, changePercent: 9 },
  { id: 'visits', label: 'Visits', value: 421, changePercent: 7 },
  { id: 'bookings', label: 'Bookings', value: 96, changePercent: 14 },
  { id: 'sales', label: 'Sales', value: 74, changePercent: 11 },
];

const mallMetrics: readonly DashboardMetric[] = [
  { id: 'mall_view', label: 'Mall views', value: 128_450 },
  { id: 'store_profiles', label: 'Store profiles', value: 327 },
  { id: 'active_deals', label: 'Active deals', value: 42 },
  { id: 'events', label: 'Events', value: 8 },
  { id: 'saves', label: 'Saves', value: 12_840 },
  { id: 'directions', label: 'Directions', value: 4_230 },
];

const mallRetailerSummary: MallRetailerSummary = {
  active: 248,
  pending: 52,
  total: 327,
  unregistered: 27,
};

export function selectRetailerDashboardDemoData(
  userId: string = demoIds.users.bima,
  storeId: string = demoIds.stores.lumenSneakers,
  database: DemoDatabase = demoDatabase,
): RetailerDashboardDemoData | undefined {
  const user = database.users.find(({ id }) => id === userId);
  const store = database.stores.find(({ id }) => id === storeId);
  if (!user || !store || !can(user, 'store.read_private', { storeId })) return undefined;

  const mall = database.malls.find(({ id }) => id === store.mallId);
  if (!mall) return undefined;

  const campaigns = database.campaigns.filter(
    ({ owner }) => owner.type === 'store' && owner.storeId === store.id,
  );
  const campaignIds = new Set(campaigns.map(({ id }) => id));
  const subscription = database.subscriptions.find(
    ({ owner }) => owner.type === 'store' && owner.storeId === store.id,
  );
  const paymentPurposeIds = new Set([
    ...campaignIds,
    ...(subscription ? [subscription.id] : []),
  ]);

  return {
    advertisements: database.advertisements.filter(({ campaignId }) => campaignIds.has(campaignId)),
    bookings: database.bookings.filter(({ storeId: id }) => id === store.id),
    campaigns,
    deals: database.deals.filter(({ storeId: id }) => id === store.id),
    floor: database.mallFloors.find(({ id }) => id === store.floorId),
    journey: retailerJourney,
    mall,
    metrics: retailerMetrics,
    payments: database.payments.filter(({ purpose }) =>
      paymentPurposeIds.has(
        purpose.type === 'campaign' ? purpose.campaignId : purpose.subscriptionId,
      ),
    ),
    products: database.products.filter(({ storeId: id }) => id === store.id),
    store,
    subscription,
    user,
  };
}

export function selectMallDashboardDemoData(
  userId: string = demoIds.users.maya,
  mallId: string = demoIds.malls.aurora,
  database: DemoDatabase = demoDatabase,
): MallDashboardDemoData | undefined {
  const user = database.users.find(({ id }) => id === userId);
  const mall = database.malls.find(({ id }) => id === mallId);
  if (!user || !mall || !can(user, 'mall.read_private', { mallId })) return undefined;

  const stores = database.stores.filter(({ mallId: id }) => id === mall.id);
  const storeIds = new Set(stores.map(({ id }) => id));
  const campaigns = database.campaigns.filter(
    ({ owner }) => owner.type === 'mall' && owner.mallId === mall.id,
  );
  const campaignIds = new Set(campaigns.map(({ id }) => id));
  const subscription = database.subscriptions.find(
    ({ owner }) => owner.type === 'mall' && owner.mallId === mall.id,
  );
  const paymentPurposeIds = new Set([
    ...campaignIds,
    ...(subscription ? [subscription.id] : []),
  ]);

  return {
    advertisements: database.advertisements.filter(({ campaignId }) => campaignIds.has(campaignId)),
    bookings: database.bookings.filter(({ mallId: id }) => id === mall.id),
    campaigns,
    deals: database.deals.filter(({ mallId: id }) => id === mall.id),
    events: database.mallEvents.filter(({ mallId: id }) => id === mall.id),
    floors: database.mallFloors
      .filter(({ mallId: id }) => id === mall.id)
      .sort((left, right) => left.sortOrder - right.sortOrder),
    mall,
    metrics: mallMetrics,
    payments: database.payments.filter(({ purpose }) =>
      paymentPurposeIds.has(
        purpose.type === 'campaign' ? purpose.campaignId : purpose.subscriptionId,
      ),
    ),
    retailerSummary: mallRetailerSummary,
    retailerUsers: database.users.filter((candidate) =>
      candidate.roleAssignments.some(
        ({ role, scope, status }) =>
          status === 'active' &&
          (role === 'retailer_admin' || role === 'retailer_staff') &&
          scope.type === 'store' &&
          storeIds.has(scope.storeId),
      ),
    ),
    stores,
    subscription,
    user,
  };
}
