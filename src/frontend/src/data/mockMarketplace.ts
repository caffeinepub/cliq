export interface MockListing {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: "New" | "Like New" | "Good" | "Fair";
  category: string;
  seller: string;
  sellerUsername: string;
  university: string;
  universityAcronym: string;
  imageUrl: string;
  rating: number;
  isBoosted?: boolean;
  isService?: boolean;
  timestamp: string;
}

export const MOCK_LISTINGS: MockListing[] = [
  {
    id: "listing-1",
    title: "HP EliteBook 840 G5 — Clean",
    description:
      "Intel Core i5 8th Gen, 8GB RAM, 256GB SSD. No scratches. Battery lasts 5+ hours. Graduating so I need to sell.",
    price: 185000,
    condition: "Like New",
    category: "Gadgets & Electronics",
    seller: "Zainab Hassan",
    sellerUsername: "zainab_h",
    university: "Bayero University Kano",
    universityAcronym: "BUK",
    imageUrl:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
    rating: 4.8,
    isBoosted: true,
    timestamp: "2h ago",
  },
  {
    id: "listing-2",
    title: "400L Engineering Textbooks Bundle",
    description:
      "Strength of Materials, Fluid Mechanics & Thermodynamics. All in good condition. Selling as a bundle.",
    price: 12000,
    condition: "Good",
    category: "Books",
    seller: "Temi Adeyemi",
    sellerUsername: "temi_ade",
    university: "University of Lagos",
    universityAcronym: "UNILAG",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    rating: 4.5,
    timestamp: "5h ago",
  },
  {
    id: "listing-3",
    title: "Samsung Galaxy A54 — 128GB",
    description:
      "6 months old, no issues. Comes with original charger and case. Screen protector always on.",
    price: 145000,
    condition: "Like New",
    category: "Gadgets & Electronics",
    seller: "Chidi Okafor",
    sellerUsername: "chidi_ok",
    university: "University of Nigeria, Nsukka",
    universityAcronym: "UNN",
    imageUrl:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400",
    rating: 4.7,
    timestamp: "1d ago",
  },
  {
    id: "listing-4",
    title: "Study Desk + Chair Set",
    description:
      "Wooden study desk (120cm x 60cm) + ergonomic chair. Perfect for off-campus hostel. Pickup only.",
    price: 35000,
    condition: "Good",
    category: "Furniture & Equipment",
    seller: "Omotola Bello",
    sellerUsername: "tola_bello",
    university: "Lagos State University",
    universityAcronym: "LASU",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    rating: 4.2,
    timestamp: "2d ago",
  },
  {
    id: "listing-5",
    title: "Hair Braiding & Styling Service",
    description:
      "Professional braiding, weaves, and natural hair styling. On-campus house calls available. DM to book.",
    price: 5000,
    condition: "New",
    category: "Beauty & Fashion",
    seller: "Favour Eze",
    sellerUsername: "favour_ez",
    university: "University of Benin",
    universityAcronym: "UNIBEN",
    imageUrl:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
    rating: 4.9,
    isService: true,
    timestamp: "3h ago",
  },
  {
    id: "listing-6",
    title: "Jollof Rice Business (Bulk Orders)",
    description:
      "Best jollof rice in campus! Minimum order 10 plates. Delivery available within campus. Order by 6pm for next day.",
    price: 1200,
    condition: "New",
    category: "Food & Drink",
    seller: "Bukola Fashola",
    sellerUsername: "bukky_f",
    university: "Ahmadu Bello University",
    universityAcronym: "ABU",
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    rating: 4.8,
    isService: true,
    timestamp: "1h ago",
  },
  {
    id: "listing-7",
    title: "MacBook Air M1 — 8GB/256GB",
    description:
      "2021 model. Battery health 91%. Comes with original charger. Minor scuff on lid, functionally perfect.",
    price: 410000,
    condition: "Good",
    category: "Gadgets & Electronics",
    seller: "Emeka Nwosu",
    sellerUsername: "emeka_nw",
    university: "University of Ibadan",
    universityAcronym: "UI",
    imageUrl:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",
    rating: 4.6,
    isBoosted: true,
    timestamp: "6h ago",
  },
  {
    id: "listing-8",
    title: "300L Law Textbooks — Full Set",
    description:
      "Constitutional Law, Criminal Law, Tort, Contract & Land Law. All recommended texts. Selling before service year.",
    price: 18500,
    condition: "Good",
    category: "Books",
    seller: "Adaeze Obi",
    sellerUsername: "ada_obi",
    university: "Nnamdi Azikiwe University",
    universityAcronym: "UNIZIK",
    imageUrl:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400",
    rating: 4.3,
    timestamp: "4d ago",
  },
  {
    id: "listing-9",
    title: "Mini Fridge — Haier 100L",
    description:
      "Works perfectly. Leaving campus so selling. Cold enough for drinks and food. Energy efficient.",
    price: 48000,
    condition: "Good",
    category: "Furniture & Equipment",
    seller: "Temi Adeyemi",
    sellerUsername: "temi_ade",
    university: "University of Lagos",
    universityAcronym: "UNILAG",
    imageUrl:
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400",
    rating: 4.4,
    timestamp: "3d ago",
  },
  {
    id: "listing-10",
    title: "Private Tutoring — Maths & Physics",
    description:
      "A-grade student offering private tutoring for 100L and 200L courses. ₦3,000/hr or ₦10,000/month. UNILAG only.",
    price: 3000,
    condition: "New",
    category: "Services",
    seller: "Emeka Nwosu",
    sellerUsername: "emeka_nw",
    university: "University of Ibadan",
    universityAcronym: "UI",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    rating: 5.0,
    isService: true,
    timestamp: "12h ago",
  },
  {
    id: "listing-11",
    title: "Infinity Band Wireless Earbuds",
    description:
      "JBL Tune 115TWS — 6 hours playtime, good bass. Lost the case but earbuds work perfectly.",
    price: 9500,
    condition: "Fair",
    category: "Gadgets & Electronics",
    seller: "Chidi Okafor",
    sellerUsername: "chidi_ok",
    university: "University of Nigeria, Nsukka",
    universityAcronym: "UNN",
    imageUrl:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400",
    rating: 3.9,
    timestamp: "1d ago",
  },
  {
    id: "listing-12",
    title: "Ankara Fashion Pieces (Custom Made)",
    description:
      "Custom-made Ankara dresses, tops, and trousers. Send your measurements and fabric choice. 5–7 day turnaround.",
    price: 8000,
    condition: "New",
    category: "Beauty & Fashion",
    seller: "Omotola Bello",
    sellerUsername: "tola_bello",
    university: "Lagos State University",
    universityAcronym: "LASU",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    rating: 4.7,
    isService: true,
    timestamp: "8h ago",
  },
];
