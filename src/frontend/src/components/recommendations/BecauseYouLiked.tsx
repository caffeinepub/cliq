import { mockPosts } from "../../data/mockPosts";
import { getContentRecommendations } from "../../lib/recommendationEngine";

interface BecauseYouLikedProps {
  likedPostIds: string[];
}

export function BecauseYouLiked({ likedPostIds }: BecauseYouLikedProps) {
  const result = getContentRecommendations(mockPosts, likedPostIds);
  if (!result) return null;

  const { triggerPost, recommendations } = result;
  const preview =
    triggerPost.content.slice(0, 40) +
    (triggerPost.content.length > 40 ? "..." : "");

  return (
    <div className="mx-0 mb-3 border border-[#FFE0D6] bg-[#FFF5F2] rounded-xl overflow-hidden">
      <p className="text-[11px] text-[#FF6B35] font-semibold px-3 pt-2.5 pb-1">
        Because you liked:{" "}
        <span className="font-normal text-[#6C757D]">"{preview}"</span>
      </p>
      <div
        className="flex gap-2 overflow-x-auto px-3 pb-3 pt-1"
        style={{ scrollbarWidth: "none" }}
      >
        {recommendations.map((post) => (
          <div
            key={post.id}
            className="flex-shrink-0 w-[160px] border border-[#E5E5E5] rounded-xl bg-white p-2.5 shadow-sm"
          >
            <p className="text-[11px] font-semibold text-[#212529] truncate">
              {post.displayName}
            </p>
            <p className="text-[10px] text-[#6C757D] mt-0.5 line-clamp-2 leading-relaxed">
              {post.content.slice(0, 60)}
              {post.content.length > 60 ? "..." : ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
