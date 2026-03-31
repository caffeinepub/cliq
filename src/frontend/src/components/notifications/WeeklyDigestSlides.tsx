import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { mockPosts } from "../../data/mockPosts";
import { getUniversityAcronym } from "../../lib/universityAcronyms";

interface WeeklyDigestSlidesProps {
  open: boolean;
  onClose: () => void;
}

const ORANGE = "#E8432D";
const BG = "#0A0A0A";

function ReblogIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      role="img"
      aria-label="Recliq"
    >
      <title>Recliq</title>
      <path d="M7 4v4H3l5 6 5-6H9V4H7zm10 16v-4h4l-5-6-5 6h4v4h2z" />
    </svg>
  );
}

function PostCard({
  post,
  glowBorder,
}: {
  post: (typeof mockPosts)[0];
  glowBorder?: boolean;
}) {
  const initials = post.isAnonymous
    ? "🥷"
    : post.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#1a1a1a",
        border: glowBorder
          ? `2px solid ${ORANGE}`
          : "1px solid rgba(255,255,255,0.12)",
        boxShadow: glowBorder ? `0 0 24px ${ORANGE}44` : undefined,
      }}
    >
      <div className="flex items-center gap-3 p-4 pb-2">
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: ORANGE }}
        >
          {post.isAnonymous ? "🥷" : initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white leading-tight truncate">
            {post.isAnonymous ? "Anonymous" : post.displayName}
          </p>
          <p className="text-xs text-zinc-400">
            {getUniversityAcronym(post.university)}
          </p>
        </div>
      </div>

      <p className="px-4 pb-3 text-sm text-zinc-200 leading-relaxed">
        {post.content}
      </p>

      {post.mediaUrl && post.mediaType === "image" && (
        <img
          src={post.mediaUrl}
          alt="Post media"
          className="w-full object-cover"
          style={{ maxHeight: 180 }}
        />
      )}

      <div
        className="flex items-center gap-5 px-4 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span style={{ color: ORANGE }}>🔥</span>
          <span className="font-bold text-zinc-200">{post.likes}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span>💬</span>
          <span className="font-bold text-zinc-200">{post.comments}</span>
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
          <ReblogIcon className="h-3 w-3" />
          <span className="font-bold text-zinc-200">{post.shares}</span>
        </span>
      </div>
    </div>
  );
}

