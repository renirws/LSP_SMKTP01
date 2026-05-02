import React from "react";
import { UserRole } from "../../types";
import { hasPermission, Permission } from "../../lib/permissions";

interface PermissionGateProps {
  role: UserRole;
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ role, permission, children, fallback = null }: PermissionGateProps) {
  if (!hasPermission(role, permission)) return <>{fallback}</>;
  return <>{children}</>;
}
