export interface MockUser {
  id: string;
  email: string;
  password: string;
  displayName: string;
  username: string;
  university: string;
  universityAcronym: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  following: number;
  posts: number;
}

export const DEMO_ACCOUNTS: MockUser[] = [
  {
    id: "user_demo1",
    email: "temi@cliq.app",
    password: "campus123",
    displayName: "Temi Adeyemi",
    username: "temi_ade",
    university: "University of Lagos",
    universityAcronym: "UNILAG",
    bio: "400L Engineering | Bookworm | Campus foodie 🍛",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=temi",
    followers: 342,
    following: 187,
    posts: 56,
  },
  {
    id: "user_demo2",
    email: "chidi@cliq.app",
    password: "campus123",
    displayName: "Chidi Okafor",
    username: "chidi_ok",
    university: "University of Nigeria, Nsukka",
    universityAcronym: "UNN",
    bio: "300L CompSci | Tech bro in the making 💻 | DSA nerd",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chidi",
    followers: 218,
    following: 134,
    posts: 43,
  },
  {
    id: "user_demo3",
    email: "zainab@cliq.app",
    password: "campus123",
    displayName: "Zainab Hassan",
    username: "zainab_h",
    university: "Bayero University Kano",
    universityAcronym: "BUK",
    bio: "Final year Med student | Side hustle queen 👑 | Gadget dealer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=zainab",
    followers: 501,
    following: 290,
    posts: 88,
  },
];

export const MOCK_USERS: MockUser[] = [
  ...DEMO_ACCOUNTS,
  {
    id: "user_4",
    email: "emeka@cliq.app",
    password: "campus123",
    displayName: "Emeka Nwosu",
    username: "emeka_nw",
    university: "University of Ibadan",
    universityAcronym: "UI",
    bio: "5.0 GPA | Study tips content creator | Future lawyer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=emeka",
    followers: 1203,
    following: 89,
    posts: 124,
  },
  {
    id: "user_5",
    email: "bukola@cliq.app",
    password: "campus123",
    displayName: "Bukola Fashola",
    username: "bukky_f",
    university: "Ahmadu Bello University",
    universityAcronym: "ABU",
    bio: "Campus food critic 🍛 | ABU 300L Economics | Foodie first",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bukola",
    followers: 678,
    following: 412,
    posts: 92,
  },
  {
    id: "user_6",
    email: "favour@cliq.app",
    password: "campus123",
    displayName: "Favour Eze",
    username: "favour_ez",
    university: "University of Benin",
    universityAcronym: "UNIBEN",
    bio: "200L Mass Comm | Meme lord | Library WiFi addict",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=favour",
    followers: 2341,
    following: 567,
    posts: 201,
  },
  {
    id: "user_7",
    email: "omotola@cliq.app",
    password: "campus123",
    displayName: "Omotola Bello",
    username: "tola_bello",
    university: "Lagos State University",
    universityAcronym: "LASU",
    bio: "400L Architecture | Hostel review blogger | Campus activist",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=omotola",
    followers: 445,
    following: 223,
    posts: 67,
  },
  {
    id: "user_8",
    email: "adaeze@cliq.app",
    password: "campus123",
    displayName: "Adaeze Obi",
    username: "ada_obi",
    university: "Nnamdi Azikiwe University",
    universityAcronym: "UNIZIK",
    bio: "Pharmacy 500L | Roommate finder | Study group coordinator",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=adaeze",
    followers: 189,
    following: 201,
    posts: 34,
  },
];
