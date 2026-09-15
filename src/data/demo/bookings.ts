import type {
  AvailabilityException,
  AvailabilityRule,
  Booking,
  BookingConfiguration,
  BookingService,
  BookingSession,
  DayOfWeek,
} from '../../models';
import { idr, text, timestamps } from './helpers';
import { demoIds } from './ids';

const configurationStoreIds = [
  demoIds.stores.dapurSenja,
  demoIds.stores.sariBeauty,
  demoIds.stores.arunaBarber,
  demoIds.stores.rimbaSpa,
  demoIds.stores.layarCinema,
  demoIds.stores.orbitArcade,
  demoIds.stores.pulseFitness,
] as const;

export const bookingConfigurations: readonly BookingConfiguration[] =
  configurationStoreIds.map((storeId) => ({
    id: `booking-configuration-${storeId}`,
    storeId,
    isEnabled: true,
    timeZone: 'Asia/Jakarta',
    confirmationMode:
      storeId === demoIds.stores.dapurSenja ? 'manual' : 'automatic',
    defaultDurationMinutes: storeId === demoIds.stores.arunaBarber ? 45 : 60,
    slotIntervalMinutes: 30,
    minimumLeadTimeMinutes: 60,
    maximumAdvanceDays: 30,
    reminderLeadTimeMinutes: 120,
    ...timestamps(),
  }));

