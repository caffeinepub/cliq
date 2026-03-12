import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Comment,
  Conversation,
  MarketplaceListing,
  MediaAttachment,
  Message,
  Notification,
  Post,
  Ticket,
  TicketEvent,
  UserProfile,
} from "../backend";
import type { ExternalBlob } from "../backend";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      try {
        return await actor.getCallerUserProfile();
      } catch (error: any) {
        if (error.message?.includes("No profile found")) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userPrincipal?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal)
        throw new Error("Actor or user principal not available");
      try {
        const { Principal } = await import("@dfinity/principal");
        const principal = Principal.fromText(userPrincipal);
        return await actor.getUserProfile(principal);
      } catch (error: any) {
        if (error.message?.includes("No profile found")) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
    retry: false,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useSearchUsers(term: string, universityFilter: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile[]>({
    queryKey: ["searchUsers", term, universityFilter],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      if (!term.trim()) return [];
      try {
        return await actor.searchUsers(term, universityFilter);
      } catch (error: any) {
        if (error.message?.includes("Search term cannot be empty")) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!term.trim(),
    retry: false,
  });
}

// Post queries
export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      content,
      media,
    }: { content: string; media?: MediaAttachment | null }) => {
      if (!actor) throw new Error("Actor not available");
      return await actor.createPost(content, media || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followingFeed"] });
      queryClient.invalidateQueries({ queryKey: ["campusFeed"] });
      queryClient.invalidateQueries({ queryKey: ["universalFeed"] });
    },
  });
}

export function useGetPost(postId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post | null>({
    queryKey: ["post", postId],
    queryFn: async () => {
      if (!actor || !postId) throw new Error("Actor or post ID not available");
      return await actor.getPost(BigInt(postId));
    },
    enabled: !!actor && !actorFetching && !!postId,
  });
}

export function useGetFollowingFeed(limit = 20, offset = 0) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ["followingFeed", limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.getFollowingFeed(BigInt(limit), BigInt(offset));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCampusFeed(limit = 20, offset = 0) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ["campusFeed", limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.getCampusFeed(BigInt(limit), BigInt(offset));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetUniversalFeed(limit = 20, offset = 0) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ["universalFeed", limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.getUniversalFeed(BigInt(limit), BigInt(offset));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.likePost(postId);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["followingFeed"] });
      queryClient.invalidateQueries({ queryKey: ["campusFeed"] });
      queryClient.invalidateQueries({ queryKey: ["universalFeed"] });
    },
  });
}

export function useUnlikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.unlikePost(postId);
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId.toString()] });
      queryClient.invalidateQueries({ queryKey: ["followingFeed"] });
      queryClient.invalidateQueries({ queryKey: ["campusFeed"] });
      queryClient.invalidateQueries({ queryKey: ["universalFeed"] });
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      content,
      parentComment,
    }: { postId: bigint; content: string; parentComment?: bigint | null }) => {
      if (!actor) throw new Error("Actor not available");
      return await actor.addComment(postId, content, parentComment || null);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["post", postId.toString()] });
    },
  });
}

export function useDeleteComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      postId: _postId,
    }: { commentId: bigint; postId: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteComment(commentId);
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId.toString()],
      });
    },
  });
}

export function useGetComments(postId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      if (!actor || !postId) throw new Error("Actor or post ID not available");
      return await actor.getComments(BigInt(postId));
    },
    enabled: !!actor && !actorFetching && !!postId,
  });
}

export function useFollowUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(userPrincipal);
      await actor.followUser(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followingFeed"] });
    },
  });
}

export function useIsFollowing(userPrincipal?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isFollowing", userPrincipal],
    queryFn: async () => {
      if (!actor || !userPrincipal)
        throw new Error("Actor or user principal not available");
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(userPrincipal);
      return await actor.isFollowing(principal);
    },
    enabled: !!actor && !actorFetching && !!userPrincipal,
  });
}

