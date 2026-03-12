import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Shield, UserMinus, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useGrantAdminRole,
  useListAdmins,
  useRevokeAdminRole,
} from "../../../hooks/useAdminQueries";
import { useInternetIdentity } from "../../../hooks/useInternetIdentity";
import { useGetUserProfile } from "../../../hooks/useQueries";
import { isSuperAdmin } from "../../../lib/superAdmin";

function AdminItem({
  principalId,
  onRevoke,
}: { principalId: string; onRevoke: () => void }) {
  const { data: profile } = useGetUserProfile(principalId);
  const { identity } = useInternetIdentity();
  const currentUserPrincipal = identity?.getPrincipal().toString();
  const isCurrentUserSuperAdmin = isSuperAdmin(currentUserPrincipal);

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div>
        <p className="font-semibold">
          {profile?.displayName || "Unknown User"}
        </p>
        <p className="text-sm text-muted-foreground">{principalId}</p>
      </div>
      {isCurrentUserSuperAdmin && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <UserMinus className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke Admin Role</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke admin privileges from this user?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onRevoke}>Revoke</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export function AdminsPanel() {
  const { data: admins, isLoading, isError } = useListAdmins();
  const grantAdmin = useGrantAdminRole();
  const revokeAdmin = useRevokeAdminRole();
  const [newAdminPrincipal, setNewAdminPrincipal] = useState("");
  const { identity } = useInternetIdentity();
  const currentUserPrincipal = identity?.getPrincipal().toString();
  const isCurrentUserSuperAdmin = isSuperAdmin(currentUserPrincipal);

  const handleGrantAdmin = async () => {
    if (!newAdminPrincipal.trim()) {
      toast.error("Please enter a valid principal ID");
      return;
    }

    try {
      await grantAdmin.mutateAsync(newAdminPrincipal.trim());
      toast.success("Admin role granted successfully");
      setNewAdminPrincipal("");
    } catch (error: any) {
      if (error.message?.includes("Unauthorized")) {
        toast.error("Only super admins can grant admin privileges");
      } else {
        toast.error(error.message || "Failed to grant admin role");
      }
    }
  };

  const handleRevokeAdmin = async (principalId: string) => {
    try {
      await revokeAdmin.mutateAsync(principalId);
      toast.success("Admin role revoked successfully");
    } catch (error: any) {
      if (error.message?.includes("Unauthorized")) {
        toast.error("Only super admins can revoke admin privileges");
      } else {
        toast.error(error.message || "Failed to revoke admin role");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Failed to load admin list</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Management</CardTitle>
        <CardDescription>
          {isCurrentUserSuperAdmin
            ? "Manage admin privileges for users"
            : "View current admins (super admin required to modify)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isCurrentUserSuperAdmin && (
          <div className="mb-6 rounded-lg border p-4">
            <Label htmlFor="newAdmin" className="mb-2 block">
              Grant Admin Role
            </Label>
            <div className="flex gap-2">
              <Input
                id="newAdmin"
                placeholder="Enter principal ID"
                value={newAdminPrincipal}
                onChange={(e) => setNewAdminPrincipal(e.target.value)}
                disabled={grantAdmin.isPending}
              />
              <Button
                onClick={handleGrantAdmin}
                disabled={grantAdmin.isPending}
              >
                {grantAdmin.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Grant
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {!admins || admins.length === 0 ? (
          <div className="py-12 text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No admins found</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {admins.map((principalId) => (
                <AdminItem
                  key={principalId}
                  principalId={principalId}
                  onRevoke={() => handleRevokeAdmin(principalId)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
