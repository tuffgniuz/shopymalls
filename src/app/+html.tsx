import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const description = 'Discover malls, stores, deals, events, and bookings across Jakarta.';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <title>Shopymalls</title>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
        />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#050505" />
        <meta name="color-scheme" content="dark" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Shopymalls" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />

        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: 'html, body { background-color: #050505; }' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
