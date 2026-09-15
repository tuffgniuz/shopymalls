import { useLocalSearchParams } from 'expo-router';

import { BookingScreen } from '@/screens/booking';

export default function BookingRoute() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  return <BookingScreen serviceId={serviceId} />;
}