export const bookingServices: readonly BookingService[] = [
  {
    id: demoIds.bookingServices.restaurant,
    mallId: demoIds.malls.aurora,
    storeId: demoIds.stores.dapurSenja,
    type: 'restaurant',
    name: text('Reservasi meja', 'Table reservation'),
    description: text(
      'Pesan meja untuk makan siang atau malam di Dapur Senja.',
      'Reserve a table for lunch or dinner at Dapur Senja.',
    ),
    scheduleMode: 'recurring_slots',
    durationMinutes: 90,
    quantityUnit: 'guests',
    minimumQuantity: 1,
    maximumQuantity: 8,
    capacityPerSlot: 24,
    isActive: true,
    ...timestamps(),
  },
  {
    id: demoIds.bookingServices.salon,
    mallId: demoIds.malls.aurora,
    storeId: demoIds.stores.sariBeauty,
    type: 'salon',
    name: text('Manikur signature', 'Signature manicure'),
    description: text(
      'Perawatan kuku lengkap dengan pilihan warna musiman.',
      'A complete nail treatment with seasonal color choices.',
    ),
    scheduleMode: 'recurring_slots',
    durationMinutes: 60,
    quantityUnit: 'participants',
    minimumQuantity: 1,
    maximumQuantity: 2,
    capacityPerSlot: 4,
    price: idr(350_000),
    isActive: true,
    ...timestamps(),
  },
  {
    id: demoIds.bookingServices.barber,
    mallId: demoIds.malls.nusantara,
    storeId: demoIds.stores.arunaBarber,
    type: 'barber',
    name: text('Potong dan tata', 'Cut and style'),
    description: text(
      'Konsultasi, potong presisi, dan penataan akhir.',
      'Consultation, precision cut, and finishing style.',
    ),
    scheduleMode: 'recurring_slots',
    durationMinutes: 45,
    quantityUnit: 'participants',
    minimumQuantity: 1,
    maximumQuantity: 1,
    capacityPerSlot: 3,
    price: idr(180_000),
    isActive: true,
    ...timestamps(),
  },
  {
    id: demoIds.bookingServices.spa,
    mallId: demoIds.malls.nusantara,
    storeId: demoIds.stores.rimbaSpa,
    type: 'spa',
    name: text('Ritual relaksasi Rimba', 'Rimba relaxation ritual'),
    description: text(
      'Pijat aromaterapi selama 90 menit dengan minyak botanikal.',
      'A 90-minute aromatherapy massage with botanical oils.',
    ),
    scheduleMode: 'recurring_slots',
    durationMinutes: 90,
    quantityUnit: 'participants',
    minimumQuantity: 1,
    maximumQuantity: 2,
    capacityPerSlot: 3,
    price: idr(550_000),
    isActive: true,
    ...timestamps(),
  },
  {
    id: demoIds.bookingServices.cinema,
    mallId: demoIds.malls.aurora,
    storeId: demoIds.stores.layarCinema,
    type: 'cinema',
    name: text('Layar Premiere', 'Layar Premiere'),
    description: text(
      'Pemutaran film terbaru di studio premium.',
      'A new-release screening in the premium studio.',
    ),
    scheduleMode: 'fixed_sessions',
    durationMinutes: 120,
    quantityUnit: 'tickets',
    minimumQuantity: 1,
    maximumQuantity: 6,
    capacityPerSlot: 48,
    price: idr(125_000),
    isActive: true,
    ...timestamps(),
  },
  {
    id: demoIds.bookingServices.event,
    mallId: demoIds.malls.aurora,
    storeId: demoIds.stores.layarCinema,
    eventId: demoIds.events.styleWeek,
    type: 'event',
    name: text('Jakarta Style Week — runway malam', 'Jakarta Style Week — evening runway'),
    description: text(
      'Tiket untuk pertunjukan runway utama dan sesi desainer.',
      'Admission to the headline runway and designer session.',
    ),
    scheduleMode: 'fixed_sessions',
    durationMinutes: 120,
    quantityUnit: 'tickets',
    minimumQuantity: 1,
    maximumQuantity: 4,
    capacityPerSlot: 120,
    price: idr(250_000),
    isActive: true,
    ...timestamps(),
  },
  {
    id: demoIds.bookingServices.entertainment,
    mallId: demoIds.malls.senayan,
    storeId: demoIds.stores.orbitArcade,
    type: 'entertainment',
    name: text('Paket bermain bersama', 'Play together package'),
    description: text(
      'Dua jam akses permainan untuk kelompok kecil.',
      'Two hours of game access for a small group.',
    ),
    scheduleMode: 'recurring_slots',
    durationMinutes: 120,
    quantityUnit: 'participants',
    minimumQuantity: 2,
    maximumQuantity: 8,
    capacityPerSlot: 16,
    price: idr(150_000),
    isActive: true,
    ...timestamps(),
  },
  {
    id: demoIds.bookingServices.fitness,
    mallId: demoIds.malls.senayan,
    storeId: demoIds.stores.pulseFitness,
    type: 'fitness',
    name: text('Pulse rooftop circuit', 'Pulse rooftop circuit'),
    description: text(
      'Kelas circuit 60 menit untuk semua tingkat kebugaran.',
      'A 60-minute circuit class for every fitness level.',
    ),
    scheduleMode: 'fixed_sessions',
    durationMinutes: 60,
    quantityUnit: 'participants',
    minimumQuantity: 1,
    maximumQuantity: 3,
    capacityPerSlot: 18,
    price: idr(175_000),
    isActive: true,
    ...timestamps(),
  },
];

const recurringServiceIds = [
  demoIds.bookingServices.restaurant,
  demoIds.bookingServices.salon,
  demoIds.bookingServices.barber,
  demoIds.bookingServices.spa,
  demoIds.bookingServices.entertainment,
] as const;

const weekDays: readonly DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const availabilityRules: readonly AvailabilityRule[] =
  recurringServiceIds.flatMap((serviceId) =>
    weekDays.map((day) => ({
      id: `availability-${serviceId}-${day}`,
      serviceId,
      day,
      timeRanges:
        serviceId === demoIds.bookingServices.restaurant
          ? [{ opensAt: '11:30', closesAt: '21:00' }]
          : serviceId === demoIds.bookingServices.entertainment
            ? [{ opensAt: '10:00', closesAt: '20:00' }]
            : [{ opensAt: '10:00', closesAt: '19:00' }],
      isActive: true,
      ...timestamps(),
    })),
  );

