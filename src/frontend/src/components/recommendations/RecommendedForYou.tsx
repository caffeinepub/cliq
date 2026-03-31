import { ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { MOCK_LISTINGS } from "../../data/mockMarketplace";
import { scoreMarketplaceItem } from "../../lib/recommendationEngine";

const DEMO_SEARCHES = ["laptop", "books", "gadgets"];
const DEMO_VIEWED = ["Gadgets & Electronics", "Books"];

export function RecommendedForYou() {
  const recommendations = useMemo(() => {
    return MOCK_LISTINGS.map((item) => ({
      item,
      score: scoreMarketplaceItem(item, DEMO_SEARCHES, DEMO_VIEWED),
    }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ item }) => item);
  }, []);

  return (
    <div className="px-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-[#212529]">
          ✨ Recommended for You
        </span>
        <span className="text-[10px] text-[#E8432D] font-medium border border-[#FFE0D6] bg-[#FFF5F2] px-2 py-0.5 rounded-full">
          Personalised
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {recommendations.map((item, i) => (
          <div
            key={item.id}
            className="rounded-2xl overflow-hidden bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all cursor-pointer"
            data-ocid={`marketplace.recommended.item.${i + 1}`}
          >
            <div className="aspect-square w-full bg-[#F8F9FA] overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
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
                {item.title}
              </p>
              <p className="text-xs text-[#6C757D]">⭐ {item.rating}</p>
              <p className="text-sm font-semibold text-[#E8432D]">
                ₦{item.price.toLocaleString()}
              </p>
              <p className="text-[10px] text-[#ADB5BD]">{item.seller}</p>
              <p className="text-[10px] text-[#6C757D]">
                🏛️ {item.universityAcronym}
              </p>
              <button
                type="button"
                className="w-full rounded-[40px] border border-[#E8432D] text-[#E8432D] text-xs py-1.5 hover:bg-[#E8432D] hover:text-white transition-colors mt-1"
                onClick={() => toast.info("Open messages to contact seller")}
                data-ocid={`marketplace.recommended.message.${i + 1}`}
              >
                💬 Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
