import type { Booking } from '../../models';
import { DEMO_NOW } from './constants';

export type RuntimeBookingInput = Omit<
  Booking,
  'createdAt' | 'id' | 'updatedAt'
>;

let runtimeBookings: readonly Booking[] = [];
const listeners = new Set<() => void>();

export function getRuntimeBookings(): readonly Booking[] {
  return runtimeBookings;
}

export function subscribeToRuntimeBookings(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function createRuntimeBooking(input: RuntimeBookingInput): Booking {
  const booking: Booking = {
    ...input,
    id: `booking-poc-${runtimeBookings.length + 1}`,
    createdAt: DEMO_NOW,
    updatedAt: DEMO_NOW,
  };
  runtimeBookings = [...runtimeBookings, booking];
  listeners.forEach((listener) => listener());
  return booking;
}