export function WeeklyDigestSlides({ open, onClose }: WeeklyDigestSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (open) setCurrentSlide(0);
  }, [open]);

  const mostLiked = [...mockPosts].sort((a, b) => b.likes - a.likes)[0];
  const mostCommented = [...mockPosts].sort(
    (a, b) => b.comments - a.comments,
  )[0];
  const mostRecliqed = [...mockPosts].sort((a, b) => b.shares - a.shares)[0];
  const topPost = [...mockPosts].sort(
    (a, b) =>
      b.likes +
      b.comments * 2 +
      b.shares * 3 -
      (a.likes + a.comments * 2 + a.shares * 3),
  )[0];
  const totalInteractions = mockPosts.reduce(
    (sum, p) => sum + p.likes + p.comments + p.shares,
    0,
  );
  const newFollowers = 8;
  const topScore = topPost
    ? topPost.likes + topPost.comments * 2 + topPost.shares * 3
    : 0;

  const TOTAL = 5;

  const goTo = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };
  const goNext = () => {
    if (currentSlide < TOTAL - 1) goTo(currentSlide + 1);
  };
  const goPrev = () => {
    if (currentSlide > 0) goTo(currentSlide - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
  const weekRange = `${fmt(weekStart)} – ${fmt(now)}`;

  if (!open) return null;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <p
                className="text-5xl font-black tracking-tight leading-none"
                style={{ color: ORANGE }}
              >
                YOUR WEEK
              </p>
              <p className="text-zinc-400 text-sm mt-2 font-medium">
                Week of {weekRange}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-6xl font-black text-white leading-none">
                  {totalInteractions}
                </p>
                <p className="mt-2 uppercase text-xs font-semibold text-zinc-400 tracking-wide">
                  Total Interactions
                </p>
              </div>
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-6xl font-black text-white leading-none">
                  +{newFollowers}
                </p>
                <p className="mt-2 uppercase text-xs font-semibold text-zinc-400 tracking-wide">
                  New Followers
                </p>
              </div>
            </div>

            <p className="text-center text-zinc-500 text-sm">
              This was your week on CLIQ 🔥
            </p>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-2xl font-black" style={{ color: ORANGE }}>
                🔥 MOST LIKED
              </p>
              <p className="text-5xl font-black text-white leading-none mt-1">
                {mostLiked.likes}{" "}
                <span className="text-2xl font-semibold text-zinc-400">
                  likes
                </span>
              </p>
            </div>
            <PostCard post={mostLiked} />
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-full font-bold text-sm text-white"
              style={{ background: ORANGE }}
              data-ocid="digest.view_post.button"
            >
              View Post
            </button>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-2xl font-black" style={{ color: ORANGE }}>
                💬 MOST COMMENTED
              </p>
              <p className="text-5xl font-black text-white leading-none mt-1">
                {mostCommented.comments}{" "}
                <span className="text-2xl font-semibold text-zinc-400">
                  comments
                </span>
              </p>
            </div>
            <PostCard post={mostCommented} />
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-full font-bold text-sm text-white"
              style={{ background: ORANGE }}
              data-ocid="digest.view_post.button"
            >
              View Post
            </button>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-2xl font-black" style={{ color: ORANGE }}>
                🔁 MOST RECLIQED
              </p>
              <p className="text-5xl font-black text-white leading-none mt-1">
                {mostRecliqed.shares}{" "}
                <span className="text-2xl font-semibold text-zinc-400">
                  recliqs
                </span>
              </p>
            </div>
            <PostCard post={mostRecliqed} />
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-full font-bold text-sm text-white"
              style={{ background: ORANGE }}
              data-ocid="digest.view_post.button"
            >
              View Post
            </button>
          </div>
        );

      case 4:
        return (
          <div className="flex flex-col gap-5">
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: "linear-gradient(135deg, #E8432D 0%, #e8432d 100%)",
              }}
            >
              <p className="text-2xl font-black text-white">
                🏆 TOP POST OF THE WEEK
              </p>
              <p className="text-white/80 text-xs mt-1">
                Highest combined engagement score
              </p>
            </div>

            <p className="text-center">
              <span className="text-4xl font-black text-white">{topScore}</span>
              <span className="text-zinc-400 text-sm ml-2">
                engagement score
              </span>
            </p>

            <PostCard post={topPost} glowBorder />

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-full font-bold text-sm text-white"
              style={{ background: ORANGE }}
              data-ocid="digest.view_post.button"
            >
              View Post
            </button>

            <p className="text-center text-zinc-500 text-sm">
              Keep it up — your content is on fire 🔥
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: BG }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      data-ocid="digest.modal"
    >
      {/* Backdrop button for tap-outside-to-close */}
      <button
        type="button"
        aria-label="Close digest"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        tabIndex={-1}
      />

      {/* Main content — stop propagation so clicks here don't close */}
      <div
        role="presentation"
        className="relative z-10 flex flex-col w-full h-full max-w-lg mx-auto"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Top bar: progress + close */}
        <div className="flex items-center gap-3 px-5 pt-12 pb-4 flex-shrink-0">
          <div className="flex-1 h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((currentSlide + 1) / TOTAL) * 100}%`,
                background: ORANGE,
              }}
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.08)" }}
            data-ocid="digest.close_button"
          >
            ✕
          </button>
        </div>

        {/* Slide content */}
        <div className="flex-1 overflow-y-auto px-5 pb-4">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {renderSlide()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <div
          className="flex items-center justify-between px-5 pb-10 pt-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            type="button"
            onClick={goPrev}
            disabled={currentSlide === 0}
            aria-label="Previous slide"
            className="h-11 w-11 rounded-full flex items-center justify-center text-lg font-bold transition-all disabled:opacity-20"
            style={{ background: "rgba(255,255,255,0.08)", color: "white" }}
            data-ocid="digest.pagination_prev"
          >
            ←
          </button>

          <span className="text-zinc-400 text-sm font-semibold">
            {currentSlide + 1} / {TOTAL}
          </span>

          <button
            type="button"
            onClick={goNext}
            disabled={currentSlide === TOTAL - 1}
            aria-label="Next slide"
            className="h-11 w-11 rounded-full flex items-center justify-center text-lg font-bold transition-all disabled:opacity-20 text-white"
            style={{
              background:
                currentSlide === TOTAL - 1 ? "rgba(255,255,255,0.08)" : ORANGE,
            }}
            data-ocid="digest.pagination_next"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
