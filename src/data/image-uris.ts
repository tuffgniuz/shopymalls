export const demoImageUris = {
  malls: {
    aurora: 'asset://content/malls/aurora-central',
    kemang: 'asset://content/malls/kemang-square-pending',
    nusantara: 'asset://content/malls/nusantara-galleria',
    senayan: 'asset://content/malls/senayan-terraces',
  },
  stores: {
    arunaBarber: 'asset://content/stores/aruna-barbershop',
    atelierNusa: 'asset://content/stores/atelier-nusa-fashion',
    dapurSenja: 'asset://content/stores/dapur-senja-restaurant',
    kopiTaman: 'asset://content/stores/kopi-taman',
    layarCinema: 'asset://content/stores/layar-cinema',
    lumenSneakers: 'asset://content/stores/lumen-sneakers',
    orbitArcade: 'asset://content/stores/orbit-arcade',
    pulseFitness: 'asset://content/stores/pulse-fitness',
    rimbaSpa: 'asset://content/stores/rimba-spa',
    rumahLiving: 'asset://content/stores/rumah-living',
    sariBeauty: 'asset://content/stores/sari-beauty-studio',
    teknoHub: 'asset://content/stores/tekno-hub',
  },
  products: {
    aeroHeadphones: 'asset://content/products/aero-headphones',
    artisanCeramics: 'asset://content/products/artisan-ceramic-set',
    botanicalSet: 'asset://content/products/botanical-skincare-set',
    modernBatikShirt: 'asset://content/products/modern-batik-shirt',
    nightBloomFragrance: 'asset://content/products/night-bloom-fragrance',
    novaController: 'asset://content/products/nova-game-controller',
    obsidianRunner: 'asset://content/products/obsidian-runner',
    siennaHandbag: 'asset://content/products/sienna-handbag',
    singleOriginCoffee: 'asset://content/products/single-origin-coffee',
    slateSmartwatch: 'asset://content/products/slate-smartwatch',
    studioFitnessKit: 'asset://content/products/studio-fitness-kit',
    tropicalDessertBox: 'asset://content/products/tropical-dessert-box',
  },
  events: {
    acousticTwilight: 'asset://content/events/acoustic-twilight',
    flavourFestival: 'asset://content/events/nusantara-flavour-festival',
    styleWeek: 'asset://content/events/jakarta-style-week',
    wellnessWeekend: 'asset://content/events/wellness-weekend',
    youngCreators: 'asset://content/events/young-creators-workshop',
  },
  avatars: {
    alya: 'asset://content/avatars/alya-putri',
    bima: 'asset://content/avatars/bima-pratama',
    maya: 'asset://content/avatars/maya-santoso',
    rizky: 'asset://content/avatars/rizky-aditya',
  },
  maps: {
    auroraLevelTwo: 'asset://content/maps/aurora-central-level-two',
  },
} as const;

type NestedStringValue<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? { [Key in keyof T]: NestedStringValue<T[Key]> }[keyof T]
    : never;

export type DemoImageUri = NestedStringValue<typeof demoImageUris>;

