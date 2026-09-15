import type {
  Category,
  EntityStatus,
  Mall,
  MallFacility,
  MallFloor,
  SocialLinks,
  Store,
} from '../../models';
import { demoImageUris } from '../image-uris';
import { DEMO_TIME_ZONE } from './constants';
import { image, openingHours, text, timestamps } from './helpers';
import { demoIds } from './ids';

export const categories: readonly Category[] = [
  ['fashion', 'Fashion', 'shirt-outline'],
  ['beauty', 'Kecantikan', 'Beauty', 'sparkles-outline'],
  ['dining', 'Kuliner', 'Dining', 'restaurant-outline'],
  ['electronics', 'Elektronik', 'Electronics', 'phone-portrait-outline'],
  ['entertainment', 'Hiburan', 'Entertainment', 'game-controller-outline'],
  ['fitness', 'Kebugaran', 'Fitness', 'barbell-outline'],
  ['services', 'Layanan', 'Services', 'cut-outline'],
  ['lifestyle', 'Gaya hidup', 'Lifestyle', 'home-outline'],
].map((entry, index) => {
  const [key, idName, enName, iconName] =
    entry.length === 3
      ? [entry[0], entry[0] === 'fashion' ? 'Mode' : entry[0], entry[1], entry[2]]
      : entry;

  return {
    id: demoIds.categories[key as keyof typeof demoIds.categories],
    slug: key,
    name: text(idName, enName),
    iconName,
    sortOrder: index,
    status: 'active',
    ...timestamps(),
  };
});

function mallFacilities(mallId: string): readonly MallFacility[] {
  return [
    {
      id: `${mallId}-facility-parking`,
      type: 'parking',
      label: text('Parkir', 'Parking'),
      locationText: text('Basement B1–B3', 'Basement B1–B3'),
    },
    {
      id: `${mallId}-facility-prayer-room`,
      type: 'prayer_room',
      label: text('Musala', 'Prayer room'),
      locationText: text('Lantai 2', 'Level 2'),
    },
    {
      id: `${mallId}-facility-wifi`,
      type: 'wifi',
      label: text('Wi-Fi gratis', 'Free Wi-Fi'),
    },
    {
      id: `${mallId}-facility-accessibility`,
      type: 'accessibility',
      label: text('Akses kursi roda', 'Wheelchair access'),
    },
  ];
}

