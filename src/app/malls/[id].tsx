import { useLocalSearchParams } from 'expo-router';

import { MallProfileScreen } from '@/screens/mall';

export default function MallProfileRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <MallProfileScreen mallId={id} />;
}
