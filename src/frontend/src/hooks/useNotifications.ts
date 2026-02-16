import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Notification } from '../backend';
import { useEffect, useRef } from 'react';

export function useGetNotifications(since?: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Notification[]>({
    queryKey: ['notifications', since?.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getNotifications(since || null);
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUnreadNotificationCount() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['unreadNotificationCount'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getUnreadNotificationCount();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000, // Poll every 10 seconds
  });
}

export function useNotificationsPolling() {
  const { actor, isFetching: actorFetching } = useActor();
  const lastFetchRef = useRef<bigint>(BigInt(Date.now()) * BigInt(1000000));

  const query = useQuery<Notification[]>({
    queryKey: ['notificationsPolling'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const notifications = await actor.getNotifications(lastFetchRef.current);
      if (notifications.length > 0) {
        const latestTimestamp = notifications.reduce((max, n) => n.timestamp > max ? n.timestamp : max, lastFetchRef.current);
        lastFetchRef.current = latestTimestamp;
      }
      return notifications;
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 15000, // Poll every 15 seconds
  });

  return query;
}
