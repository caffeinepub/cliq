import { useAdminAuth } from '../../hooks/useAdminAuth';
import { AccessDeniedScreen } from './AccessDeniedScreen';
import { Loader2 } from 'lucide-react';

interface AdminGateProps {
  children: React.ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const { isAdmin, isLoading, isError } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
