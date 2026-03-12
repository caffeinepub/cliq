import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

export function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">
          You do not have permission to access the admin area. This section is
          restricted to administrators only.
        </p>
        <Button onClick={() => navigate({ to: "/" })}>Return to Home</Button>
      </div>
    </div>
  );
}
