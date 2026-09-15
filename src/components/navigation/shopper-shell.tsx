import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppSymbol } from '@/components/data-display';
import { useI18n } from '@/i18n';
import { BottomNavigation, type BottomNavigationItem } from './bottom-navigation';

export type ShopperTab = 'home' | 'explore' | 'saved' | 'profile';

const routes: Record<ShopperTab, '/' | '/explore' | '/saved' | '/profile'> = {
  home: '/',
  explore: '/explore',
  saved: '/saved',
  profile: '/profile',
};

export interface ShopperShellProps {
  activeTab: ShopperTab;
  children: ReactNode;
}

export function ShopperShell({ activeTab, children }: ShopperShellProps) {
  const router = useRouter();
  const { t } = useI18n();
  const navigationItems: readonly BottomNavigationItem<ShopperTab>[] = [
    {
      value: 'home',
      label: t('Home', 'Beranda'),
      icon: ({ color, selected }) => (
        <AppSymbol
          name={{ android: 'home', ios: selected ? 'house.fill' : 'house' }}
          size={24}
          tintColor={color}
        />
      ),
    },
    {
      value: 'explore',
      label: t('Explore', 'Jelajahi'),
      icon: ({ color }) => (
        <AppSymbol
          name={{ android: 'search', ios: 'magnifyingglass' }}
          size={24}
          tintColor={color}
        />
      ),
    },
    {
      value: 'saved',
      label: t('Saved', 'Tersimpan'),
      icon: ({ color, selected }) => (
        <AppSymbol
          name={{ android: 'bookmark', ios: selected ? 'bookmark.fill' : 'bookmark' }}
          size={24}
          tintColor={color}
        />
      ),
    },
    {
      value: 'profile',
      label: t('Profile', 'Profil'),
      icon: ({ color, selected }) => (
        <AppSymbol
          name={{ android: 'person', ios: selected ? 'person.fill' : 'person' }}
          size={24}
          tintColor={color}
        />
      ),
    },
  ];

  return (
    <View className="flex-1 bg-canvas">
      {children}
      <BottomNavigation
        items={navigationItems}
        onValueChange={(value) => router.replace(routes[value])}
        value={activeTab}
      />
    </View>
  );
}
