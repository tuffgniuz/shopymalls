export const radius = {
  xs: 4,
  sm: 8,
  control: 12,
  card: 16,
  feature: 18,
  navigation: 24,
  full: 999,
} as const;

export type RadiusToken = keyof typeof radius;
