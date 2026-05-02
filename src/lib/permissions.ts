import { UserRole } from "../types";

export type Permission = 
  | "view_asesi_panel" 
  | "view_admin_panel" 
  | "view_executive_dashboard" 
  | "verify_apl01" 
  | "approve_certificate" 
  | "view_system_logs";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ASESI]: [
    "view_asesi_panel"
  ],
  [UserRole.ADMIN]: [
    "view_admin_panel",
    "verify_apl01"
  ],
  [UserRole.DIREKTUR]: [
    "view_executive_dashboard",
    "view_admin_panel",
    "approve_certificate",
    "view_system_logs"
  ]
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
