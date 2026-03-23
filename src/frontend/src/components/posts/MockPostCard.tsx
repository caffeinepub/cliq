import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Loader2, MessageCircle, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MockPost } from "../../data/mockPosts";
import { ShareModal } from "./ShareModal";

interface MockPostCardProps {
  post: MockPost;
  index: number;
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
      toast.success("Recliqed! ∞");
    }, 600);
  };

  return (
    <>
      <Card
        className="hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all cursor-pointer border rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        data-ocid={`post.item.${index}`}
      >
        <CardContent className="p-5">
          {/* Boost badge */}
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

          {/* Community + University Tags */}
          <div className="flex items-center justify-between mb-2">
            <div>
              {post.community && (
                <span className="bg-[#F0F0F0] text-[#212529] text-[11px] font-medium px-2 py-0.5 rounded-full">
                  {post.community}
                </span>
              )}
            </div>
            <span className="bg-[#FF6B35] text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
              🏛️ {post.university.split(" ").slice(0, 2).join(" ")}
            </span>
          </div>

          <div className="flex gap-4">
            {/* Avatar */}
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
              {/* Author row */}
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

              {/* Content */}
              <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap text-foreground">
                {post.content}
              </p>

              {/* Media */}
              {post.mediaUrl && (
                <div className="rounded-none overflow-hidden border border-border mt-2">
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

              {/* Tumblr-style engagement bar */}
              <div className="flex justify-between items-end pt-2 border-t border-[#F0F0F0]">
                {/* Like */}
                <button
                  type="button"
                  data-ocid="post.like.button"
                  onClick={handleLike}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-1 rounded-xl hover:bg-accent/10 transition-colors"
                >
                  <Flame
                    className={`h-5 w-5 ${
                      isLiked
                        ? "text-[#FF6B35] fill-[#FF6B35]"
                        : "text-[#ADB5BD]"
                    }`}
                  />
                  <span
                    className={`text-base font-bold leading-tight ${
                      isLiked ? "text-[#FF6B35]" : "text-[#212529]"
                    }`}
                  >
                    {likeCount}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#ADB5BD] font-medium">
                    Like
                  </span>
                </button>

                {/* Comment */}
                <button
                  type="button"
                  data-ocid="post.comment.button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-1 rounded-xl hover:bg-accent/10 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#ADB5BD]" />
                  <span className="text-base font-bold leading-tight text-[#212529]">
                    {post.comments}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#ADB5BD] font-medium">
                    Comment
                  </span>
                </button>

                {/* Recliq (∞) */}
                <button
                  type="button"
                  data-ocid="post.recliq.button"
                  onClick={handleRecliq}
                  disabled={isRecliqing}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-1 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  {isRecliqing ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#ADB5BD]" />
                  ) : (
                    <span
                      className={`text-xl font-black leading-none ${
                        hasRecliqed ? "text-[#FF6B35]" : "text-[#ADB5BD]"
                      }`}
                    >
                      ∞
                    </span>
                  )}
                  <span
                    className={`text-base font-bold leading-tight ${
                      hasRecliqed ? "text-[#FF6B35]" : "text-[#212529]"
                    }`}
                  >
                    {recliqCount}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#ADB5BD] font-medium">
                    Recliq
                  </span>
                </button>

                {/* Share */}
                <button
                  type="button"
                  data-ocid="post.share.button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalOpen(true);
                  }}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-1 rounded-xl hover:bg-[#2C8A7A]/10 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-[#ADB5BD]" />
                  <span className="text-base font-bold leading-tight text-[#212529]">
                    —
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#ADB5BD] font-medium">
                    Share
                  </span>
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
