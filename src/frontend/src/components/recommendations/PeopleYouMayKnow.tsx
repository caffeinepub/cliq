import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useMemo, useState } from "react";
import { MOCK_USERS } from "../../data/mockUsers";
import {
  addFollowedUser,
  removeFollowedUser,
} from "../../lib/interactionStore";
import { scoreFriendRecommendation } from "../../lib/recommendationEngine";

interface PeopleYouMayKnowProps {
  currentUserUniversity: string;
}

export function PeopleYouMayKnow({
  currentUserUniversity,
}: PeopleYouMayKnowProps) {
  // Track followed IDs in local state so useMemo can react to changes
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  const recommendations = useMemo(() => {
    const scored = MOCK_USERS.map((u) => ({
      user: u,
      score: scoreFriendRecommendation(
        u,
        currentUserUniversity,
        [],
        followedIds,
      ),
    }));
    scored.sort((a, b) => b.score - a.score);
    const sameUni = scored
      .filter((s) => s.user.university === currentUserUniversity)
      .slice(0, 5);
    if (sameUni.length >= 3) return sameUni.map((s) => s.user);
    return scored.slice(0, 5).map((s) => s.user);
  }, [currentUserUniversity, followedIds]);

  const handleFollow = (userId: string) => {
    setFollowedIds((prev) => {
      if (prev.includes(userId)) {
        removeFollowedUser(userId);
        return prev.filter((id) => id !== userId);
      }
      addFollowedUser(userId);
      return [...prev, userId];
    });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 px-4 py-2">
        <span className="text-sm font-semibold text-[#212529]">
          People You May Know
        </span>
        <Info size={12} className="text-[#ADB5BD]" />
      </div>
      <div
        className="flex gap-3 overflow-x-auto px-4 pb-3"
        style={{ scrollbarWidth: "none" }}
      >
        {recommendations.map((user) => {
          const initials = user.displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          const isFollowed = followedIds.includes(user.id);
          return (
            <div
              key={user.id}
              className="flex-shrink-0 w-[110px] border border-[#E5E5E5] rounded-2xl p-3 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col items-center gap-2"
              data-ocid="explore.people.card"
            >
              <div className="h-10 w-10 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="text-center min-w-0 w-full">
                <p className="text-[13px] font-bold text-[#212529] truncate">
                  {user.displayName}
                </p>
                <p className="text-[11px] text-[#6C757D] truncate">
                  @{user.username}
                </p>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-[#FF6B35] text-white text-[10px] font-medium">
                  {user.universityAcronym}
                </span>
              </div>
              <Button
                size="sm"
                variant={isFollowed ? "default" : "outline"}
                className={`w-full rounded-[40px] text-[10px] h-7 px-2 ${
                  isFollowed
                    ? "bg-[#FF6B35] border-[#FF6B35] text-white"
                    : "border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                }`}
                onClick={() => handleFollow(user.id)}
                data-ocid="explore.people.button"
              >
                {isFollowed ? "Following" : "Follow"}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
