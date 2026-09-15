import { useRouter } from 'expo-router';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { View } from 'react-native';

import {
  AppSymbol,
  AppText,
  Badge,
  Button,
  Card,
  EmptyState,
  IconButton,
  PressableCard,
  PriceText,
  Screen,
  SectionHeader,
  ShopperShell,
  TabList,
  type AppSymbolName,
} from '@/components';
import {
  DEMO_NOW,
  demoIds,
  getRuntimeBookings,
  selectMyBookingsDemoData,
  subscribeToRuntimeBookings,
  type ResolvedBooking,
} from '@/data';
import { formatDateValue, getAppLanguage, localize, translateUiText, useI18n } from '@/i18n';
import type { BookingStatus, BookingType } from '@/models';
import { colors } from '@/theme';

type BookingTab = 'upcoming' | 'past';

const bookingTypeIcons = {
  restaurant: { android: 'restaurant', ios: 'fork.knife' },
  salon: { android: 'content_cut', ios: 'scissors' },
  barber: { android: 'content_cut', ios: 'scissors' },
  spa: { android: 'spa', ios: 'leaf' },
  cinema: { android: 'movie', ios: 'film' },
  event: { android: 'confirmation_number', ios: 'ticket' },
  entertainment: { android: 'sports_esports', ios: 'gamecontroller' },
  fitness: { android: 'fitness_center', ios: 'dumbbell' },
} satisfies Record<BookingType, AppSymbolName>;

function isToday(value: string): boolean {
  return value.slice(0, 10) === DEMO_NOW.slice(0, 10);
}

function formatSchedule(item: ResolvedBooking): string {
  const { booking } = item;
  const date = isToday(booking.startsAt)
    ? translateUiText('Today', getAppLanguage())
    : formatDateValue(booking.startsAt, { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta', weekday: 'short' });
  return `${date} · ${formatDateValue(booking.startsAt, { hour: '2-digit', hour12: false, minute: '2-digit', timeZone: 'Asia/Jakarta' })}–${formatDateValue(booking.endsAt, { hour: '2-digit', hour12: false, minute: '2-digit', timeZone: 'Asia/Jakarta' })}`;
}

function quantityText(item: ResolvedBooking): string {
  const { booking } = item;
  const singular = booking.quantityUnit.replace(/s$/, '');
  const amount = `${booking.quantity} ${booking.quantity === 1 ? singular : booking.quantityUnit}`;
  return booking.selectedSeatLabels?.length
    ? `${amount} · Seats ${booking.selectedSeatLabels.join(', ')}`
    : amount;
}

function statusVariant(status: BookingStatus): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'confirmed' || status === 'completed') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'cancelled' || status === 'no_show') return 'danger';
  return 'neutral';
}

function BookingRow({ item, onPress }: { item: ResolvedBooking; onPress: () => void }) {
  const icon = bookingTypeIcons[item.service.type];

  return (
    <PressableCard
      accessibilityLabel={`Open ${item.store.name} booking, ${item.booking.status}`}
      className="flex-row items-center gap-md"
      onPress={onPress}
      padding="compact"
    >
      <View className="h-14 w-14 items-center justify-center rounded-control bg-booking-surface">
        <AppSymbol name={icon} size={22} tintColor={colors.booking} />
      </View>
      <View className="flex-1 gap-xs">
        <View className="flex-row items-start justify-between gap-sm">
          <AppText className="flex-1" numberOfLines={1} variant="subheadStrong">
            {item.store.name}
          </AppText>
          <Badge variant={statusVariant(item.booking.status)}>
            {item.booking.status.toUpperCase().replace('_', ' ')}
          </Badge>
        </View>
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {localize(item.service.name)}
        </AppText>
        <AppText numeric tone="booking" variant="caption">
          {formatSchedule(item)}
        </AppText>
        <AppText tone="secondary" variant="caption">
          {quantityText(item)}
        </AppText>
        {item.booking.totalPrice ? (
          <PriceText tone="secondary" value={item.booking.totalPrice.amount} variant="caption" />
        ) : null}
      </View>
      <AppSymbol
        name={{ android: 'chevron_right', ios: 'chevron.right' }}
        size={18}
        tintColor={colors.textPrimary}
      />
    </PressableCard>
  );
}

