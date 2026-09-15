import { useRouter } from 'expo-router';
import type { AppSymbolName } from '@/components';
import { AppSymbol, AppText, Button, Card, Screen } from '@/components';
import { colors } from '@/theme';

const previewCopy = {
  directions: {
    body: 'Turn-by-turn directions will connect to Apple Maps or Google Maps in a later stage.',
    icon: { android: 'navigation', ios: 'location.north.fill' },
    label: 'Directions',
  },
  deal: {
    body: 'The full deal page will be part of the next stage of the demo journey.',
    icon: { android: 'sell', ios: 'tag' },
    label: 'Deal',
  },
  event: {
    body: 'Event details and session options will be added in a later stage.',
    icon: { android: 'calendar_month', ios: 'calendar' },
    label: 'Event',
  },
  mall: {
    body: 'The mall profile, store directory, facilities, and map are coming next.',
    icon: { android: 'apartment', ios: 'building.2' },
    label: 'Mall',
  },
  notification: {
    body: 'Alya’s booking confirmations, reminders, and deal alerts will be available here.',
    icon: { android: 'notifications', ios: 'bell.fill' },
    label: 'Notifications',
  },
  product: {
    body: 'Product variants, availability, and purchase links will be added in a later stage.',
    icon: { android: 'shopping_bag', ios: 'bag' },
    label: 'Product',
  },
  promotion: {
    body: 'Promoted campaign details and participation options will be added later.',
    icon: { android: 'campaign', ios: 'megaphone' },
    label: 'Promotion',
  },
  social: {
    body: 'The POC keeps social destinations local; production will open the store’s verified profile.',
    icon: { android: 'group', ios: 'person.2' },
    label: 'Social',
  },
  store: {
    body: 'The store profile, products, deals, and booking options will be added later.',
    icon: { android: 'storefront', ios: 'storefront' },
    label: 'Store',
  },
} as const satisfies Record<
  string,
  { body: string; icon: AppSymbolName; label: string }
>;

export interface PreviewScreenProps {
  kind?: string;
  title?: string;
}

export function PreviewScreen({ kind = 'mall', title = 'Shopymalls' }: PreviewScreenProps) {
  const router = useRouter();
  const copy = previewCopy[kind as keyof typeof previewCopy] ?? previewCopy.mall;

  return (
    <Screen reserveBottomNavigation={false}>
      <Card className="items-center gap-lg py-3xl" variant="highlight">
        <ViewIcon icon={copy.icon} />
        <AppText tone="accent" variant="eyebrow">
          {copy.label.toUpperCase()}
        </AppText>
        <AppText className="text-center" variant="title">
          {title}
        </AppText>
        <AppText className="max-w-80 text-center" tone="secondary" variant="body">
          {copy.body}
        </AppText>
        <Button
          label="Back"
          leading={(color) => (
            <AppSymbol
              name={{ android: 'arrow_back', ios: 'arrow.left' }}
              size={16}
              tintColor={color}
            />
          )}
          onPress={() => router.back()}
        />
      </Card>
    </Screen>
  );
}

function ViewIcon({ icon }: { icon: AppSymbolName }) {
  return (
    <AppSymbol name={icon} size={38} tintColor={colors.lime} />
  );
}
