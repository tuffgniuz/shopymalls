import { useLocalSearchParams } from 'expo-router';

import { StoreProfileScreen } from '@/screens/store';

export default function StoreProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StoreProfileScreen storeId={id} />;
}
