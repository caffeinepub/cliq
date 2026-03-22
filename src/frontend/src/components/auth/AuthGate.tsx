import { Loader2 } from "lucide-react";
import { getMockUser } from "../../hooks/useMockAuth";
import { SignedOutLanding } from "./SignedOutLanding";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  // Use mock auth (localStorage) instead of Internet Identity
  const user = getMockUser();

  if (!user) {
    return <SignedOutLanding />;
  }

  return <>{children}</>;
}
