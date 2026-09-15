import {
  SymbolView,
  type AndroidSymbol,
  type SFSymbol,
  type SymbolViewProps,
} from 'expo-symbols';

export interface AppSymbolName {
  android: AndroidSymbol;
  ios: SFSymbol;
  web?: AndroidSymbol;
}

export type AppSymbolProps = Omit<SymbolViewProps, 'name'> & {
  name: AppSymbolName;
};

/** Cross-platform symbol with an SF Symbol on iPhone and Material fallback. */
export function AppSymbol({
  name,
  resizeMode = 'scaleAspectFit',
  ...props
}: AppSymbolProps) {
  return (
    <SymbolView
      name={{ ios: name.ios, android: name.android, web: name.web ?? name.android }}
      resizeMode={resizeMode}
      {...props}
    />
  );
}
