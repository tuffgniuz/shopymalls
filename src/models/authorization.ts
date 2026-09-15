import type { EntityId } from './common';
import type { User, UserRole, UserRoleAssignment } from './user';

export const PERMISSIONS = [
  'catalog.read_public',
  'profile.read_own',
  'profile.update_own',
  'favorites.manage_own',
  'notifications.read_own',
  'notifications.manage_own',
  'bookings.create_own',
  'bookings.read_own',
  'bookings.update_own',
  'bookings.cancel_own',
  'store.read_private',
  'store.update',
  'store.staff_manage',
  'store.products_manage',
  'store.deals_manage',
  'store.events_manage',
  'store.bookings_read',
  'store.bookings_manage',
  'store.booking_settings_manage',
  'store.campaigns_manage',
  'store.analytics_read',
  'store.billing_manage',
  'mall.read_private',
  'mall.update',
  'mall.staff_manage',
  'mall.stores_review',
  'mall.events_manage',
  'mall.deals_feature',
  'mall.deals_moderate',
  'mall.campaigns_manage',
  'mall.analytics_read',
  'mall.billing_manage',
  'mall.floor_maps_manage',
  'platform.users_manage',
  'platform.malls_manage',
  'platform.stores_manage',
  'platform.content_moderate',
  'platform.analytics_read',
  'platform.pilot_manage',
  'platform.testing_manage',
  'platform.billing_manage',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export interface AuthorizationTarget {
  ownerUserId?: EntityId;
  mallId?: EntityId;
  storeId?: EntityId;
}

const PUBLIC_PERMISSIONS = ['catalog.read_public'] as const satisfies readonly Permission[];

const OWN_RESOURCE_PERMISSIONS = [
  'profile.read_own',
  'profile.update_own',
  'favorites.manage_own',
  'notifications.read_own',
  'notifications.manage_own',
  'bookings.create_own',
  'bookings.read_own',
  'bookings.update_own',
  'bookings.cancel_own',
] as const satisfies readonly Permission[];

const RETAILER_STAFF_PERMISSIONS = [
  'store.read_private',
  'store.products_manage',
  'store.deals_manage',
  'store.events_manage',
  'store.bookings_read',
  'store.bookings_manage',
] as const satisfies readonly Permission[];

const RETAILER_ADMIN_PERMISSIONS = [
  ...RETAILER_STAFF_PERMISSIONS,
  'store.update',
  'store.staff_manage',
  'store.booking_settings_manage',
  'store.campaigns_manage',
  'store.analytics_read',
  'store.billing_manage',
] as const satisfies readonly Permission[];

const MALL_ADMIN_PERMISSIONS = [
  'store.read_private',
  'mall.read_private',
  'mall.update',
  'mall.staff_manage',
  'mall.stores_review',
  'mall.events_manage',
  'mall.deals_feature',
  'mall.deals_moderate',
  'mall.campaigns_manage',
  'mall.analytics_read',
  'mall.billing_manage',
  'mall.floor_maps_manage',
] as const satisfies readonly Permission[];

/** Active users receive public and own-resource access in addition to this map. */
export const ROLE_PERMISSIONS = {
  shopper: [],
  retailer_staff: RETAILER_STAFF_PERMISSIONS,
  retailer_admin: RETAILER_ADMIN_PERMISSIONS,
  mall_admin: MALL_ADMIN_PERMISSIONS,
  platform_admin: PERMISSIONS,
} as const satisfies Record<UserRole, readonly Permission[]>;

function includesPermission(
  permissions: readonly Permission[],
  permission: Permission,
): boolean {
  return permissions.includes(permission);
}

function assignmentMatchesTarget(
  assignment: UserRoleAssignment,
  target: AuthorizationTarget,
): boolean {
  switch (assignment.scope.type) {
    case 'self':
      return target.ownerUserId === assignment.userId;
    case 'store':
      return target.storeId === assignment.scope.storeId;
    case 'mall':
      return target.mallId === assignment.scope.mallId;
    case 'platform':
      return true;
  }
}

/**
 * Client-side authorization for the POC. This controls visible actions but is
 * not a security boundary; a future API/database must enforce the same policy.
 */
export function can(
  user: User,
  permission: Permission,
  target: AuthorizationTarget = {},
): boolean {
  if (user.status === 'blocked') {
    return false;
  }

  if (includesPermission(PUBLIC_PERMISSIONS, permission)) {
    return true;
  }

  const isOwnPermission = includesPermission(
    OWN_RESOURCE_PERMISSIONS,
    permission,
  );
  const isOwnResource = isOwnPermission && target.ownerUserId === user.id;

  if (user.status === 'pending') {
    return permission === 'profile.read_own' && isOwnResource;
  }

  if (isOwnPermission) {
    return isOwnResource;
  }

  return user.roleAssignments.some(
    (assignment) =>
      assignment.userId === user.id &&
      assignment.status === 'active' &&
      includesPermission(ROLE_PERMISSIONS[assignment.role], permission) &&
      assignmentMatchesTarget(assignment, target),
  );
}

export function canAny(
  user: User,
  permissions: readonly Permission[],
  target: AuthorizationTarget = {},
): boolean {
  return permissions.some((permission) => can(user, permission, target));
}

export function canAll(
  user: User,
  permissions: readonly Permission[],
  target: AuthorizationTarget = {},
): boolean {
  return permissions.every((permission) => can(user, permission, target));
}
