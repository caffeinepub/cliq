import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Search, ShoppingBag } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { FloatingActionButton } from "../components/shared/FloatingActionButton";
import {
  useCreateListing,
  useGetCallerUserProfile,
  useSearchListings,
} from "../hooks/useQueries";

const trendingItems = [
  {
    id: "t1",
    title: "Engineering Mathematics Textbook",
    price: 3500,
    rating: 4.8,
    seller: "@emeka_sells",
    uni: "UNILAG",
    image: null,
  },
  {
    id: "t2",
    title: "HP Laptop - Core i5 (Great Condition)",
    price: 85000,
    rating: 4.9,
    seller: "@techguy_ife",
    uni: "OAU",
    image: null,
  },
  {
    id: "t3",
    title: "Room Available - Off Campus (2 bed)",
    price: 15000,
    rating: 4.7,
    seller: "@landlord_naija",
    uni: "FUTA",
    image: null,
  },
  {
    id: "t4",
    title: "Braiding & Styling Services",
    price: 2500,
    rating: 5.0,
    seller: "@hairqueen_abk",
    uni: "UNIBEN",
    image: null,
  },
  {
    id: "t5",
    title: "Calculus & Stats Tutoring (Per Session)",
    price: 1500,
    rating: 4.6,
    seller: "@prof_tunde",
    uni: "ABU",
    image: null,
  },
  {
    id: "t6",
    title: "Barely Used Mini Fridge (100L)",
    price: 25000,
    rating: 4.5,
    seller: "@dorm_deals",
    uni: "UNIPORT",
    image: null,
  },
];

const services = [
  { emoji: "💇", label: "Hair" },
  { emoji: "💈", label: "Barber" },
  { emoji: "🧺", label: "Laundry" },
  { emoji: "📚", label: "Tutors" },
  { emoji: "🔧", label: "Repairs" },
  { emoji: "💅", label: "Nail" },
];

const categories = [
  { emoji: "➕", label: "Create Ads", isCreate: true },
  { emoji: "🔥", label: "Trending", isCreate: false },
  { emoji: "🪑", label: "Furniture", isCreate: false },
  { emoji: "🍔", label: "Food & Drink", isCreate: false },
  { emoji: "💄", label: "Beauty & Fashion", isCreate: false },
  { emoji: "📚", label: "Books", isCreate: false },
  { emoji: "💻", label: "Gadgets", isCreate: false },
  { emoji: "🎟️", label: "Events", isCreate: false },
];

