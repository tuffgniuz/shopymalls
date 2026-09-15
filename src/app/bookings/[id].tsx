import { useLocalSearchParams } from 'expo-router';

import { BookingDetailsScreen } from '@/screens/booking';

export default function BookingDetailsRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <BookingDetailsScreen bookingId={id} />;
}