// Marketplace queries
export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      price,
      media,
    }: {
      title: string;
      description: string;
      price: number;
      media?: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return await actor.createListing(
        title,
        description,
        BigInt(price),
        media || null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
    },
  });
}

export function useGetListing(listingId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MarketplaceListing | null>({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      if (!actor || !listingId)
        throw new Error("Actor or listing ID not available");
      return await actor.getListing(BigInt(listingId));
    },
    enabled: !!actor && !actorFetching && !!listingId,
  });
}

export function useSearchListings(
  searchTerm?: string,
  universityFilter?: string,
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MarketplaceListing[]>({
    queryKey: ["marketplaceListings", searchTerm, universityFilter],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.searchListings(
        searchTerm || null,
        universityFilter || null,
      );
    },
    enabled: !!actor && !actorFetching,
  });
}

// Messaging queries
export function useStartConversation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (otherUserPrincipal: string) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(otherUserPrincipal);
      return await actor.startConversation(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useGetConversations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.getConversations();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMessages(conversationId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!actor || !conversationId)
        throw new Error("Actor or conversation ID not available");
      return await actor.getMessages(BigInt(conversationId));
    },
    enabled: !!actor && !actorFetching && !!conversationId,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: { conversationId: bigint; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      return await actor.sendMessage(conversationId, content);
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// Tickets queries
export function useCreateTicketEvent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      eventDate,
      verifiers,
      ticketPrice,
      availableTickets,
    }: {
      title: string;
      description: string;
      eventDate: bigint;
      verifiers: string[];
      ticketPrice?: number;
      availableTickets?: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@dfinity/principal");
      const verifierPrincipals = verifiers.map((v) => Principal.fromText(v));
      return await actor.createTicketEvent(
        title,
        description,
        eventDate,
        verifierPrincipals,
        BigInt(ticketPrice || 0),
        BigInt(availableTickets || 0),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
      queryClient.invalidateQueries({ queryKey: ["browseTicketEvents"] });
    },
  });
}

export function useGetTicketEvent(eventId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TicketEvent | null>({
    queryKey: ["ticketEvent", eventId],
    queryFn: async () => {
      if (!actor || !eventId)
        throw new Error("Actor or event ID not available");
      return await actor.getTicketEvent(BigInt(eventId));
    },
    enabled: !!actor && !actorFetching && !!eventId,
  });
}

export function useBrowseTicketEvents(
  universityFilter?: string | null,
  limit = 20,
  offset = 0,
) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<TicketEvent[]>({
    queryKey: ["browseTicketEvents", universityFilter, limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.browseTicketEvents(
        universityFilter || null,
        BigInt(limit),
        BigInt(offset),
      );
    },
    enabled: !!actor && !actorFetching,
  });
}

export function usePurchaseTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.purchaseTicket(eventId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTickets"] });
      queryClient.invalidateQueries({ queryKey: ["browseTicketEvents"] });
    },
  });
}

export function useGetMyTickets() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Ticket[]>({
    queryKey: ["myTickets"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.getMyTickets();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetEventTickets(eventId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Ticket[]>({
    queryKey: ["eventTickets", eventId],
    queryFn: async () => {
      if (!actor || !eventId)
        throw new Error("Actor or event ID not available");
      return await actor.getEventTickets(BigInt(eventId));
    },
    enabled: !!actor && !actorFetching && !!eventId,
  });
}

export function useIssueTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      attendee,
      code,
    }: { eventId: bigint; attendee: string; code: string }) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@dfinity/principal");
      const attendeePrincipal = Principal.fromText(attendee);
      await actor.issueTicket(eventId, attendeePrincipal, code);
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({
        queryKey: ["eventTickets", eventId.toString()],
      });
    },
  });
}

export function useVerifyTicket() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Actor not available");
      return await actor.verifyTicket(code);
    },
  });
}

export function useCheckInTicket() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.checkInTicket(code);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
    },
  });
}
