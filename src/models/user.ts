import type {
  AppLocale,
  BaseEntity,
  EntityId,
  IsoDateTime,
  LocalizedText,
} from './common';

export const USER_STATUSES = ['pending', 'active', 'blocked'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const USER_ROLES = [
  'shopper',
  'retailer_staff',
  'retailer_admin',
  'mall_admin',
  'platform_admin',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_ASSIGNMENT_STATUSES = ['active', 'inactive'] as const;
export type RoleAssignmentStatus =
  (typeof ROLE_ASSIGNMENT_STATUSES)[number];

interface RoleAssignmentFields extends BaseEntity {
  userId: EntityId;
  status: RoleAssignmentStatus;
}

/**
 * Role scope is part of the role assignment, preventing a retailer or mall
 * administrator from operating on unrelated businesses.
 */
export type UserRoleAssignment =
  | (RoleAssignmentFields & {
      role: 'shopper';
      scope: { type: 'self' };
    })
  | (RoleAssignmentFields & {
      role: 'retailer_staff' | 'retailer_admin';
      scope: { type: 'store'; storeId: EntityId };
    })
  | (RoleAssignmentFields & {
      role: 'mall_admin';
      scope: { type: 'mall'; mallId: EntityId };
    })
  | (RoleAssignmentFields & {
      role: 'platform_admin';
      scope: { type: 'platform' };
    });

export interface UserPreferences {
  locale: AppLocale;
  shoppingInterests: readonly LocalizedText[];
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  dealAlertsEnabled: boolean;
  bookingRemindersEnabled: boolean;
}

/**
 * This is an application profile, not an authentication identity. It contains
 * no password, token, provider, or session fields.
 */
export interface User extends BaseEntity {
  fullName: string;
  avatarUrl?: string;
  emailAddress?: string;
  phoneNumber?: string;
  status: UserStatus;
  preferences: UserPreferences;
  roleAssignments: readonly UserRoleAssignment[];
  lastActiveAt?: IsoDateTime;
}
