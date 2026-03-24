export interface MockNotification {
  id: string;
  type:
    | "like"
    | "comment"
    | "follow"
    | "mention"
    | "recliq"
    | "message"
    | "community";
  actor: string;
  actorUsername: string;
  actorAvatar: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedContent?: string;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "notif-1",
    type: "like",
    actor: "Emeka Nwosu",
    actorUsername: "emeka_nw",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emeka",
    message: "liked your post about Engineering textbooks",
    timestamp: "2m ago",
    read: false,
    relatedContent: "Selling my 400L Engineering textbooks...",
  },
  {
    id: "notif-2",
    type: "follow",
    actor: "Bukola Fashola",
    actorUsername: "bukky_f",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bukola",
    message: "started following you",
    timestamp: "15m ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "comment",
    actor: "Chidi Okafor",
    actorUsername: "chidi_ok",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chidi",
    message: "commented on your post",
    timestamp: "1h ago",
    read: false,
    relatedContent:
      "Are the books still available? Interested in the Thermodynamics one 🙏",
  },
  {
    id: "notif-4",
    type: "mention",
    actor: "Favour Eze",
    actorUsername: "favour_ez",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=favour",
    message: "mentioned you in a post",
    timestamp: "2h ago",
    read: true,
    relatedContent:
      "@temi_ade your textbook prices are way better than the bookshop fr 😭",
  },
  {
    id: "notif-5",
    type: "recliq",
    actor: "Adaeze Obi",
    actorUsername: "ada_obi",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=adaeze",
    message: "recliqed your post about exam tips",
    timestamp: "3h ago",
    read: true,
  },
  {
    id: "notif-6",
    type: "like",
    actor: "Zainab Hassan",
    actorUsername: "zainab_h",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zainab",
    message: "and 23 others liked your post",
    timestamp: "5h ago",
    read: true,
  },
  {
    id: "notif-7",
    type: "community",
    actor: "Campus Foodies",
    actorUsername: "campus_foodies",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=foodies",
    message: "Your post was featured in Campus Foodies",
    timestamp: "6h ago",
    read: true,
  },
  {
    id: "notif-8",
    type: "message",
    actor: "Omotola Bello",
    actorUsername: "tola_bello",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=omotola",
    message: "sent you a message",
    timestamp: "8h ago",
    read: true,
    relatedContent:
      "Hey! Is that mini fridge still available? I need one urgently",
  },
  {
    id: "notif-9",
    type: "follow",
    actor: "Emeka Nwosu",
    actorUsername: "emeka_nw",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emeka",
    message: "started following you",
    timestamp: "1d ago",
    read: true,
  },
  {
    id: "notif-10",
    type: "comment",
    actor: "Bukola Fashola",
    actorUsername: "bukky_f",
    actorAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bukola",
    message: "replied to your comment",
    timestamp: "1d ago",
    read: true,
    relatedContent:
      "Yes the canteen is amazing! Go early before they sell out though 👏",
  },
];
