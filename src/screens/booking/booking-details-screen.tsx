import { useRouter } from 'expo-router';
import { useMemo, useSyncExternalStore } from 'react';
import { View } from 'react-native';

import {
  AppSymbol,
  AppText,
  Badge,
  Button,
  Card,
  IconButton,
  InlineMessage,
  PriceText,
  Screen,
  ShopperShell,
} from '@/components';
import {
  getRuntimeBookings,
  selectBookingDetailsDemoData,
  subscribeToRuntimeBookings,
} from '@/data';
import { formatDateValue, localize, useI18n } from '@/i18n';
import type { BookingStatus } from '@/models';
import { colors } from '@/theme';

function statusVariant(status: BookingStatus): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'confirmed' || status === 'completed') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'cancelled' || status === 'no_show') return 'danger';
  return 'neutral';
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-lg border-b border-border py-md last:border-b-0">
      <AppText tone="secondary" variant="caption">{label}</AppText>
      <AppText className="flex-1 text-right" selectable variant="subheadStrong">
        {value}
      </AppText>
    </View>
  );
}

export interface BookingDetailsScreenProps {
  bookingId: string;
}

export function BookingDetailsScreen({ bookingId }: BookingDetailsScreenProps) {
  const router = useRouter();
  useI18n();
  const runtimeBookings = useSyncExternalStore(
    subscribeToRuntimeBookings,
    getRuntimeBookings,
    getRuntimeBookings,
  );
  const data = useMemo(
    () => selectBookingDetailsDemoData(bookingId, undefined, runtimeBookings),
    [bookingId, runtimeBookings],
  );

  if (!data) {
    return (
      <ShopperShell activeTab="profile">
        <Screen contentContainerClassName="min-h-full justify-center">
          <Card className="items-center gap-lg py-3xl" variant="booking">
            <AppSymbol
              name={{ android: 'event_busy', ios: 'calendar.badge.exclamationmark' }}
              size={34}
              tintColor={colors.booking}
            />
            <AppText variant="titleSmall">Booking not found</AppText>
            <Button label="Open My Bookings" onPress={() => router.replace('/bookings')} />
          </Card>
        </Screen>
      </ShopperShell>
    );
  }

  const quantityUnit = data.booking.quantity === 1
    ? data.booking.quantityUnit.replace(/s$/, '')
    : data.booking.quantityUnit;

  return (
    <ShopperShell activeTab="profile">
      <Screen contentContainerClassName="gap-xl">
        <View className="flex-row items-center justify-between gap-lg">
          <IconButton
            accessibilityLabel="Back"
            icon={(color) => (
              <AppSymbol
                name={{ android: 'arrow_back', ios: 'chevron.left' }}
                size={21}
                tintColor={color}
              />
            )}
            onPress={() => router.back()}
          />
          <AppText className="flex-1 text-center" variant="section">Booking details</AppText>
          <IconButton
            accessibilityLabel="Open My Bookings"
            icon={(color) => (
              <AppSymbol
                name={{ android: 'calendar_month', ios: 'calendar' }}
                size={21}
                tintColor={color}
              />
            )}
            onPress={() => router.replace('/bookings')}
            variant="booking"
          />
        </View>

        <Card className="items-center gap-md py-xl" variant="booking">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-booking-strong">
            <AppSymbol
              name={{ android: 'event_available', ios: 'calendar.badge.checkmark' }}
              size={28}
              tintColor={colors.booking}
            />
          </View>
          <Badge variant={statusVariant(data.booking.status)}>
            {data.booking.status.toUpperCase().replace('_', ' ')}
          </Badge>
          <AppText className="text-center" variant="title">{data.store.name}</AppText>
          <AppText className="text-center" tone="secondary" variant="subhead">
            {localize(data.service.name)}
          </AppText>
        </Card>

        <Card className="px-lg py-xs" padding="none">
          <DetailRow label="Mall" value={data.mall.name} />
          <DetailRow label="Date" value={formatDateValue(data.booking.startsAt, { dateStyle: 'medium', timeZone: 'Asia/Jakarta' })} />
          <DetailRow
            label="Time"
            value={`${formatDateValue(data.booking.startsAt, { hour: '2-digit', hour12: false, minute: '2-digit', timeZone: 'Asia/Jakarta' })}–${formatDateValue(data.booking.endsAt, { hour: '2-digit', hour12: false, minute: '2-digit', timeZone: 'Asia/Jakarta' })}`}
          />
          <DetailRow label="Quantity" value={`${data.booking.quantity} ${quantityUnit}`} />
          {data.booking.selectedSeatLabels?.length ? (
            <DetailRow label="Seats" value={data.booking.selectedSeatLabels.join(', ')} />
          ) : null}
          {data.booking.totalPrice ? (
            <View className="flex-row items-center justify-between gap-lg py-md">
              <AppText tone="secondary" variant="caption">Total</AppText>
              <PriceText value={data.booking.totalPrice.amount} variant="subheadStrong" />
            </View>
          ) : null}
        </Card>

        <InlineMessage
          icon={(color) => (
            <AppSymbol
              name={{ android: 'confirmation_number', ios: 'ticket' }}
              size={22}
              tintColor={color}
            />
          )}
          title="Confirmation code"
          variant="booking"
        >
          {data.booking.confirmationCode}
        </InlineMessage>

        <View className="flex-row gap-sm">
          <Button
            className="flex-1"
            label="Store profile"
            onPress={() => router.push({ pathname: '/stores/[id]', params: { id: data.store.id } })}
            variant="secondary"
          />
          <Button
            className="flex-1"
            label="Manage booking"
            onPress={() => router.push({ pathname: '/preview', params: { id: data.booking.id, kind: 'booking', title: 'Manage booking' } })}
            variant="booking"
          />
        </View>
      </Screen>
    </ShopperShell>
  );
}
