import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';

import {
  AppSymbol,
  AppText,
  Badge,
  Button,
  Card,
  Chip,
  IconButton,
  InlineMessage,
  PressableCard,
  PriceText,
  Screen,
  SectionHeader,
  ShopperShell,
  type AppSymbolName,
} from '@/components';
import {
  CURRENT_DEMO_USER_ID,
  DEMO_NOW,
  createRuntimeBooking,
  getRuntimeBookings,
  resolveImageSource,
  selectBookingFlowDemoData,
  selectUserById,
  type BookingDateOption,
  type BookingServiceOption,
} from '@/data';
import { formatDateValue, getAppLocale, localize, useI18n } from '@/i18n';
import type { Booking, BookingType } from '@/models';
import { colors, spacing } from '@/theme';

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

function parseDate(date: string): Date {
  return new Date(`${date}T12:00:00+07:00`);
}

function formatType(type: BookingType): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function BookingHeader({ onBack, onBookings }: { onBack: () => void; onBookings: () => void }) {
  return (
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
        onPress={onBack}
      />
      <AppText className="flex-1 text-center" variant="section">Booking</AppText>
      <IconButton
        accessibilityLabel="Open My Bookings"
        icon={(color) => (
          <AppSymbol
            name={{ android: 'calendar_month', ios: 'calendar' }}
            size={21}
            tintColor={color}
          />
        )}
        onPress={onBookings}
      />
    </View>
  );
}

function BookingProgress({ confirmed }: { confirmed: boolean }) {
  const steps = [
    { label: 'Service', number: 1 },
    { label: 'Schedule', number: 2 },
    { label: 'Confirm', number: 3 },
  ];

  return (
    <View className="flex-row items-center gap-sm">
      {steps.map((step, index) => {
        const active = confirmed ? true : step.number === 1;
        return (
          <View className="flex-1 flex-row items-center gap-xs" key={step.label}>
            <View className={`h-8 w-8 items-center justify-center rounded-full border ${active ? 'border-booking-strong bg-booking-strong' : 'border-border bg-surface'}`}>
              <AppText numeric tone={active ? 'onBooking' : 'secondary'} variant="label">
                {step.number}
              </AppText>
            </View>
            <AppText tone={active ? 'booking' : 'secondary'} variant="caption">
              {step.label}
            </AppText>
            {index < steps.length - 1 ? <View className="h-px flex-1 bg-border" /> : null}
          </View>
        );
      })}
    </View>
  );
}

function ServiceTypeCard({
  item,
  onPress,
  selected,
}: {
  item: BookingServiceOption;
  onPress: () => void;
  selected: boolean;
}) {
  const icon = bookingTypeIcons[item.service.type];

  return (
    <PressableCard
      accessibilityLabel={`${formatType(item.service.type)} booking at ${item.store.name}`}
      accessibilityState={{ selected }}
      className="h-20 w-24 items-center justify-center gap-xs"
      onPress={onPress}
      padding="compact"
      variant={selected ? 'booking' : 'default'}
    >
      <AppSymbol
        name={icon}
        size={22}
        tintColor={selected ? colors.booking : colors.textPrimary}
      />
      <AppText
        numberOfLines={1}
        tone={selected ? 'booking' : 'secondary'}
        variant="caption"
      >
        {formatType(item.service.type)}
      </AppText>
    </PressableCard>
  );
}

function DateCard({ item, onPress, selected }: { item: BookingDateOption; onPress: () => void; selected: boolean }) {
  const parts = new Intl.DateTimeFormat(getAppLocale(), {
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
  }).formatToParts(parseDate(item.date));
  const weekday = parts.find(({ type }) => type === 'weekday')?.value ?? '';
  const day = parts.find(({ type }) => type === 'day')?.value ?? '';

  return (
    <PressableCard
      accessibilityLabel={`${weekday} ${day}`}
      accessibilityState={{ selected }}
      className="h-20 flex-1 items-center justify-center gap-xs"
      onPress={onPress}
      padding="compact"
      variant={selected ? 'booking' : 'default'}
    >
      <AppText tone={selected ? 'booking' : 'secondary'} variant="micro">
        {weekday.toUpperCase()}
      </AppText>
      <AppText numeric tone={selected ? 'onBooking' : 'primary'} variant="titleSmall">
        {day}
      </AppText>
    </PressableCard>
  );
}

