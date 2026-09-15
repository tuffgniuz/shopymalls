import type {
  Advertisement,
  AnalyticsEvent,
  AnalyticsEventName,
  Campaign,
} from '../../models';
import { demoImageUris } from '../image-uris';
import { idr, text, timestamps } from './helpers';
import { demoIds } from './ids';

export const campaigns: readonly Campaign[] = [
  {
    id: demoIds.campaigns.runnerWeekend,
    owner: { type: 'store', storeId: demoIds.stores.lumenSneakers, mallId: demoIds.malls.aurora },
    createdByUserId: demoIds.users.bima,
    name: 'Weekend Runner Launch',
    goal: 'deal_redemptions',
    audience: { cityNames: ['Jakarta'], mallIds: [demoIds.malls.aurora], interests: ['sneakers', 'fitness', 'streetwear'], minimumAge: 18, maximumAge: 40 },
    budget: idr(12_000_000),
    startsAt: '2026-09-10T00:00:00+07:00',
    endsAt: '2026-09-14T23:59:59+07:00',
    status: 'active',
    ...timestamps(),
  },
  {
    id: demoIds.campaigns.auroraDiscovery,
    owner: { type: 'mall', mallId: demoIds.malls.aurora },
    createdByUserId: demoIds.users.maya,
    name: 'Discover Aurora Central',
    goal: 'store_visits',
    audience: { cityNames: ['Jakarta Pusat', 'Jakarta Selatan'], mallIds: [demoIds.malls.aurora], interests: ['shopping', 'dining', 'entertainment'] },
    budget: idr(30_000_000),
    startsAt: '2026-09-01T00:00:00+07:00',
    endsAt: '2026-09-30T23:59:59+07:00',
    status: 'active',
    ...timestamps(),
  },
  {
    id: demoIds.campaigns.beautyWeek,
    owner: { type: 'store', storeId: demoIds.stores.sariBeauty, mallId: demoIds.malls.aurora },
    createdByUserId: demoIds.users.rizky,
    name: 'Sari Beauty Week',
    goal: 'bookings',
    audience: { cityNames: ['Jakarta'], mallIds: [demoIds.malls.aurora], interests: ['beauty', 'wellness'], minimumAge: 20 },
    budget: idr(8_500_000),
    startsAt: '2026-09-14T00:00:00+07:00',
    endsAt: '2026-09-21T23:59:59+07:00',
    status: 'pending',
    ...timestamps(),
  },
  {
    id: demoIds.campaigns.styleWeek,
    owner: { type: 'mall', mallId: demoIds.malls.aurora },
    createdByUserId: demoIds.users.maya,
    name: 'Jakarta Style Week',
    goal: 'awareness',
    audience: { cityNames: ['Jakarta'], mallIds: [demoIds.malls.aurora, demoIds.malls.nusantara], interests: ['fashion', 'design', 'culture'] },
    budget: idr(45_000_000),
    startsAt: '2026-09-08T00:00:00+07:00',
    endsAt: '2026-09-20T23:59:59+07:00',
    status: 'active',
    ...timestamps(),
  },
  {
    id: demoIds.campaigns.coffeeMorning,
    owner: { type: 'store', storeId: demoIds.stores.kopiTaman, mallId: demoIds.malls.aurora },
    createdByUserId: demoIds.users.bima,
    name: 'Kopi Taman Morning Ritual',
    goal: 'sales',
    audience: { cityNames: ['Jakarta Pusat'], mallIds: [demoIds.malls.aurora], interests: ['coffee', 'breakfast', 'remote work'] },
    budget: idr(4_000_000),
    startsAt: '2026-10-01T00:00:00+07:00',
    endsAt: '2026-10-14T23:59:59+07:00',
    status: 'draft',
    ...timestamps(),
  },
];

