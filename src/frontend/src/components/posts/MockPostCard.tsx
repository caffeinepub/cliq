import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EyeOff,
  Flame,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Pause,
  Play,
  Share2,
  ShieldAlert,
  Trash2,
  UserMinus,
  UserPlus,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { MockPost } from "../../data/mockPosts";
import { addLikedPost, removeLikedPost } from "../../lib/interactionStore";
import { getUniversityAcronym } from "../../lib/universityAcronyms";
import { ShareModal } from "./ShareModal";

interface MockPostCardProps {
  post: MockPost;
  index: number;
}

const REPORT_REASONS = [
  "Spam",
  "Harassment",
  "Hate speech",
  "Illegal content",
  "Nudity",
  "Violence",
  "Impersonation",
  "Self-harm",
  "Other",
];

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

interface VideoPlayerProps {
  src: string;
}

function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const handleVideoClick = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handlePlay = () => setIsPaused(false);
  const handlePause = () => setIsPaused(true);

  return (
    <div className="relative w-full overflow-hidden bg-black">
      {/* VIDEO pill badge */}
      <span className="absolute top-2 left-2 z-20 bg-[#E8432D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase pointer-events-none">
        VIDEO
      </span>

      {/* Mute/unmute button */}
      <button
        type="button"
        onClick={toggleMute}
        className="absolute top-2 right-2 z-20 bg-black/50 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-black/70 transition-colors"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>

      {/* Play/Pause overlay */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-150 ${isPaused ? "opacity-100" : "opacity-0"}`}
      >
        <div className="bg-black/50 backdrop-blur-sm rounded-full p-3">
          {isPaused ? (
            <Play className="h-8 w-8 text-white fill-white" />
          ) : (
            <Pause className="h-8 w-8 text-white fill-white" />
          )}
        </div>
      </div>

      {/* biome-ignore lint/a11y/useMediaCaption: video player with custom controls */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: video tap-to-play is supplemental; keyboard handled by parent */}
      <video
        ref={videoRef}
        src={src}
        playsInline
        onClick={handleVideoClick}
        onPlay={handlePlay}
        onPause={handlePause}
        className="w-full max-h-96 object-cover cursor-pointer"
        preload="metadata"
      />
    </div>
  );
}

export function MockPostCard({ post, index }: MockPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [hasRecliqed, setHasRecliqed] = useState(false);
  const [recliqCount, setRecliqCount] = useState(post.shares);
  const [isRecliqing, setIsRecliqing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0]);

  const isAdmin = localStorage.getItem("cliq_is_admin") === "true";

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
    const nowLiked = !isLiked;
    setIsLiked(nowLiked);
    setLikeCount((prev) => (nowLiked ? prev + 1 : prev - 1));
    if (nowLiked) {
      addLikedPost(post.id);
    } else {
      removeLikedPost(post.id);
    }
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

  const handleReport = () => {
    toast.success("Report submitted. We'll review this post.");
    setReportOpen(false);
  };

  const uniAcronym = getUniversityAcronym(post.university);
  const totalNotes = likeCount + post.comments + recliqCount;

  if (isDeleted) return null;

  if (isHidden) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] mb-4 rounded-2xl border border-[#E8E8E8] dark:border-zinc-800 p-4 text-center text-sm text-muted-foreground italic">
        Post hidden
        <button
          type="button"
          onClick={() => setIsHidden(false)}
          className="ml-2 text-[#E8432D] underline text-xs"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Tumblr-style postcard */}
      <article
        className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-[#E8E8E8] dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.07)] overflow-hidden mb-4 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.11)] transition-shadow"
        data-ocid={`post.item.${index}`}
      >
        {/* ── Card Header ── */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          {/* Avatar */}
          <Avatar className="h-9 w-9 flex-shrink-0 border border-[#F0F0F0] dark:border-zinc-700">
            {post.isAnonymous ? (
              <AvatarFallback className="bg-[#F0F0F0] dark:bg-zinc-800 text-base">
                🥷
              </AvatarFallback>
            ) : (
              <AvatarFallback
                className="font-semibold text-sm text-white"
                style={{ backgroundColor: stringToColor(post.username) }}
              >
                {initials}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Name + username + timestamp */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-foreground leading-tight">
                {post.isAnonymous ? "Anonymous" : post.displayName}
              </span>
              {!post.isAnonymous && (
                <span className="text-xs text-muted-foreground">
                  @{post.username}
                </span>
              )}
              {post.isAnonymous && (
                <span className="text-xs text-muted-foreground">🥷 anon</span>
              )}
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {post.timestamp}
              </span>
            </div>
          </div>

          {/* Right side: boost tag + community pill + three-dot */}
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            {post.isBoosted && post.boostLabel && (
              <span className="text-[10px] text-[#E8432D] font-semibold uppercase tracking-wide">
                🚀 {post.boostLabel}
              </span>
            )}
            {post.community && (
              <span className="bg-[#F0F0F0] dark:bg-zinc-800 text-muted-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
                {post.community}
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p-1 rounded-full hover:bg-[#F0F0F0] dark:hover:bg-zinc-800 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  data-ocid="post.dropdown_menu"
                  aria-label="Post options"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Following @${post.username}`);
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Follow @{post.username}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Muted @${post.username}`);
                  }}
                >
                  <VolumeX className="mr-2 h-4 w-4" />
                  Mute @{post.username}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Blocked @${post.username}`);
                  }}
                >
                  <UserMinus className="mr-2 h-4 w-4" />
                  Block @{post.username}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportOpen(true);
                  }}
                >
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  Report post
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsHidden(true);
                        toast.info("Post hidden");
                      }}
                    >
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide post
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleted(true);
                        toast.success("Post deleted");
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete post
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── Media (edge-to-edge, no padding) — media-only posts ── */}
        {post.mediaUrl && !post.content && (
          <div className="w-full overflow-hidden">
            {post.mediaType === "image" ? (
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="w-full max-h-96 object-cover"
              />
            ) : post.mediaType === "video" ? (
              <VideoPlayer src={post.mediaUrl} />
            ) : null}
          </div>
        )}

        {/* ── Post body ── */}
        {post.content && (
          <div className="px-4 py-3">
            <p className="text-[15px] font-normal leading-relaxed text-foreground whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {/* ── Media below text (if both exist) ── */}
        {post.mediaUrl && post.content && (
          <div className="w-full overflow-hidden">
            {post.mediaType === "image" ? (
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="w-full max-h-96 object-cover"
              />
            ) : post.mediaType === "video" ? (
              <VideoPlayer src={post.mediaUrl} />
            ) : null}
          </div>
        )}

        {/* ── Source/attribution line ── */}
        <div className="px-4 pb-2 pt-1">
          <span className="text-[11px] text-muted-foreground">
            🏛️ {uniAcronym} · campus
          </span>
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
          {/* Left cluster: Like · Comment · Recliq */}
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              data-ocid="post.like.button"
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
                {likeCount}
              </span>
            </button>

            <button
              type="button"
              data-ocid="post.comment.button"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-zinc-800 transition-colors"
            >
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold text-muted-foreground">
                {post.comments}
              </span>
            </button>

            <button
              type="button"
              data-ocid="post.recliq.button"
              onClick={handleRecliq}
              disabled={isRecliqing}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors ${
                hasRecliqed
                  ? "hover:bg-orange-50 dark:hover:bg-orange-950/20"
                  : "hover:bg-[#F8F8F8] dark:hover:bg-zinc-800"
              }`}
            >
              {isRecliqing ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <ReblogIcon
                  className={`h-5 w-5 ${
                    hasRecliqed ? "text-[#E8432D]" : "text-muted-foreground"
                  }`}
                />
              )}
              <span
                className={`text-sm font-semibold ${
                  hasRecliqed ? "text-[#E8432D]" : "text-muted-foreground"
                }`}
              >
                {recliqCount}
              </span>
            </button>
          </div>

          {/* Share pushed to far right */}
          <button
            type="button"
            data-ocid="post.share.button"
            onClick={(e) => {
              e.stopPropagation();
              setShareModalOpen(true);
            }}
            className="ml-auto flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-[#F8F8F8] dark:hover:bg-zinc-800 transition-colors"
          >
            <Share2 className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </article>

      <ShareModal
        postId={post.id}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />

      {/* Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent data-ocid="post.report.dialog">
          <DialogHeader>
            <DialogTitle>Report Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Why are you reporting this post?
            </p>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-[#EEEEEE] rounded-[40px] px-3 py-2 text-sm bg-white dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#E8432D]/30"
              data-ocid="post.report.select"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setReportOpen(false)}
              data-ocid="post.report.cancel_button"
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-[#E8432D] hover:bg-[#d43827]"
              onClick={handleReport}
              data-ocid="post.report.submit_button"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function stringToColor(str: string): string {
  const palette = [
    "#E8432D",
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
