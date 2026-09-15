import type { ImageSourcePropType } from 'react-native';

import { demoImageUris, type DemoImageUri } from './image-uris';

/** Static requires are necessary so Metro can include every local image. */
export const demoImageSources = {
  [demoImageUris.malls.aurora]: require('../../assets/content/malls/aurora-central.jpg'),
  [demoImageUris.malls.kemang]: require('../../assets/content/malls/kemang-square-pending.jpg'),
  [demoImageUris.malls.nusantara]: require('../../assets/content/malls/nusantara-galleria.jpg'),
  [demoImageUris.malls.senayan]: require('../../assets/content/malls/senayan-terraces.jpg'),
  [demoImageUris.stores.arunaBarber]: require('../../assets/content/stores/aruna-barbershop.jpg'),
  [demoImageUris.stores.atelierNusa]: require('../../assets/content/stores/atelier-nusa-fashion.jpg'),
  [demoImageUris.stores.dapurSenja]: require('../../assets/content/stores/dapur-senja-restaurant.jpg'),
  [demoImageUris.stores.kopiTaman]: require('../../assets/content/stores/kopi-taman.jpg'),
  [demoImageUris.stores.layarCinema]: require('../../assets/content/stores/layar-cinema.jpg'),
  [demoImageUris.stores.lumenSneakers]: require('../../assets/content/stores/lumen-sneakers.jpg'),
  [demoImageUris.stores.orbitArcade]: require('../../assets/content/stores/orbit-arcade.jpg'),
  [demoImageUris.stores.pulseFitness]: require('../../assets/content/stores/pulse-fitness.jpg'),
  [demoImageUris.stores.rimbaSpa]: require('../../assets/content/stores/rimba-spa.jpg'),
  [demoImageUris.stores.rumahLiving]: require('../../assets/content/stores/rumah-living.jpg'),
  [demoImageUris.stores.sariBeauty]: require('../../assets/content/stores/sari-beauty-studio.jpg'),
  [demoImageUris.stores.teknoHub]: require('../../assets/content/stores/tekno-hub.jpg'),
  [demoImageUris.products.aeroHeadphones]: require('../../assets/content/products/aero-headphones.jpg'),
  [demoImageUris.products.artisanCeramics]: require('../../assets/content/products/artisan-ceramic-set.jpg'),
  [demoImageUris.products.botanicalSet]: require('../../assets/content/products/botanical-skincare-set.jpg'),
  [demoImageUris.products.modernBatikShirt]: require('../../assets/content/products/modern-batik-shirt.jpg'),
  [demoImageUris.products.nightBloomFragrance]: require('../../assets/content/products/night-bloom-fragrance.jpg'),
  [demoImageUris.products.novaController]: require('../../assets/content/products/nova-game-controller.jpg'),
  [demoImageUris.products.obsidianRunner]: require('../../assets/content/products/obsidian-runner.jpg'),
  [demoImageUris.products.siennaHandbag]: require('../../assets/content/products/sienna-handbag.jpg'),
  [demoImageUris.products.singleOriginCoffee]: require('../../assets/content/products/single-origin-coffee.jpg'),
  [demoImageUris.products.slateSmartwatch]: require('../../assets/content/products/slate-smartwatch.jpg'),
  [demoImageUris.products.studioFitnessKit]: require('../../assets/content/products/studio-fitness-kit.jpg'),
  [demoImageUris.products.tropicalDessertBox]: require('../../assets/content/products/tropical-dessert-box.jpg'),
  [demoImageUris.events.acousticTwilight]: require('../../assets/content/events/acoustic-twilight.jpg'),
  [demoImageUris.events.flavourFestival]: require('../../assets/content/events/nusantara-flavour-festival.jpg'),
  [demoImageUris.events.styleWeek]: require('../../assets/content/events/jakarta-style-week.jpg'),
  [demoImageUris.events.wellnessWeekend]: require('../../assets/content/events/wellness-weekend.jpg'),
  [demoImageUris.events.youngCreators]: require('../../assets/content/events/young-creators-workshop.jpg'),
  [demoImageUris.avatars.alya]: require('../../assets/content/avatars/alya-putri.jpg'),
  [demoImageUris.avatars.bima]: require('../../assets/content/avatars/bima-pratama.jpg'),
  [demoImageUris.avatars.maya]: require('../../assets/content/avatars/maya-santoso.jpg'),
  [demoImageUris.avatars.rizky]: require('../../assets/content/avatars/rizky-aditya.jpg'),
  [demoImageUris.maps.auroraLevelTwo]: require('../../assets/content/maps/aurora-central-level-two.jpg'),
} as const satisfies Record<DemoImageUri, ImageSourcePropType>;

export function isDemoImageUri(uri: string): uri is DemoImageUri {
  return Object.prototype.hasOwnProperty.call(demoImageSources, uri);
}

export function resolveImageSource(uri: string): ImageSourcePropType {
  return isDemoImageUri(uri) ? demoImageSources[uri] : { uri };
}
