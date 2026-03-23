import { useEffect, useRef, useState } from "react";
import { mockPosts } from "../../data/mockPosts";
import { getUniversityAcronym } from "../../lib/universityAcronyms";

interface WeeklyDigestSlidesProps {
  open: boolean;
  onClose: () => void;
}

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

export function WeeklyDigestSlides({ open, onClose }: WeeklyDigestSlidesProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (open) setCurrentSlide(0);
  }, [open]);

  const mostLiked = [...mockPosts].sort((a, b) => b.likes - a.likes)[0];
  const mostRecliqed = [...mockPosts].sort((a, b) => b.shares - a.shares)[0];
  const mostViewed = [...mockPosts].sort(
    (a, b) =>
      b.likes +
      b.comments * 2 +
      b.shares * 3 -
      (a.likes + a.comments * 2 + a.shares * 3),
  )[0];
  const newFollowers = 8;
  const topPost = [...mockPosts].sort(
    (a, b) =>
      b.likes +
      b.comments * 2 +
      b.shares * 3 -
      (a.likes + a.comments * 2 + a.shares * 3),
  )[0];

  const slides = [
    {
      id: "most-viewed",
      label: "👁️ MOST VIEWED",
      color: "#1D4E89",
      post: mostViewed,
      stat: `${mostViewed.likes + mostViewed.comments + mostViewed.shares} interactions`,
      statIcon: "👁️",
    },
    {
      id: "most-liked",
      label: "🔥 MOST LIKED",
      color: "#FF6B35",
      post: mostLiked,
      stat: `${mostLiked.likes} likes`,
      statIcon: "🔥",
    },
    {
      id: "most-recliqed",
      label: "🔁 MOST RECLIQED",
      color: "#2D6A4F",
      post: mostRecliqed,
      stat: `${mostRecliqed.shares} recliqs`,
      statIcon: "🔁",
    },
    {
      id: "followers",
      label: "👥 NEW FOLLOWERS",
      color: "#7B2D8B",
      post: null,
      stat: `${newFollowers} new followers this week`,
      statIcon: "👥",
      isFollowers: true,
    },
    {
      id: "top-post",
      label: "🏆 TOP POST OF THE WEEK",
      color: "#e8432d",
      post: topPost,
      stat: `${topPost.likes} 🔥 · ${topPost.comments} 💬 · ${topPost.shares} 🔁`,
      statIcon: "🏆",
      isTop: true,
    },
  ];

  const TOTAL = slides.length;
  const goNext = () => setCurrentSlide((p) => Math.min(p + 1, TOTAL - 1));
  const goPrev = () => setCurrentSlide((p) => Math.max(p - 1, 0));

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

  if (!open) return null;

  const slide = slides[currentSlide];

  return (
    <>
      {/* Full-screen overlay */}
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop button */}
        <button
          type="button"
          aria-label="Close digest"
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
          onClick={onClose}
        />

        {/* Sheet panel */}
        <div
          className="relative w-full max-w-lg mx-auto rounded-t-3xl bg-white overflow-hidden"
          style={{ maxHeight: "88vh" }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Weekly Digest
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg font-bold"
            >
              ×
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5 pb-3">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="transition-all duration-200 rounded-full"
                style={{
                  width: i === currentSlide ? 20 : 6,
                  height: 6,
                  backgroundColor: i === currentSlide ? slide.color : "#E5E5E5",
                }}
              />
            ))}
          </div>

          {/* Slide */}
          <div
            className="px-5 pb-8 select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: `2px solid ${slide.color}20` }}
            >
              {/* Slide header stripe */}
              <div
                className="px-5 py-4"
                style={{ backgroundColor: slide.color }}
              >
                <p className="text-white text-xs font-black uppercase tracking-widest opacity-80">
                  {slide.label}
                </p>
                <p className="text-white text-xl font-black mt-1">
                  {slide.statIcon} {slide.stat}
                </p>
              </div>

              {/* Slide body */}
              {slide.isFollowers ? (
                <div className="bg-white p-6 text-center">
                  <div className="text-6xl mb-4" style={{ lineHeight: 1 }}>
                    👥
                  </div>
                  <p
                    className="text-4xl font-black"
                    style={{ color: slide.color }}
                  >
                    +{newFollowers}
                  </p>
                  <p className="text-base font-semibold text-gray-500 mt-2">
                    New followers this week
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Keep posting — your audience is growing 🚀
                  </p>
                </div>
              ) : slide.post ? (
                <div className="bg-white p-4">
                  {slide.isTop && (
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white mb-3"
                      style={{ backgroundColor: slide.color }}
                    >
                      🏆 Top Post
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: slide.color }}
                    >
                      {slide.post.isAnonymous
                        ? "🥷"
                        : slide.post.displayName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-none">
                        {slide.post.isAnonymous
                          ? "Anonymous"
                          : slide.post.displayName}
                      </p>
                      <p className="text-xs text-gray-400">
                        🏛️ {getUniversityAcronym(slide.post.university)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                    {slide.post.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      🔥{" "}
                      <span className="font-bold text-gray-700">
                        {slide.post.likes}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      💬{" "}
                      <span className="font-bold text-gray-700">
                        {slide.post.comments}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <ReblogIcon className="h-3 w-3" />
                      <span className="font-bold text-gray-700">
                        {slide.post.shares}
                      </span>
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Nav arrows */}
            <div className="flex items-center justify-between mt-5">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentSlide === 0}
                className="h-10 px-4 rounded-full text-sm font-bold transition-colors disabled:opacity-30"
                style={{
                  backgroundColor:
                    currentSlide === 0 ? "#F0F0F0" : `${slide.color}15`,
                  color: currentSlide === 0 ? "#ADB5BD" : slide.color,
                }}
              >
                ← Prev
              </button>
              <span className="text-xs text-gray-400 font-medium">
                {currentSlide + 1} / {TOTAL}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={currentSlide === TOTAL - 1}
                className="h-10 px-4 rounded-full text-sm font-bold transition-colors disabled:opacity-30"
                style={{
                  backgroundColor:
                    currentSlide === TOTAL - 1 ? "#F0F0F0" : slide.color,
                  color: currentSlide === TOTAL - 1 ? "#ADB5BD" : "white",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
