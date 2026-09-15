import { useLocalSearchParams } from 'expo-router';

import { PreviewScreen } from '@/screens/shared';

export default function PreviewRoute() {
  const { kind, title } = useLocalSearchParams<{ kind?: string; title?: string }>();
  return <PreviewScreen kind={kind} title={title} />;
}
