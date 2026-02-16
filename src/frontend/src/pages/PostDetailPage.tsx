import { useParams } from '@tanstack/react-router';
import { useGetPost, useGetComments, useAddComment, useGetUserProfile } from '../hooks/useQueries';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { CommentThread } from '../components/comments/CommentThread';

export function PostDetailPage() {
  const { postId } = useParams({ from: '/post/$postId' });
  const navigate = useNavigate();
  const { data: post, isLoading: postLoading } = useGetPost(postId);
  const { data: comments, isLoading: commentsLoading } = useGetComments(postId);
  const { data: authorProfile } = useGetUserProfile(post?.author.toString());
  const addComment = useAddComment();
  const [commentContent, setCommentContent] = useState('');

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    try {
      await addComment.mutateAsync({ 
        postId: BigInt(postId), 
        content: commentContent,
        parentComment: null 
      });
      setCommentContent('');
      toast.success('Comment added!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    }
  };

  if (postLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="space-y-4 p-4">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold">Post not found</h1>
        </div>
      </div>
    );
  }

  const avatarUrl = authorProfile?.avatar?.getDirectURL();
  const initials = authorProfile?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    return date.toLocaleString();
  };

  const mediaUrl = post.media?.__kind__ === 'image' 
    ? post.media.image.getDirectURL() 
    : post.media?.__kind__ === 'video' 
    ? post.media.video.getDirectURL() 
    : null;

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Post</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-12 w-12">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={authorProfile?.displayName} />
              ) : (
                <AvatarFallback>{initials || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <div className="font-semibold">{authorProfile?.displayName || 'Unknown'}</div>
                <div className="text-sm text-muted-foreground">@{authorProfile?.username || 'unknown'}</div>
              </div>
              <p className="text-base whitespace-pre-wrap">{post.content}</p>
              
              {mediaUrl && (
                <div className="rounded-lg overflow-hidden border">
                  {post.media?.__kind__ === 'image' ? (
                    <img src={mediaUrl} alt="Post media" className="w-full" />
                  ) : post.media?.__kind__ === 'video' ? (
                    <video src={mediaUrl} controls className="w-full" />
                  ) : null}
                </div>
              )}

              <div className="text-sm text-muted-foreground pt-2 border-t">
                {formatTimestamp(post.timestamp)}
              </div>
              <div className="flex gap-6 pt-2 border-t">
                <div className="text-sm">
                  <span className="font-semibold">{Number(post.likes)}</span> Likes
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <Textarea
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleAddComment} disabled={addComment.isPending || !commentContent.trim()}>
                {addComment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Comment'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Comments</h2>
        {commentsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : comments && comments.length > 0 ? (
          <CommentThread postId={postId} comments={comments} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
}