export const availabilityExceptions: readonly AvailabilityException[] = [
  {
    id: 'availability-exception-sari-20260917',
    serviceId: demoIds.bookingServices.salon,
    date: '2026-09-17',
    isUnavailable: true,
    reason: text('Pelatihan tim', 'Team training'),
    ...timestamps(),
  },
  {
    id: 'availability-exception-dapur-20260920',
    serviceId: demoIds.bookingServices.restaurant,
    date: '2026-09-20',
    isUnavailable: false,
    replacementTimeRanges: [{ opensAt: '12:00', closesAt: '23:00' }],
    capacityOverride: 30,
    reason: text('Jam khusus akhir pekan', 'Special weekend hours'),
    ...timestamps(),
  },
];

interface SessionSeed {
  id: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  remainingCapacity: number;
  status?: BookingSession['status'];
  seatMapId?: string;
}

function createSession(seed: SessionSeed): BookingSession {
  return {
    ...seed,
    status: seed.status ?? 'scheduled',
    ...timestamps(),
  };
}

export const bookingSessions: readonly BookingSession[] = [
  createSession({ id: demoIds.bookingSessions.cinemaOne, serviceId: demoIds.bookingServices.cinema, startsAt: '2026-09-12T18:30:00+07:00', endsAt: '2026-09-12T20:30:00+07:00', capacity: 48, remainingCapacity: 21, seatMapId: 'seat-map-layar-premiere' }),
  createSession({ id: demoIds.bookingSessions.cinemaTwo, serviceId: demoIds.bookingServices.cinema, startsAt: '2026-09-12T20:45:00+07:00', endsAt: '2026-09-12T22:45:00+07:00', capacity: 48, remainingCapacity: 13, seatMapId: 'seat-map-layar-premiere' }),
  createSession({ id: demoIds.bookingSessions.cinemaThree, serviceId: demoIds.bookingServices.cinema, startsAt: '2026-09-13T18:30:00+07:00', endsAt: '2026-09-13T20:30:00+07:00', capacity: 48, remainingCapacity: 34, seatMapId: 'seat-map-layar-premiere' }),
  createSession({ id: demoIds.bookingSessions.cinemaFour, serviceId: demoIds.bookingServices.cinema, startsAt: '2026-09-13T20:45:00+07:00', endsAt: '2026-09-13T22:45:00+07:00', capacity: 48, remainingCapacity: 28, seatMapId: 'seat-map-layar-premiere' }),
  createSession({ id: demoIds.bookingSessions.eventOne, serviceId: demoIds.bookingServices.event, startsAt: '2026-09-19T19:00:00+07:00', endsAt: '2026-09-19T21:00:00+07:00', capacity: 120, remainingCapacity: 37 }),
  createSession({ id: demoIds.bookingSessions.eventTwo, serviceId: demoIds.bookingServices.event, startsAt: '2026-09-20T19:00:00+07:00', endsAt: '2026-09-20T21:00:00+07:00', capacity: 120, remainingCapacity: 54 }),
  createSession({ id: demoIds.bookingSessions.fitnessOne, serviceId: demoIds.bookingServices.fitness, startsAt: '2026-09-13T08:00:00+07:00', endsAt: '2026-09-13T09:00:00+07:00', capacity: 18, remainingCapacity: 5 }),
  createSession({ id: demoIds.bookingSessions.fitnessTwo, serviceId: demoIds.bookingServices.fitness, startsAt: '2026-09-14T18:00:00+07:00', endsAt: '2026-09-14T19:00:00+07:00', capacity: 18, remainingCapacity: 8 }),
  createSession({ id: demoIds.bookingSessions.fitnessThree, serviceId: demoIds.bookingServices.fitness, startsAt: '2026-09-16T18:00:00+07:00', endsAt: '2026-09-16T19:00:00+07:00', capacity: 18, remainingCapacity: 11 }),
  createSession({ id: demoIds.bookingSessions.fitnessFour, serviceId: demoIds.bookingServices.fitness, startsAt: '2026-09-19T08:00:00+07:00', endsAt: '2026-09-19T09:00:00+07:00', capacity: 18, remainingCapacity: 12 }),
];

