import { AppText, type AppTextProps } from './app-text';
import { useI18n } from '@/i18n';

export type PriceLocale = 'id-ID' | 'en-ID';

export type PriceTextProps = Omit<AppTextProps, 'children' | 'numeric'> & {
  locale?: PriceLocale;
  value: number;
};

const formatters: Record<PriceLocale, Intl.NumberFormat> = {
  'id-ID': new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }),
  'en-ID': new Intl.NumberFormat('en-ID', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }),
};

export function PriceText({
  locale,
  selectable = true,
  value,
  variant = 'bodyStrong',
  ...props
}: PriceTextProps) {
  const { priceLocale } = useI18n();
  const selectedLocale = locale ?? priceLocale;
  const sign = value < 0 ? '-' : '';
  const amount = formatters[selectedLocale].format(Math.abs(value));

  return (
    <AppText numeric selectable={selectable} variant={variant} {...props}>
      {`${sign}Rp${amount}`}
    </AppText>
  );
}
