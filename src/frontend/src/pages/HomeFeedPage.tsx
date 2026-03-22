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
      {/* Tabs — sticky at top */}
      <div className="sticky top-0 z-20 bg-background border-b-2 border-border px-4 pt-2 pb-0">
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

          {/* FOLLOWING TAB */}
          <TabsContent value="following" className="space-y-4 mt-6">
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
          <TabsContent value="campus" className="space-y-4 mt-6">
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

          {/* UNIVERSAL TAB */}
          <TabsContent value="universal" className="space-y-4 mt-6">
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
      </div>

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
