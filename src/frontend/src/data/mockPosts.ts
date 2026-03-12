export interface MockPost {
  id: string;
  displayName: string;
  username: string;
  university: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isAnonymous?: boolean;
  isBoosted?: boolean;
  boostLabel?: string;
  boostReason?: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

export const mockPosts: MockPost[] = [
  {
    id: "mock-1",
    displayName: "Temi Adeyemi",
    username: "temi_ade",
    university: "University of Lagos",
    content:
      "Selling my 400L Engineering textbooks — Strength of Materials, Fluid Mechanics & Thermodynamics. All in good condition. Price is negotiable, just DM me! Don't let these collect dust 😅📚 #UNILAG #Engineering",
    timestamp: "12m",
    likes: 34,
    comments: 12,
    shares: 5,
    isBoosted: true,
    boostLabel: "Sponsored",
    boostReason: "Popular near you",
  },
  {
    id: "mock-2",
    displayName: "Chidi Okafor",
    username: "chidi_ok",
    university: "University of Nigeria, Nsukka",
    content:
      "Anyone in 300L Computer Science at UNN forming a study group for Data Structures & Algorithms? We meet Saturdays at the ICT building. Drop your WhatsApp number below 👇 #UNN #CompSci #StudyGroup",
    timestamp: "45m",
    likes: 67,
    comments: 28,
    shares: 14,
  },
  {
    id: "mock-3",
    displayName: "Anonymous",
    username: "anonymous",
    university: "Obafemi Awolowo University",
    content:
      "Confession: I've been pretending to understand our lecturer in Organic Chemistry for the entire semester. The man speaks for 2 hours and I take zero notes because I literally understand nothing 💀 Please someone save me before exams",
    timestamp: "1h",
    likes: 213,
    comments: 54,
    shares: 31,
    isAnonymous: true,
  },
  {
    id: "mock-4",
    displayName: "Bukola Fashola",
    username: "bukky_f",
    university: "Ahmadu Bello University",
    content:
      "The new canteen in Faculty of Sciences is actually underrated! Had jollof rice + chicken + plantain for ₦600. The portions are generous and the food is fresh. Way better than the main cafeteria that has been recycling the same soup since 2019 😭🍛 #ABU #CampusLife",
    timestamp: "2h",
    likes: 189,
    comments: 43,
    shares: 22,
  },
  {
    id: "mock-5",
    displayName: "Emeka Nwosu",
    username: "emeka_nw",
    university: "University of Ibadan",
    content:
      "Exam tips from a 5.0 GPA student 🧵\n\n1. Read past questions first — 70% of exams repeat\n2. Form study groups for theory courses\n3. Sleep before exams > pulling all-nighters\n4. Teach what you learn to someone else\n5. Start 2 weeks before, not 2 days before\n\nRT to save a life 🙏 #UI #Exams",
    timestamp: "3h",
    likes: 445,
    comments: 87,
    shares: 176,
  },
  {
    id: "mock-6",
    displayName: "Zainab Hassan",
    username: "zainab_h",
    university: "Bayero University Kano",
    content:
      "🔥 LAPTOP FOR SALE — HP EliteBook 840 G5\n• Intel Core i5 8th Gen\n• 8GB RAM, 256GB SSD\n• Battery lasts 5+ hours\n• No scratches, clean screen\n• ₦185,000 (negotiable)\n\nGraduating so I need to sell. Serious buyers only, come see it in person. DM me! #BUK #Marketplace",
    timestamp: "5h",
    likes: 58,
    comments: 19,
    shares: 8,
  },
  {
    id: "mock-7",
    displayName: "Favour Eze",
    username: "favour_ez",
    university: "University of Benin",
    content:
      "Me going to the library: I'll study for 6 hours straight 💪\n\nMe 20 minutes later: *watching TikTok in the library toilet* 😭😭😭\n\nWhy does the library WiFi hit different?? #UNIBEN #StudentLife",
    timestamp: "6h",
    likes: 892,
    comments: 134,
    shares: 267,
  },
  {
    id: "mock-8",
    displayName: "Omotola Bello",
    username: "tola_bello",
    university: "Lagos State University",
    content:
      "Honest review of the new student hostel block B:\n\n✅ Clean bathrooms (finally!!!)\n✅ 24hr water supply\n✅ New beds with actual mattresses\n❌ Generator only runs 6pm–11pm\n❌ No AC (but what were we expecting lol)\n\nOverall 7/10, biggest improvement in years. Props to the VC 👏 #LASU #CampusLife",
    timestamp: "8h",
    likes: 312,
    comments: 67,
    shares: 45,
  },
  {
    id: "mock-9",
    displayName: "Anonymous",
    username: "anonymous",
    university: "Federal University of Technology Akure",
    content:
      "Hot gist from the department 👀 A certain lecturer cancelled his 8am class... by showing up at 8am, writing his phone number on the board, and telling us to WhatsApp him if we ever want to reschedule. King behavior fr 😂 #FUTA #CampusGist",
    timestamp: "10h",
    likes: 731,
    comments: 201,
    shares: 188,
    isAnonymous: true,
  },
  {
    id: "mock-10",
    displayName: "Adaeze Obi",
    username: "ada_obi",
    university: "Nnamdi Azikiwe University",
    content:
      "Looking for a female roommate to share a 2-bedroom flat off campus near UNIZIK main gate. Rent is ₦180,000/year per person. The flat has constant electricity, good security, and a kitchen. Must be serious and clean 🏠 DM me ASAP, moving in next month! #UNIZIK #Roommate",
    timestamp: "1d",
    likes: 44,
    comments: 23,
    shares: 11,
  },
];
