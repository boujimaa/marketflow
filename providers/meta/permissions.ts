export const META_REQUIRED_PERMISSIONS = [
  "public_profile",
  "pages_show_list",
  "pages_read_engagement",
  "instagram_basic",
] as const;

export type MetaPermission = { permission: string; status: string };

export function validateGrantedPermissions(permissions: MetaPermission[]): string[] {
  const granted = new Set(
    permissions.filter(({ status }) => status === "granted").map(({ permission }) => permission),
  );
  const missing = META_REQUIRED_PERMISSIONS.filter((permission) => !granted.has(permission));

  if (missing.length > 0) {
    throw new Error(`Required Meta permissions were not granted: ${missing.join(", ")}.`);
  }

  return [...granted];
}