export const advertisements: readonly Advertisement[] = [
  { id: demoIds.advertisements.runnerHome, campaignId: demoIds.campaigns.runnerWeekend, placement: 'home_featured', headline: text('Lari lebih jauh akhir pekan ini', 'Go farther this weekend'), body: text('Hemat 30% untuk Obsidian Runner di Lumen Sneakers.', 'Save 30% on Obsidian Runner at Lumen Sneakers.'), creativeUrl: demoImageUris.products.obsidianRunner, destinationDeepLink: `/deals/${demoIds.deals.weekendRunner}`, status: 'active', ...timestamps() },
  { id: demoIds.advertisements.runnerSocial, campaignId: demoIds.campaigns.runnerWeekend, placement: 'social_media', socialChannel: 'instagram', headline: text('Lumen Run Club', 'Lumen Run Club'), body: text('Bergerak bersama setiap Minggu di Aurora Central.', 'Move together every Sunday at Aurora Central.'), creativeUrl: demoImageUris.stores.lumenSneakers, destinationDeepLink: `/stores/${demoIds.stores.lumenSneakers}`, status: 'active', ...timestamps() },
  { id: demoIds.advertisements.auroraExplore, campaignId: demoIds.campaigns.auroraDiscovery, placement: 'explore_featured', headline: text('Hari baru di Aurora', 'A new day at Aurora'), body: text('Temukan toko, kuliner, dan pengalaman di pusat kota.', 'Discover stores, dining, and experiences downtown.'), creativeUrl: demoImageUris.malls.aurora, destinationDeepLink: `/malls/${demoIds.malls.aurora}`, status: 'active', ...timestamps() },
  { id: demoIds.advertisements.beautyPush, campaignId: demoIds.campaigns.beautyWeek, placement: 'push_notification', headline: text('Waktunya merawat diri', 'Time for self-care'), body: text('Pesan Manikur Signature dengan harga spesial.', 'Book a Signature Manicure at a special price.'), creativeUrl: demoImageUris.products.botanicalSet, destinationDeepLink: `/book/${demoIds.bookingServices.salon}`, status: 'pending', ...timestamps() },
  { id: demoIds.advertisements.styleMall, campaignId: demoIds.campaigns.styleWeek, placement: 'mall_featured', headline: text('Jakarta Style Week hadir', 'Jakarta Style Week arrives'), body: text('Runway, lokakarya, dan desainer lokal dalam satu pekan.', 'Runways, workshops, and local designers in one week.'), creativeUrl: demoImageUris.events.styleWeek, destinationDeepLink: `/events/${demoIds.events.styleWeek}`, status: 'active', ...timestamps() },
  { id: demoIds.advertisements.coffeeSocial, campaignId: demoIds.campaigns.coffeeMorning, placement: 'social_media', socialChannel: 'tiktok', headline: text('Mulai pagi dengan kopi lokal', 'Start with local coffee'), body: text('Ritual pagi baru segera hadir di Kopi Taman.', 'A new morning ritual is coming to Kopi Taman.'), creativeUrl: demoImageUris.products.singleOriginCoffee, destinationDeepLink: `/stores/${demoIds.stores.kopiTaman}`, status: 'draft', ...timestamps() },
];

const eventNames: readonly AnalyticsEventName[] = [
  'mall_view',
  'store_view',
  'deal_view',
  'deal_save',
  'directions_tap',
  'store_visit',
  'booking_created',
  'booking_completed',
  'purchase_recorded',
  'advertisement_impression',
  'advertisement_click',
];

const shopperIds = [demoIds.users.alya, demoIds.users.dinda, demoIds.users.fajar, demoIds.users.nisa] as const;
const mallIds = [demoIds.malls.aurora, demoIds.malls.nusantara, demoIds.malls.senayan] as const;
const storeIds = [demoIds.stores.lumenSneakers, demoIds.stores.dapurSenja, demoIds.stores.sariBeauty, demoIds.stores.atelierNusa, demoIds.stores.orbitArcade, demoIds.stores.pulseFitness] as const;
const dealIds = [demoIds.deals.weekendRunner, demoIds.deals.beautyWeek, demoIds.deals.batikEdit, demoIds.deals.playTogether] as const;
const bookingIds = [demoIds.bookings.alyaDinner, demoIds.bookings.alyaPastDinner, demoIds.bookings.dindaSpa, demoIds.bookings.fajarArcade] as const;
const campaignIds = [demoIds.campaigns.runnerWeekend, demoIds.campaigns.auroraDiscovery, demoIds.campaigns.styleWeek] as const;
const advertisementIds = [demoIds.advertisements.runnerHome, demoIds.advertisements.auroraExplore, demoIds.advertisements.styleMall] as const;

export const analyticsEvents: readonly AnalyticsEvent[] = Array.from(
  { length: 120 },
  (_, index) => {
    const eventName = eventNames[index % eventNames.length];
    const occurredAt = new Date(
      Date.parse('2026-09-12T10:00:00+07:00') - index * 37 * 60 * 1000,
    ).toISOString();
    const isDealEvent = eventName === 'deal_view' || eventName === 'deal_save';
    const isBookingEvent = eventName === 'booking_created' || eventName === 'booking_completed';
    const isAdvertisementEvent = eventName === 'advertisement_impression' || eventName === 'advertisement_click';

    return {
      id: `analytics-event-${String(index + 1).padStart(3, '0')}`,
      occurredAt,
      eventName,
      userId: shopperIds[index % shopperIds.length],
      mallId: mallIds[index % mallIds.length],
      storeId: storeIds[index % storeIds.length],
      dealId: isDealEvent ? dealIds[index % dealIds.length] : undefined,
      bookingId: isBookingEvent ? bookingIds[index % bookingIds.length] : undefined,
      campaignId: isAdvertisementEvent ? campaignIds[index % campaignIds.length] : undefined,
      advertisementId: isAdvertisementEvent ? advertisementIds[index % advertisementIds.length] : undefined,
      metadata: {
        source: index % 3 === 0 ? 'home' : index % 3 === 1 ? 'explore' : 'mall_detail',
        demoSequence: index + 1,
      },
    };
  },
);
