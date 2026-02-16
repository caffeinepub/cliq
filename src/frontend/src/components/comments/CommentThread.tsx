import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { useGetUserProfile, useAddComment, useDeleteComment } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { Comment } from '../../backend';

interface CommentThreadProps {
  postId: string;
  comments: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  postId: string;
  replies: Comment[];
  onReply: (commentId: bigint) => void;
  replyingTo: bigint | null;
  onCancelReply: () => void;
}

function CommentItem({ comment, postId, replies, onReply, replyingTo, onCancelReply }: CommentItemProps) {
  const { data: commentAuthor } = useGetUserProfile(comment.author.toString());
  const { identity } = useInternetIdentity();
  const addComment = useAddComment();
  const deleteComment = useDeleteComment();
  const [replyContent, setReplyContent] = useState('');

  const isAuthor = identity?.getPrincipal().toString() === comment.author.toString();
  const isReplying = replyingTo === comment.id;

  const commentAvatarUrl = commentAuthor?.avatar?.getDirectURL();
  const commentInitials = commentAuthor?.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      await addComment.mutateAsync({
        postId: BigInt(postId),
        content: replyContent,
        parentComment: comment.id,
      });
      setReplyContent('');
      onCancelReply();
      toast.success('Reply added!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add reply');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment and all its replies?')) {
      return;
    }

    try {
      await deleteComment.mutateAsync({ commentId: comment.id, postId: BigInt(postId) });
      toast.success('Comment deleted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              {commentAvatarUrl ? (
                <AvatarImage src={commentAvatarUrl} alt={commentAuthor?.displayName} />
              ) : (
                <AvatarFallback>{commentInitials || 'U'}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-sm">{commentAuthor?.displayName || 'Unknown'}</span>
                <span className="text-xs text-muted-foreground">
                  @{commentAuthor?.username || 'unknown'}
                </span>
                <span className="text-xs text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(comment.timestamp)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap break-words">{comment.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2"
                  onClick={() => onReply(comment.id)}
                >
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                {isAuthor && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    disabled={deleteComment.isPending}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>

          {isReplying && (
            <div className="mt-3 ml-11 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[60px]"
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={onCancelReply}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={addComment.isPending || !replyContent.trim()}
                >
                  {addComment.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Replying...
                    </>
                  ) : (
                    'Reply'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {replies.length > 0 && (
        <div className="ml-8 space-y-3 border-l-2 border-muted pl-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id.toString()}
              comment={reply}
              postId={postId}
              replies={[]}
              onReply={onReply}
              replyingTo={replyingTo}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentThread({ postId, comments }: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<bigint | null>(null);

  const topLevelComments = comments.filter((c) => !c.parentComment);
  
  const getReplies = (commentId: bigint): Comment[] => {
    return comments.filter((c) => c.parentComment === commentId);
  };

  const sortedTopLevel = topLevelComments.sort((a, b) => {
    return Number(a.timestamp - b.timestamp);
  });

  return (
    <div className="space-y-4">
      {sortedTopLevel.map((comment) => (
        <CommentItem
          key={comment.id.toString()}
          comment={comment}
          postId={postId}
          replies={getReplies(comment.id)}
          onReply={setReplyingTo}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      ))}
    </div>
  );
}
