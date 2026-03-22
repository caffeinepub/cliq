import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  Heart,
  Loader2,
  MessageCircle,
  Rocket,
  Send,
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
    if (boosted) {
      incrementBoostView(postIdStr);
    }
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
      toast.success("Recliqed! 🔁");
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
        className="hover:shadow-bold transition-all cursor-pointer border-2"
        onClick={handleCardClick}
      >
        <CardContent className="pt-6">
          {boosted && boostLabel && <BoostedPostBadge label={boostLabel} />}
          <div className="flex gap-4">
            <Avatar className="h-12 w-12 border-2 border-border">
              {isAnonymous ? (
                <AvatarFallback className="bg-muted text-lg">🥷</AvatarFallback>
              ) : avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={authorProfile?.displayName} />
              ) : (
                <AvatarFallback className="font-bold text-base">
                  {initials || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base">
                    {isAnonymous
                      ? "Anonymous"
                      : authorProfile?.displayName || "Unknown"}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    @
                    {isAnonymous
                      ? "anonymous"
                      : authorProfile?.username || "unknown"}
                  </span>
                  {isAnonymous && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                      🥷 Anonymous
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {formatTimestamp(post.timestamp)}
                  </span>
                </div>
                {boosted && boostReason && (
                  <BoostReasonLabel reason={boostReason} />
                )}
              </div>
              <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">
                {displayContent}
              </p>

              {mediaUrl && (
                <div className="rounded-2xl overflow-hidden border-2 border-border mt-3">
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

              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-10 gap-2 px-3 rounded-full font-bold ${
                    isLiked
                      ? "text-destructive hover:text-destructive"
                      : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  }`}
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="text-sm">{Number(post.likes)}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-2 px-3 rounded-full font-bold text-muted-foreground hover:text-accent hover:bg-accent/10"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">0</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isRecliqing}
                  data-ocid="post_card.recliq_button"
                  className={`h-10 gap-2 px-3 rounded-full font-bold transition-colors ${
                    hasAlreadyRecliqed
                      ? "text-primary hover:text-primary hover:bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                  onClick={handleRecliq}
                >
                  {isRecliqing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Share2
                      className={`h-5 w-5 ${hasAlreadyRecliqed ? "fill-current" : ""}`}
                    />
                  )}
                  {recliqCount > 0 && (
                    <span className="text-sm">{recliqCount}</span>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 rounded-full font-bold text-muted-foreground hover:text-primary hover:bg-primary/10"
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 px-3 rounded-full font-bold text-muted-foreground hover:text-[#2C8A7A] hover:bg-[#2C8A7A]/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalOpen(true);
                  }}
                  title="Share post"
                  data-ocid="post_card.share_button"
                >
                  <Send className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full font-bold text-muted-foreground hover:text-primary hover:bg-primary/10 ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    setBoostModalOpen(true);
                  }}
                  title="Boost post"
                  data-ocid="post_card.boost_button"
                >
                  <Rocket className="h-5 w-5" />
                </Button>
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