export const malls: readonly Mall[] = [
  {
    id: demoIds.malls.aurora,
    name: 'Aurora Central',
    slug: 'aurora-central',
    description: text(
      'Destinasi belanja, kuliner, dan hiburan modern di jantung Jakarta.',
      'A modern shopping, dining, and entertainment destination in the heart of Jakarta.',
    ),
    address: {
      line1: 'Jl. M.H. Thamrin No. 18',
      district: 'Menteng',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10350',
      countryCode: 'ID',
    },
    coordinates: { latitude: -6.1952, longitude: 106.8227 },
    timeZone: DEMO_TIME_ZONE,
    contact: {
      email: 'hello@aurora-central.example',
      phone: '+62 21 555 0101',
      websiteUrl: 'https://aurora-central.example',
    },
    socialLinks: {},
    openingHours: openingHours(['10:00', '22:00'], ['10:00', '23:00']),
    facilities: mallFacilities(demoIds.malls.aurora),
    isFeatured: true,
    rating: { average: 4.8, count: 2841 },
    coverImages: [
      image(
        'media-mall-aurora-cover',
        demoImageUris.malls.aurora,
        'Atrium tropis Aurora Central pada malam hari',
        'Aurora Central tropical atrium at night',
      ),
    ],
    status: 'active',
    ...timestamps(),
  },
  {
    id: demoIds.malls.nusantara,
    name: 'Nusantara Galleria',
    slug: 'nusantara-galleria',
    description: text(
      'Galeri ritel premium dengan sentuhan desain Indonesia kontemporer.',
      'A premium retail gallery with contemporary Indonesian design.',
    ),
    address: {
      line1: 'Jl. Jenderal Sudirman No. 88',
      district: 'Setiabudi',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12920',
      countryCode: 'ID',
    },
    coordinates: { latitude: -6.2198, longitude: 106.8145 },
    timeZone: DEMO_TIME_ZONE,
    contact: {
      email: 'hello@nusantara-galleria.example',
      phone: '+62 21 555 0102',
      websiteUrl: 'https://nusantara-galleria.example',
    },
    socialLinks: {},
    openingHours: openingHours(['10:00', '22:00'], ['10:00', '23:00']),
    facilities: mallFacilities(demoIds.malls.nusantara),
    rating: { average: 4.7, count: 1932 },
    coverImages: [
      image(
        'media-mall-nusantara-cover',
        demoImageUris.malls.nusantara,
        'Galeri utama Nusantara Galleria',
        'Nusantara Galleria main gallery',
      ),
    ],
    status: 'active',
    ...timestamps(),
  },
  {
    id: demoIds.malls.senayan,
    name: 'Senayan Terraces',
    slug: 'senayan-terraces',
    description: text(
      'Ruang belanja terbuka dengan kuliner, kebugaran, dan hiburan.',
      'Open-air shopping with dining, fitness, and entertainment.',
    ),
    address: {
      line1: 'Jl. Asia Afrika No. 12',
      district: 'Tanah Abang',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta',
      postalCode: '10270',
      countryCode: 'ID',
    },
    coordinates: { latitude: -6.2252, longitude: 106.7992 },
    timeZone: DEMO_TIME_ZONE,
    contact: {
      email: 'hello@senayan-terraces.example',
      phone: '+62 21 555 0103',
      websiteUrl: 'https://senayan-terraces.example',
    },
    socialLinks: {},
    openingHours: openingHours(['10:00', '22:00'], ['09:00', '23:00']),
    facilities: mallFacilities(demoIds.malls.senayan),
    rating: { average: 4.6, count: 1478 },
    coverImages: [
      image(
        'media-mall-senayan-cover',
        demoImageUris.malls.senayan,
        'Teras belanja Senayan saat senja',
        'Senayan shopping terraces at dusk',
      ),
    ],
    status: 'active',
    ...timestamps(),
  },
  {
    id: demoIds.malls.kemang,
    name: 'Kemang Square',
    slug: 'kemang-square',
    description: text(
      'Pusat gaya hidup lingkungan yang segera hadir di Jakarta Selatan.',
      'A neighborhood lifestyle center coming soon to South Jakarta.',
    ),
    address: {
      line1: 'Jl. Kemang Raya No. 42',
      district: 'Mampang Prapatan',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12730',
      countryCode: 'ID',
    },
    coordinates: { latitude: -6.2608, longitude: 106.8138 },
    timeZone: DEMO_TIME_ZONE,
    contact: { email: 'hello@kemang-square.example', phone: '+62 21 555 0104' },
    socialLinks: {},
    openingHours: openingHours(),
    facilities: mallFacilities(demoIds.malls.kemang),
    coverImages: [
      image(
        'media-mall-kemang-cover',
        demoImageUris.malls.kemang,
        'Eksterior Kemang Square',
        'Kemang Square exterior',
      ),
    ],
    status: 'pending',
    ...timestamps(),
  },
];

