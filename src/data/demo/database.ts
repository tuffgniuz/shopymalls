import type {
  Advertisement,
  AnalyticsEvent,
  AvailabilityException,
  AvailabilityRule,
  Booking,
  BookingConfiguration,
  BookingService,
  BookingSession,
  Campaign,
  Category,
  Deal,
  Favorite,
  Mall,
  MallEvent,
  MallFloor,
  Notification,
  Payment,
  Product,
  Store,
  Subscription,
  User,
} from '../../models';
import { payments, subscriptions } from './billing';
import {
  availabilityExceptions,
  availabilityRules,
  bookingConfigurations,
  bookings,
  bookingServices,
  bookingSessions,
} from './bookings';
import { categories, mallFloors, malls, stores } from './catalog';
import { deals, mallEvents, products } from './commerce';
import { favorites, notifications } from './engagement';
import { advertisements, analyticsEvents, campaigns } from './marketing';
import { users } from './users';

/**
 * Persistence boundary for the POC. Screens consume this shape through
 * selectors, so a future API or local database can replace these arrays
 * without changing the UI-facing domain model.
 */
export interface DemoDatabase {
  readonly users: readonly User[];
  readonly categories: readonly Category[];
  readonly malls: readonly Mall[];
  readonly mallFloors: readonly MallFloor[];
  readonly stores: readonly Store[];
  readonly products: readonly Product[];
  readonly deals: readonly Deal[];
  readonly mallEvents: readonly MallEvent[];
  readonly bookingConfigurations: readonly BookingConfiguration[];
  readonly bookingServices: readonly BookingService[];
  readonly availabilityRules: readonly AvailabilityRule[];
  readonly availabilityExceptions: readonly AvailabilityException[];
  readonly bookingSessions: readonly BookingSession[];
  readonly bookings: readonly Booking[];
  readonly favorites: readonly Favorite[];
  readonly notifications: readonly Notification[];
  readonly campaigns: readonly Campaign[];
  readonly advertisements: readonly Advertisement[];
  readonly analyticsEvents: readonly AnalyticsEvent[];
  readonly subscriptions: readonly Subscription[];
  readonly payments: readonly Payment[];
}

export const demoDatabase = {
  users,
  categories,
  malls,
  mallFloors,
  stores,
  products,
  deals,
  mallEvents,
  bookingConfigurations,
  bookingServices,
  availabilityRules,
  availabilityExceptions,
  bookingSessions,
  bookings,
  favorites,
  notifications,
  campaigns,
  advertisements,
  analyticsEvents,
  subscriptions,
  payments,
} as const satisfies DemoDatabase;
