import type {
  Address,
  BaseEntity,
  ContactDetails,
  DailyOpeningHours,
  EntityId,
  EntityStatus,
  GeoPoint,
  IsoDateTime,
  LocalizedText,
  MediaAsset,
  Money,
  RatingSummary,
  SocialLinks,
} from './common';

export interface Category extends BaseEntity {
  parentCategoryId?: EntityId;
  slug: string;
  name: LocalizedText;
  iconName?: string;
  sortOrder: number;
  status: EntityStatus;
}

export const MALL_FACILITY_TYPES = [
  'accessibility',
  'atm',
  'baby_care',
  'concierge',
  'ev_charging',
  'parking',
  'prayer_room',
  'restroom',
  'wifi',
] as const;
export type MallFacilityType = (typeof MALL_FACILITY_TYPES)[number];

export interface MallFacility {
  id: EntityId;
  type: MallFacilityType;
  label: LocalizedText;
  locationText?: LocalizedText;
}

export interface Mall extends BaseEntity {
  name: string;
  slug: string;
  description: LocalizedText;
  address: Address;
  coordinates?: GeoPoint;
  timeZone: string;
  contact: ContactDetails;
  socialLinks: SocialLinks;
  openingHours: readonly DailyOpeningHours[];
  facilities: readonly MallFacility[];
  isFeatured?: boolean;
  rating?: RatingSummary;
  logoUrl?: string;
  coverImages: readonly MediaAsset[];
  status: EntityStatus;
}

export interface MallFloor extends BaseEntity {
  mallId: EntityId;
  name: LocalizedText;
  levelCode: string;
  mapImageUrl?: string;
  sortOrder: number;
  status: EntityStatus;
}

export interface Store extends BaseEntity {
  mallId: EntityId;
  categoryIds: readonly EntityId[];
  name: string;
  slug: string;
  brandName?: string;
  description: LocalizedText;
  floorId?: EntityId;
  levelText?: string;
  unitNumber?: string;
  contact: ContactDetails;
  socialLinks: SocialLinks;
  openingHours: readonly DailyOpeningHours[];
  logoUrl?: string;
  coverImages: readonly MediaAsset[];
  rating?: RatingSummary;
  status: EntityStatus;
}

export interface Product extends BaseEntity {
  storeId: EntityId;
  categoryId?: EntityId;
  name: LocalizedText;
  description: LocalizedText;
  sku?: string;
  images: readonly MediaAsset[];
  price: Money;
  salePrice?: Money;
  status: EntityStatus;
}

export const DEAL_STATUSES = [
  'draft',
  'pending',
  'active',
  'expired',
  'rejected',
  'archived',
] as const;
export type DealStatus = (typeof DEAL_STATUSES)[number];

export interface Deal extends BaseEntity {
  storeId: EntityId;
  mallId: EntityId;
  productIds: readonly EntityId[];
  title: LocalizedText;
  description: LocalizedText;
  image?: MediaAsset;
  discountLabel: LocalizedText;
  terms: LocalizedText;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  status: DealStatus;
  isFeatured: boolean;
  isSponsored: boolean;
}

export interface MallEvent extends BaseEntity {
  mallId: EntityId;
  storeId?: EntityId;
  title: LocalizedText;
  description: LocalizedText;
  image?: MediaAsset;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  locationText: LocalizedText;
  status: EntityStatus;
}
