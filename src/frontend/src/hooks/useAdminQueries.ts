import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Comment,
  Conversation,
  MarketplaceListing,
  Message,
  Post,
  TicketEvent,
  UserProfile,
} from "../backend";
import { useActor } from "./useActor";
import { useAdminAuth } from "./useAdminAuth";

// Users
export function useGetAllUserProfiles() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAdmin } = useAdminAuth();

  return useQuery<UserProfile[]>({
    queryKey: ["adminAllUserProfiles"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.getAllUserProfiles();
    },
    enabled: !!actor && !actorFetching && isAdmin,
  });
}

// Posts
export function useListPosts(limit = 20, offset = 0) {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAdmin } = useAdminAuth();

  return useQuery<Post[]>({
    queryKey: ["adminPosts", limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.listPosts(BigInt(limit), BigInt(offset));
    },
    enabled: !!actor && !actorFetching && isAdmin,
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminPosts"] });
      queryClient.invalidateQueries({ queryKey: ["followingFeed"] });
      queryClient.invalidateQueries({ queryKey: ["campusFeed"] });
      queryClient.invalidateQueries({ queryKey: ["universalFeed"] });
    },
  });
}

export function useDeleteComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteComment(commentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

// Marketplace
export function useListMarketplaceListings(limit = 20, offset = 0) {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAdmin } = useAdminAuth();

  return useQuery<MarketplaceListing[]>({
    queryKey: ["adminMarketplaceListings", limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.listMarketplaceListings(BigInt(limit), BigInt(offset));
    },
    enabled: !!actor && !actorFetching && isAdmin,
  });
}

export function useMarkListingAsSold() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.markListingAsSold(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMarketplaceListings"] });
      queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      await actor.deleteListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMarketplaceListings"] });
      queryClient.invalidateQueries({ queryKey: ["marketplaceListings"] });
    },
  });
}

// Tickets/Events
export function useListTicketEvents(limit = 20, offset = 0) {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAdmin } = useAdminAuth();

  return useQuery<TicketEvent[]>({
    queryKey: ["adminTicketEvents", limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.listTicketEvents(BigInt(limit), BigInt(offset));
    },
    enabled: !!actor && !actorFetching && isAdmin,
  });
}

// Conversations
export function useListConversations(limit = 20, offset = 0) {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAdmin } = useAdminAuth();

  return useQuery<Conversation[]>({
    queryKey: ["adminConversations", limit, offset],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.listConversations(BigInt(limit), BigInt(offset));
    },
    enabled: !!actor && !actorFetching && isAdmin,
  });
}

export function useGetMessagesAdmin(conversationId?: string) {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAdmin } = useAdminAuth();

  return useQuery<Message[]>({
    queryKey: ["adminMessages", conversationId],
    queryFn: async () => {
      if (!actor || !conversationId)
        throw new Error("Actor or conversation ID not available");
      return await actor.getMessages(BigInt(conversationId));
    },
    enabled: !!actor && !actorFetching && !!conversationId && isAdmin,
  });
}

// Admin management
export function useListAdmins() {
  const { actor, isFetching: actorFetching } = useActor();
  const { isAdmin } = useAdminAuth();

  return useQuery<string[]>({
    queryKey: ["adminList"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const admins = await actor.listAdmins();
      return admins.map((p) => p.toString());
    },
    enabled: !!actor && !actorFetching && isAdmin,
  });
}

export function useGrantAdminRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(userPrincipal);
      await actor.grantAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminList"] });
    },
  });
}

export function useRevokeAdminRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error("Actor not available");
      const { Principal } = await import("@dfinity/principal");
      const principal = Principal.fromText(userPrincipal);
      await actor.revokeAdminRole(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminList"] });
    },
  });
}
