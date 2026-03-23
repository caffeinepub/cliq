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
    <div className="space-y-4 p-4">
      <ProfileHeader profile={profile} isOwnProfile={true} />

      <Tabs defaultValue="posts">
        <TabsList className="w-full">
          <TabsTrigger value="posts" className="flex-1">
            Posts
          </TabsTrigger>
          <TabsTrigger value="replies" className="flex-1">
            Replies
          </TabsTrigger>
          <TabsTrigger value="media" className="flex-1">
            Media
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex-1">
            🔖 Saved
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="posts"
          className="py-6 text-center text-muted-foreground"
        >
          No posts yet
        </TabsContent>
        <TabsContent
          value="replies"
          className="py-6 text-center text-muted-foreground"
        >
          No replies yet
        </TabsContent>
        <TabsContent
          value="media"
          className="py-6 text-center text-muted-foreground"
        >
          No media yet
        </TabsContent>
        <TabsContent value="bookmarks">
          {bookmarkedPosts.length > 0 ? (
            <div className="space-y-0 mt-4">
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
