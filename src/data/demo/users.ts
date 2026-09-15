import type { User, UserPreferences, UserRoleAssignment } from '../../models';
import { demoImageUris } from '../image-uris';
import { timestamps } from './helpers';
import { demoIds } from './ids';

const defaultPreferences: UserPreferences = {
  locale: 'en',
  shoppingInterests: [
    { id: 'Mode', en: 'Fashion' },
    { id: 'Sneaker', en: 'Sneakers' },
    { id: 'Gaya hidup', en: 'Lifestyle' },
    { id: 'Kecantikan', en: 'Beauty' },
  ],
  pushNotificationsEnabled: true,
  emailNotificationsEnabled: false,
  dealAlertsEnabled: true,
  bookingRemindersEnabled: true,
};

function shopperAssignment(userId: string): UserRoleAssignment {
  return {
    id: `role-${userId}-shopper`,
    userId,
    role: 'shopper',
    scope: { type: 'self' },
    status: 'active',
    ...timestamps(),
  };
}

function retailerAssignment(
  userId: string,
  storeId: string,
  role: 'retailer_staff' | 'retailer_admin',
): UserRoleAssignment {
  return {
    id: `role-${userId}-${storeId}-${role}`,
    userId,
    role,
    scope: { type: 'store', storeId },
    status: 'active',
    ...timestamps(),
  };
}

export const users: readonly User[] = [
  {
    id: demoIds.users.alya,
    fullName: 'Alya Putri',
    avatarUrl: demoImageUris.avatars.alya,
    emailAddress: 'alya.putri@example.com',
    phoneNumber: '+62 812 0000 0101',
    status: 'active',
    preferences: defaultPreferences,
    roleAssignments: [shopperAssignment(demoIds.users.alya)],
    lastActiveAt: '2026-09-12T09:52:00+07:00',
    ...timestamps(),
  },
  {
    id: demoIds.users.dinda,
    fullName: 'Dinda Maharani',
    emailAddress: 'dinda.maharani@example.com',
    phoneNumber: '+62 812 0000 0102',
    status: 'active',
    preferences: { ...defaultPreferences, locale: 'en' },
    roleAssignments: [shopperAssignment(demoIds.users.dinda)],
    lastActiveAt: '2026-09-11T21:12:00+07:00',
    ...timestamps(),
  },
  {
    id: demoIds.users.fajar,
    fullName: 'Fajar Hidayat',
    emailAddress: 'fajar.hidayat@example.com',
    phoneNumber: '+62 812 0000 0103',
    status: 'active',
    preferences: defaultPreferences,
    roleAssignments: [shopperAssignment(demoIds.users.fajar)],
    lastActiveAt: '2026-09-12T08:05:00+07:00',
    ...timestamps(),
  },
  {
    id: demoIds.users.nisa,
    fullName: 'Nisa Rahma',
    emailAddress: 'nisa.rahma@example.com',
    phoneNumber: '+62 812 0000 0104',
    status: 'active',
    preferences: defaultPreferences,
    roleAssignments: [shopperAssignment(demoIds.users.nisa)],
    lastActiveAt: '2026-09-10T18:44:00+07:00',
    ...timestamps(),
  },
  {
    id: demoIds.users.bima,
    fullName: 'Bima Pratama',
    avatarUrl: demoImageUris.avatars.bima,
    emailAddress: 'bima.pratama@example.com',
    phoneNumber: '+62 812 0000 0201',
    status: 'active',
    preferences: defaultPreferences,
    roleAssignments: [
      retailerAssignment(
        demoIds.users.bima,
        demoIds.stores.lumenSneakers,
        'retailer_admin',
      ),
      retailerAssignment(
        demoIds.users.bima,
        demoIds.stores.dapurSenja,
        'retailer_admin',
      ),
    ],
    lastActiveAt: '2026-09-12T09:35:00+07:00',
    ...timestamps(),
  },
  {
    id: demoIds.users.tono,
    fullName: 'Tono Wijaya',
    emailAddress: 'tono.wijaya@example.com',
    phoneNumber: '+62 812 0000 0202',
    status: 'active',
    preferences: defaultPreferences,
    roleAssignments: [
      retailerAssignment(
        demoIds.users.tono,
        demoIds.stores.dapurSenja,
        'retailer_staff',
      ),
    ],
    lastActiveAt: '2026-09-12T09:40:00+07:00',
    ...timestamps(),
  },
  {
    id: demoIds.users.maya,
    fullName: 'Maya Santoso',
    avatarUrl: demoImageUris.avatars.maya,
    emailAddress: 'maya.santoso@example.com',
    phoneNumber: '+62 812 0000 0301',
    status: 'active',
    preferences: defaultPreferences,
    roleAssignments: [
      {
        id: `role-${demoIds.users.maya}-${demoIds.malls.aurora}-mall-admin`,
        userId: demoIds.users.maya,
        role: 'mall_admin',
        scope: { type: 'mall', mallId: demoIds.malls.aurora },
        status: 'active',
        ...timestamps(),
      },
    ],
    lastActiveAt: '2026-09-12T09:48:00+07:00',
    ...timestamps(),
  },
  {
    id: demoIds.users.rizky,
    fullName: 'Rizky Aditya',
    avatarUrl: demoImageUris.avatars.rizky,
    emailAddress: 'rizky.aditya@example.com',
    phoneNumber: '+62 812 0000 0401',
    status: 'active',
    preferences: { ...defaultPreferences, emailNotificationsEnabled: true },
    roleAssignments: [
      {
        id: `role-${demoIds.users.rizky}-platform-admin`,
        userId: demoIds.users.rizky,
        role: 'platform_admin',
        scope: { type: 'platform' },
        status: 'active',
        ...timestamps(),
      },
    ],
    lastActiveAt: '2026-09-12T09:58:00+07:00',
    ...timestamps(),
  },
];
