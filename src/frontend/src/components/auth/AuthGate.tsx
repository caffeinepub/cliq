import { useRouterState } from "@tanstack/react-router";
import { getMockUser } from "../../hooks/useMockAuth";
import { SignedOutLanding } from "./SignedOutLanding";

interface AuthGateProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = ["/signin", "/signup"];

export function AuthGate({ children }: AuthGateProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  // Allow sign-in and sign-up pages through without auth
  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  const user = getMockUser();
  if (!user) {
    return <SignedOutLanding />;
  }

  return <>{children}</>;
}
