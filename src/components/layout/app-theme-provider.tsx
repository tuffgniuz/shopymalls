import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  useFonts,
} from '@expo-google-fonts/open-sans';
import type { ReactNode } from 'react';

import { fontFamilies } from '@/theme';

const appFonts = {
  [fontFamilies.regular]: OpenSans_400Regular,
  [fontFamilies.bold]: OpenSans_700Bold,
};

export type AppThemeProviderProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

/** Mount once in the root layout to load the theme CSS and static font files. */
export function AppThemeProvider({
  children,
  fallback = null,
}: AppThemeProviderProps) {
  const [fontsLoaded, fontError] = useFonts(appFonts);

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return fallback;
  }

  return children;
}
