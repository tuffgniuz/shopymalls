import { useLocalSearchParams } from 'expo-router';

import { DealDetailsScreen } from '@/screens/deal';

export default function DealDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <DealDetailsScreen dealId={id} />;
}
