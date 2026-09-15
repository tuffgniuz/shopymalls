import type {
  BaseEntity,
  DailyOpeningHours,
  DayOfWeek,
  LocalizedText,
  MediaAsset,
  Money,
} from '../../models';
import { DAYS_OF_WEEK } from '../../models';
import { DEMO_CREATED_AT, DEMO_UPDATED_AT } from './constants';

export function text(id: string, en: string): LocalizedText {
  return { id, en };
}

export function idr(amount: number): Money {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error(`IDR amounts must be non-negative integers. Received: ${amount}`);
  }

  return { amount, currency: 'IDR' };
}

export function timestamps(
  createdAt = DEMO_CREATED_AT,
  updatedAt = DEMO_UPDATED_AT,
): Pick<BaseEntity, 'createdAt' | 'updatedAt'> {
  return { createdAt, updatedAt };
}

export function image(
  id: string,
  url: string,
  altId: string,
  altEn: string,
  sortOrder = 0,
): MediaAsset {
  return {
    id,
    type: 'image',
    url,
    alt: text(altId, altEn),
    sortOrder,
  };
}

export function openingHours(
  weekdays: readonly [string, string] = ['10:00', '22:00'],
  weekends: readonly [string, string] = weekdays,
  closedDays: readonly DayOfWeek[] = [],
): readonly DailyOpeningHours[] {
  return DAYS_OF_WEEK.map((day) => {
    const isClosed = closedDays.includes(day);
    const range = day === 'saturday' || day === 'sunday' ? weekends : weekdays;

    return {
      day,
      isClosed,
      periods: isClosed ? [] : [{ opensAt: range[0], closesAt: range[1] }],
    };
  });
}

