import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Loader2, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MockPost } from "../../data/mockPosts";
import { getUniversityAcronym } from "../../lib/universityAcronyms";
import { ShareModal } from "./ShareModal";

interface MockPostCardProps {
  post: MockPost;
  index: number;
}

function ReblogIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role="img"
      aria-label="Recliq"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Recliq</title>
      <path d="M7 4v4H3l5 6 5-6H9V4H7zm10 16v-4h4l-5-6-5 6h4v4h2z" />
    </svg>
  );
}

export function MockPostCard({ post, index }: MockPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [hasRecliqed, setHasRecliqed] = useState(false);
  const [recliqCount, setRecliqCount] = useState(post.shares);
  const [isRecliqing, setIsRecliqing] = useState(false);

  const initials = post.isAnonymous
    ? "🥷"
    : post.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleRecliq = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasRecliqed) {
      toast.info("Already Recliqed this post");
      return;
    }
    if (isRecliqing) return;
    setIsRecliqing(true);
    setTimeout(() => {
      setHasRecliqed(true);
      setRecliqCount((prev) => prev + 1);
      setIsRecliqing(false);
      toast.success("Recliqed!");
    }, 600);
  };

  const uniAcronym = getUniversityAcronym(post.university);

  return (
    <>
      <Card
        className="hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all cursor-pointer border rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] mx-3 mb-3"
        data-ocid={`post.item.${index}`}
      >
        <CardContent className="p-5">
          {post.isBoosted && post.boostLabel && (
            <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-border">
              <span className="text-sm">🚀</span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                {post.boostLabel}
              </span>
              {post.boostReason && (
                <span className="text-xs text-muted-foreground ml-1">
                  · {post.boostReason}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <div>
              {post.community && (
                <span className="bg-[#F0F0F0] text-[#212529] text-[11px] font-medium px-2 py-0.5 rounded-full">
                  {post.community}
                </span>
              )}
            </div>
            <span className="bg-[#FF6B35] text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
              🏛️ {uniAcronym}
            </span>
          </div>

          <div className="flex gap-4">
            <Avatar className="h-11 w-11 border border-border flex-shrink-0">
              {post.isAnonymous ? (
                <AvatarFallback className="bg-muted text-lg">🥷</AvatarFallback>
              ) : (
                <AvatarFallback
                  className="font-semibold text-sm"
                  style={{ backgroundColor: stringToColor(post.username) }}
                >
                  <span className="text-white">{initials}</span>
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm">
                  {post.isAnonymous ? "Anonymous" : post.displayName}
                </span>
                {!post.isAnonymous && (
                  <span className="text-sm text-[#6C757D] font-normal">
                    @{post.username}
                  </span>
                )}
                {post.isAnonymous && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    🥷 Anonymous
                  </span>
                )}
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {post.timestamp}
                </span>
              </div>

              <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap text-foreground">
                {post.content}
              </p>

              {post.mediaUrl && (
                <div className="rounded-xl overflow-hidden border border-border mt-2">
                  {post.mediaType === "image" ? (
                    <img
                      src={post.mediaUrl}
                      alt="Post media"
                      className="w-full max-h-96 object-cover"
                    />
                  ) : post.mediaType === "video" ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      playsInline
                      className="w-full max-h-96"
                    >
                      <track kind="captions" />
                    </video>
                  ) : null}
                </div>
              )}

              {/* Engagement bar — icons + counts only */}
              <div className="flex justify-between items-center pt-2 border-t border-[#F0F0F0]">
                <button
                  type="button"
                  data-ocid="post.like.button"
                  onClick={handleLike}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-accent/10 transition-colors"
                >
                  <Flame
                    className={`h-5 w-5 ${
                      isLiked
                        ? "text-[#FF6B35] fill-[#FF6B35]"
                        : "text-[#ADB5BD]"
                    }`}
                  />
                  <span
                    className={`text-sm font-bold ${isLiked ? "text-[#FF6B35]" : "text-[#6C757D]"}`}
                  >
                    {likeCount}
                  </span>
                </button>

                <button
                  type="button"
                  data-ocid="post.comment.button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-accent/10 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#ADB5BD]" />
                  <span className="text-sm font-bold text-[#6C757D]">
                    {post.comments}
                  </span>
                </button>

                <button
                  type="button"
                  data-ocid="post.recliq.button"
                  onClick={handleRecliq}
                  disabled={isRecliqing}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-primary/10 transition-colors"
                >
                  {isRecliqing ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#ADB5BD]" />
                  ) : (
                    <ReblogIcon
                      className={`h-5 w-5 ${hasRecliqed ? "text-[#FF6B35]" : "text-[#ADB5BD]"}`}
                    />
                  )}
                  <span
                    className={`text-sm font-bold ${hasRecliqed ? "text-[#FF6B35]" : "text-[#6C757D]"}`}
                  >
                    {recliqCount}
                  </span>
                </button>

                <button
                  type="button"
                  data-ocid="post.share.button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 py-2 px-3 rounded-full hover:bg-[#2C8A7A]/10 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-[#ADB5BD]" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ShareModal
        postId={post.id}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </>
  );
}

function stringToColor(str: string): string {
  const palette = [
    "#FF6B35",
    "#2D6A4F",
    "#1D4E89",
    "#7B2D8B",
    "#C62828",
    "#006064",
    "#4E342E",
    "#37474F",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}
