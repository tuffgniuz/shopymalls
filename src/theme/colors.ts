/**
 * Shopymalls color tokens.
 *
 * These values are the programmatic counterpart of the NativeWind theme
 * variables declared in `src/global.css`.
 */
export const colors = {
  canvas: '#050505',
  surface: '#101010',
  surfaceRaised: '#151515',
  surfaceOverlay: '#1A1A1A',
  border: '#2A2A2A',
  textPrimary: '#F6F6F6',
  textSecondary: '#A3A3A3',
  textTertiary: '#828282',
  textDisabled: '#8A8A8A',
  lime: '#B8F500',
  onLime: '#050505',
  limeSurface: '#101400',
  limeSurfaceStrong: '#171C00',
  limeBorder: '#3A4B12',
  booking: '#A85DD4',
  bookingStrong: '#68289E',
  bookingSurface: '#302251',
  onBooking: '#F6F6F6',
  success: '#B8F500',
  warning: '#F6C850',
  warningSurface: '#2B2100',
  danger: '#FF6B6B',
  dangerSurface: '#4A2020',
} as const;

export const imageOverlays = {
  soft: 'rgba(0, 0, 0, 0.34)',
  strong: 'rgba(0, 0, 0, 0.44)',
  bottom: 'rgba(0, 0, 0, 0.82)',
} as const;

export type ColorToken = keyof typeof colors;
export type ImageOverlayToken = keyof typeof imageOverlays;
