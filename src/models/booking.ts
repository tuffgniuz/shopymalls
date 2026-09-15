import type {
  BaseEntity,
  DayOfWeek,
  EntityId,
  IsoDate,
  IsoDateTime,
  LocalTime,
  LocalizedText,
  Money,
  TimeRange,
} from './common';

export const BOOKING_TYPES = [
  'restaurant',
  'salon',
  'barber',
  'spa',
  'cinema',
  'event',
  'entertainment',
  'fitness',
] as const;
export type BookingType = (typeof BOOKING_TYPES)[number];

export const BOOKING_STATUSES = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingConfirmationMode = 'automatic' | 'manual';
export type BookingScheduleMode = 'recurring_slots' | 'fixed_sessions';
export type BookingQuantityUnit = 'guests' | 'participants' | 'tickets';

export interface BookingConfiguration extends BaseEntity {
  storeId: EntityId;
  isEnabled: boolean;
  timeZone: string;
  confirmationMode: BookingConfirmationMode;
  defaultDurationMinutes: number;
  slotIntervalMinutes: number;
  minimumLeadTimeMinutes: number;
  maximumAdvanceDays: number;
  reminderLeadTimeMinutes: number;
}

export interface BookingService extends BaseEntity {
  mallId: EntityId;
  storeId: EntityId;
  eventId?: EntityId;
  type: BookingType;
  name: LocalizedText;
  description: LocalizedText;
  scheduleMode: BookingScheduleMode;
  durationMinutes?: number;
  quantityUnit: BookingQuantityUnit;
  minimumQuantity: number;
  maximumQuantity: number;
  capacityPerSlot: number;
  price?: Money;
  isActive: boolean;
}

export interface AvailabilityRule extends BaseEntity {
  serviceId: EntityId;
  day: DayOfWeek;
  timeRanges: readonly TimeRange[];
  capacityOverride?: number;
  isActive: boolean;
}

export interface AvailabilityException extends BaseEntity {
  serviceId: EntityId;
  date: IsoDate;
  isUnavailable: boolean;
  replacementTimeRanges?: readonly TimeRange[];
  capacityOverride?: number;
  reason?: LocalizedText;
}

/** A fixed cinema show, class, entertainment session, or event occurrence. */
export interface BookingSession extends BaseEntity {
  serviceId: EntityId;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  capacity: number;
  remainingCapacity: number;
  seatMapId?: EntityId;
  status: 'scheduled' | 'cancelled' | 'completed';
}

export interface BookingCustomer {
  name: string;
  phoneNumber?: string;
  emailAddress?: string;
}

export interface Booking extends BaseEntity {
  userId: EntityId;
  mallId: EntityId;
  storeId: EntityId;
  serviceId: EntityId;
  sessionId?: EntityId;
  startsAt: IsoDateTime;
  endsAt: IsoDateTime;
  quantity: number;
  quantityUnit: BookingQuantityUnit;
  selectedSeatLabels?: readonly string[];
  customer: BookingCustomer;
  customerNote?: string;
  status: BookingStatus;
  confirmationCode: string;
  totalPrice?: Money;
  confirmedAt?: IsoDateTime;
  cancelledAt?: IsoDateTime;
  cancellationReason?: string;
}

/** Useful when rendering a recurring slot without creating a database row. */
export interface AvailableBookingSlot {
  serviceId: EntityId;
  date: IsoDate;
  startsAt: LocalTime;
  endsAt: LocalTime;
  remainingCapacity: number;
}

