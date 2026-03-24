import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Flame, Loader2, MessageCircle, Rocket, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Post } from "../../backend";
import {
  useGetUserProfile,
  useLikePost,
  useRecliqPost,
  useUnlikePost,
} from "../../hooks/useQueries";
import {
  getBoostLabel,
  getBoostReason,
  incrementBoostView,
  isPostBoosted,
} from "../../lib/boostUtils";
import {
  getRecliqCount,
  hasRecliqed,
  incrementRecliqCount,
  markRecliqed,
} from "../../lib/recliqUtils";
import { BoostPostModal } from "../boosts/BoostPostModal";
import { BoostReasonLabel } from "../boosts/BoostReasonLabel";
import { BoostedPostBadge } from "../boosts/BoostedPostBadge";
import { ShareModal } from "./ShareModal";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const isAnonymous = post.content.startsWith("[anon] ");
  const displayContent = isAnonymous ? post.content.slice(7) : post.content;

  const { data: authorProfile } = useGetUserProfile(post.author.toString());
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const recliqPost = useRecliqPost();
  const [isLiked, setIsLiked] = useState(false);
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isRecliqing, setIsRecliqing] = useState(false);

  const postIdStr = post.id.toString();
  const boosted = isPostBoosted(postIdStr);
  const boostLabel = boosted ? (getBoostLabel(postIdStr) ?? "Sponsored") : null;
  const boostReason = boosted ? getBoostReason(postIdStr) : null;

  const [hasAlreadyRecliqed, setHasAlreadyRecliqed] = useState(() =>
    hasRecliqed(postIdStr),
  );
  const [recliqCount, setRecliqCount] = useState(() =>
    getRecliqCount(postIdStr),
  );

  useEffect(() => {
    if (boosted) incrementBoostView(postIdStr);
  }, [boosted, postIdStr]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isLiked) {
        await unlikePost.mutateAsync(post.id);
        setIsLiked(false);
      } else {
        await likePost.mutateAsync(post.id);
        setIsLiked(true);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update like");
    }
  };

  const handleRecliq = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasAlreadyRecliqed) {
      toast.info("You've already Recliqed this post");
      return;
    }
    if (isRecliqing) return;
    setIsRecliqing(true);
    try {
      const authorUsername = isAnonymous
        ? "anonymous"
        : authorProfile?.username || "unknown";
      const newPostId = await recliqPost.mutateAsync({
        authorUsername,
        originalContent: displayContent,
      });
      markRecliqed(postIdStr, newPostId.toString());
      incrementRecliqCount(postIdStr);
      setHasAlreadyRecliqed(true);
      setRecliqCount((prev) => prev + 1);
      toast.success("Recliqed! ∞");
    } catch (error: any) {
      toast.error(error.message || "Failed to Recliq");
    } finally {
      setIsRecliqing(false);
    }
  };

  const handleCardClick = () => {
    navigate({ to: "/post/$postId", params: { postId: postIdStr } });
  };

  const avatarUrl = isAnonymous ? null : authorProfile?.avatar?.getDirectURL();
  const initials = authorProfile?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const mediaUrl =
    post.media?.__kind__ === "image"
      ? post.media.image.getDirectURL()
      : post.media?.__kind__ === "video"
        ? post.media.video.getDirectURL()
        : null;

  return (
    <>
      <Card
        className="hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all cursor-pointer border rounded-none shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        onClick={handleCardClick}
      >
        <CardContent className="p-5">
          {boosted && boostLabel && <BoostedPostBadge label={boostLabel} />}

          {/* University tag */}
          <div className="flex justify-end mb-2">
            <span className="bg-[#FF6B35] text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
              🏛️ Campus
            </span>
          </div>

          <div className="flex gap-4">
            <Avatar className="h-11 w-11 border border-border">
              {isAnonymous ? (
                <AvatarFallback className="bg-muted text-lg">🥷</AvatarFallback>
              ) : avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={authorProfile?.displayName} />
              ) : (
                <AvatarFallback className="font-semibold text-sm">
                  {initials || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm">
                    {isAnonymous
                      ? "Anonymous"
                      : authorProfile?.displayName || "Unknown"}
                  </span>
                  <span className="text-sm text-[#6C757D] font-normal">
                    @
                    {isAnonymous
                      ? "anonymous"
                      : authorProfile?.username || "unknown"}
                  </span>
                  {isAnonymous && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      🥷 Anonymous
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(post.timestamp)}
                  </span>
                </div>
                {boosted && boostReason && (
                  <BoostReasonLabel reason={boostReason} />
                )}
              </div>
              <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap">
                {displayContent}
              </p>

              {mediaUrl && (
                <div className="rounded-none overflow-hidden border border-border mt-2">
                  {post.media?.__kind__ === "image" ? (
                    <img
                      src={mediaUrl}
                      alt="Post media"
                      className="w-full max-h-96 object-cover"
                    />
                  ) : post.media?.__kind__ === "video" ? (
                    <video
                      src={mediaUrl}
                      controls
                      playsInline
                      className="w-full max-h-96"
                    >
                      <track kind="captions" />
                    </video>
                  ) : null}
                </div>
              )}

              {/* Tumblr-style engagement bar — all buttons left-aligned, evenly spaced */}
              <div className="flex items-end justify-start gap-2 pt-2 border-t border-[#F0F0F0]">
                {/* Like */}
                <button
                  type="button"
                  onClick={handleLike}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-1 rounded-xl hover:bg-accent/10 transition-colors"
                >
                  <Flame
                    className={`h-5 w-5 ${isLiked ? "text-[#FF6B35] fill-[#FF6B35]" : "text-[#ADB5BD]"}`}
                  />
                  <span
                    className={`text-base font-bold leading-tight ${isLiked ? "text-[#FF6B35]" : "text-[#212529]"}`}
                  >
                    {Number(post.likes)}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#ADB5BD] font-medium">
                    Like
                  </span>
                </button>

                {/* Comment */}
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-1 rounded-xl hover:bg-accent/10 transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-[#ADB5BD]" />
                  <span className="text-base font-bold leading-tight text-[#212529]">
                    0
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#ADB5BD] font-medium">
                    Comment
                  </span>
                </button>

                {/* Recliq */}
                <button
                  type="button"
                  onClick={handleRecliq}
                  disabled={isRecliqing}
                  className="flex flex-col items-center gap-0.5 min-w-[56px] py-2 px-1 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  {isRecliqing ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#ADB5BD]" />
                  ) : (
                    <span
                      className={`text-xl font-black leading-none ${hasAlreadyRecliqed ? "text-[#FF6B35]" : "text-[#ADB5BD]"}`}
                    >
                      ∞
                    </span>
                  )}
                  <span
                    className={`text-base font-bold leading-tight ${hasAlreadyRecliqed ? "text-[#FF6B35]" : "text-[#212529]"}`}
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

                {/* Boost (smaller, at end) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBoostModalOpen(true);
                  }}
                  title="Boost post"
                  className="flex flex-col items-center gap-0.5 min-w-[44px] py-2 px-1 rounded-xl hover:bg-primary/10 transition-colors"
                >
                  <Rocket className="h-4 w-4 text-[#ADB5BD]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#ADB5BD] font-medium">
                    Boost
                  </span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <BoostPostModal
        postId={postIdStr}
        open={boostModalOpen}
        onOpenChange={setBoostModalOpen}
      />
      <ShareModal
        postId={postIdStr}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </>
  );
}
