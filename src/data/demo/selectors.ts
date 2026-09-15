import type {
  Advertisement,
  Booking,
  BookingConfiguration,
  BookingService,
  Category,
  Campaign,
  Deal,
  FavoriteTarget,
  GeoPoint,
  Mall,
  MallEvent,
  MallFloor,
  Product,
  Store,
  User,
} from '../../models';
import { DEMO_LOCATION, DEMO_NOW } from './constants';
import type { DemoDatabase } from './database';
import { demoDatabase } from './database';
import { CURRENT_DEMO_USER_ID } from './ids';

export interface NearbyMall {
  mall: Mall;
  distanceKm: number;
  activeDealCount: number;
  activeStoreCount: number;
}

export interface HomeFeaturedDeal {
  deal: Deal;
  mall: Mall;
  store: Store;
}

export interface HomeUpcomingEvent {
  event: MallEvent;
  mall: Mall;
}

export interface HomeRecommendedStore {
  mall: Mall;
  store: Store;
}

export interface ExploreStore {
  mall: Mall;
  store: Store;
}

export interface ExploreDeal {
  deal: Deal;
  mall: Mall;
  store: Store;
}

export interface ExploreEvent {
  event: MallEvent;
  mall: Mall;
}

export interface ExploreDemoData {
  categories: readonly Category[];
  malls: readonly NearbyMall[];
  stores: readonly ExploreStore[];
  deals: readonly ExploreDeal[];
  events: readonly ExploreEvent[];
}

export interface MallProfileDemoData {
  mall: Mall;
  floors: readonly MallFloor[];
  stores: readonly Store[];
  deals: readonly ExploreDeal[];
  events: readonly MallEvent[];
  isSaved: boolean;
}

export interface StorePromotion {
  advertisement: Advertisement;
  campaign: Campaign;
}

export interface StoreProfileDemoData {
  store: Store;
  mall: Mall;
  floor?: MallFloor;
  categories: readonly Category[];
  products: readonly Product[];
  deals: readonly Deal[];
  bookingServices: readonly BookingService[];
  promotion?: StorePromotion;
  isSaved: boolean;
  isOpenNow: boolean;
}

export interface DealDetailsDemoData {
  deal: Deal;
  store: Store;
  mall: Mall;
  floor?: MallFloor;
  products: readonly Product[];
  isSaved: boolean;
  isStoreSaved: boolean;
}

export interface SavedMall {
  mall: Mall;
  activeDealCount: number;
  activeStoreCount: number;
}

export interface SavedDemoData {
  deals: readonly ExploreDeal[];
  malls: readonly SavedMall[];
  stores: readonly ExploreStore[];
}

export interface ProfileDemoData {
  currentUser: User;
  favoriteMalls: readonly SavedMall[];
  favoriteStores: readonly ExploreStore[];
  savedItemCount: number;
  upcomingBookingCount: number;
}

export interface BookingServiceOption {
  mall: Mall;
  service: BookingService;
  store: Store;
}

export interface BookingTimeOption {
  endsAt: string;
  remainingCapacity: number;
  sessionId?: string;
  startsAt: string;
  time: string;
}

export interface BookingDateOption {
  date: string;
  times: readonly BookingTimeOption[];
}

export interface BookingFlowDemoData extends BookingServiceOption {
  configuration: BookingConfiguration;
  dates: readonly BookingDateOption[];
  services: readonly BookingServiceOption[];
}

export interface ResolvedBooking {
  booking: Booking;
  mall: Mall;
  service: BookingService;
  store: Store;
}

export interface MyBookingsDemoData {
  past: readonly ResolvedBooking[];
  upcoming: readonly ResolvedBooking[];
}

export type ResolvedFavorite =
  | { type: 'mall'; item: Mall }
  | { type: 'store'; item: Store }
  | { type: 'deal'; item: Deal };

