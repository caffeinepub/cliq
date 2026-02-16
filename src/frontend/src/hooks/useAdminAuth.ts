import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAdminAuth() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.isCallerAdmin();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return false;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    isAdmin: query.data ?? false,
    isLoading: actorFetching || query.isLoading,
    isError: query.isError,
  };
}
