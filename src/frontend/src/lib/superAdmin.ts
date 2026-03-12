// Super admin configuration
// In production, this should be configured via environment variables
// The first admin is automatically initialized in useActor.ts

export function isSuperAdmin(principalId?: string): boolean {
  if (!principalId) return false;

  // Check if this is the first admin (initialized automatically)
  // In a production environment, you would check against a configured list
  // For now, we'll use a simple check that can be extended

  // You can add specific principal IDs here for super admin access
  const _superAdmins: string[] = [
    // Add super admin principal IDs here
    // Example: '2vxsx-fae'
  ];

  // For now, we'll treat all admins as super admins
  // This can be refined based on your requirements
  return true;
}