export interface BookingScreenProps {
  serviceId: string;
}

export function BookingScreen({ serviceId }: BookingScreenProps) {
  return <BookingScreenContent key={serviceId} serviceId={serviceId} />;
}

function BookingScreenContent({ serviceId }: BookingScreenProps) {
  const router = useRouter();
  useI18n();
  const { width } = useWindowDimensions();
  const data = useMemo(() => selectBookingFlowDemoData(serviceId), [serviceId]);
  const preferredDate = data?.service.type === 'salon'
    ? data.dates.find(({ date }) => date === '2026-09-15') ?? data.dates[0]
    : data?.dates[0];
  const preferredTime = preferredDate?.times.find(({ time }) => time === '13:00') ?? preferredDate?.times[0];
  const [selectedDate, setSelectedDate] = useState(preferredDate?.date ?? '');
  const [selectedTime, setSelectedTime] = useState(preferredTime?.time ?? '');
  const [quantity, setQuantity] = useState(data?.service.minimumQuantity ?? 1);
  const [createdBooking, setCreatedBooking] = useState<Booking>();

  if (!data) {
    return (
      <ShopperShell activeTab="explore">
        <Screen contentContainerClassName="min-h-full justify-center">
          <Card className="items-center gap-lg py-3xl" variant="booking">
            <AppSymbol
              name={{ android: 'calendar_month', ios: 'calendar' }}
              size={34}
              tintColor={colors.booking}
            />
            <AppText variant="titleSmall">Booking service not found</AppText>
            <Button label="Back to Explore" onPress={() => router.replace('/explore')} />
          </Card>
        </Screen>
      </ShopperShell>
    );
  }

  const dateOption = data.dates.find(({ date }) => date === selectedDate) ?? data.dates[0];
  const timeOption = dateOption?.times.find(({ time }) => time === selectedTime) ?? dateOption?.times[0];
  const timeCardWidth = Math.max(
    92,
    (width - spacing.screen * 2 - spacing.sm * 2) / 3,
  );
  const totalPrice = data.service.price
    ? data.service.price.amount * quantity
    : undefined;

  const chooseDate = (option: BookingDateOption) => {
    setSelectedDate(option.date);
    setSelectedTime(option.times[0]?.time ?? '');
    setCreatedBooking(undefined);
  };
  const confirmBooking = () => {
    if (!dateOption || !timeOption) return;
    const user = selectUserById(CURRENT_DEMO_USER_ID);
    if (!user) return;
    const isConfirmed = data.configuration.confirmationMode === 'automatic';
    const sequence = getRuntimeBookings().length + 1;
    const booking = createRuntimeBooking({
      userId: user.id,
      mallId: data.mall.id,
      storeId: data.store.id,
      serviceId: data.service.id,
      sessionId: timeOption.sessionId,
      startsAt: timeOption.startsAt,
      endsAt: timeOption.endsAt,
      quantity,
      quantityUnit: data.service.quantityUnit,
      customer: {
        emailAddress: user.emailAddress,
        name: user.fullName,
        phoneNumber: user.phoneNumber,
      },
      status: isConfirmed ? 'confirmed' : 'pending',
      confirmationCode: `SM-POC-${(1000 + sequence).toString()}`,
      totalPrice: totalPrice === undefined
        ? undefined
        : { amount: totalPrice, currency: 'IDR' },
      confirmedAt: isConfirmed ? DEMO_NOW : undefined,
    });
    setCreatedBooking(booking);
  };

  return (
    <ShopperShell activeTab="explore">
      <Screen contentContainerClassName="gap-xl">
        <BookingHeader
          onBack={() => router.back()}
          onBookings={() => router.push('/bookings')}
        />

        <InlineMessage
          icon={(color) => (
            <AppSymbol
              name={{ android: 'calendar_month', ios: 'calendar' }}
              size={24}
              tintColor={color}
            />
          )}
          title="Shopymalls Booking"
          variant="booking"
        >
          One reservation system for dining, services, cinema, events, and more.
        </InlineMessage>

        <BookingProgress confirmed={Boolean(createdBooking)} />

        <View className="gap-md">
          <SectionHeader title="Booking type" />
          <ScrollView
            contentContainerClassName="gap-sm"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {data.services.map((item) => (
              <ServiceTypeCard
                item={item}
                key={item.service.id}
                onPress={() => router.replace({ pathname: '/book/[serviceId]', params: { serviceId: item.service.id } })}
                selected={item.service.id === data.service.id}
              />
            ))}
          </ScrollView>
        </View>

        <View className="gap-md">
          <SectionHeader title="Choose a business" />
          <PressableCard
            accessibilityLabel={`Open ${data.store.name} profile`}
            className="flex-row items-center gap-md"
            onPress={() => router.push({ pathname: '/stores/[id]', params: { id: data.store.id } })}
            padding="compact"
          >
            {data.store.coverImages[0] ? (
              <Image
                accessibilityLabel={`${data.store.name} interior`}
                contentFit="cover"
                source={resolveImageSource(data.store.coverImages[0].url)}
                style={{ borderRadius: 12, height: 56, width: 56 }}
              />
            ) : null}
            <View className="flex-1 gap-xs">
              <AppText variant="subheadStrong">{data.store.name}</AppText>
              <AppText tone="secondary" variant="caption">
                {[data.mall.name, data.store.levelText, data.store.unitNumber ? `Unit ${data.store.unitNumber}` : undefined].filter(Boolean).join(' · ')}
              </AppText>
              <Badge variant="booking">{localize(data.service.name)}</Badge>
            </View>
            <AppSymbol
              name={{ android: 'chevron_right', ios: 'chevron.right' }}
              size={18}
              tintColor={colors.textPrimary}
            />
          </PressableCard>
        </View>

        <View className="gap-md">
          <SectionHeader title="Choose date" />
          <View className="flex-row gap-sm">
            {data.dates.map((option) => (
              <DateCard
                item={option}
                key={option.date}
                onPress={() => chooseDate(option)}
                selected={option.date === dateOption?.date}
              />
            ))}
          </View>
        </View>

        <View className="gap-md">
          <SectionHeader title="Choose time" />
          {dateOption && dateOption.times.length > 0 ? (
            <View className="flex-row flex-wrap gap-sm">
              {dateOption.times.map((option) => {
                const selected = option.time === timeOption?.time;
                return (
                  <Chip
                    className="rounded-control"
                    key={option.startsAt}
                    label={option.time}
                    onPress={() => {
                      setSelectedTime(option.time);
                      setCreatedBooking(undefined);
                    }}
                    selected={selected}
                    style={{ width: timeCardWidth }}
                    variant="booking"
                  />
                );
              })}
            </View>
          ) : (
            <AppText tone="secondary">No available times for this date.</AppText>
          )}
          {timeOption ? (
            <View className="flex-row items-center gap-xs">
              <View className="h-2 w-2 rounded-full bg-lime" />
              <AppText tone="accent" variant="caption">
                {`${timeOption.remainingCapacity} places available`}
              </AppText>
            </View>
          ) : null}
        </View>

        <View className="gap-md">
          <SectionHeader title={data.service.quantityUnit === 'guests' ? 'Number of guests' : 'Participants or tickets'} />
          <View className="flex-row items-center gap-md">
            <IconButton
              accessibilityLabel="Decrease quantity"
              disabled={quantity <= data.service.minimumQuantity}
              icon={(color) => (
                <AppSymbol name={{ android: 'remove', ios: 'minus' }} size={18} tintColor={color} />
              )}
              onPress={() => {
                setQuantity((current) => Math.max(data.service.minimumQuantity, current - 1));
                setCreatedBooking(undefined);
              }}
              size="compact"
            />
            <AppText numeric variant="title">{quantity}</AppText>
            <IconButton
              accessibilityLabel="Increase quantity"
              disabled={quantity >= data.service.maximumQuantity}
              icon={(color) => (
                <AppSymbol name={{ android: 'add', ios: 'plus' }} size={18} tintColor={color} />
              )}
              onPress={() => {
                setQuantity((current) => Math.min(data.service.maximumQuantity, current + 1));
                setCreatedBooking(undefined);
              }}
              size="compact"
              variant="booking"
            />
            <AppText className="flex-1" tone="secondary" variant="caption">
              {`Up to ${data.service.maximumQuantity} ${data.service.quantityUnit}`}
            </AppText>
          </View>
        </View>

        <Card className="gap-lg">
          <AppText tone="booking" variant="eyebrow">BOOKING SUMMARY</AppText>
          <View className="flex-row items-start justify-between gap-md">
            <View className="flex-1 gap-xs">
              <AppText variant="titleSmall">{data.store.name}</AppText>
              <AppText tone="booking" variant="subheadStrong">
                {localize(data.service.name)}
              </AppText>
              {dateOption && timeOption ? (
                <AppText tone="secondary" variant="caption">
                  {`${formatDateValue(parseDate(dateOption.date), { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta', weekday: 'short', year: 'numeric' })} · ${timeOption.time} · ${quantity} ${quantity === 1 ? data.service.quantityUnit.replace(/s$/, '') : data.service.quantityUnit}`}
                </AppText>
              ) : null}
            </View>
            {totalPrice === undefined ? (
              <AppText tone="accent" variant="titleSmall">Free</AppText>
            ) : (
              <PriceText tone="primary" value={totalPrice} variant="titleSmall" />
            )}
          </View>
          <Button
            disabled={!timeOption || Boolean(createdBooking)}
            label={createdBooking ? 'Booking created' : 'Confirm booking'}
            onPress={confirmBooking}
            trailing={(color) => (
              <AppSymbol
                name={{ android: createdBooking ? 'check' : 'arrow_forward', ios: createdBooking ? 'checkmark' : 'arrow.right' }}
                size={17}
                tintColor={color}
              />
            )}
            variant="booking"
          />
        </Card>

        {createdBooking ? (
          <View className="gap-md">
            <InlineMessage
              icon={(color) => (
                <AppSymbol
                  name={{ android: 'check_circle', ios: 'checkmark.circle.fill' }}
                  size={24}
                  tintColor={color}
                />
              )}
              title={createdBooking.status === 'confirmed' ? 'Booking confirmed' : 'Booking requested'}
              variant={createdBooking.status === 'confirmed' ? 'success' : 'warning'}
            >
              {createdBooking.status === 'confirmed'
                ? 'Your reservation is now available in My Bookings.'
                : 'The business will confirm your request. You can track it in My Bookings.'}
            </InlineMessage>
            <Button
              label="View My Bookings"
              onPress={() => router.push('/bookings')}
              variant="secondary"
            />
          </View>
        ) : null}

        <View className="flex-row items-center justify-center gap-sm">
          <AppSymbol
            name={{ android: 'verified_user', ios: 'shield' }}
            size={16}
            tintColor={colors.textTertiary}
          />
          <AppText tone="tertiary" variant="caption">
            No payment is collected in this prototype.
          </AppText>
        </View>
      </Screen>
    </ShopperShell>
  );
}