interface BookingSeed extends Omit<Booking, 'createdAt' | 'updatedAt' | 'customer'> {
  customerName: string;
  customerPhone: string;
}

function createBooking(seed: BookingSeed): Booking {
  const { customerName, customerPhone, ...booking } = seed;
  return {
    ...booking,
    customer: { name: customerName, phoneNumber: customerPhone },
    ...timestamps(),
  };
}

const alya = { customerName: 'Alya Putri', customerPhone: '+62 812 0000 0101' };
const dinda = { customerName: 'Dinda Maharani', customerPhone: '+62 812 0000 0102' };
const fajar = { customerName: 'Fajar Hidayat', customerPhone: '+62 812 0000 0103' };
const nisa = { customerName: 'Nisa Rahma', customerPhone: '+62 812 0000 0104' };

export const bookings: readonly Booking[] = [
  createBooking({ id: demoIds.bookings.alyaDinner, userId: demoIds.users.alya, mallId: demoIds.malls.aurora, storeId: demoIds.stores.dapurSenja, serviceId: demoIds.bookingServices.restaurant, startsAt: '2026-09-12T19:00:00+07:00', endsAt: '2026-09-12T20:30:00+07:00', quantity: 2, quantityUnit: 'guests', status: 'confirmed', confirmationCode: 'SM-DP-4102', confirmedAt: '2026-09-11T16:20:00+07:00', ...alya }),
  createBooking({ id: demoIds.bookings.alyaSalon, userId: demoIds.users.alya, mallId: demoIds.malls.aurora, storeId: demoIds.stores.sariBeauty, serviceId: demoIds.bookingServices.salon, startsAt: '2026-09-15T13:00:00+07:00', endsAt: '2026-09-15T14:00:00+07:00', quantity: 1, quantityUnit: 'participants', status: 'pending', confirmationCode: 'SM-SB-2831', totalPrice: idr(350_000), ...alya }),
  createBooking({ id: demoIds.bookings.alyaCinema, userId: demoIds.users.alya, mallId: demoIds.malls.aurora, storeId: demoIds.stores.layarCinema, serviceId: demoIds.bookingServices.cinema, sessionId: demoIds.bookingSessions.cinemaTwo, startsAt: '2026-09-12T20:45:00+07:00', endsAt: '2026-09-12T22:45:00+07:00', quantity: 2, quantityUnit: 'tickets', selectedSeatLabels: ['E7', 'E8'], status: 'confirmed', confirmationCode: 'SM-LC-8872', totalPrice: idr(250_000), confirmedAt: '2026-09-12T09:10:00+07:00', ...alya }),
  createBooking({ id: demoIds.bookings.alyaFitness, userId: demoIds.users.alya, mallId: demoIds.malls.senayan, storeId: demoIds.stores.pulseFitness, serviceId: demoIds.bookingServices.fitness, sessionId: demoIds.bookingSessions.fitnessTwo, startsAt: '2026-09-14T18:00:00+07:00', endsAt: '2026-09-14T19:00:00+07:00', quantity: 1, quantityUnit: 'participants', status: 'confirmed', confirmationCode: 'SM-PF-5520', totalPrice: idr(175_000), confirmedAt: '2026-09-12T08:02:00+07:00', ...alya }),
  createBooking({ id: demoIds.bookings.dindaSpa, userId: demoIds.users.dinda, mallId: demoIds.malls.nusantara, storeId: demoIds.stores.rimbaSpa, serviceId: demoIds.bookingServices.spa, startsAt: '2026-09-13T11:00:00+07:00', endsAt: '2026-09-13T12:30:00+07:00', quantity: 1, quantityUnit: 'participants', status: 'confirmed', confirmationCode: 'SM-RS-0924', totalPrice: idr(550_000), confirmedAt: '2026-09-11T18:00:00+07:00', ...dinda }),
  createBooking({ id: demoIds.bookings.dindaEvent, userId: demoIds.users.dinda, mallId: demoIds.malls.aurora, storeId: demoIds.stores.layarCinema, serviceId: demoIds.bookingServices.event, sessionId: demoIds.bookingSessions.eventOne, startsAt: '2026-09-19T19:00:00+07:00', endsAt: '2026-09-19T21:00:00+07:00', quantity: 2, quantityUnit: 'tickets', status: 'confirmed', confirmationCode: 'SM-JS-7341', totalPrice: idr(500_000), confirmedAt: '2026-09-10T14:42:00+07:00', ...dinda }),
  createBooking({ id: demoIds.bookings.fajarArcade, userId: demoIds.users.fajar, mallId: demoIds.malls.senayan, storeId: demoIds.stores.orbitArcade, serviceId: demoIds.bookingServices.entertainment, startsAt: '2026-09-13T14:00:00+07:00', endsAt: '2026-09-13T16:00:00+07:00', quantity: 4, quantityUnit: 'participants', status: 'pending', confirmationCode: 'SM-OA-1185', totalPrice: idr(600_000), ...fajar }),
  createBooking({ id: demoIds.bookings.fajarBarber, userId: demoIds.users.fajar, mallId: demoIds.malls.nusantara, storeId: demoIds.stores.arunaBarber, serviceId: demoIds.bookingServices.barber, startsAt: '2026-09-12T15:00:00+07:00', endsAt: '2026-09-12T15:45:00+07:00', quantity: 1, quantityUnit: 'participants', status: 'confirmed', confirmationCode: 'SM-AB-3016', totalPrice: idr(180_000), confirmedAt: '2026-09-11T12:00:00+07:00', ...fajar }),
  createBooking({ id: demoIds.bookings.nisaDinner, userId: demoIds.users.nisa, mallId: demoIds.malls.aurora, storeId: demoIds.stores.dapurSenja, serviceId: demoIds.bookingServices.restaurant, startsAt: '2026-09-14T12:30:00+07:00', endsAt: '2026-09-14T14:00:00+07:00', quantity: 5, quantityUnit: 'guests', status: 'cancelled', confirmationCode: 'SM-DP-6190', cancelledAt: '2026-09-12T08:40:00+07:00', cancellationReason: 'Perubahan rencana', ...nisa }),
  createBooking({ id: demoIds.bookings.nisaCinema, userId: demoIds.users.nisa, mallId: demoIds.malls.aurora, storeId: demoIds.stores.layarCinema, serviceId: demoIds.bookingServices.cinema, sessionId: demoIds.bookingSessions.cinemaThree, startsAt: '2026-09-13T18:30:00+07:00', endsAt: '2026-09-13T20:30:00+07:00', quantity: 1, quantityUnit: 'tickets', selectedSeatLabels: ['C5'], status: 'confirmed', confirmationCode: 'SM-LC-7738', totalPrice: idr(125_000), confirmedAt: '2026-09-12T07:30:00+07:00', ...nisa }),
  createBooking({ id: demoIds.bookings.alyaPastDinner, userId: demoIds.users.alya, mallId: demoIds.malls.aurora, storeId: demoIds.stores.dapurSenja, serviceId: demoIds.bookingServices.restaurant, startsAt: '2026-09-05T19:00:00+07:00', endsAt: '2026-09-05T20:30:00+07:00', quantity: 3, quantityUnit: 'guests', status: 'completed', confirmationCode: 'SM-DP-2021', confirmedAt: '2026-09-03T11:20:00+07:00', ...alya }),
  createBooking({ id: demoIds.bookings.dindaNoShow, userId: demoIds.users.dinda, mallId: demoIds.malls.aurora, storeId: demoIds.stores.sariBeauty, serviceId: demoIds.bookingServices.salon, startsAt: '2026-09-08T10:00:00+07:00', endsAt: '2026-09-08T11:00:00+07:00', quantity: 1, quantityUnit: 'participants', status: 'no_show', confirmationCode: 'SM-SB-4410', totalPrice: idr(350_000), confirmedAt: '2026-09-06T13:55:00+07:00', ...dinda }),
];