export interface HomeDemoData {
  categories: readonly Category[];
  currentUser: User;
  nearbyMalls: readonly NearbyMall[];
  featuredDeals: readonly HomeFeaturedDeal[];
  upcomingEvents: readonly HomeUpcomingEvent[];
  recommendedStores: readonly HomeRecommendedStore[];
  savedItems: readonly ResolvedFavorite[];
  unreadNotificationCount: number;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function distanceInKilometers(from: GeoPoint, to: GeoPoint): number {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(to.latitude - from.latitude);
  const longitudeDelta = toRadians(to.longitude - from.longitude);
  const fromLatitude = toRadians(from.latitude);
  const toLatitude = toRadians(to.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) *
      Math.cos(toLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function selectUserById(
  userId: string,
  database: DemoDatabase = demoDatabase,
): User | undefined {
  return database.users.find((user) => user.id === userId);
}

export function selectNearbyMalls(
  location: GeoPoint = DEMO_LOCATION,
  database: DemoDatabase = demoDatabase,
): readonly NearbyMall[] {
  return database.malls
    .filter((mall) => mall.status === 'active' && mall.coordinates)
    .map((mall) => ({
      mall,
      distanceKm: Number(
        distanceInKilometers(location, mall.coordinates as GeoPoint).toFixed(1),
      ),
      activeDealCount: database.deals.filter(
        (deal) =>
          deal.mallId === mall.id &&
          deal.status === 'active' &&
          Date.parse(deal.startsAt) <= Date.parse(DEMO_NOW) &&
          Date.parse(deal.endsAt) >= Date.parse(DEMO_NOW),
      ).length,
      activeStoreCount: database.stores.filter(
        (store) => store.mallId === mall.id && store.status === 'active',
      ).length,
    }))
    .sort((left, right) => left.distanceKm - right.distanceKm);
}

export function selectActiveDeals(
  now: string = DEMO_NOW,
  database: DemoDatabase = demoDatabase,
): readonly Deal[] {
  const nowValue = Date.parse(now);
  const activeStoreIds = new Set(
    database.stores.filter((store) => store.status === 'active').map(({ id }) => id),
  );
  const activeMallIds = new Set(
    database.malls.filter((mall) => mall.status === 'active').map(({ id }) => id),
  );

  return database.deals
    .filter(
      (deal) =>
        deal.status === 'active' &&
        Date.parse(deal.startsAt) <= nowValue &&
        Date.parse(deal.endsAt) >= nowValue &&
        activeStoreIds.has(deal.storeId) &&
        activeMallIds.has(deal.mallId),
    );
}

export function selectFeaturedDeals(
  now: string = DEMO_NOW,
  database: DemoDatabase = demoDatabase,
): readonly Deal[] {
  return selectActiveDeals(now, database)
    .filter((deal) => deal.isFeatured)
    .sort((left, right) => Number(right.isSponsored) - Number(left.isSponsored));
}

export function selectUpcomingEvents(
  now: string = DEMO_NOW,
  database: DemoDatabase = demoDatabase,
): readonly MallEvent[] {
  const nowValue = Date.parse(now);
  return database.mallEvents
    .filter(
      (event) =>
        event.status === 'active' && Date.parse(event.endsAt) >= nowValue,
    )
    .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt));
}

export function selectRecommendedStores(
  database: DemoDatabase = demoDatabase,
  limit = 6,
): readonly Store[] {
  return [...database.stores]
    .filter((store) => store.status === 'active')
    .sort((left, right) => (right.rating?.average ?? 0) - (left.rating?.average ?? 0))
    .slice(0, limit);
}

export function resolveFavoriteTarget(
  target: FavoriteTarget,
  database: DemoDatabase = demoDatabase,
): ResolvedFavorite | undefined {
  switch (target.type) {
    case 'mall': {
      const item = database.malls.find(({ id }) => id === target.mallId);
      return item ? { type: 'mall', item } : undefined;
    }
    case 'store': {
      const item = database.stores.find(({ id }) => id === target.storeId);
      return item ? { type: 'store', item } : undefined;
    }
    case 'deal': {
      const item = database.deals.find(({ id }) => id === target.dealId);
      return item ? { type: 'deal', item } : undefined;
    }
  }
}

export function selectSavedItems(
  userId: string,
  database: DemoDatabase = demoDatabase,
): readonly ResolvedFavorite[] {
  return database.favorites
    .filter((favorite) => favorite.userId === userId)
    .map((favorite) => resolveFavoriteTarget(favorite.target, database))
    .filter((item): item is ResolvedFavorite => item !== undefined);
}

export function selectSavedDemoData(
  database: DemoDatabase = demoDatabase,
  userId: string = CURRENT_DEMO_USER_ID,
): SavedDemoData {
  const savedItems = selectSavedItems(userId, database);
  const activeDeals = selectActiveDeals(DEMO_NOW, database);
  const activeMalls = database.malls.filter(({ status }) => status === 'active');
  const activeStores = database.stores.filter(({ status }) => status === 'active');

  return {
    deals: savedItems.flatMap((favorite) => {
      if (favorite.type !== 'deal') return [];
      const deal = activeDeals.find(({ id }) => id === favorite.item.id);
      if (!deal) return [];
      const mall = activeMalls.find(({ id }) => id === deal.mallId);
      const store = activeStores.find(({ id }) => id === deal.storeId);
      return mall && store ? [{ deal, mall, store }] : [];
    }),
    stores: savedItems.flatMap((favorite) => {
      if (favorite.type !== 'store') return [];
      const store = activeStores.find(({ id }) => id === favorite.item.id);
      if (!store) return [];
      const mall = activeMalls.find(({ id }) => id === store.mallId);
      return mall ? [{ mall, store }] : [];
    }),
    malls: savedItems.flatMap((favorite) => {
      if (favorite.type !== 'mall') return [];
      const mall = activeMalls.find(({ id }) => id === favorite.item.id);
      if (!mall) return [];
      return [{
        mall,
        activeDealCount: activeDeals.filter(({ mallId }) => mallId === mall.id).length,
        activeStoreCount: activeStores.filter(({ mallId }) => mallId === mall.id).length,
      }];
    }),
  };
}

export function selectProfileDemoData(
  database: DemoDatabase = demoDatabase,
  userId: string = CURRENT_DEMO_USER_ID,
): ProfileDemoData {
  const currentUser = selectUserById(userId, database);
  if (!currentUser) {
    throw new Error(`Demo user not found: ${userId}`);
  }

  const saved = selectSavedDemoData(database, userId);
  const nowValue = Date.parse(DEMO_NOW);
  const upcomingBookingCount = selectBookingsForUser(userId, database).filter(
    (booking) =>
      (booking.status === 'confirmed' || booking.status === 'pending') &&
      Date.parse(booking.endsAt) >= nowValue,
  ).length;

  return {
    currentUser,
    favoriteMalls: saved.malls,
    favoriteStores: saved.stores,
    savedItemCount: saved.deals.length + saved.stores.length + saved.malls.length,
    upcomingBookingCount,
  };
}

export function selectBookingsForUser(
  userId: string,
  database: DemoDatabase = demoDatabase,
  additionalBookings: readonly Booking[] = [],
) {
  return [...database.bookings, ...additionalBookings]
    .filter((booking) => booking.userId === userId)
    .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt));
}

const weekDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function timeToMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const remainder = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${remainder}`;
}

function toJakartaDateTime(date: string, time: string): string {
  return `${date}T${time}:00+07:00`;
}

function compactTimeOptions(
  options: readonly BookingTimeOption[],
): readonly BookingTimeOption[] {
  if (options.length <= 6) return options;
  const lastIndex = options.length - 1;
  const indexes = Array.from(
    { length: 6 },
    (_, index) => Math.round((index * lastIndex) / 5),
  );
  return indexes.map((index) => options[index]).filter(Boolean) as BookingTimeOption[];
}

function recurringBookingDates(
  service: BookingService,
  configuration: BookingConfiguration,
  database: DemoDatabase,
): readonly BookingDateOption[] {
  const dates: BookingDateOption[] = [];
  const startDate = DEMO_NOW.slice(0, 10);

  for (let offset = 0; offset < 14 && dates.length < 4; offset += 1) {
    const date = addDays(startDate, offset);
    const exception = database.availabilityExceptions.find(
      (item) => item.serviceId === service.id && item.date === date,
    );
    if (exception?.isUnavailable) continue;

    const day = weekDays[new Date(`${date}T00:00:00Z`).getUTCDay()];
    const rule = database.availabilityRules.find(
      (item) => item.serviceId === service.id && item.day === day && item.isActive,
    );
    const ranges = exception?.replacementTimeRanges ?? rule?.timeRanges ?? [];
    const options = ranges.flatMap(({ opensAt, closesAt }) => {
      const starts = timeToMinutes(opensAt);
      const closes = timeToMinutes(closesAt);
      const duration = service.durationMinutes ?? configuration.defaultDurationMinutes;
      const values: BookingTimeOption[] = [];

      for (
        let value = starts;
        value + duration <= closes;
        value += configuration.slotIntervalMinutes
      ) {
        const time = minutesToTime(value);
        const endsAt = minutesToTime(value + duration);
        const startsAt = toJakartaDateTime(date, time);
        if (Date.parse(startsAt) < Date.parse(DEMO_NOW)) continue;
        values.push({
          endsAt: toJakartaDateTime(date, endsAt),
          remainingCapacity: exception?.capacityOverride ?? service.capacityPerSlot,
          startsAt,
          time,
        });
      }
      return values;
    });

    if (options.length > 0) {
      dates.push({ date, times: compactTimeOptions(options) });
    }
  }

  return dates;
}

function fixedBookingDates(
  service: BookingService,
  database: DemoDatabase,
): readonly BookingDateOption[] {
  const groups = new Map<string, BookingTimeOption[]>();
  database.bookingSessions
    .filter(
      (session) =>
        session.serviceId === service.id &&
        session.status === 'scheduled' &&
        session.remainingCapacity > 0 &&
        Date.parse(session.startsAt) >= Date.parse(DEMO_NOW),
    )
    .sort((left, right) => Date.parse(left.startsAt) - Date.parse(right.startsAt))
    .forEach((session) => {
      const date = session.startsAt.slice(0, 10);
      const options = groups.get(date) ?? [];
      options.push({
        endsAt: session.endsAt,
        remainingCapacity: session.remainingCapacity,
        sessionId: session.id,
        startsAt: session.startsAt,
        time: session.startsAt.slice(11, 16),
      });
      groups.set(date, options);
    });

  return [...groups.entries()]
    .slice(0, 4)
    .map(([date, times]) => ({ date, times }));
}

export function selectBookingFlowDemoData(
  serviceId: string,
  database: DemoDatabase = demoDatabase,
): BookingFlowDemoData | undefined {
  const services = database.bookingServices
    .filter(({ isActive }) => isActive)
    .flatMap((service) => {
      const store = database.stores.find(
        ({ id, status }) => id === service.storeId && status === 'active',
      );
      const mall = database.malls.find(
        ({ id, status }) => id === service.mallId && status === 'active',
      );
      return store && mall ? [{ mall, service, store }] : [];
    });
  const selected = services.find(({ service }) => service.id === serviceId);
  if (!selected) return undefined;

  const configuration = database.bookingConfigurations.find(
    ({ storeId, isEnabled }) => storeId === selected.store.id && isEnabled,
  );
  if (!configuration) return undefined;

  return {
    ...selected,
    configuration,
    dates:
      selected.service.scheduleMode === 'fixed_sessions'
        ? fixedBookingDates(selected.service, database)
        : recurringBookingDates(selected.service, configuration, database),
    services,
  };
}

export function selectMyBookingsDemoData(
  database: DemoDatabase = demoDatabase,
  userId: string = CURRENT_DEMO_USER_ID,
  additionalBookings: readonly Booking[] = [],
): MyBookingsDemoData {
  const resolved = selectBookingsForUser(
    userId,
    database,
    additionalBookings,
  ).flatMap((booking) => {
    const service = database.bookingServices.find(({ id }) => id === booking.serviceId);
    const store = database.stores.find(({ id }) => id === booking.storeId);
    const mall = database.malls.find(({ id }) => id === booking.mallId);
    return service && store && mall ? [{ booking, mall, service, store }] : [];
  });

  return {
    upcoming: resolved.filter(
      ({ booking }) =>
        (booking.status === 'confirmed' || booking.status === 'pending') &&
        Date.parse(booking.endsAt) >= Date.parse(DEMO_NOW),
    ),
    past: resolved
      .filter(
        ({ booking }) =>
          booking.status === 'completed' ||
          booking.status === 'cancelled' ||
          booking.status === 'no_show' ||
          Date.parse(booking.endsAt) < Date.parse(DEMO_NOW),
      )
      .sort(
        (left, right) =>
          Date.parse(right.booking.startsAt) - Date.parse(left.booking.startsAt),
      ),
  };
}

export function selectBookingDetailsDemoData(
  bookingId: string,
  database: DemoDatabase = demoDatabase,
  additionalBookings: readonly Booking[] = [],
): ResolvedBooking | undefined {
  const booking = [...database.bookings, ...additionalBookings].find(
    ({ id }) => id === bookingId,
  );
  if (!booking) return undefined;
  const service = database.bookingServices.find(({ id }) => id === booking.serviceId);
  const store = database.stores.find(({ id }) => id === booking.storeId);
  const mall = database.malls.find(({ id }) => id === booking.mallId);
  return service && store && mall ? { booking, mall, service, store } : undefined;
}

export function selectHomeDemoData(
  database: DemoDatabase = demoDatabase,
  userId: string = CURRENT_DEMO_USER_ID,
): HomeDemoData {
  const currentUser = selectUserById(userId, database);
  if (!currentUser) {
    throw new Error(`Demo user not found: ${userId}`);
  }

  return {
    categories: database.categories
      .filter((category) => category.status === 'active')
      .sort((left, right) => left.sortOrder - right.sortOrder),
    currentUser,
    nearbyMalls: selectNearbyMalls(DEMO_LOCATION, database).slice(0, 3),
    featuredDeals: selectFeaturedDeals(DEMO_NOW, database)
      .slice(0, 6)
      .flatMap((deal) => {
        const mall = database.malls.find(({ id }) => id === deal.mallId);
        const store = database.stores.find(({ id }) => id === deal.storeId);
        return mall && store ? [{ deal, mall, store }] : [];
      }),
    upcomingEvents: selectUpcomingEvents(DEMO_NOW, database)
      .slice(0, 5)
      .flatMap((event) => {
        const mall = database.malls.find(({ id }) => id === event.mallId);
        return mall ? [{ event, mall }] : [];
      }),
    recommendedStores: selectRecommendedStores(database).flatMap((store) => {
      const mall = database.malls.find(({ id }) => id === store.mallId);
      return mall ? [{ mall, store }] : [];
    }),
    savedItems: selectSavedItems(userId, database),
    unreadNotificationCount: database.notifications.filter(
      (notification) => notification.userId === userId && !notification.readAt,
    ).length,
  };
}

export function selectExploreDemoData(
  database: DemoDatabase = demoDatabase,
): ExploreDemoData {
  const malls = selectNearbyMalls(DEMO_LOCATION, database);
  const activeMallIds = new Set(malls.map(({ mall }) => mall.id));

  return {
    categories: database.categories
      .filter((category) => category.status === 'active')
      .sort((left, right) => left.sortOrder - right.sortOrder),
    malls,
    stores: database.stores
      .filter(
        (store) => store.status === 'active' && activeMallIds.has(store.mallId),
      )
      .flatMap((store) => {
        const mall = database.malls.find(({ id }) => id === store.mallId);
        return mall ? [{ mall, store }] : [];
      })
      .sort(
        (left, right) =>
          (right.store.rating?.average ?? 0) -
          (left.store.rating?.average ?? 0),
      ),
    deals: selectActiveDeals(DEMO_NOW, database).flatMap((deal) => {
      const mall = database.malls.find(({ id }) => id === deal.mallId);
      const store = database.stores.find(({ id }) => id === deal.storeId);
      return mall && store ? [{ deal, mall, store }] : [];
    }),
    events: selectUpcomingEvents(DEMO_NOW, database).flatMap((event) => {
      const mall = database.malls.find(({ id }) => id === event.mallId);
      return mall && activeMallIds.has(mall.id) ? [{ event, mall }] : [];
    }),
  };
}

export function selectMallProfileDemoData(
  mallId: string,
  database: DemoDatabase = demoDatabase,
  userId: string = CURRENT_DEMO_USER_ID,
): MallProfileDemoData | undefined {
  const mall = database.malls.find(
    ({ id, status }) => id === mallId && status === 'active',
  );
  if (!mall) return undefined;

  const stores = database.stores
    .filter((store) => store.mallId === mallId && store.status === 'active')
    .sort(
      (left, right) =>
        (right.rating?.average ?? 0) - (left.rating?.average ?? 0),
    );

  return {
    mall,
    floors: database.mallFloors
      .filter((floor) => floor.mallId === mallId && floor.status === 'active')
      .sort((left, right) => left.sortOrder - right.sortOrder),
    stores,
    deals: selectActiveDeals(DEMO_NOW, database)
      .filter((deal) => deal.mallId === mallId)
      .flatMap((deal) => {
        const store = stores.find(({ id }) => id === deal.storeId);
        return store ? [{ deal, mall, store }] : [];
      }),
    events: selectUpcomingEvents(DEMO_NOW, database).filter(
      (event) => event.mallId === mallId,
    ),
    isSaved: database.favorites.some(
      (favorite) =>
        favorite.userId === userId &&
        favorite.target.type === 'mall' &&
        favorite.target.mallId === mallId,
    ),
  };
}

function isStoreOpenAt(store: Store, timeZone: string, now: string): boolean {
  const date = new Date(now);
  const day = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
  })
    .format(date)
    .toLowerCase();
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    timeZone,
  }).format(date);
  const hours = store.openingHours.find(({ day: itemDay }) => itemDay === day);

  return Boolean(
    hours &&
      !hours.isClosed &&
      hours.periods.some(
        ({ opensAt, closesAt }) => opensAt <= time && time < closesAt,
      ),
  );
}

export function selectStoreProfileDemoData(
  storeId: string,
  database: DemoDatabase = demoDatabase,
  userId: string = CURRENT_DEMO_USER_ID,
): StoreProfileDemoData | undefined {
  const store = database.stores.find(
    ({ id, status }) => id === storeId && status === 'active',
  );
  if (!store) return undefined;

  const mall = database.malls.find(
    ({ id, status }) => id === store.mallId && status === 'active',
  );
  if (!mall) return undefined;

  const campaign = database.campaigns.find(
    (item) =>
      item.status === 'active' &&
      item.owner.type === 'store' &&
      item.owner.storeId === storeId &&
      Date.parse(item.startsAt) <= Date.parse(DEMO_NOW) &&
      Date.parse(item.endsAt) >= Date.parse(DEMO_NOW),
  );
  const advertisement = campaign
    ? database.advertisements.find(
        (item) =>
          item.campaignId === campaign.id &&
          item.status === 'active' &&
          item.placement === 'social_media',
      ) ??
      database.advertisements.find(
        (item) => item.campaignId === campaign.id && item.status === 'active',
      )
    : undefined;

  return {
    store,
    mall,
    floor: database.mallFloors.find(
      ({ id, status }) => id === store.floorId && status === 'active',
    ),
    categories: database.categories.filter(
      ({ id, status }) => store.categoryIds.includes(id) && status === 'active',
    ),
    products: database.products.filter(
      (product) => product.storeId === storeId && product.status === 'active',
    ),
    bookingServices: database.bookingServices.filter(
      (service) => service.storeId === storeId && service.isActive,
    ),
    deals: selectActiveDeals(DEMO_NOW, database).filter(
      (deal) => deal.storeId === storeId,
    ),
    promotion:
      campaign && advertisement ? { advertisement, campaign } : undefined,
    isSaved: database.favorites.some(
      (favorite) =>
        favorite.userId === userId &&
        favorite.target.type === 'store' &&
        favorite.target.storeId === storeId,
    ),
    isOpenNow: isStoreOpenAt(store, mall.timeZone, DEMO_NOW),
  };
}

export function selectDealDetailsDemoData(
  dealId: string,
  database: DemoDatabase = demoDatabase,
  userId: string = CURRENT_DEMO_USER_ID,
): DealDetailsDemoData | undefined {
  const deal = selectActiveDeals(DEMO_NOW, database).find(({ id }) => id === dealId);
  if (!deal) return undefined;

  const store = database.stores.find(
    ({ id, status }) => id === deal.storeId && status === 'active',
  );
  const mall = database.malls.find(
    ({ id, status }) => id === deal.mallId && status === 'active',
  );
  if (!store || !mall) return undefined;

  return {
    deal,
    store,
    mall,
    floor: database.mallFloors.find(
      ({ id, status }) => id === store.floorId && status === 'active',
    ),
    products: deal.productIds.flatMap((productId) => {
      const product = database.products.find(
        ({ id, status }) => id === productId && status === 'active',
      );
      return product ? [product] : [];
    }),
    isSaved: database.favorites.some(
      (favorite) =>
        favorite.userId === userId &&
        favorite.target.type === 'deal' &&
        favorite.target.dealId === dealId,
    ),
    isStoreSaved: database.favorites.some(
      (favorite) =>
        favorite.userId === userId &&
        favorite.target.type === 'store' &&
        favorite.target.storeId === store.id,
    ),
  };
}
