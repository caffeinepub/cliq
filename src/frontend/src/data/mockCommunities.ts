export interface MockCommunity {
  id: string;
  name: string;
  description: string;
  university: string;
  universityAcronym: string;
  members: number;
  postsThisWeek: number;
  isPrivate: boolean;
  category: string;
  coverColor: string;
  emoji: string;
  joined?: boolean;
}

export const MOCK_COMMUNITIES: MockCommunity[] = [
  {
    id: "comm-1",
    name: "UNILAG Marketplace",
    description:
      "Buy, sell and swap everything on UNILAG campus. Students only.",
    university: "University of Lagos",
    universityAcronym: "UNILAG",
    members: 4521,
    postsThisWeek: 87,
    isPrivate: false,
    category: "Marketplace",
    coverColor: "#FF6B35",
    emoji: "🛒",
    joined: true,
  },
  {
    id: "comm-2",
    name: "UNN Tech Hub",
    description:
      "For tech enthusiasts, coders, and entrepreneurs at University of Nigeria.",
    university: "University of Nigeria, Nsukka",
    universityAcronym: "UNN",
    members: 1893,
    postsThisWeek: 43,
    isPrivate: false,
    category: "Technology",
    coverColor: "#2C8A7A",
    emoji: "💻",
    joined: false,
  },
  {
    id: "comm-3",
    name: "Campus Foodies",
    description:
      "Sharing the best food spots, canteen reviews, and cooking tips across all Nigerian campuses.",
    university: "All Universities",
    universityAcronym: "All",
    members: 8712,
    postsThisWeek: 201,
    isPrivate: false,
    category: "Lifestyle",
    coverColor: "#e8432d",
    emoji: "🍛",
    joined: true,
  },
  {
    id: "comm-4",
    name: "ABU Study Circle",
    description:
      "Private academic support group for ABU students. Past questions, study tips, group sessions.",
    university: "Ahmadu Bello University",
    universityAcronym: "ABU",
    members: 672,
    postsThisWeek: 34,
    isPrivate: true,
    category: "Academics",
    coverColor: "#6C757D",
    emoji: "📚",
    joined: false,
  },
  {
    id: "comm-5",
    name: "Campus Sports Connect",
    description:
      "Find teammates, organize games, and follow campus sports news across Nigerian universities.",
    university: "All Universities",
    universityAcronym: "All",
    members: 3401,
    postsThisWeek: 118,
    isPrivate: false,
    category: "Sports",
    coverColor: "#28A745",
    emoji: "⚽",
    joined: false,
  },
  {
    id: "comm-6",
    name: "LASU Fashion & Style",
    description:
      "Fashion inspo, outfit ideas, thrift deals, and custom tailors for LASU students.",
    university: "Lagos State University",
    universityAcronym: "LASU",
    members: 2189,
    postsThisWeek: 76,
    isPrivate: false,
    category: "Fashion",
    coverColor: "#FFC107",
    emoji: "👗",
    joined: true,
  },
];
