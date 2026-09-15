import { Host, Picker, Switch } from '@expo/ui';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import {
  AppSymbol,
  AppText,
  Button,
  Card,
  Chip,
  IconButton,
  PressableCard,
  Screen,
  SectionHeader,
  ShopperShell,
} from '@/components';
import { demoIds, resolveImageSource, selectProfileDemoData } from '@/data';
import { useI18n } from '@/i18n';
import { colors } from '@/theme';

type NotificationSetting = 'bookingReminders' | 'dealAlerts' | 'pushNotifications';

interface GroupedAction {
  accessibilityLabel: string;
  icon: ReactNode;
  onPress: () => void;
  subtitle: string;
  title: string;
}

interface NotificationRowProps {
  description: string;
  icon: ReactNode;
  label: string;
  onValueChange: (value: boolean) => void;
  value: boolean;
}

function GroupedActions({ actions }: { actions: readonly GroupedAction[] }) {
  return (
    <Card className="overflow-hidden" padding="none">
      {actions.map((action, index) => (
        <Pressable
          accessibilityLabel={action.accessibilityLabel}
          accessibilityRole="button"
          className={`min-h-18 flex-row items-center gap-md px-md py-sm active:opacity-[0.78] ${index > 0 ? 'border-t border-border' : ''}`}
          key={action.title}
          onPress={action.onPress}
        >
          <View className="h-11 w-11 items-center justify-center rounded-control bg-surface-raised">
            {action.icon}
          </View>
          <View className="flex-1 gap-xs">
            <AppText variant="subheadStrong">{action.title}</AppText>
            <AppText numberOfLines={1} tone="secondary" variant="caption">
              {action.subtitle}
            </AppText>
          </View>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-surface-overlay">
            <AppSymbol
              name={{ android: 'chevron_right', ios: 'chevron.right' }}
              size={16}
              tintColor={colors.textPrimary}
            />
          </View>
        </Pressable>
      ))}
    </Card>
  );
}

function NotificationRow({
  description,
  icon,
  label,
  onValueChange,
  value,
}: NotificationRowProps) {
  return (
    <View className="min-h-20 flex-row items-center gap-md border-b border-border py-sm last:border-b-0">
      <View className="h-10 w-10 items-center justify-center">{icon}</View>
      <View className="flex-1 gap-xs">
        <AppText variant="subheadStrong">{label}</AppText>
        <AppText tone="secondary" variant="caption">
          {description}
        </AppText>
      </View>
      <Host
        accessibilityLabel={label}
        colorScheme="dark"
        matchContents
        seedColor={colors.lime}
      >
        <Switch
          onValueChange={onValueChange}
          value={value}
        />
      </Host>
    </View>
  );
}

