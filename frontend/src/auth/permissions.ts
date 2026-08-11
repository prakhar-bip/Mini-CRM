export type Permission =
  | 'customers.read'
  | 'customers.create'
  | 'customers.update'
  | 'customers.delete'
  | 'customers.followup'
  | 'products.read'
  | 'products.create'
  | 'products.update'
  | 'products.delete'
  | 'products.stock_adjust'
  | 'challans.read'
  | 'challans.create'
  | 'challans.confirm'
  | 'challans.cancel'
  | 'users.read'
  | 'users.manage'
  | 'reports.read';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    'customers.read',
    'customers.create',
    'customers.update',
    'customers.delete',
    'customers.followup',
    'products.read',
    'products.create',
    'products.update',
    'products.delete',
    'products.stock_adjust',
    'challans.read',
    'challans.create',
    'challans.confirm',
    'challans.cancel',
    'users.read',
    'users.manage',
    'reports.read',
  ],
  SALES: [
    'customers.read',
    'customers.create',
    'customers.update',
    'customers.followup',
    'products.read',
    'challans.read',
    'challans.create',
    'challans.confirm',
    'challans.cancel',
    'reports.read',
  ],
  WAREHOUSE: [
    'customers.read',
    'products.read',
    'products.create',
    'products.update',
    'products.stock_adjust',
    'challans.read',
    'reports.read',
  ],
  ACCOUNTS: [
    'customers.read',
    'products.read',
    'challans.read',
    'reports.read',
  ],
};

export const ROLE_DASHBOARD_ROUTES: Record<string, string> = {
  ADMIN: '/dashboard/admin',
  WAREHOUSE: '/dashboard/warehouse',
  SALES: '/dashboard/sales',
  ACCOUNTS: '/dashboard/accounts',
};

export const hasPermission = (userRole: string | undefined, permission: Permission): boolean => {
  if (!userRole) return false;
  const normalizedRole = userRole.toUpperCase();
  const permissions = ROLE_PERMISSIONS[normalizedRole] || [];
  return permissions.includes(permission);
};
