import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Heart, MessageCircle, Rocket, Send } from "lucide-react";
import { useState } from "react";
import type { MockPost } from "../../data/mockPosts";
import { ShareModal } from "./ShareModal";

interface MockPostCardProps {
  post: MockPost;
  index: number;
}

export function MockPostCard({ post, index }: MockPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [shareModalOpen, setShareModalOpen] = useState(false);

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

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked((prev) => !prev);
  };

  return (
    <>
      <Card
        className="hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all cursor-pointer border rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        data-ocid={`post.item.${index}`}
      >
        <CardContent className="p-5">
          {/* Boost badge */}
          {post.isBoosted && post.boostLabel && (
            <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-border">
              <Rocket className="h-[18px] w-[18px] text-primary" />
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
                <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  🏛️ {post.university.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>

              {/* Content */}
              <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap text-foreground">
                {post.content}
              </p>

              {/* Media */}
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

              {/* Action row */}
              <div className="flex items-center gap-1 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="post.like.button"
                  className={`h-9 gap-1.5 px-2.5 rounded-full text-xs ${
                    isLiked
                      ? "text-destructive hover:text-destructive"
                      : "text-[#ADB5BD] hover:text-destructive hover:bg-destructive/10"
                  }`}
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-[18px] w-[18px] ${isLiked ? "fill-current" : ""}`}
                  />
                  <span>{likeCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="post.comment.button"
                  className="h-9 gap-1.5 px-2.5 rounded-full text-xs text-[#ADB5BD] hover:text-foreground hover:bg-accent/10"
                >
                  <MessageCircle className="h-[18px] w-[18px]" />
                  <span>{post.comments}</span>
                </Button>

                {/* Recliq — infinity symbol */}
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="post.recliq.button"
                  className="h-9 gap-1.5 px-2.5 rounded-full text-xs text-[#ADB5BD] hover:text-primary hover:bg-primary/10"
                >
                  <span className="text-base leading-none font-black">∞</span>
                  {post.shares > 0 && <span>{post.shares}</span>}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="post.bookmark.button"
                  className={`h-9 px-2.5 rounded-full ${
                    isBookmarked
                      ? "text-primary hover:text-primary"
                      : "text-[#ADB5BD] hover:text-primary hover:bg-primary/10"
                  }`}
                  onClick={handleBookmark}
                >
                  <Bookmark
                    className={`h-[18px] w-[18px] ${isBookmarked ? "fill-current" : ""}`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="post.share.button"
                  className="h-9 px-2.5 rounded-full text-[#ADB5BD] hover:text-[#2C8A7A] hover:bg-[#2C8A7A]/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalOpen(true);
                  }}
                  title="Share post"
                >
                  <Send className="h-[18px] w-[18px]" />
                </Button>
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

/** Deterministic color from a string (for avatar backgrounds) */
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
