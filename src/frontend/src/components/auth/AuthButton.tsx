import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { LogOut, Loader2 } from 'lucide-react';

export function AuthButton() {
  const { clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  if (!isAuthenticated) return null;

  return (
    <Button
      onClick={handleLogout}
      disabled={disabled}
      variant="ghost"
      size="sm"
      className="gap-2"
    >
      {disabled ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </>
      )}
    </Button>
  );
}
