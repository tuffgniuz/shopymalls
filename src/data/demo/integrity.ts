import { can, type BaseEntity, type Money, type User } from '../../models';
import { demoImageUris } from '../image-uris';
import type { DemoDatabase } from './database';
import { demoDatabase } from './database';
import { demoIds } from './ids';

type IssueCollector = (message: string) => void;

function makeIdSet(items: readonly { id: string }[]): Set<string> {
  return new Set(items.map(({ id }) => id));
}

function checkUniqueIds(
  label: string,
  items: readonly BaseEntity[] | readonly { id: string }[],
  issue: IssueCollector,
): void {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) issue(`${label} contains duplicate id "${item.id}".`);
    seen.add(item.id);
  }
}

function checkReference(
  source: string,
  value: string,
  targets: ReadonlySet<string>,
  issue: IssueCollector,
): void {
  if (!targets.has(value)) issue(`${source} references missing id "${value}".`);
}

function checkMoney(label: string, money: Money | undefined, issue: IssueCollector): void {
  if (!money) return;
  if (money.currency !== 'IDR') issue(`${label} must use IDR.`);
  if (!Number.isSafeInteger(money.amount) || money.amount < 0) {
    issue(`${label} must use a non-negative whole-rupiah amount.`);
  }
}

function flattenStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (!value || typeof value !== 'object') return [];
  return Object.values(value).flatMap(flattenStrings);
}

function validateImages(database: DemoDatabase, issue: IssueCollector): void {
  const registeredImages = new Set(flattenStrings(demoImageUris));
  const references: readonly (readonly [
    label: string,
    url: string | undefined,
  ])[] = [
    ...database.users.map((item) => [`user ${item.id}`, item.avatarUrl] as const),
    ...database.malls.flatMap((item) => item.coverImages.map((media) => [`mall ${item.id}`, media.url] as const)),
    ...database.mallFloors.map((item) => [`floor ${item.id}`, item.mapImageUrl] as const),
    ...database.stores.flatMap((item) => item.coverImages.map((media) => [`store ${item.id}`, media.url] as const)),
    ...database.products.flatMap((item) => item.images.map((media) => [`product ${item.id}`, media.url] as const)),
    ...database.deals.map((item) => [`deal ${item.id}`, item.image?.url] as const),
    ...database.mallEvents.map((item) => [`event ${item.id}`, item.image?.url] as const),
    ...database.advertisements.map((item) => [`advertisement ${item.id}`, item.creativeUrl] as const),
  ];

  for (const [label, url] of references) {
    if (url?.startsWith('asset://') && !registeredImages.has(url)) {
      issue(`${label} uses unregistered image URI "${url}".`);
    }
  }
}

function findUser(database: DemoDatabase, userId: string): User | undefined {
  return database.users.find(({ id }) => id === userId);
}

function validateAuthorization(database: DemoDatabase, issue: IssueCollector): void {
  const alya = findUser(database, demoIds.users.alya);
  const bima = findUser(database, demoIds.users.bima);
  const tono = findUser(database, demoIds.users.tono);
  const maya = findUser(database, demoIds.users.maya);
  const rizky = findUser(database, demoIds.users.rizky);

  if (!alya || !can(alya, 'favorites.manage_own', { ownerUserId: alya.id })) {
    issue('Shopper authorization fixture cannot manage its own favorites.');
  }
  if (!bima || !can(bima, 'store.update', { storeId: demoIds.stores.lumenSneakers })) {
    issue('Retailer admin authorization fixture cannot update Lumen Sneakers.');
  }
  if (bima && can(bima, 'store.update', { storeId: demoIds.stores.teknoHub })) {
    issue('Retailer admin authorization fixture can update an unrelated store.');
  }
  if (tono && can(tono, 'store.billing_manage', { storeId: demoIds.stores.dapurSenja })) {
    issue('Retailer staff authorization fixture can manage store billing.');
  }
  if (!maya || !can(maya, 'mall.deals_moderate', { mallId: demoIds.malls.aurora })) {
    issue('Mall admin authorization fixture cannot moderate Aurora deals.');
  }
  if (maya && can(maya, 'mall.update', { mallId: demoIds.malls.nusantara })) {
    issue('Mall admin authorization fixture can update an unrelated mall.');
  }
  if (!rizky || !can(rizky, 'platform.users_manage')) {
    issue('Platform admin authorization fixture cannot manage users.');
  }
}

