/** Shared, persistence-agnostic primitives for the Shopymalls domain. */

export type EntityId = string;
export type IsoDate = string;
export type IsoDateTime = string;
export type LocalTime = string;

export const SUPPORTED_LANGUAGES = ['en', 'id'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const SUPPORTED_LOCALES = ['en', 'id-ID'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export type LocalizedText = Readonly<Record<Language, string>>;

export const SUPPORTED_CURRENCIES = ['IDR'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

/**
 * Money is stored as a whole-rupiah integer. For example, Rp149.000 is
 * represented as `{ amount: 149000, currency: 'IDR' }`.
 */
export interface Money {
  amount: number;
  currency: Currency;
}

export interface BaseEntity {
  id: EntityId;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export type JsonValue =
  | boolean
  | number
  | string
  | null
  | JsonObject
  | readonly JsonValue[];

export interface JsonObject {
  readonly [key: string]: JsonValue;
}

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export interface TimeRange {
  opensAt: LocalTime;
  closesAt: LocalTime;
}

export interface DailyOpeningHours {
  day: DayOfWeek;
  isClosed: boolean;
  periods: readonly TimeRange[];
}

export interface Address {
  line1: string;
  line2?: string;
  district?: string;
  city: string;
  province?: string;
  postalCode?: string;
  countryCode: 'ID';
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface ContactDetails {
  email?: string;
  phone?: string;
  websiteUrl?: string;
}

export interface SocialLinks {
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
}

export interface MediaAsset {
  id: EntityId;
  type: 'image' | 'video';
  url: string;
  alt: LocalizedText;
  sortOrder: number;
}

export interface RatingSummary {
  average: number;
  count: number;
}

export const ENTITY_STATUSES = [
  'pending',
  'active',
  'blocked',
  'archived',
] as const;
export type EntityStatus = (typeof ENTITY_STATUSES)[number];
