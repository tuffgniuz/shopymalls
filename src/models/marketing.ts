import type {
  BaseEntity,
  EntityId,
  IsoDateTime,
  JsonObject,
  LocalizedText,
  Money,
} from './common';

export const CAMPAIGN_STATUSES = [
  'draft',
  'pending',
  'active',
  'paused',
  'completed',
  'rejected',
] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

export const CAMPAIGN_GOALS = [
  'awareness',
  'store_visits',
  'deal_redemptions',
  'bookings',
  'sales',
] as const;
export type CampaignGoal = (typeof CAMPAIGN_GOALS)[number];

export type CampaignOwner =
  | { type: 'store'; storeId: EntityId; mallId: EntityId }
  | { type: 'mall'; mallId: EntityId }
  | { type: 'platform' };

export interface CampaignAudience {
  cityNames: readonly string[];
  mallIds: readonly EntityId[];
  interests: readonly string[];
  minimumAge?: number;
  maximumAge?: number;
}

export interface Campaign extends BaseEntity {
  owner: CampaignOwner;
  createdByUserId: EntityId;
  name: string;
  goal: CampaignGoal;
  audience: CampaignAudience;
  budget: Money;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  status: CampaignStatus;
}

export const AD_PLACEMENTS = [
  'home_featured',
  'explore_featured',
  'mall_featured',
  'push_notification',
  'social_media',
] as const;
export type AdPlacement = (typeof AD_PLACEMENTS)[number];

export type SocialChannel = 'facebook' | 'instagram' | 'tiktok';

export interface Advertisement extends BaseEntity {
  campaignId: EntityId;
  placement: AdPlacement;
  socialChannel?: SocialChannel;
  headline: LocalizedText;
  body: LocalizedText;
  creativeUrl?: string;
  destinationDeepLink?: string;
  status: CampaignStatus;
}

export const ANALYTICS_EVENT_NAMES = [
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
] as const;
export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number];

export interface AnalyticsEvent {
  id: EntityId;
  occurredAt: IsoDateTime;
  eventName: AnalyticsEventName;
  userId?: EntityId;
  mallId?: EntityId;
  storeId?: EntityId;
  dealId?: EntityId;
  bookingId?: EntityId;
  campaignId?: EntityId;
  advertisementId?: EntityId;
  metadata: JsonObject;
}