export function ProfileScreen() {
  const router = useRouter();
  const { language, localize, setLanguage, t } = useI18n();
  const data = useMemo(() => selectProfileDemoData(), []);
  const preferences = data.currentUser.preferences;
  const [selectedInterests, setSelectedInterests] = useState(
    preferences.shoppingInterests.map((interest) => localize(interest)),
  );
  const [notifications, setNotifications] = useState({
    bookingReminders: preferences.bookingRemindersEnabled,
    dealAlerts: preferences.dealAlertsEnabled,
    pushNotifications: preferences.pushNotificationsEnabled,
  });
  const firstName = data.currentUser.fullName.split(' ')[0] ?? data.currentUser.fullName;
  const firstMall = data.favoriteMalls[0]?.mall.name ?? t('No saved malls yet', 'Belum ada mal tersimpan');
  const firstStore = data.favoriteStores[0]?.store.name ?? t('No saved stores yet', 'Belum ada toko tersimpan');
  const mallSubtitle = data.favoriteMalls.length > 1
    ? t(`${firstMall} + ${data.favoriteMalls.length - 1} more`, `${firstMall} + ${data.favoriteMalls.length - 1} lainnya`)
    : firstMall;
  const storeSubtitle = data.favoriteStores.length > 1
    ? t(`${firstStore} + ${data.favoriteStores.length - 1} more`, `${firstStore} + ${data.favoriteStores.length - 1} lainnya`)
    : firstStore;
  const preview = (kind: string, title: string) => {
    router.push({ pathname: '/preview', params: { kind, title } });
  };
  const updateNotification = (key: NotificationSetting, value: boolean) => {
    setNotifications((current) => ({ ...current, [key]: value }));
  };
  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  };

  const favoriteActions: readonly GroupedAction[] = [
    {
      accessibilityLabel: t(`Open ${data.favoriteMalls.length} favorite malls`, `Buka ${data.favoriteMalls.length} mal favorit`),
      icon: (
        <AppSymbol
          name={{ android: 'apartment', ios: 'building.2' }}
          size={21}
          tintColor={colors.textPrimary}
        />
      ),
      onPress: () => router.push('/saved'),
      subtitle: mallSubtitle,
      title: t('Favorite malls', 'Mal favorit'),
    },
    {
      accessibilityLabel: t(`Open ${data.favoriteStores.length} favorite stores`, `Buka ${data.favoriteStores.length} toko favorit`),
      icon: (
        <AppSymbol
          name={{ android: 'storefront', ios: 'storefront' }}
          size={21}
          tintColor={colors.textPrimary}
        />
      ),
      onPress: () => router.push('/saved'),
      subtitle: storeSubtitle,
      title: t('Favorite stores', 'Toko favorit'),
    },
  ];
  const accountActions: readonly GroupedAction[] = [
    {
      accessibilityLabel: t('Open personal details', 'Buka data pribadi'),
      icon: (
        <AppSymbol
          name={{ android: 'badge', ios: 'person.text.rectangle' }}
          size={21}
          tintColor={colors.textPrimary}
        />
      ),
      onPress: () => preview('profile', 'Personal details'),
      subtitle: t('Email and phone number', 'Email dan nomor telepon'),
      title: t('Personal details', 'Data pribadi'),
    },
  ];
  const businessActions: readonly GroupedAction[] = [
    {
      accessibilityLabel: t('Open the retailer dashboard demo', 'Buka demo dasbor retailer'),
      icon: (
        <AppSymbol
          name={{ android: 'storefront', ios: 'storefront' }}
          size={21}
          tintColor={colors.lime}
        />
      ),
      onPress: () => router.push('/business'),
      subtitle: t('Store, campaigns, analytics, and billing', 'Toko, kampanye, analitik, dan tagihan'),
      title: t('Retailer workspace', 'Ruang kerja retailer'),
    },
    {
      accessibilityLabel: t('Open the mall administrator dashboard demo', 'Buka demo dasbor pengelola mal'),
      icon: (
        <AppSymbol
          name={{ android: 'apartment', ios: 'building.2' }}
          size={21}
          tintColor={colors.lime}
        />
      ),
      onPress: () => router.push('/mall-dashboard'),
      subtitle: t('Stores, events, maps, campaigns, and retailers', 'Toko, acara, peta, kampanye, dan retailer'),
      title: t('Mall workspace', 'Ruang kerja mal'),
    },
  ];

  return (
    <ShopperShell activeTab="profile">
      <Screen contentContainerClassName="gap-xl">
        <View className="flex-row items-center justify-between gap-lg">
          <View className="gap-xs">
            <AppText className="tracking-widest" tone="accent" variant="eyebrow">
              SHOPYMALLS
            </AppText>
            <AppText variant="screenTitle">{t('Profile', 'Profil')}</AppText>
          </View>
          <IconButton
            accessibilityLabel={t('Open profile settings', 'Buka pengaturan profil')}
            icon={(color) => (
              <AppSymbol
                name={{ android: 'tune', ios: 'slider.horizontal.3' }}
                size={21}
                tintColor={color}
              />
            )}
            onPress={() => preview('settings', t('Profile settings', 'Pengaturan profil'))}
          />
        </View>

        <Card className="flex-row items-center gap-md">
          {data.currentUser.avatarUrl ? (
            <Image
              accessibilityLabel={`${data.currentUser.fullName} profile photo`}
              contentFit="cover"
              source={resolveImageSource(data.currentUser.avatarUrl)}
              style={{ borderRadius: 32, height: 64, width: 64 }}
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-full border border-lime bg-lime-surface-strong">
              <AppText tone="accent" variant="title">
                {firstName.slice(0, 1).toUpperCase()}
              </AppText>
            </View>
          )}
          <View className="flex-1 gap-xs">
            <AppText variant="titleSmall">{t(`Welcome, ${firstName}`, `Selamat datang, ${firstName}`)}</AppText>
            <AppText tone="secondary" variant="caption">
              {t('Your personal shopping experience', 'Pengalaman belanja pribadi Anda')}
            </AppText>
          </View>
          <Button
            label={t('Edit', 'Ubah')}
            onPress={() => preview('profile', t('Edit profile', 'Ubah profil'))}
            size="compact"
            variant="secondary"
          />
        </Card>

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'favorite_border', ios: 'heart' }}
                size={21}
                tintColor={colors.lime}
              />
            )}
            title={t('My preferences', 'Preferensi saya')}
          />
          <View className="flex-row flex-wrap gap-sm">
            {preferences.shoppingInterests.map((interest) => {
              const label = localize(interest);
              const selected = selectedInterests.includes(label);
              return (
                <Chip
                  key={label}
                  label={label}
                  leading={(color) => (
                    <AppSymbol
                      name={{ android: 'check_circle', ios: 'checkmark.circle.fill' }}
                      size={15}
                      tintColor={color}
                    />
                  )}
                  onPress={() => toggleInterest(label)}
                  selected={selected}
                />
              );
            })}
            <Chip
              label={t('Add category', 'Tambah kategori')}
              leading={() => (
                <AppSymbol
                  name={{ android: 'add', ios: 'plus' }}
                  size={16}
                  tintColor={colors.lime}
                />
              )}
              onPress={() => preview('preferences', t('Add preference', 'Tambah preferensi'))}
            />
          </View>
        </View>

        <View className="flex-row gap-sm">
          <PressableCard
            accessibilityLabel={t(`Open My Bookings, ${data.upcomingBookingCount} upcoming`, `Buka Pemesanan Saya, ${data.upcomingBookingCount} mendatang`)}
            className="flex-1 flex-row items-center gap-sm"
            onPress={() => router.push('/bookings')}
            padding="compact"
          >
            <View className="h-11 w-11 items-center justify-center rounded-control bg-booking-surface">
              <AppSymbol
                name={{ android: 'calendar_month', ios: 'calendar' }}
                size={21}
                tintColor={colors.booking}
              />
            </View>
            <View className="flex-1 gap-xs">
              <AppText numberOfLines={1} variant="subheadStrong">{t('My bookings', 'Pemesanan saya')}</AppText>
              <AppText numeric tone="secondary" variant="caption">
                {t(pluralize(data.upcomingBookingCount, 'upcoming booking'), `${data.upcomingBookingCount} pemesanan mendatang`)}
              </AppText>
            </View>
          </PressableCard>
          <PressableCard
            accessibilityLabel={t(`Open Saved, ${data.savedItemCount} items`, `Buka Tersimpan, ${data.savedItemCount} item`)}
            className="flex-1 flex-row items-center gap-sm"
            onPress={() => router.push('/saved')}
            padding="compact"
          >
            <View className="h-11 w-11 items-center justify-center rounded-control bg-lime-surface-strong">
              <AppSymbol
                name={{ android: 'bookmark', ios: 'bookmark.fill' }}
                size={21}
                tintColor={colors.lime}
              />
            </View>
            <View className="flex-1 gap-xs">
              <AppText numberOfLines={1} variant="subheadStrong">{t('Saved places', 'Tempat tersimpan')}</AppText>
              <AppText numeric tone="secondary" variant="caption">
                {t(pluralize(data.savedItemCount, 'item'), `${data.savedItemCount} item`)}
              </AppText>
            </View>
          </PressableCard>
        </View>

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'star_outline', ios: 'star' }}
                size={21}
                tintColor={colors.lime}
              />
            )}
            title={t('My favorites', 'Favorit saya')}
          />
          <GroupedActions actions={favoriteActions} />
        </View>

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'notifications_none', ios: 'bell' }}
                size={21}
                tintColor={colors.lime}
              />
            )}
            title={t('Notifications', 'Notifikasi')}
          />
          <Card className="px-md py-xs" padding="none">
            <NotificationRow
              description={t('Updates from saved stores.', 'Pembaruan dari toko tersimpan.')}
              icon={(
                <AppSymbol
                  name={{ android: 'sell', ios: 'tag' }}
                  size={21}
                  tintColor={colors.textPrimary}
                />
              )}
              label={t('New deals & sales', 'Promo dan diskon baru')}
              onValueChange={(value) => updateNotification('dealAlerts', value)}
              value={notifications.dealAlerts}
            />
            <NotificationRow
              description={t('Never miss a reservation.', 'Jangan lewatkan reservasi.')}
              icon={(
                <AppSymbol
                  name={{ android: 'calendar_month', ios: 'calendar' }}
                  size={21}
                  tintColor={colors.textPrimary}
                />
              )}
              label={t('Booking reminders', 'Pengingat pemesanan')}
              onValueChange={(value) => updateNotification('bookingReminders', value)}
              value={notifications.bookingReminders}
            />
            <NotificationRow
              description={t('Manage Shopymalls notifications.', 'Kelola notifikasi Shopymalls.')}
              icon={(
                <AppSymbol
                  name={{ android: 'notifications_none', ios: 'bell' }}
                  size={21}
                  tintColor={colors.textPrimary}
                />
              )}
              label={t('All notifications', 'Semua notifikasi')}
              onValueChange={(value) => updateNotification('pushNotifications', value)}
              value={notifications.pushNotifications}
            />
          </Card>
        </View>

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'person_outline', ios: 'person' }}
                size={21}
                tintColor={colors.textPrimary}
              />
            )}
            title={t('Account', 'Akun')}
          />
          <GroupedActions actions={accountActions} />
        </View>

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'language', ios: 'globe' }}
                size={21}
                tintColor={colors.lime}
              />
            )}
            title={t('Language', 'Bahasa')}
          />
          <Card className="flex-row items-center gap-md">
            <View className="flex-1 gap-xs">
              <AppText variant="subheadStrong">{t('App language', 'Bahasa aplikasi')}</AppText>
              <AppText tone="secondary" variant="caption">
                {t('Changes apply immediately across Shopymalls.', 'Perubahan langsung diterapkan di seluruh Shopymalls.')}
              </AppText>
            </View>
            <View className="min-w-32">
              <Host
                accessibilityLabel={t('App language', 'Bahasa aplikasi')}
                colorScheme="dark"
                matchContents
                seedColor={colors.lime}
              >
                <Picker
                  appearance="menu"
                  onValueChange={(value) => setLanguage(value as 'en' | 'id')}
                  selectedValue={language}
                >
                  <Picker.Item label="English" value="en" />
                  <Picker.Item label="Bahasa Indonesia" value="id" />
                </Picker>
              </Host>
            </View>
          </Card>
        </View>

        <View className="gap-md">
          <SectionHeader
            icon={(
              <AppSymbol
                name={{ android: 'business_center', ios: 'briefcase' }}
                size={21}
                tintColor={colors.lime}
              />
            )}
            title={t('Business demos', 'Demo bisnis')}
          />
          <GroupedActions actions={businessActions} />
        </View>

        <PressableCard
          accessibilityLabel={t('Open personalized recommendations', 'Buka rekomendasi personal')}
          className="flex-row items-center gap-md"
          onPress={() => preview('recommendations', 'For You')}
          variant="highlight"
        >
          <View className="h-12 w-12 items-center justify-center rounded-control bg-lime-surface-strong">
            <AppSymbol
              name={{ android: 'auto_awesome', ios: 'sparkles' }}
              size={23}
              tintColor={colors.lime}
            />
          </View>
          <View className="flex-1 gap-xs">
            <AppText variant="subheadStrong">{t('For You', 'Untuk Anda')}</AppText>
            <AppText tone="secondary" variant="caption">
              {t('Recommendations shaped by what you save and explore.', 'Rekomendasi berdasarkan hal yang Anda simpan dan jelajahi.')}
            </AppText>
          </View>
          <AppSymbol
            name={{ android: 'chevron_right', ios: 'chevron.right' }}
            size={17}
            tintColor={colors.textPrimary}
          />
        </PressableCard>

        <Button
          label={t('Create a booking', 'Buat pemesanan')}
          leading={(color) => (
            <AppSymbol
              name={{ android: 'calendar_month', ios: 'calendar.badge.plus' }}
              size={18}
              tintColor={color}
            />
          )}
          onPress={() => router.push({
            pathname: '/book/[serviceId]',
            params: { serviceId: demoIds.bookingServices.salon },
          })}
          variant="booking"
        />
      </Screen>
    </ShopperShell>
  );
}

function pluralize(value: number, singular: string): string {
  return `${value} ${value === 1 ? singular : `${singular}s`}`;
}
