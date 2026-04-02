import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "@tanstack/react-router";
import {
  Flame,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Rocket,
  Share2,
} from "lucide-react";
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
import { ShareModal } from "./ShareModal";

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
      toast.success("Recliqed!");
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

  const totalNotes = Number(post.likes) + recliqCount;

  return (
    <>
      {/* Tumblr-style postcard */}
      <div
        className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E8E8E8] dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden mb-4 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] transition-shadow"
        onClick={handleCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {/* ── Card Header ── */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          <Avatar className="h-9 w-9 flex-shrink-0 border border-[#F0F0F0] dark:border-zinc-700">
            {isAnonymous ? (
              <AvatarFallback className="bg-muted text-base">🥷</AvatarFallback>
            ) : avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={authorProfile?.displayName} />
            ) : (
              <AvatarFallback className="font-semibold text-sm">
                {initials || "U"}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-foreground leading-tight">
                {isAnonymous
                  ? "Anonymous"
                  : authorProfile?.displayName || "Unknown"}
              </span>
              <span className="text-xs text-muted-foreground">
                @
                {isAnonymous
                  ? "anonymous"
                  : authorProfile?.username || "unknown"}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(post.timestamp)}
              </span>
            </div>
            {boosted && boostReason && (
              <BoostReasonLabel reason={boostReason} />
            )}
          </div>

          {/* Boost label + menu */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            {boosted && boostLabel && (
              <span className="text-[10px] text-[#E8432D] font-semibold uppercase tracking-wide">
                🚀 {boostLabel}
              </span>
            )}
            <button
              type="button"
              className="p-1 rounded-full hover:bg-[#F0F0F0] dark:hover:bg-zinc-800 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setBoostModalOpen(true);
              }}
              aria-label="Post options"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* ── Media edge-to-edge (no content) ── */}
        {mediaUrl && !displayContent && (
          <div className="w-full overflow-hidden">
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

        {/* ── Post body ── */}
        {displayContent && (
          <div className="px-4 py-3">
            <p className="text-[15px] font-normal leading-relaxed text-foreground whitespace-pre-wrap">
              {displayContent}
            </p>
          </div>
        )}

        {/* ── Media below text (if both) ── */}
        {mediaUrl && displayContent && (
          <div className="w-full overflow-hidden">
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

        {/* ── Attribution ── */}
        <div className="px-4 pb-2 pt-1">
          <span className="text-[11px] text-muted-foreground">🏛️ Campus</span>
        </div>

        {/* ── Notes count bar ── */}
        {totalNotes > 0 && (
          <div className="px-4 py-1.5 border-t border-[#F0F0F0] dark:border-zinc-800">
            <span className="text-xs font-semibold text-muted-foreground">
              {totalNotes.toLocaleString()}{" "}
              {totalNotes === 1 ? "note" : "notes"}
            </span>
          </div>
        )}

        {/* ── Engagement footer ── */}
        <div className="flex items-center px-3 py-2 border-t border-[#F0F0F0] dark:border-zinc-800">
          {/* Left cluster */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={handleLike}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                isLiked
                  ? "hover:bg-orange-50 dark:hover:bg-orange-950/20"
                  : "hover:bg-[#F8F8F8] dark:hover:bg-zinc-800"
              }`}
            >
              <Flame
                className={`h-5 w-5 ${
                  isLiked
                    ? "text-[#E8432D] fill-[#E8432D]"
                    : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-semibold ${
                  isLiked ? "text-[#E8432D]" : "text-muted-foreground"
                }`}
              >
                {Number(post.likes)}
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-zinc-800 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">
                0
              </span>
            </button>

            <button
              type="button"
              onClick={handleRecliq}
              disabled={isRecliqing}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                hasAlreadyRecliqed
                  ? "hover:bg-orange-50 dark:hover:bg-orange-950/20"
                  : "hover:bg-[#F8F8F8] dark:hover:bg-zinc-800"
              }`}
            >
              {isRecliqing ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <ReblogIcon
                  className={`h-5 w-5 ${
                    hasAlreadyRecliqed
                      ? "text-[#E8432D]"
                      : "text-muted-foreground"
                  }`}
                />
              )}
              <span
                className={`text-sm font-semibold ${
                  hasAlreadyRecliqed
                    ? "text-[#E8432D]"
                    : "text-muted-foreground"
                }`}
              >
                {recliqCount}
              </span>
            </button>
          </div>

          {/* Boost + Share pushed right */}
          <div className="ml-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBoostModalOpen(true);
              }}
              title="Boost post"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-zinc-800 transition-colors"
            >
              <Rocket className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShareModalOpen(true);
              }}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-zinc-800 transition-colors"
            >
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

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
