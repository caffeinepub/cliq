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
  MoreVertical,
  Share2,
  ShieldAlert,
  Trash2,
  UserMinus,
  UserPlus,
  VolumeX,
} from "lucide-react";
import { useState } from "react";
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

  if (isDeleted) return null;

  if (isHidden) {
    return (
      <div className="bg-[#F8F9FA] dark:bg-zinc-900 p-4 border-b border-[#F0F0F0] dark:border-zinc-800 text-center text-sm text-[#6C757D] italic">
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
      <div
        className="bg-white dark:bg-black p-4 w-full border-b border-[#F0F0F0] dark:border-zinc-800 hover:bg-[#FAFAFA] dark:hover:bg-zinc-950 transition-colors cursor-pointer"
        data-ocid={`post.item.${index}`}
      >
        {post.isBoosted && post.boostLabel && (
          <div className="flex items-center gap-1.5 mb-3 pb-2 border-b border-[#F0F0F0] dark:border-zinc-800">
            <span className="text-sm">🚀</span>
            <span className="text-xs font-semibold text-[#E8432D] uppercase tracking-wide">
              {post.boostLabel}
            </span>
            {post.boostReason && (
              <span className="text-xs text-[#6C757D] ml-1">
                · {post.boostReason}
              </span>
            )}
          </div>
        )}

        {/* Community tag top-right + three-dot menu */}
        <div className="flex items-center justify-between mb-2 min-h-[24px]">
          <div />
          <div className="flex items-center gap-2">
            {post.community && (
              <span className="bg-[#F0F0F0] dark:bg-zinc-800 text-[#212529] dark:text-zinc-300 text-[11px] font-medium px-2 py-0.5 rounded-full">
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
                  <MoreVertical className="h-4 w-4 text-[#ADB5BD]" />
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

        {/* Post body — avatar top-left */}
        <div className="flex gap-3 items-start">
          <Avatar className="h-10 w-10 border border-[#F0F0F0] flex-shrink-0 mt-0.5">
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

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-semibold text-sm text-[#212529] dark:text-zinc-100">
                {post.isAnonymous ? "Anonymous" : post.displayName}
              </span>
              {!post.isAnonymous && (
                <span className="text-sm text-[#6C757D] font-normal">
                  @{post.username}
                </span>
              )}
              {post.isAnonymous && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F0F0F0] dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-[#6C757D]">
                  🥷 Anonymous
                </span>
              )}
              <span className="text-[#ADB5BD] text-xs">·</span>
              <span className="text-[13px] text-[#ADB5BD]">
                {post.timestamp}
              </span>
            </div>

            <p className="text-[15px] font-normal leading-relaxed whitespace-pre-wrap text-[#212529] dark:text-zinc-200">
              {post.content}
            </p>

            {post.mediaUrl && (
              <div className="overflow-hidden mt-3 rounded-lg">
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

            {/* Engagement bar — left-aligned cluster + share far right */}
            <div className="flex items-center pt-3">
              {/* Left cluster */}
              <div className="flex items-center gap-0">
                <button
                  type="button"
                  data-ocid="post.like.button"
                  onClick={handleLike}
                  className="flex items-center gap-1.5 py-2 px-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                >
                  <Flame
                    className={`h-5 w-5 ${
                      isLiked
                        ? "text-[#E8432D] fill-[#E8432D]"
                        : "text-[#ADB5BD]"
                    }`}
                  />
                  <span
                    className={`text-[16px] font-semibold ${
                      isLiked ? "text-[#E8432D]" : "text-[#6C757D]"
                    }`}
                  >
                    {likeCount}
                  </span>
                </button>

                <button
                  type="button"
                  data-ocid="post.comment.button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 py-2 px-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
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
                  className="flex items-center gap-1.5 py-2 px-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                >
                  {isRecliqing ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#ADB5BD]" />
                  ) : (
                    <ReblogIcon
                      className={`h-5 w-5 ${
                        hasRecliqed ? "text-[#E8432D]" : "text-[#ADB5BD]"
                      }`}
                    />
                  )}
                  <span
                    className={`text-[16px] font-semibold ${
                      hasRecliqed ? "text-[#E8432D]" : "text-[#6C757D]"
                    }`}
                  >
                    {recliqCount}
                  </span>
                </button>
              </div>

              {/* Share pushed to far right */}
              <div className="ml-auto">
                <button
                  type="button"
                  data-ocid="post.share.button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShareModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <Share2 className="h-5 w-5 text-[#ADB5BD]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* University tag — below post, right-aligned */}
        <div className="mt-2 flex justify-end">
          <span className="bg-[#E8432D] text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            🏛️ {uniAcronym}
          </span>
        </div>
      </div>

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
            <p className="text-sm text-[#6C757D]">
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
              className="rounded-full bg-[#E8432D] hover:bg-[#e8432d]"
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
