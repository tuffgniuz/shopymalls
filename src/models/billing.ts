import type {
  BaseEntity,
  EntityId,
  IsoDateTime,
  Money,
} from './common';

export const SUBSCRIPTION_PLANS = ['free', 'pro', 'premium', 'mall'] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

export type SubscriptionOwner =
  | { type: 'user'; userId: EntityId }
  | { type: 'store'; storeId: EntityId }
  | { type: 'mall'; mallId: EntityId };

export interface Subscription extends BaseEntity {
  owner: SubscriptionOwner;
  plan: SubscriptionPlan;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  startsAt: IsoDateTime;
  expiresAt?: IsoDateTime;
  renewsAutomatically: boolean;
}

export type PaymentPurpose =
  | { type: 'subscription'; subscriptionId: EntityId }
  | { type: 'campaign'; campaignId: EntityId };

export interface Payment extends BaseEntity {
  userId: EntityId;
  purpose: PaymentPurpose;
  amount: Money;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  provider?: string;
  providerReference?: string;
  paidAt?: IsoDateTime;
}

