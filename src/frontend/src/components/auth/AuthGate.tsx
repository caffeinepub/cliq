import { useRouterState } from "@tanstack/react-router";
import { getMockUser } from "../../hooks/useMockAuth";
import { OnboardingFlow } from "../onboarding/OnboardingFlow";

interface AuthGateProps {
  children: React.ReactNode;
}

const PUBLIC_PATHS = ["/signin", "/signup"];

export function AuthGate({ children }: AuthGateProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  if (PUBLIC_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  const user = getMockUser();
  if (!user) {
    return <OnboardingFlow />;
  }

  return <>{children}</>;
}
