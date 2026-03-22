import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { MockPostCard } from "../components/posts/MockPostCard";
import { PostCard } from "../components/posts/PostCard";
import { PostComposer } from "../components/posts/PostComposer";
import { FloatingActionButton } from "../components/shared/FloatingActionButton";
import { mockPosts } from "../data/mockPosts";
import {
  useGetCampusFeed,
  useGetFollowingFeed,
  useGetUniversalFeed,
} from "../hooks/useQueries";

export function HomeFeedPage() {
  const [activeTab, setActiveTab] = useState<
    "following" | "campus" | "universal"
  >("campus");
  const [composerOpen, setComposerOpen] = useState(false);

  const { data: followingFeed, isLoading: followingLoading } =
    useGetFollowingFeed();
  const { data: campusFeed, isLoading: campusLoading } = useGetCampusFeed();
  const { data: universalFeed, isLoading: universalLoading } =
    useGetUniversalFeed();

  return (
    <div data-ocid="home_feed.page" className="relative pb-4">
      <Tabs
        data-ocid="home_feed.tabs"
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as "following" | "campus" | "universal")
        }
        className="w-full"
      >
        {/* Sticky Tabs Header — underline style */}
        <div className="sticky top-0 z-20 bg-background">
          <TabsList className="flex gap-6 border-b border-border px-4 bg-transparent h-auto w-full justify-start rounded-none p-0">
            <TabsTrigger
              value="following"
              className="pb-3 pt-3 text-sm font-semibold text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent shadow-none hover:text-foreground transition-colors"
              data-ocid="home_feed.following.tab"
            >
              CLIQS
            </TabsTrigger>
            <TabsTrigger
              value="campus"
              className="pb-3 pt-3 text-sm font-semibold text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent shadow-none hover:text-foreground transition-colors"
              data-ocid="home_feed.campus.tab"
            >
              CAMPUS
            </TabsTrigger>
            <TabsTrigger
              value="universal"
              className="pb-3 pt-3 text-sm font-semibold text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent shadow-none hover:text-foreground transition-colors"
              data-ocid="home_feed.universal.tab"
            >
              EXPLORE
            </TabsTrigger>
          </TabsList>
        </div>

        {/* CLIQS TAB — Following feed */}
        <TabsContent value="following" className="space-y-4 mt-6 px-4">
          {mockPosts.map((post, i) => (
            <MockPostCard key={post.id} post={post} index={i + 1} />
          ))}
          {followingLoading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="home_feed.following.loading_state"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            followingFeed?.map((post, i) => (
              <div
                key={post.id.toString()}
                data-ocid={`home_feed.following.item.${i + 1}`}
              >
                <PostCard post={post} />
              </div>
            ))
          )}
        </TabsContent>

        {/* CAMPUS TAB */}
        <TabsContent value="campus" className="space-y-4 mt-6 px-4">
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

        {/* EXPLORE TAB — algorithm-curated from all universities */}
        <TabsContent value="universal" className="space-y-4 mt-6 px-4">
          <p className="text-xs text-muted-foreground pb-1">
            Trending posts from all universities
          </p>
          {mockPosts.map((post, i) => (
            <MockPostCard key={post.id} post={post} index={i + 1} />
          ))}
          {universalLoading ? (
            <div
              className="flex justify-center py-12"
              data-ocid="home_feed.universal.loading_state"
            >
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            universalFeed?.map((post, i) => (
              <div
                key={post.id.toString()}
                data-ocid={`home_feed.universal.item.${i + 1}`}
              >
                <PostCard post={post} />
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Post Composer Dialog */}
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

      {/* FAB */}
      <FloatingActionButton onClick={() => setComposerOpen(true)} />
    </div>
  );
}