const floorSpecs: readonly [
  id: string,
  mallId: string,
  idName: string,
  enName: string,
  levelCode: string,
  sortOrder: number,
  mapImageUrl?: string,
][] = [
  [demoIds.floors.auroraGround, demoIds.malls.aurora, 'Lantai dasar', 'Ground floor', 'G', 0],
  [demoIds.floors.auroraOne, demoIds.malls.aurora, 'Lantai 1', 'Level 1', 'L1', 1],
  [demoIds.floors.auroraTwo, demoIds.malls.aurora, 'Lantai 2', 'Level 2', 'L2', 2, demoImageUris.maps.auroraLevelTwo],
  [demoIds.floors.auroraThree, demoIds.malls.aurora, 'Lantai 3', 'Level 3', 'L3', 3],
  [demoIds.floors.nusantaraGround, demoIds.malls.nusantara, 'Lantai dasar', 'Ground floor', 'G', 0],
  [demoIds.floors.nusantaraOne, demoIds.malls.nusantara, 'Lantai 1', 'Level 1', 'L1', 1],
  [demoIds.floors.nusantaraTwo, demoIds.malls.nusantara, 'Lantai 2', 'Level 2', 'L2', 2],
  [demoIds.floors.senayanGround, demoIds.malls.senayan, 'Teras dasar', 'Ground terrace', 'G', 0],
  [demoIds.floors.senayanOne, demoIds.malls.senayan, 'Teras 1', 'Terrace 1', 'T1', 1],
  [demoIds.floors.senayanTwo, demoIds.malls.senayan, 'Teras 2', 'Terrace 2', 'T2', 2],
  [demoIds.floors.kemangGround, demoIds.malls.kemang, 'Lantai dasar', 'Ground floor', 'G', 0],
  [demoIds.floors.kemangOne, demoIds.malls.kemang, 'Lantai 1', 'Level 1', 'L1', 1],
];

export const mallFloors: readonly MallFloor[] = floorSpecs.map(
  ([id, mallId, idName, enName, levelCode, sortOrder, mapImageUrl]) => ({
    id,
    mallId,
    name: text(idName, enName),
    levelCode,
    mapImageUrl,
    sortOrder,
    status: mallId === demoIds.malls.kemang ? 'pending' : 'active',
    ...timestamps(),
  }),
);

interface StoreSeed {
  id: string;
  mallId: string;
  categoryIds: readonly string[];
  name: string;
  slug: string;
  descriptionId: string;
  descriptionEn: string;
  floorId?: string;
  levelText?: string;
  unitNumber?: string;
  coverUrl?: string;
  status?: EntityStatus;
  rating?: { average: number; count: number };
  hours?: ReturnType<typeof openingHours>;
  socialLinks?: SocialLinks;
}

function createStore(seed: StoreSeed): Store {
  return {
    id: seed.id,
    mallId: seed.mallId,
    categoryIds: seed.categoryIds,
    name: seed.name,
    slug: seed.slug,
    description: text(seed.descriptionId, seed.descriptionEn),
    floorId: seed.floorId,
    levelText: seed.levelText,
    unitNumber: seed.unitNumber,
    contact: {
      email: `hello@${seed.slug}.example`,
      phone: '+62 21 555 1000',
    },
    socialLinks: seed.socialLinks ?? {},
    openingHours: seed.hours ?? openingHours(),
    coverImages: seed.coverUrl
      ? [
          image(
            `media-${seed.id}-cover`,
            seed.coverUrl,
            `Interior ${seed.name}`,
            `${seed.name} interior`,
          ),
        ]
      : [],
    rating: seed.rating,
    status: seed.status ?? 'active',
    ...timestamps(),
  };
}

