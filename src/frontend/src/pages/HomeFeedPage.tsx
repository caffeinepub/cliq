import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MockPostCard } from "../components/posts/MockPostCard";
import { PostCard } from "../components/posts/PostCard";
import { PostComposer } from "../components/posts/PostComposer";
import { BecauseYouLiked } from "../components/recommendations/BecauseYouLiked";
import { FloatingActionButton } from "../components/shared/FloatingActionButton";
import { mockPosts } from "../data/mockPosts";
import {
  useGetCampusFeed,
  useGetFollowingFeed,
  useGetUniversalFeed,
} from "../hooks/useQueries";
import { getLikedPostIds, subscribe } from "../lib/interactionStore";
import { getUniversalFeed } from "../lib/universalAlgorithm";

const CURRENT_USER_UNIVERSITY = "University of Lagos";

export function HomeFeedPage() {
  const [activeTab, setActiveTab] = useState<"cliqs" | "campus" | "explore">(
    "campus",
  );
  const [composerOpen, setComposerOpen] = useState(false);
  const [likedPostIds, setLikedPostIds] = useState<string[]>(() =>
    getLikedPostIds(),
  );

  useEffect(() => {
    return subscribe(() => {
      setLikedPostIds(getLikedPostIds());
    });
  }, []);

  const { data: followingFeed, isLoading: followingLoading } =
    useGetFollowingFeed();
  const { data: campusFeed, isLoading: campusLoading } = useGetCampusFeed();
  const { data: universalFeed, isLoading: universalLoading } =
    useGetUniversalFeed();

  const algorithmicPosts = getUniversalFeed(mockPosts, CURRENT_USER_UNIVERSITY);

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
        <div className="sticky top-0 z-20 bg-background border-b border-[#E5E5E5]">
          {/* Home heading */}
          <div className="px-4 pt-4 pb-1">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              Home
            </h1>
          </div>

          {/* Tab row */}
          <TabsList className="flex gap-0 bg-transparent rounded-none p-0 h-auto w-full border-b-0">
            <TabsTrigger
              value="cliqs"
              data-ocid="home_feed.cliqs.tab"
              className="flex-1 py-3 text-sm font-semibold text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF6B35] data-[state=active]:text-[#FF6B35] data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
            >
              CLIQS
            </TabsTrigger>
            <TabsTrigger
              value="campus"
              data-ocid="home_feed.campus.tab"
              className="flex-1 py-3 text-sm font-semibold text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF6B35] data-[state=active]:text-[#FF6B35] data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
            >
              CAMPUS
            </TabsTrigger>
            <TabsTrigger
              value="explore"
              data-ocid="home_feed.explore.tab"
              className="flex-1 py-3 text-sm font-semibold text-muted-foreground rounded-none border-b-2 border-transparent data-[state=active]:border-[#FF6B35] data-[state=active]:text-[#FF6B35] data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-all"
            >
              EXPLORE
            </TabsTrigger>
          </TabsList>
        </div>

        {/* CLIQS TAB — followed users/communities */}
        <TabsContent value="cliqs" className="mt-0 divide-y divide-[#E5E5E5]">
          {mockPosts.map((post, i) => (
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
        </TabsContent>

        {/* CAMPUS TAB — university posts */}
        <TabsContent value="campus" className="mt-0 divide-y divide-[#E5E5E5]">
          {mockPosts.map((post, i) => (
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
        </TabsContent>

        {/* EXPLORE TAB — algorithmic cross-university */}
        <TabsContent value="explore" className="mt-0">
          <p className="text-[10px] text-muted-foreground pb-1 px-4 pt-2">
            ✨ Algorithmically ranked
          </p>
          <div className="px-4">
            <BecauseYouLiked likedPostIds={likedPostIds} />
          </div>
          <div className="divide-y divide-[#E5E5E5]">
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
          <PostComposer />
        </DialogContent>
      </Dialog>

      <FloatingActionButton onClick={() => setComposerOpen(true)} />
    </div>
  );
}
