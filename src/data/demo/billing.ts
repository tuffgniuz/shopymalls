import type { Payment, Subscription } from '../../models';
import { idr, timestamps } from './helpers';
import { demoIds } from './ids';

export const subscriptions: readonly Subscription[] = [
  { id: demoIds.subscriptions.bima, owner: { type: 'user', userId: demoIds.users.bima }, plan: 'free', status: 'active', startsAt: '2026-08-01T00:00:00+07:00', renewsAutomatically: false, ...timestamps() },
  { id: demoIds.subscriptions.lumen, owner: { type: 'store', storeId: demoIds.stores.lumenSneakers }, plan: 'premium', status: 'active', startsAt: '2026-09-01T00:00:00+07:00', expiresAt: '2027-08-31T23:59:59+07:00', renewsAutomatically: true, ...timestamps() },
  { id: demoIds.subscriptions.aurora, owner: { type: 'mall', mallId: demoIds.malls.aurora }, plan: 'mall', status: 'active', startsAt: '2026-07-01T00:00:00+07:00', expiresAt: '2027-06-30T23:59:59+07:00', renewsAutomatically: true, ...timestamps() },
  { id: demoIds.subscriptions.kopi, owner: { type: 'store', storeId: demoIds.stores.kopiTaman }, plan: 'pro', status: 'pending', startsAt: '2026-10-01T00:00:00+07:00', renewsAutomatically: true, ...timestamps() },
];

export const payments: readonly Payment[] = [
  { id: 'payment-lumen-premium', userId: demoIds.users.bima, purpose: { type: 'subscription', subscriptionId: demoIds.subscriptions.lumen }, amount: idr(9_900_000), status: 'paid', provider: 'demo_gateway', providerReference: 'DEMO-PAY-0001', paidAt: '2026-09-01T08:15:00+07:00', ...timestamps() },
  { id: 'payment-aurora-mall', userId: demoIds.users.maya, purpose: { type: 'subscription', subscriptionId: demoIds.subscriptions.aurora }, amount: idr(29_900_000), status: 'paid', provider: 'demo_gateway', providerReference: 'DEMO-PAY-0002', paidAt: '2026-07-01T09:30:00+07:00', ...timestamps() },
  { id: 'payment-runner-campaign', userId: demoIds.users.bima, purpose: { type: 'campaign', campaignId: demoIds.campaigns.runnerWeekend }, amount: idr(12_000_000), status: 'paid', provider: 'demo_gateway', providerReference: 'DEMO-PAY-0003', paidAt: '2026-09-09T15:12:00+07:00', ...timestamps() },
  { id: 'payment-style-week-campaign', userId: demoIds.users.maya, purpose: { type: 'campaign', campaignId: demoIds.campaigns.styleWeek }, amount: idr(45_000_000), status: 'paid', provider: 'demo_gateway', providerReference: 'DEMO-PAY-0004', paidAt: '2026-09-07T10:05:00+07:00', ...timestamps() },
  { id: 'payment-coffee-campaign', userId: demoIds.users.bima, purpose: { type: 'campaign', campaignId: demoIds.campaigns.coffeeMorning }, amount: idr(4_000_000), status: 'pending', provider: 'demo_gateway', providerReference: 'DEMO-PAY-0005', ...timestamps() },
];
