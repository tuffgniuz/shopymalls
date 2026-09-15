import type {
  BaseEntity,
  EntityId,
  IsoDateTime,
} from './common';

export type FavoriteTarget =
  | { type: 'mall'; mallId: EntityId }
  | { type: 'store'; storeId: EntityId }
  | { type: 'deal'; dealId: EntityId };

export interface Favorite extends BaseEntity {
  userId: EntityId;
  target: FavoriteTarget;
}

export const NOTIFICATION_TYPES = [
  'booking_confirmation',
  'booking_reminder',
  'deal_alert',
  'event_reminder',
  'business_update',
  'system',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/** Notification copy is stored in the recipient's chosen language. */
export interface Notification extends BaseEntity {
  userId: EntityId;
  type: NotificationType;
  title: string;
  body: string;
  deepLink?: string;
  readAt?: IsoDateTime;
}

