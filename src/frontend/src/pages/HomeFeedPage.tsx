import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FeedComposer } from "../components/posts/FeedComposer";
import { PostCard } from "../components/posts/PostCard";
import {
  useGetCampusFeed,
  useGetFollowingFeed,
  useGetUniversalFeed,
} from "../hooks/useQueries";

export function HomeFeedPage() {
  const [activeTab, setActiveTab] = useState<
    "following" | "campus" | "universal"
  >("campus");
  const [composerVisible, setComposerVisible] = useState(true);
  const lastScrollY = useRef(0);

  const { data: followingFeed, isLoading: followingLoading } =
    useGetFollowingFeed();
  const { data: campusFeed, isLoading: campusLoading } = useGetCampusFeed();
  const { data: universalFeed, isLoading: universalLoading } =
    useGetUniversalFeed();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current + 5) {
        setComposerVisible(false);
      } else if (currentY < lastScrollY.current - 5) {
        setComposerVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div data-ocid="home_feed.page" className="relative">
      {/* Sticky composer — hides on scroll up */}
      <div
        className={[
          "sticky top-0 z-20 bg-background transition-all duration-300",
          composerVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none h-0 overflow-hidden",
        ].join(" ")}
      >
        <FeedComposer />
      </div>

      {/* Tabs — always visible, sticks to top when composer hides */}
      <div className="sticky top-0 z-10 bg-background border-b-2 border-border px-4 pt-2 pb-0">
        <Tabs
          data-ocid="home_feed.tabs"
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "following" | "campus" | "universal")
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 h-12 p-1 bg-muted rounded-2xl">
            <TabsTrigger
              value="following"
              className="rounded-xl font-bold data-[state=active]:shadow-bold"
              data-ocid="home_feed.following.tab"
            >
              Following
            </TabsTrigger>
            <TabsTrigger
              value="campus"
              className="rounded-xl font-bold data-[state=active]:shadow-bold"
              data-ocid="home_feed.campus.tab"
            >
              Campus
            </TabsTrigger>
            <TabsTrigger
              value="universal"
              className="rounded-xl font-bold data-[state=active]:shadow-bold"
              data-ocid="home_feed.universal.tab"
            >
              Universal
            </TabsTrigger>
          </TabsList>

          <TabsContent value="following" className="space-y-4 mt-6">
            {followingLoading ? (
              <div
                className="flex justify-center py-12"
                data-ocid="home_feed.following.loading_state"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : followingFeed && followingFeed.length > 0 ? (
              followingFeed.map((post, i) => (
                <div
                  key={post.id.toString()}
                  data-ocid={`home_feed.following.item.${i + 1}`}
                >
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div
                data-ocid="home_feed.following.empty_state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-8 overflow-hidden rounded-3xl border-2 border-border">
                  <img
                    src="/assets/generated/empty-feed.dim_1200x800.png"
                    alt="No posts yet"
                    className="max-w-md opacity-75"
                  />
                </div>
                <h2 className="mb-3 text-2xl font-black">No posts yet</h2>
                <p className="text-base font-semibold text-muted-foreground">
                  Follow other users to see their posts here!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="campus" className="space-y-4 mt-6">
            {campusLoading ? (
              <div
                className="flex justify-center py-12"
                data-ocid="home_feed.campus.loading_state"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : campusFeed && campusFeed.length > 0 ? (
              campusFeed.map((post, i) => (
                <div
                  key={post.id.toString()}
                  data-ocid={`home_feed.campus.item.${i + 1}`}
                >
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div
                data-ocid="home_feed.campus.empty_state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-8 overflow-hidden rounded-3xl border-2 border-border">
                  <img
                    src="/assets/generated/empty-feed.dim_1200x800.png"
                    alt="No posts yet"
                    className="max-w-md opacity-75"
                  />
                </div>
                <h2 className="mb-3 text-2xl font-black">No posts yet</h2>
                <p className="text-base font-semibold text-muted-foreground">
                  Be the first to share something with your campus community!
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="universal" className="space-y-4 mt-6">
            {universalLoading ? (
              <div
                className="flex justify-center py-12"
                data-ocid="home_feed.universal.loading_state"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : universalFeed && universalFeed.length > 0 ? (
              universalFeed.map((post, i) => (
                <div
                  key={post.id.toString()}
                  data-ocid={`home_feed.universal.item.${i + 1}`}
                >
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div
                data-ocid="home_feed.universal.empty_state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-8 overflow-hidden rounded-3xl border-2 border-border">
                  <img
                    src="/assets/generated/empty-feed.dim_1200x800.png"
                    alt="No posts yet"
                    className="max-w-md opacity-75"
                  />
                </div>
                <h2 className="mb-3 text-2xl font-black">No posts yet</h2>
                <p className="text-base font-semibold text-muted-foreground">
                  Be the first to share something across universities!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
