export interface MockPost {
  id: string;
  displayName: string;
  username: string;
  university: string;
  community?: string;
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
    community: "UNILAG Marketplace",
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
    community: "UNN Tech Hub",
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
    community: "Campus Foodies",
    content:
      "The new canteen in Faculty of Sciences is actually underrated! Had jollof rice + chicken + plantain for ₦600. The portions are generous and the food is fresh. Way better than the main cafeteria that has been recycling the same soup since 2019 😭🍛 #ABU #CampusLife",
    timestamp: "2h",
    likes: 189,
    comments: 43,
    shares: 22,
    mediaUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600",
    mediaType: "image",
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
    mediaUrl:
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
    mediaType: "image",
  },
  {
    id: "mock-6",
    displayName: "Zainab Hassan",
    username: "zainab_h",
    university: "Bayero University Kano",
    community: "BUK Gadgets & Tech",
    content:
      "🔥 LAPTOP FOR SALE — HP EliteBook 840 G5\n• Intel Core i5 8th Gen\n• 8GB RAM, 256GB SSD\n• Battery lasts 5+ hours\n• No scratches, clean screen\n• ₦185,000 (negotiable)\n\nGraduating so I need to sell. Serious buyers only, come see it in person. DM me! #BUK #Marketplace",
    timestamp: "5h",
    likes: 58,
    comments: 19,
    shares: 8,
    mediaUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    mediaType: "image",
  },
  {
    id: "mock-video-1",
    displayName: "Tunde Adewale",
    username: "tunde_law",
    university: "University of Lagos",
    community: "UNILAG Law Faculty",
    content:
      "UNILAG Law Week 2026 opening ceremony — the energy was insane 🔥 Shoutout to every 300L and 400L student who made it happen. This is history! #UNILAG #LawWeek2026 #CampusLife",
    timestamp: "30m",
    likes: 156,
    comments: 42,
    shares: 28,
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    mediaType: "video",
  },
  {
    id: "mock-video-2",
    displayName: "Ngozi Eze",
    username: "ngozi_ez",
    university: "University of Ibadan",
    content:
      "When the generator comes on during your midnight read 😂 This is why we can't have nice things at UI. The whole hostel just woke up like it's 8am 💀 #UI #CampusLife #StudentProblems",
    timestamp: "2h",
    likes: 312,
    comments: 89,
    shares: 67,
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    mediaType: "video",
  },
  {
    id: "mock-video-3",
    displayName: "Seun Oladipo",
    username: "seun_prints",
    university: "Obafemi Awolowo University",
    community: "OAU Creative Hub",
    content:
      "Made this custom printed tee in 20 minutes! DM for orders — custom designs from ₦2,500 🎨 Fast turnaround, campus delivery available. #OAU #StudentHustle #CustomPrints",
    timestamp: "4h",
    likes: 78,
    comments: 31,
    shares: 19,
    mediaUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    mediaType: "video",
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
    mediaUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600",
    mediaType: "image",
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
