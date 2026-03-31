import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MockPostCard } from "../components/posts/MockPostCard";
import { PostCard } from "../components/posts/PostCard";
import { PostComposer } from "../components/posts/PostComposer";
import { ProfileCompletionModal } from "../components/profile/ProfileCompletionModal";
import { BecauseYouLiked } from "../components/recommendations/BecauseYouLiked";
import { FloatingActionButton } from "../components/shared/FloatingActionButton";
import { mockPosts } from "../data/mockPosts";
import { useProfileCompletion } from "../hooks/useProfileCompletion";
import {
  useGetCampusFeed,
  useGetFollowingFeed,
  useGetUniversalFeed,
} from "../hooks/useQueries";
import { getLikedPostIds, subscribe } from "../lib/interactionStore";
import { getUniversalFeed } from "../lib/universalAlgorithm";
import { getUniversityAcronym } from "../lib/universityAcronyms";

const CAMPUS_UNIVERSITIES = [
  "University of Lagos",
  "University of Nigeria, Nsukka",
  "Obafemi Awolowo University",
  "Ahmadu Bello University",
  "University of Ibadan",
];

const SUGGESTED_USERS = [
  {
    id: "s1",
    displayName: "Temi Adeyemi",
    username: "temi_ade",
    university: "University of Lagos",
    bio: "400L Engineering · Campus life 🔥",
  },
  {
    id: "s2",
    displayName: "Emeka Nwosu",
    username: "emeka_nw",
    university: "University of Ibadan",
    bio: "5.0 GPA tips & campus gist 📚",
  },
  {
    id: "s3",
    displayName: "Bukola Fashola",
    username: "bukky_f",
    university: "Ahmadu Bello University",
    bio: "Food lover & campus reviewer 🍛",
  },
  {
    id: "s4",
    displayName: "Favour Eze",
    username: "favour_ez",
    university: "University of Benin",
    bio: "Memes, vibes & student life 😂",
  },
];

