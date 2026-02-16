import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import type { Post } from '../../backend';
import { useLikePost, useUnlikePost, useGetUserProfile } from '../../hooks/useQueries';
import { useState } from 'react';
import { toast } from 'sonner';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const { data: authorProfile } = useGetUserProfile(post.author.toString());
  const likePost = useLikePost();
  const unlikePost = useUnlikePost();
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isLiked) {
        await unlikePost.mutateAsync(post.id);
        setIsLiked(false);
      } else {
        await likePost.mutateAsync(post.id);
        setIsLiked(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update like');
    }
  };

  const handleCardClick = () => {
    navigate({ to: '/post/$postId', params: { postId: post.id.toString() } });
  };

  const avatarUrl = authorProfile?.avatar?.getDirectURL();
  const initials = authorProfile?.displayName
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

  const mediaUrl = post.media?.__kind__ === 'image' 
    ? post.media.image.getDirectURL() 
    : post.media?.__kind__ === 'video' 
    ? post.media.video.getDirectURL() 
    : null;

  return (
    <Card className="hover:bg-accent/5 transition-colors cursor-pointer" onClick={handleCardClick}>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={authorProfile?.displayName} />
            ) : (
              <AvatarFallback>{initials || 'U'}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{authorProfile?.displayName || 'Unknown'}</span>
              <span className="text-sm text-muted-foreground">@{authorProfile?.username || 'unknown'}</span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{formatTimestamp(post.timestamp)}</span>
            </div>
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            
            {mediaUrl && (
              <div className="rounded-lg overflow-hidden border mt-3">
                {post.media?.__kind__ === 'image' ? (
                  <img src={mediaUrl} alt="Post media" className="w-full max-h-96 object-cover" />
                ) : post.media?.__kind__ === 'video' ? (
                  <video src={mediaUrl} controls className="w-full max-h-96" />
                ) : null}
              </div>
            )}

            <div className="flex items-center gap-6 pt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 gap-2 px-2 ${isLiked ? 'text-chart-1' : 'text-muted-foreground hover:text-chart-1'}`}
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{Number(post.likes)}</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-muted-foreground hover:text-chart-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">0</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 text-muted-foreground hover:text-chart-3">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-chart-4">
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
