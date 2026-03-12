import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeletePost, useListPosts } from "../../../hooks/useAdminQueries";
import { useGetUserProfile } from "../../../hooks/useQueries";

function PostItem({ post }: { post: any }) {
  const { data: authorProfile } = useGetUserProfile(post.author.toString());
  const deletePost = useDeletePost();

  const handleDelete = async () => {
    try {
      await deletePost.mutateAsync(post.id);
      toast.success("Post deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post");
    }
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-semibold">
            {authorProfile?.displayName || "Unknown User"}
          </p>
          <p className="text-sm text-muted-foreground">
            {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={deletePost.isPending}>
              {deletePost.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 text-destructive" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <p className="mb-2">{post.content}</p>
      {post.media && (
        <div className="mt-2">
          {post.media.__kind__ === "image" && (
            <img
              src={post.media.image.getDirectURL()}
              alt="Post media"
              className="max-h-64 rounded-lg object-cover"
            />
          )}
          {post.media.__kind__ === "video" && (
            <video
              src={post.media.video.getDirectURL()}
              controls
              className="max-h-64 rounded-lg"
            >
              <track kind="captions" />
            </video>
          )}
        </div>
      )}
      <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
        <span>{Number(post.likes)} likes</span>
        <span>{post.university}</span>
      </div>
    </div>
  );
}

export function PostsPanel() {
  const [page, setPage] = useState(0);
  const limit = 20;
  const { data: posts, isLoading, isError } = useListPosts(limit, page * limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Failed to load posts</p>
        </CardContent>
      </Card>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No posts found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts Management</CardTitle>
        <CardDescription>View and moderate platform posts</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {posts.map((post) => (
              <PostItem key={post.id.toString()} post={post} />
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page + 1}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={posts.length < limit}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
