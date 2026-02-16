import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TicketEvent {
    id: bigint;
    title: string;
    creator: Principal;
    availableTickets: bigint;
    verifiers: Array<Principal>;
    description: string;
    university: string;
    ticketPrice: bigint;
    eventDate: Time;
}
export type Time = bigint;
export interface Comment {
    id: bigint;
    content: string;
    author: Principal;
    parentComment?: bigint;
    timestamp: Time;
    postId: bigint;
}
export type MediaAttachment = {
    __kind__: "video";
    video: ExternalBlob;
} | {
    __kind__: "image";
    image: ExternalBlob;
};
export interface MarketplaceListing {
    id: bigint;
    media?: ExternalBlob;
    title: string;
    sold: boolean;
    description: string;
    seller: Principal;
    university: string;
    timestamp: Time;
    price: bigint;
}
export interface Post {
    id: bigint;
    media?: MediaAttachment;
    content: string;
    author: Principal;
    likes: bigint;
    university: string;
    timestamp: Time;
}
export interface Notification {
    id: bigint;
    notificationType: NotificationType;
    read: boolean;
    recipient: Principal;
    timestamp: Time;
    relatedId?: bigint;
    relatedUser?: Principal;
}
export interface Message {
    id: bigint;
    content: string;
    sender: Principal;
    conversationId: bigint;
    timestamp: Time;
}
export interface Ticket {
    eventId: bigint;
    code: string;
    attendee: Principal;
    checkedIn: boolean;
    pricePaid: bigint;
    checkedInAt?: Time;
}
export interface Conversation {
    id: bigint;
    participants: Array<Principal>;
    lastMessageTime: Time;
}
export interface UserProfile {
    bio: string;
    username: string;
    displayName: string;
    university: string;
    avatar?: ExternalBlob;
}
export enum NotificationType {
    like = "like",
    comment = "comment",
    message = "message",
    follow = "follow"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: bigint, content: string, parentComment: bigint | null): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    browseTicketEvents(universityFilter: string | null, limit: bigint, offset: bigint): Promise<Array<TicketEvent>>;
    checkInTicket(code: string): Promise<void>;
    createListing(title: string, description: string, price: bigint, media: ExternalBlob | null): Promise<bigint>;
    createPost(content: string, media: MediaAttachment | null): Promise<bigint>;
    createTicketEvent(title: string, description: string, eventDate: Time, verifiers: Array<Principal>, ticketPrice: bigint, availableTickets: bigint): Promise<bigint>;
    deleteComment(commentId: bigint): Promise<void>;
    deleteListing(listingId: bigint): Promise<void>;
    deletePost(postId: bigint): Promise<void>;
    followUser(user: Principal): Promise<void>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCampusFeed(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getCommentThread(postId: bigint, parentComment: bigint | null): Promise<Array<Comment>>;
    getComments(postId: bigint): Promise<Array<Comment>>;
    getContactList(): Promise<Array<Conversation>>;
    getConversations(): Promise<Array<Conversation>>;
    getEventTickets(eventId: bigint): Promise<Array<Ticket>>;
    getFollowers(user: Principal): Promise<Array<Principal>>;
    getFollowing(user: Principal): Promise<Array<Principal>>;
    getFollowingFeed(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getListing(listingId: bigint): Promise<MarketplaceListing | null>;
    getMessages(conversationId: bigint): Promise<Array<Message>>;
    getMyTickets(): Promise<Array<Ticket>>;
    getNotifications(since: Time | null): Promise<Array<Notification>>;
    getPost(postId: bigint): Promise<Post | null>;
    getTicketEvent(eventId: bigint): Promise<TicketEvent | null>;
    getUniversalFeed(limit: bigint, offset: bigint): Promise<Array<Post>>;
    getUnreadNotificationCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    grantAdminRole(user: Principal): Promise<void>;
    hasProfile(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isFollowing(user: Principal): Promise<boolean>;
    issueTicket(eventId: bigint, attendee: Principal, code: string): Promise<void>;
    likePost(postId: bigint): Promise<void>;
    listAdmins(): Promise<Array<Principal>>;
    listConversations(limit: bigint, offset: bigint): Promise<Array<Conversation>>;
    listMarketplaceListings(limit: bigint, offset: bigint): Promise<Array<MarketplaceListing>>;
    listPosts(limit: bigint, offset: bigint): Promise<Array<Post>>;
    listTicketEvents(limit: bigint, offset: bigint): Promise<Array<TicketEvent>>;
    markListingAsSold(listingId: bigint): Promise<void>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    purchaseTicket(eventId: bigint): Promise<void>;
    revokeAdminRole(user: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchListings(searchTerm: string | null, universityFilter: string | null): Promise<Array<MarketplaceListing>>;
    searchUsers(term: string, universityFilter: string | null): Promise<Array<UserProfile>>;
    sendMessage(conversationId: bigint, content: string): Promise<bigint>;
    startConversation(otherUser: Principal): Promise<bigint>;
    unfollowUser(user: Principal): Promise<void>;
    unlikePost(postId: bigint): Promise<void>;
    verifyTicket(code: string): Promise<boolean>;
}