export function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [myAdsOpen, setMyAdsOpen] = useState(false);
  const { data: listings, isLoading } = useSearchListings(searchTerm);
  const createListing = useCreateListing();
  const { data: profile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreateListing = async () => {
    if (!title.trim() || !description.trim() || !price) {
      toast.error("Please fill in all required fields");
      return;
    }
    const priceNum = Number.parseFloat(price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    try {
      let media: ExternalBlob | null = null;
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        media = ExternalBlob.fromBytes(uint8Array);
      }
      await createListing.mutateAsync({
        title,
        description,
        price: priceNum,
        media,
      });
      toast.success("Listing created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setImageFile(null);
      setImagePreview(null);
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create listing");
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <h1 className="text-xl font-semibold tracking-tight">
          CLIQ MARKETPLACE
        </h1>
        <button
          type="button"
          onClick={() => setMyAdsOpen(true)}
          className="h-10 w-10 rounded-full flex items-center justify-center bg-[#F8F9FA] text-[#6C757D] hover:bg-[#E5E5E5] transition-colors text-lg"
          data-ocid="marketplace.my_ads.button"
          aria-label="My Ads"
        >
          👤
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 mb-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ADB5BD]" />
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-[40px] border border-[#E5E5E5] pl-10 pr-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
            data-ocid="marketplace.search_input"
          />
        </div>
      </div>

      {/* Featured Services Box */}
      <div className="mx-4 mb-6 border border-[#FF6B35] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        {/* Header strip */}
        <div className="bg-gradient-to-r from-[#FF6B35] to-[#ff8c5a] px-4 py-3 flex items-center justify-between">
          <span className="text-white font-semibold text-sm tracking-widest uppercase">
            Services
          </span>
          <span className="text-white/80 text-xs">Campus Pros</span>
        </div>
        {/* Services grid */}
        <div className="grid grid-cols-3 gap-2 p-4">
          {services.map((s) => (
            <button
              key={s.label}
              type="button"
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-[#FFF5F2] border border-[#FFE0D6] cursor-pointer hover:bg-[#FFE0D6] transition-colors min-h-[64px] text-center"
              onClick={() => toast.info(`Browse ${s.label} services`)}
            >
              <span className="text-xl">{s.emoji}</span>
              <span className="text-xs font-medium text-[#212529]">
                {s.label}
              </span>
            </button>
          ))}
        </div>
        {/* Browse all link */}
        <div className="px-4 pb-4">
          <button
            type="button"
            className="text-xs font-medium text-[#FF6B35] hover:underline"
            onClick={() => toast.info("Browse all services coming soon")}
          >
            Browse All Services →
          </button>
        </div>
      </div>

      {/* Quick Categories Grid */}
      <div className="px-4 mb-6">
        <p className="text-sm font-semibold text-[#212529] mb-3 uppercase tracking-wide">
          Categories
        </p>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => {
                if (cat.isCreate) {
                  setIsCreateOpen(true);
                } else {
                  toast.info(`${cat.label} coming soon`);
                }
              }}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all min-h-[72px] shadow-[0_1px_4px_rgba(0,0,0,0.04)] ${
                cat.isCreate
                  ? "bg-[#FF6B35] border-[#FF6B35] hover:bg-[#e55a26]"
                  : "border-[#E5E5E5] bg-white hover:border-[#FF6B35] hover:bg-[#FFF5F2]"
              }`}
              data-ocid={
                cat.isCreate ? "marketplace.open_modal_button" : undefined
              }
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span
                className={`text-[10px] font-medium text-center leading-tight ${
                  cat.isCreate ? "text-white" : "text-[#212529]"
                }`}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Listings Section */}
      <div className="px-4 mb-4">
        <p className="text-sm font-semibold text-[#212529] mb-3">🔥 TRENDING</p>

        {isLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="marketplace.loading_state"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Hardcoded trending items */}
            {trendingItems.map((item, i) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E5E5E5] overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all cursor-pointer"
                data-ocid={`marketplace.item.${i + 1}`}
              >
                {/* Placeholder image */}
                <div className="aspect-square w-full bg-[#F8F9FA] flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-[#E5E5E5]" />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs font-medium text-[#212529] line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-xs text-[#6C757D]">⭐ {item.rating}</p>
                  <p className="text-sm font-semibold text-[#FF6B35]">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#ADB5BD]">{item.seller}</p>
                  <p className="text-[10px] text-[#6C757D]">🏛️ {item.uni}</p>
                  <button
                    type="button"
                    className="w-full rounded-[40px] border border-[#FF6B35] text-[#FF6B35] text-xs py-1.5 hover:bg-[#FF6B35] hover:text-white transition-colors mt-1"
                    onClick={() =>
                      toast.info("Open messages to contact seller")
                    }
                  >
                    💬 Message
                  </button>
                </div>
              </div>
            ))}

            {/* Real listings from backend */}
            {listings?.map((listing, i) => {
              const imageUrl = listing.media?.getDirectURL();
              return (
                <button
                  type="button"
                  key={listing.id.toString()}
                  className="rounded-2xl border border-[#E5E5E5] overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all cursor-pointer text-left w-full"
                  onClick={() =>
                    navigate({
                      to: "/marketplace/$listingId",
                      params: { listingId: listing.id.toString() },
                    })
                  }
                  data-ocid={`marketplace.item.${trendingItems.length + i + 1}`}
                >
                  <div className="aspect-square w-full bg-[#F8F9FA] overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-[#E5E5E5]" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-xs font-medium text-[#212529] line-clamp-2">
                      {listing.title}
                    </p>
                    <p className="text-sm font-semibold text-[#FF6B35]">
                      ₦{Number(listing.price).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#6C757D]">
                      🏛️ {listing.university}
                    </p>
                    <button
                      type="button"
                      className="w-full rounded-[40px] border border-[#FF6B35] text-[#FF6B35] text-xs py-1.5 hover:bg-[#FF6B35] hover:text-white transition-colors mt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info("Open messages to contact seller");
                      }}
                    >
                      💬 Message
                    </button>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {!isLoading && listings?.length === 0 && trendingItems.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            data-ocid="marketplace.empty_state"
          >
            <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-[#E5E5E5]" />
            <h2 className="mb-2 text-xl font-semibold">No listings found</h2>
            <p className="text-sm text-muted-foreground">
              {searchTerm
                ? "Try a different search term"
                : "Be the first to list an item!"}
            </p>
          </div>
        )}

        {/* Load More */}
        <button
          type="button"
          className="rounded-[40px] border border-[#E5E5E5] text-[#6C757D] text-sm px-8 py-2.5 mx-auto block hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors mt-4"
          onClick={() => toast.info("Load more coming soon")}
        >
          Load More
        </button>
      </div>

      {/* Create Listing Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md" data-ocid="marketplace.dialog">
          <DialogHeader>
            <DialogTitle>Create Listing</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Calculus Textbook"
                data-ocid="marketplace.title.input"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item..."
                className="min-h-[100px]"
                data-ocid="marketplace.description.textarea"
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                data-ocid="marketplace.price.input"
              />
            </div>
            <div>
              <Label>Image (optional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {imagePreview ? (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="mt-2 text-xs text-destructive hover:underline"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full mt-2 rounded-[40px] border border-border text-sm py-2.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="marketplace.upload_button"
                >
                  Select Image
                </button>
              )}
            </div>
            <button
              type="button"
              className="w-full rounded-[40px] bg-primary text-primary-foreground text-sm font-semibold py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
              onClick={handleCreateListing}
              disabled={createListing.isPending}
              data-ocid="marketplace.submit_button"
            >
              {createListing.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Listing"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* My Ads Sheet */}
      <Sheet open={myAdsOpen} onOpenChange={setMyAdsOpen}>
        <SheetContent data-ocid="marketplace.my_ads.sheet">
          <SheetHeader>
            <SheetTitle>My Ads</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {profile ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Listings from{" "}
                  <span className="font-semibold text-foreground">
                    @{profile.username}
                  </span>
                </p>
                {listings?.filter(
                  (l) => l.seller?.toString() === profile.username,
                ).length === 0 ? (
                  <div
                    className="flex flex-col items-center py-12 text-center"
                    data-ocid="marketplace.my_ads.empty_state"
                  >
                    <ShoppingBag className="h-10 w-10 mb-3 text-muted-foreground opacity-40" />
                    <p className="text-sm text-muted-foreground">
                      You haven't posted any ads yet.
                    </p>
                    <button
                      type="button"
                      className="mt-4 rounded-[40px] bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5"
                      onClick={() => {
                        setMyAdsOpen(false);
                        setIsCreateOpen(true);
                      }}
                    >
                      Create Your First Ad
                    </button>
                  </div>
                ) : (
                  listings
                    ?.filter((l) => l.seller?.toString() === profile.username)
                    .map((listing, i) => (
                      <div
                        key={listing.id.toString()}
                        className="flex gap-3 border-b border-border pb-3"
                        data-ocid={`marketplace.my_ads.item.${i + 1}`}
                      >
                        <div className="h-14 w-14 rounded-lg bg-[#F8F9FA] flex-shrink-0 overflow-hidden">
                          {listing.media?.getDirectURL() ? (
                            <img
                              src={listing.media.getDirectURL()}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="h-6 w-6 m-4 text-[#E5E5E5]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {listing.title}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            ₦{Number(listing.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            ) : (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* FAB */}
      <FloatingActionButton onClick={() => setIsCreateOpen(true)} />
    </div>
  );
}