export function validateDemoData(database: DemoDatabase = demoDatabase): readonly string[] {
  const issues: string[] = [];
  const issue: IssueCollector = (message) => issues.push(message);
  const collections: readonly [string, readonly { id: string }[]][] = [
    ['users', database.users],
    ['categories', database.categories],
    ['malls', database.malls],
    ['mall floors', database.mallFloors],
    ['stores', database.stores],
    ['products', database.products],
    ['deals', database.deals],
    ['mall events', database.mallEvents],
    ['booking configurations', database.bookingConfigurations],
    ['booking services', database.bookingServices],
    ['availability rules', database.availabilityRules],
    ['availability exceptions', database.availabilityExceptions],
    ['booking sessions', database.bookingSessions],
    ['bookings', database.bookings],
    ['favorites', database.favorites],
    ['notifications', database.notifications],
    ['campaigns', database.campaigns],
    ['advertisements', database.advertisements],
    ['analytics events', database.analyticsEvents],
    ['subscriptions', database.subscriptions],
    ['payments', database.payments],
  ];
  collections.forEach(([label, items]) => checkUniqueIds(label, items, issue));

  const users = makeIdSet(database.users);
  const categories = makeIdSet(database.categories);
  const malls = makeIdSet(database.malls);
  const floors = makeIdSet(database.mallFloors);
  const stores = makeIdSet(database.stores);
  const products = makeIdSet(database.products);
  const deals = makeIdSet(database.deals);
  const events = makeIdSet(database.mallEvents);
  const services = makeIdSet(database.bookingServices);
  const sessions = makeIdSet(database.bookingSessions);
  const bookings = makeIdSet(database.bookings);
  const campaigns = makeIdSet(database.campaigns);
  const advertisements = makeIdSet(database.advertisements);
  const subscriptions = makeIdSet(database.subscriptions);

  for (const user of database.users) {
    for (const assignment of user.roleAssignments) {
      if (assignment.userId !== user.id) issue(`role ${assignment.id} has the wrong userId.`);
      if (assignment.scope.type === 'store') checkReference(`role ${assignment.id}`, assignment.scope.storeId, stores, issue);
      if (assignment.scope.type === 'mall') checkReference(`role ${assignment.id}`, assignment.scope.mallId, malls, issue);
    }
  }
  for (const floor of database.mallFloors) checkReference(`floor ${floor.id}`, floor.mallId, malls, issue);
  for (const store of database.stores) {
    checkReference(`store ${store.id}`, store.mallId, malls, issue);
    store.categoryIds.forEach((id) => checkReference(`store ${store.id}`, id, categories, issue));
    if (store.floorId) {
      checkReference(`store ${store.id}`, store.floorId, floors, issue);
      const floor = database.mallFloors.find(({ id }) => id === store.floorId);
      if (floor && floor.mallId !== store.mallId) issue(`store ${store.id} uses a floor from another mall.`);
    }
  }
  for (const product of database.products) {
    checkReference(`product ${product.id}`, product.storeId, stores, issue);
    if (product.categoryId) checkReference(`product ${product.id}`, product.categoryId, categories, issue);
    checkMoney(`product ${product.id} price`, product.price, issue);
    checkMoney(`product ${product.id} sale price`, product.salePrice, issue);
    if (product.salePrice && product.salePrice.amount >= product.price.amount) issue(`product ${product.id} sale price is not below its regular price.`);
  }
  for (const deal of database.deals) {
    checkReference(`deal ${deal.id}`, deal.storeId, stores, issue);
    checkReference(`deal ${deal.id}`, deal.mallId, malls, issue);
    const store = database.stores.find(({ id }) => id === deal.storeId);
    if (store && store.mallId !== deal.mallId) issue(`deal ${deal.id} has mismatched store and mall.`);
    for (const productId of deal.productIds) {
      checkReference(`deal ${deal.id}`, productId, products, issue);
      const product = database.products.find(({ id }) => id === productId);
      if (product && product.storeId !== deal.storeId) issue(`deal ${deal.id} includes a product from another store.`);
    }
    if (Date.parse(deal.startsAt) >= Date.parse(deal.endsAt)) issue(`deal ${deal.id} has an invalid date range.`);
  }
  for (const event of database.mallEvents) {
    checkReference(`event ${event.id}`, event.mallId, malls, issue);
    if (event.storeId) {
      checkReference(`event ${event.id}`, event.storeId, stores, issue);
      const store = database.stores.find(({ id }) => id === event.storeId);
      if (store && store.mallId !== event.mallId) issue(`event ${event.id} has mismatched store and mall.`);
    }
  }
  for (const configuration of database.bookingConfigurations) checkReference(`booking configuration ${configuration.id}`, configuration.storeId, stores, issue);
  for (const service of database.bookingServices) {
    checkReference(`booking service ${service.id}`, service.mallId, malls, issue);
    checkReference(`booking service ${service.id}`, service.storeId, stores, issue);
    if (service.eventId) checkReference(`booking service ${service.id}`, service.eventId, events, issue);
    const store = database.stores.find(({ id }) => id === service.storeId);
    if (store && store.mallId !== service.mallId) issue(`booking service ${service.id} has mismatched store and mall.`);
    checkMoney(`booking service ${service.id} price`, service.price, issue);
  }
  for (const rule of database.availabilityRules) checkReference(`availability rule ${rule.id}`, rule.serviceId, services, issue);
  for (const exception of database.availabilityExceptions) checkReference(`availability exception ${exception.id}`, exception.serviceId, services, issue);
  for (const session of database.bookingSessions) {
    checkReference(`booking session ${session.id}`, session.serviceId, services, issue);
    if (session.remainingCapacity < 0 || session.remainingCapacity > session.capacity) issue(`booking session ${session.id} has invalid remaining capacity.`);
  }
  for (const booking of database.bookings) {
    checkReference(`booking ${booking.id}`, booking.userId, users, issue);
    checkReference(`booking ${booking.id}`, booking.mallId, malls, issue);
    checkReference(`booking ${booking.id}`, booking.storeId, stores, issue);
    checkReference(`booking ${booking.id}`, booking.serviceId, services, issue);
    const service = database.bookingServices.find(({ id }) => id === booking.serviceId);
    if (service && (service.mallId !== booking.mallId || service.storeId !== booking.storeId)) issue(`booking ${booking.id} does not match its service's mall and store.`);
    if (service && service.quantityUnit !== booking.quantityUnit) issue(`booking ${booking.id} uses the wrong quantity unit.`);
    if (service && (booking.quantity < service.minimumQuantity || booking.quantity > service.maximumQuantity)) issue(`booking ${booking.id} quantity is outside service limits.`);
    if (booking.sessionId) {
      checkReference(`booking ${booking.id}`, booking.sessionId, sessions, issue);
      const session = database.bookingSessions.find(({ id }) => id === booking.sessionId);
      if (session && session.serviceId !== booking.serviceId) issue(`booking ${booking.id} uses a session from another service.`);
    } else if (service?.scheduleMode === 'fixed_sessions') {
      issue(`fixed-session booking ${booking.id} is missing a session.`);
    }
    checkMoney(`booking ${booking.id} total`, booking.totalPrice, issue);
  }
  for (const favorite of database.favorites) {
    checkReference(`favorite ${favorite.id}`, favorite.userId, users, issue);
    if (favorite.target.type === 'mall') checkReference(`favorite ${favorite.id}`, favorite.target.mallId, malls, issue);
    if (favorite.target.type === 'store') checkReference(`favorite ${favorite.id}`, favorite.target.storeId, stores, issue);
    if (favorite.target.type === 'deal') checkReference(`favorite ${favorite.id}`, favorite.target.dealId, deals, issue);
  }
  for (const notification of database.notifications) checkReference(`notification ${notification.id}`, notification.userId, users, issue);
  for (const campaign of database.campaigns) {
    checkReference(`campaign ${campaign.id}`, campaign.createdByUserId, users, issue);
    campaign.audience.mallIds.forEach((id) => checkReference(`campaign ${campaign.id}`, id, malls, issue));
    if (campaign.owner.type === 'store') {
      checkReference(`campaign ${campaign.id}`, campaign.owner.storeId, stores, issue);
      checkReference(`campaign ${campaign.id}`, campaign.owner.mallId, malls, issue);
    }
    if (campaign.owner.type === 'mall') checkReference(`campaign ${campaign.id}`, campaign.owner.mallId, malls, issue);
    checkMoney(`campaign ${campaign.id} budget`, campaign.budget, issue);
  }
  for (const advertisement of database.advertisements) checkReference(`advertisement ${advertisement.id}`, advertisement.campaignId, campaigns, issue);
  for (const subscription of database.subscriptions) {
    if (subscription.owner.type === 'user') checkReference(`subscription ${subscription.id}`, subscription.owner.userId, users, issue);
    if (subscription.owner.type === 'store') checkReference(`subscription ${subscription.id}`, subscription.owner.storeId, stores, issue);
    if (subscription.owner.type === 'mall') checkReference(`subscription ${subscription.id}`, subscription.owner.mallId, malls, issue);
  }
  for (const payment of database.payments) {
    checkReference(`payment ${payment.id}`, payment.userId, users, issue);
    if (payment.purpose.type === 'subscription') checkReference(`payment ${payment.id}`, payment.purpose.subscriptionId, subscriptions, issue);
    if (payment.purpose.type === 'campaign') checkReference(`payment ${payment.id}`, payment.purpose.campaignId, campaigns, issue);
    checkMoney(`payment ${payment.id} amount`, payment.amount, issue);
  }
  for (const analyticsEvent of database.analyticsEvents) {
    if (analyticsEvent.userId) checkReference(`analytics event ${analyticsEvent.id}`, analyticsEvent.userId, users, issue);
    if (analyticsEvent.mallId) checkReference(`analytics event ${analyticsEvent.id}`, analyticsEvent.mallId, malls, issue);
    if (analyticsEvent.storeId) checkReference(`analytics event ${analyticsEvent.id}`, analyticsEvent.storeId, stores, issue);
    if (analyticsEvent.dealId) checkReference(`analytics event ${analyticsEvent.id}`, analyticsEvent.dealId, deals, issue);
    if (analyticsEvent.bookingId) checkReference(`analytics event ${analyticsEvent.id}`, analyticsEvent.bookingId, bookings, issue);
    if (analyticsEvent.campaignId) checkReference(`analytics event ${analyticsEvent.id}`, analyticsEvent.campaignId, campaigns, issue);
    if (analyticsEvent.advertisementId) checkReference(`analytics event ${analyticsEvent.id}`, analyticsEvent.advertisementId, advertisements, issue);
  }

  validateImages(database, issue);
  validateAuthorization(database, issue);
  return issues;
}

export function assertDemoDataIntegrity(database: DemoDatabase = demoDatabase): void {
  const issues = validateDemoData(database);
  if (issues.length > 0) {
    throw new Error(`Invalid Shopymalls demo data:\n${issues.map((item) => `- ${item}`).join('\n')}`);
  }
}
