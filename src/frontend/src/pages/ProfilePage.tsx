import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Loader2 } from "lucide-react";
import { useState } from "react";
import { MockPostCard } from "../components/posts/MockPostCard";
import { PostComposer } from "../components/posts/PostComposer";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { FloatingActionButton } from "../components/shared/FloatingActionButton";
import { mockPosts } from "../data/mockPosts";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const BOOKMARKED_POST_IDS = ["mock-5", "mock-7", "mock-2"];

export function ProfilePage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const [composerOpen, setComposerOpen] = useState(false);

  const bookmarkedPosts = mockPosts.filter((p) =>
    BOOKMARKED_POST_IDS.includes(p.id),
  );
  const mediaPosts = mockPosts.filter((p) => p.mediaUrl && p.mediaType);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      <ProfileHeader profile={profile} isOwnProfile={true} />

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-10 bg-[#F8F9FA] rounded-none border-b border-[#E5E5E5] p-0">
          <TabsTrigger
            value="posts"
            className="rounded-none text-xs font-semibold h-full data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            data-ocid="profile.posts.tab"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="media"
            className="rounded-none text-xs font-semibold h-full data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            data-ocid="profile.media.tab"
          >
            Media
          </TabsTrigger>
          <TabsTrigger
            value="bookmarks"
            className="rounded-none text-xs font-semibold h-full data-[state=active]:text-[#FF6B35] data-[state=active]:border-b-2 data-[state=active]:border-[#FF6B35] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            data-ocid="profile.bookmarks.tab"
          >
            🔖 Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="posts"
          className="py-6 text-center text-muted-foreground"
        >
          No posts yet
        </TabsContent>

        <TabsContent value="media">
          {mediaPosts.length > 0 ? (
            <div className="grid grid-cols-2 gap-0.5 mt-1">
              {mediaPosts.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square bg-[#F8F9FA] overflow-hidden"
                >
                  {post.mediaType === "image" ? (
                    <img
                      src={post.mediaUrl}
                      alt={post.content.slice(0, 30)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={post.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No media posts yet
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookmarks">
          {bookmarkedPosts.length > 0 ? (
            <div className="space-y-0 mt-0">
              {bookmarkedPosts.map((post, i) => (
                <MockPostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bookmark className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="font-semibold">No bookmarks yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Save posts from the feed to see them here.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="max-w-lg" data-ocid="profile.composer.dialog">
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