export function HomeFeedPage() {
  const [activeTab, setActiveTab] = useState<"cliqs" | "campus" | "explore">(
    "campus",
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState<string[]>(() =>
    getLikedPostIds(),
  );
  const [selectedUniversity, setSelectedUniversity] = useState(
    CAMPUS_UNIVERSITIES[0],
  );
  const [uniPickerOpen, setUniPickerOpen] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const uniPickerRef = useRef<HTMLDivElement>(null);

  const { shouldShow, markCompleted, markSkipped } = useProfileCompletion();

  useEffect(() => {
    if (shouldShow) setShowProfileCompletion(true);
  }, [shouldShow]);

  useEffect(() => {
    return subscribe(() => {
      setLikedPostIds(getLikedPostIds());
    });
  }, []);

  // Close picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        uniPickerRef.current &&
        !uniPickerRef.current.contains(e.target as Node)
      ) {
        setUniPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const { data: followingFeed, isLoading: followingLoading } =
    useGetFollowingFeed();
  const { data: campusFeed, isLoading: campusLoading } = useGetCampusFeed();
  const { data: universalFeed, isLoading: universalLoading } =
    useGetUniversalFeed();

  const algorithmicPosts = getUniversalFeed(mockPosts, selectedUniversity);

  // Campus: filter mockPosts by selected university
  const campusMockPosts = mockPosts.filter(
    (p) => p.university === selectedUniversity,
  );

  // CLIQS: all mockPosts (following feed)
  const cliqsMockPosts = mockPosts;

  const hasNoFollowing =
    !followingLoading &&
    (!followingFeed || followingFeed.length === 0) &&
    cliqsMockPosts.length === 0;

  const uniAcronym = getUniversityAcronym(selectedUniversity);

  function handlePostSuccess() {
    setTimeout(() => {
      const completed = localStorage.getItem("cliq_profile_completed_at");
      const skipped = localStorage.getItem("cliq_profile_skipped_at");
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const shouldShowNow =
        !completed && (!skipped || new Date(skipped).getTime() < sevenDaysAgo);
      if (shouldShowNow) setShowProfileCompletion(true);
    }, 800);
  }

  return (
    <div
      data-ocid="home_feed.page"
      className="relative pb-4 max-w-full overflow-x-hidden"
    >
      <Tabs
        data-ocid="home_feed.tabs"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "cliqs" | "campus" | "explore")}
        className="w-full"
      >
        {/* Sticky Header: Title + Tabs */}
        <div className="sticky top-0 z-20 bg-background border-b border-[#F0F0F0] dark:border-zinc-800">
          <div className="px-4 pt-4 pb-1">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Home
            </h1>
          </div>
          <TabsList className="flex gap-0 bg-transparent rounded-none p-0 h-auto w-full border-b-0">
            <TabsTrigger
              value="cliqs"
              data-ocid="home_feed.cliqs.tab"
              className="flex-1 py-3 text-sm font-semibold text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-[#E8432D] data-[state=active]:text-[#E8432D] data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
            >
              CLIQS
            </TabsTrigger>
            <TabsTrigger
              value="campus"
              data-ocid="home_feed.campus.tab"
              className="flex-1 py-3 text-sm font-semibold text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-[#E8432D] data-[state=active]:text-[#E8432D] data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
            >
              CAMPUS
            </TabsTrigger>
            <TabsTrigger
              value="explore"
              data-ocid="home_feed.explore.tab"
              className="flex-1 py-3 text-sm font-semibold text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-[#E8432D] data-[state=active]:text-[#E8432D] data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
            >
              EXPLORE
            </TabsTrigger>
          </TabsList>
        </div>

        {/* CLIQS TAB — following feed, never changes with university */}
        <TabsContent
          value="cliqs"
          className="mt-0 divide-y divide-[#E5E5E5] dark:divide-zinc-800"
        >
          {cliqsMockPosts.map((post, i) => (
            <MockPostCard key={post.id} post={post} index={i + 1} />
          ))}
          {followingLoading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="home_feed.cliqs.loading_state"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            followingFeed?.map((post, i) => (
              <div
                key={post.id.toString()}
                data-ocid={`home_feed.cliqs.item.${i + 1}`}
              >
                <PostCard post={post} />
              </div>
            ))
          )}

          {/* Empty following state — show suggestions */}
          {hasNoFollowing && (
            <div className="px-4 py-6" data-ocid="home_feed.cliqs.empty_state">
              <p className="text-sm font-semibold text-foreground mb-1">
                People to Follow
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Follow people to see their posts here
              </p>
              <div className="space-y-3">
                {SUGGESTED_USERS.map((u) => {
                  const followed = followedUsers.includes(u.id);
                  const userInitials = u.displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);
                  return (
                    <div
                      key={u.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ backgroundColor: "#E8432D" }}
                        >
                          {userInitials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {u.displayName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{u.username} · {getUniversityAcronym(u.university)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFollowedUsers((prev) =>
                            followed
                              ? prev.filter((id) => id !== u.id)
                              : [...prev, u.id],
                          )
                        }
                        className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-colors ${
                          followed
                            ? "bg-transparent border-[#F0F0F0] text-muted-foreground"
                            : "bg-[#E8432D] border-[#E8432D] text-white"
                        }`}
                        data-ocid="home_feed.follow.button"
                      >
                        {followed ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </TabsContent>

        {/* CAMPUS TAB — filtered by selectedUniversity */}
        <TabsContent value="campus" className="mt-0">
          {/* University picker row */}
          <div
            className="flex items-center justify-between px-4 py-2 border-b border-[#F0F0F0] dark:border-zinc-800 bg-background"
            ref={uniPickerRef}
          >
            <span className="text-xs text-muted-foreground">
              📍 Showing posts from{" "}
              <span className="font-semibold text-foreground">
                {uniAcronym}
              </span>
            </span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setUniPickerOpen((o) => !o)}
                className="flex items-center gap-1 text-xs font-semibold text-[#E8432D] px-3 py-1.5 rounded-full border border-[#E8432D]/30 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                data-ocid="home_feed.campus.university.button"
              >
                Change <ChevronDown className="h-3 w-3" />
              </button>
              {uniPickerOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-zinc-900 border border-[#F0F0F0] dark:border-zinc-700 rounded-xl shadow-lg z-30 overflow-hidden">
                  {CAMPUS_UNIVERSITIES.map((uni) => (
                    <button
                      key={uni}
                      type="button"
                      onClick={() => {
                        setSelectedUniversity(uni);
                        setUniPickerOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-orange-50 dark:hover:bg-orange-950/20 ${
                        uni === selectedUniversity
                          ? "text-[#E8432D] font-semibold bg-orange-50/50 dark:bg-orange-950/10"
                          : "text-foreground"
                      }`}
                      data-ocid="home_feed.campus.university.select"
                    >
                      {getUniversityAcronym(uni)} — {uni}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {campusMockPosts.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
              data-ocid="home_feed.campus.empty_state"
            >
              <span className="text-4xl mb-3">🏛️</span>
              <h3 className="font-semibold text-lg text-foreground mb-1">
                No posts yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Be the first to post at {selectedUniversity}!
              </p>
              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="px-6 py-2 rounded-full bg-[#E8432D] text-white text-sm font-semibold hover:bg-[#e8432d] transition-colors"
                data-ocid="home_feed.campus.post_now.button"
              >
                Post Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E5E5] dark:divide-zinc-800">
              {campusMockPosts.map((post, i) => (
                <MockPostCard key={post.id} post={post} index={i + 1} />
              ))}
              {campusLoading ? (
                <div
                  className="flex justify-center py-12"
                  data-ocid="home_feed.campus.loading_state"
                >
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                campusFeed?.map((post, i) => (
                  <div
                    key={post.id.toString()}
                    data-ocid={`home_feed.campus.item.${i + 1}`}
                  >
                    <PostCard post={post} />
                  </div>
                ))
              )}
            </div>
          )}
        </TabsContent>

        {/* EXPLORE TAB — algorithmic, never changes */}
        <TabsContent value="explore" className="mt-0">
          <p className="text-[10px] text-muted-foreground pb-1 px-4 pt-2">
            ✨ Algorithmically ranked
          </p>
          <div className="px-4">
            <BecauseYouLiked likedPostIds={likedPostIds} />
          </div>
          <div className="divide-y divide-[#E5E5E5] dark:divide-zinc-800">
            {algorithmicPosts.map((post, i) => (
              <MockPostCard key={post.id} post={post} index={i + 1} />
            ))}
          </div>
          {universalLoading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="home_feed.explore.loading_state"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            universalFeed?.map((post, i) => (
              <div
                key={post.id.toString()}
                data-ocid={`home_feed.explore.item.${i + 1}`}
              >
                <PostCard post={post} />
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent
          className="max-w-lg"
          data-ocid="home_feed.composer.dialog"
        >
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
          </DialogHeader>
          <PostComposer onPostSuccess={handlePostSuccess} />
        </DialogContent>
      </Dialog>

      <FloatingActionButton onClick={() => setComposerOpen(true)} />

      <ProfileCompletionModal
        open={showProfileCompletion}
        onOpenChange={setShowProfileCompletion}
        onComplete={(dept, bday) => {
          markCompleted(dept, bday);
          setShowProfileCompletion(false);
        }}
        onSkip={() => {
          markSkipped();
          setShowProfileCompletion(false);
        }}
      />
    </div>
  );
}