function FeaturedBooking({ item, onPress }: { item: ResolvedBooking; onPress: () => void }) {
  const icon = bookingTypeIcons[item.service.type];

  return (
    <Card className="gap-lg" variant="booking">
      <View className="flex-row items-center justify-between gap-md">
        <Badge variant="booking">{isToday(item.booking.startsAt) ? 'TODAY' : 'NEXT'}</Badge>
        <Badge variant={statusVariant(item.booking.status)}>
          {item.booking.status.toUpperCase()}
        </Badge>
      </View>
      <View className="flex-row items-center gap-md">
        <View className="h-16 w-16 items-center justify-center rounded-control bg-booking-strong">
          <AppSymbol name={icon} size={25} tintColor={colors.booking} />
        </View>
        <View className="flex-1 gap-xs">
          <AppText variant="titleSmall">{item.store.name}</AppText>
          <AppText tone="secondary" variant="subhead">
            {localize(item.service.name)}
          </AppText>
          <AppText tone="secondary" variant="caption">{item.mall.name}</AppText>
          <AppText numeric tone="booking" variant="caption">
            {formatSchedule(item)}
          </AppText>
          <AppText tone="secondary" variant="caption">{quantityText(item)}</AppText>
        </View>
      </View>
      <Button label="View booking" onPress={onPress} variant="secondary" />
    </Card>
  );
}

export function MyBookingsScreen() {
  const router = useRouter();
  useI18n();
  const runtimeBookings = useSyncExternalStore(
    subscribeToRuntimeBookings,
    getRuntimeBookings,
    getRuntimeBookings,
  );
  const data = useMemo(
    () => selectMyBookingsDemoData(undefined, undefined, runtimeBookings),
    [runtimeBookings],
  );
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');
  const items = activeTab === 'upcoming' ? data.upcoming : data.past;
  const featured = activeTab === 'upcoming' ? items[0] : undefined;
  const remaining = featured ? items.slice(1) : items;
  const openBooking = (id: string) => {
    router.push({ pathname: '/bookings/[id]', params: { id } });
  };

  return (
    <ShopperShell activeTab="profile">
      <Screen contentContainerClassName="gap-xl">
        <View className="flex-row items-center justify-between gap-lg">
          <View className="gap-xs">
            <AppText className="tracking-widest" tone="accent" variant="eyebrow">
              SHOPYMALLS
            </AppText>
            <AppText variant="screenTitle">My Bookings</AppText>
          </View>
          <IconButton
            accessibilityLabel="Create a new booking"
            icon={(color) => (
              <AppSymbol
                name={{ android: 'calendar_month', ios: 'calendar.badge.plus' }}
                size={21}
                tintColor={color}
              />
            )}
            onPress={() => router.push({ pathname: '/book/[serviceId]', params: { serviceId: demoIds.bookingServices.salon } })}
            variant="booking"
          />
        </View>

        <AppText tone="secondary" variant="subhead">
          Your dining, service, cinema, and fitness reservations in one place.
        </AppText>

        <TabList
          fill
          items={[
            { label: `Upcoming ${data.upcoming.length}`, value: 'upcoming' },
            { label: `Past ${data.past.length}`, value: 'past' },
          ]}
          onValueChange={setActiveTab}
          tone="booking"
          value={activeTab}
          variant="pill"
        />

        {items.length === 0 ? (
          <Card>
            <EmptyState
              action={(
                <Button
                  label="Find a service"
                  onPress={() => router.push('/explore')}
                  variant="booking"
                />
              )}
              description="Your reservations will appear here."
              graphic={(
                <AppSymbol
                  name={{ android: 'event_busy', ios: 'calendar.badge.exclamationmark' }}
                  size={30}
                  tintColor={colors.booking}
                />
              )}
              title={activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
            />
          </Card>
        ) : null}

        {featured ? (
          <View className="gap-md">
            <SectionHeader title="Next up" />
            <FeaturedBooking
              item={featured}
              onPress={() => openBooking(featured.booking.id)}
            />
          </View>
        ) : null}

        {remaining.length > 0 ? (
          <View className="gap-md">
            <SectionHeader title={activeTab === 'upcoming' ? 'Later' : 'Booking history'} />
            <View className="gap-sm">
              {remaining.map((item) => (
                <BookingRow
                  item={item}
                  key={item.booking.id}
                  onPress={() => openBooking(item.booking.id)}
                />
              ))}
            </View>
          </View>
        ) : null}

        <PressableCard
          accessibilityLabel="Learn about My Bookings"
          className="flex-row items-center gap-md"
          onPress={() => router.push({ pathname: '/preview', params: { kind: 'bookings', title: 'My Bookings' } })}
          variant="highlight"
        >
          <View className="h-12 w-12 items-center justify-center rounded-control bg-lime-surface-strong">
            <AppSymbol
              name={{ android: 'verified_user', ios: 'shield.checkered' }}
              size={23}
              tintColor={colors.lime}
            />
          </View>
          <View className="flex-1 gap-xs">
            <AppText variant="subheadStrong">Everything in one place</AppText>
            <AppText tone="secondary" variant="caption">
              Confirmations, changes, and reminders stay connected to each booking.
            </AppText>
          </View>
          <AppSymbol
            name={{ android: 'chevron_right', ios: 'chevron.right' }}
            size={17}
            tintColor={colors.textPrimary}
          />
        </PressableCard>
      </Screen>
    </ShopperShell>
  );
}
