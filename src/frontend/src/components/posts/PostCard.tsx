import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { Bookmark, Heart, MessageCircle, Rocket, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Post } from "../../backend";
import {
  useGetUserProfile,
  useLikePost,
  useUnlikePost,
} from "../../hooks/useQueries";
import {
  getBoostLabel,
  getBoostReason,
  incrementBoostView,
  isPostBoosted,
} from "../../lib/boostUtils";
import { BoostPostModal } from "../boosts/BoostPostModal";
import { BoostReasonLabel } from "../boosts/BoostReasonLabel";
import { BoostedPostBadge } from "../boosts/BoostedPostBadge";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { data: authorProfile } = useGetUserProfile(post.author.toString());
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const [isLiked, setIsLiked] = useState(false);
  const [boostModalOpen, setBoostModalOpen] = useState(false);

  const postIdStr = post.id.toString();
  const boosted = isPostBoosted(postIdStr);
  const boostLabel = boosted ? (getBoostLabel(postIdStr) ?? "Sponsored") : null;
  const boostReason = boosted ? getBoostReason(postIdStr) : null;

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

  const handleCardClick = () => {
    navigate({ to: "/post/$postId", params: { postId: postIdStr } });
  };

  const avatarUrl = authorProfile?.avatar?.getDirectURL();
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
              {avatarUrl ? (
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
                    {authorProfile?.displayName || "Unknown"}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    @{authorProfile?.username || "unknown"}
                  </span>
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
                {post.content}
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
                  className="h-10 gap-2 px-3 rounded-full font-bold text-muted-foreground hover:text-secondary hover:bg-secondary/10"
                >
                  <Share2 className="h-5 w-5" />
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
    </>
  );
}