export const stores: readonly Store[] = [
  createStore({
    id: demoIds.stores.lumenSneakers,
    mallId: demoIds.malls.aurora,
    categoryIds: [demoIds.categories.fashion, demoIds.categories.fitness],
    name: 'Lumen Sneakers',
    slug: 'lumen-sneakers',
    descriptionId: 'Sneaker performa dan gaya urban pilihan.',
    descriptionEn: 'Curated performance sneakers and urban style.',
    floorId: demoIds.floors.auroraTwo,
    levelText: 'Lantai 2',
    unitNumber: '2.14',
    coverUrl: demoImageUris.stores.lumenSneakers,
    rating: { average: 4.8, count: 326 },
    socialLinks: {
      facebookUrl: 'https://facebook.com/lumensneakers',
      instagramUrl: 'https://instagram.com/lumensneakers',
      tiktokUrl: 'https://tiktok.com/@lumensneakers',
    },
  }),
  createStore({
    id: demoIds.stores.dapurSenja,
    mallId: demoIds.malls.aurora,
    categoryIds: [demoIds.categories.dining],
    name: 'Dapur Senja',
    slug: 'dapur-senja',
    descriptionId: 'Masakan Indonesia kontemporer untuk makan bersama.',
    descriptionEn: 'Contemporary Indonesian dining made for sharing.',
    floorId: demoIds.floors.auroraTwo,
    levelText: 'Lantai 2',
    unitNumber: '2.08',
    coverUrl: demoImageUris.stores.dapurSenja,
    rating: { average: 4.7, count: 518 },
    hours: openingHours(['11:00', '22:00'], ['10:00', '23:00']),
  }),
  createStore({
    id: demoIds.stores.sariBeauty,
    mallId: demoIds.malls.aurora,
    categoryIds: [demoIds.categories.beauty, demoIds.categories.services],
    name: 'Sari Beauty Studio',
    slug: 'sari-beauty-studio',
    descriptionId: 'Perawatan kuku dan kecantikan dalam suasana tenang.',
    descriptionEn: 'Nail and beauty treatments in a calm setting.',
    floorId: demoIds.floors.auroraOne,
    levelText: 'Lantai 1',
    unitNumber: '1.21',
    coverUrl: demoImageUris.stores.sariBeauty,
    rating: { average: 4.9, count: 204 },
  }),
  createStore({
    id: demoIds.stores.layarCinema,
    mallId: demoIds.malls.aurora,
    categoryIds: [demoIds.categories.entertainment],
    name: 'Layar Cinema',
    slug: 'layar-cinema',
    descriptionId: 'Bioskop butik dengan kursi premium dan pilihan film baru.',
    descriptionEn: 'A boutique cinema with premium seating and new releases.',
    floorId: demoIds.floors.auroraThree,
    levelText: 'Lantai 3',
    unitNumber: '3.01',
    coverUrl: demoImageUris.stores.layarCinema,
    rating: { average: 4.7, count: 891 },
  }),
  createStore({
    id: demoIds.stores.teknoHub,
    mallId: demoIds.malls.aurora,
    categoryIds: [demoIds.categories.electronics],
    name: 'Tekno Hub',
    slug: 'tekno-hub',
    descriptionId: 'Teknologi personal dan rumah pintar tanpa ribet.',
    descriptionEn: 'Straightforward personal and smart-home technology.',
    floorId: demoIds.floors.auroraOne,
    levelText: 'Lantai 1',
    unitNumber: '1.08',
    coverUrl: demoImageUris.stores.teknoHub,
    rating: { average: 4.6, count: 178 },
  }),
  createStore({
    id: demoIds.stores.kopiTaman,
    mallId: demoIds.malls.aurora,
    categoryIds: [demoIds.categories.dining],
    name: 'Kopi Taman',
    slug: 'kopi-taman',
    descriptionId: 'Kopi Indonesia, pastry segar, dan sudut hijau untuk rehat.',
    descriptionEn: 'Indonesian coffee, fresh pastries, and a green place to pause.',
    floorId: demoIds.floors.auroraGround,
    levelText: 'Lantai dasar',
    unitNumber: 'G.12',
    coverUrl: demoImageUris.stores.kopiTaman,
    rating: { average: 4.8, count: 642 },
    hours: openingHours(['08:00', '22:00'], ['08:00', '23:00']),
  }),
  createStore({
    id: demoIds.stores.atelierNusa,
    mallId: demoIds.malls.nusantara,
    categoryIds: [demoIds.categories.fashion, demoIds.categories.lifestyle],
    name: 'Atelier Nusa',
    slug: 'atelier-nusa',
    descriptionId: 'Mode Indonesia modern dengan material dan motif pilihan.',
    descriptionEn: 'Modern Indonesian fashion with selected materials and patterns.',
    floorId: demoIds.floors.nusantaraOne,
    levelText: 'Lantai 1',
    unitNumber: '1.16',
    coverUrl: demoImageUris.stores.atelierNusa,
    rating: { average: 4.9, count: 153 },
  }),
  createStore({
    id: demoIds.stores.arunaBarber,
    mallId: demoIds.malls.nusantara,
    categoryIds: [demoIds.categories.beauty, demoIds.categories.services],
    name: 'Aruna Barbershop',
    slug: 'aruna-barbershop',
    descriptionId: 'Potong rambut presisi dan grooming modern.',
    descriptionEn: 'Precision cuts and modern grooming.',
    floorId: demoIds.floors.nusantaraTwo,
    levelText: 'Lantai 2',
    unitNumber: '2.05',
    coverUrl: demoImageUris.stores.arunaBarber,
    rating: { average: 4.8, count: 286 },
  }),
  createStore({
    id: demoIds.stores.rimbaSpa,
    mallId: demoIds.malls.nusantara,
    categoryIds: [demoIds.categories.beauty, demoIds.categories.services],
    name: 'Rimba Spa',
    slug: 'rimba-spa',
    descriptionId: 'Ritual relaksasi urban terinspirasi alam Indonesia.',
    descriptionEn: 'Urban relaxation rituals inspired by Indonesian nature.',
    floorId: demoIds.floors.nusantaraTwo,
    levelText: 'Lantai 2',
    unitNumber: '2.11',
    coverUrl: demoImageUris.stores.rimbaSpa,
    rating: { average: 4.9, count: 198 },
  }),
  createStore({
    id: demoIds.stores.rumahLiving,
    mallId: demoIds.malls.nusantara,
    categoryIds: [demoIds.categories.lifestyle],
    name: 'Rumah Living',
    slug: 'rumah-living',
    descriptionId: 'Perabot dan dekorasi untuk rumah tropis kontemporer.',
    descriptionEn: 'Furniture and decor for contemporary tropical homes.',
    floorId: demoIds.floors.nusantaraGround,
    levelText: 'Lantai dasar',
    unitNumber: 'G.20',
    coverUrl: demoImageUris.stores.rumahLiving,
    rating: { average: 4.6, count: 94 },
  }),
  createStore({
    id: demoIds.stores.orbitArcade,
    mallId: demoIds.malls.senayan,
    categoryIds: [demoIds.categories.entertainment],
    name: 'Orbit Arcade',
    slug: 'orbit-arcade',
    descriptionId: 'Permainan sosial dan aktivitas seru untuk semua usia.',
    descriptionEn: 'Social games and energetic activities for every age.',
    floorId: demoIds.floors.senayanOne,
    levelText: 'Teras 1',
    unitNumber: 'T1.07',
    coverUrl: demoImageUris.stores.orbitArcade,
    rating: { average: 4.7, count: 407 },
  }),
  createStore({
    id: demoIds.stores.pulseFitness,
    mallId: demoIds.malls.senayan,
    categoryIds: [demoIds.categories.fitness],
    name: 'Pulse Fitness',
    slug: 'pulse-fitness',
    descriptionId: 'Kelas kelompok premium dengan pemandangan kota.',
    descriptionEn: 'Premium group classes with city views.',
    floorId: demoIds.floors.senayanTwo,
    levelText: 'Teras 2',
    unitNumber: 'T2.03',
    coverUrl: demoImageUris.stores.pulseFitness,
    rating: { average: 4.8, count: 219 },
    hours: openingHours(['06:00', '22:00'], ['07:00', '20:00']),
  }),
  createStore({
    id: demoIds.stores.monoLab,
    mallId: demoIds.malls.kemang,
    categoryIds: [demoIds.categories.fashion],
    name: 'Mono Lab',
    slug: 'mono-lab',
    descriptionId: 'Konsep mode minimal yang sedang menunggu persetujuan.',
    descriptionEn: 'A minimal fashion concept awaiting approval.',
    floorId: demoIds.floors.kemangGround,
    levelText: 'Lantai dasar',
    unitNumber: 'G.06',
    status: 'pending',
  }),
  createStore({
    id: demoIds.stores.quickPrize,
    mallId: demoIds.malls.aurora,
    categoryIds: [demoIds.categories.entertainment],
    name: 'Quick Prize',
    slug: 'quick-prize',
    descriptionId: 'Akun demo yang diblokir untuk menguji moderasi.',
    descriptionEn: 'A blocked demo account for moderation testing.',
    floorId: demoIds.floors.auroraThree,
    levelText: 'Lantai 3',
    unitNumber: '3.18',
    status: 'blocked',
  }),
];
