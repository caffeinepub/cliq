import { useGetNotifications } from '../hooks/useNotifications';
import { Bell, Loader2, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useGetUserProfile } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import type { Notification } from '../backend';

function NotificationItem({ notification }: { notification: Notification }) {
  const navigate = useNavigate();
  const { data: relatedUser } = useGetUserProfile(notification.relatedUser?.toString());
  
  const avatarUrl = relatedUser?.avatar?.getDirectURL();
  const initials = relatedUser?.displayName
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
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-chart-1" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-chart-2" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-chart-3" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-chart-4" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getNotificationText = () => {
    const userName = relatedUser?.displayName || 'Someone';
    switch (notification.notificationType) {
      case 'like':
        return `${userName} liked your post`;
      case 'comment':
        return `${userName} commented on your post`;
      case 'follow':
        return `${userName} started following you`;
      case 'message':
        return `${userName} sent you a message`;
      default:
        return 'New notification';
    }
  };

  const handleNotificationClick = () => {
    if (notification.notificationType === 'message' && notification.relatedId) {
      navigate({ to: '/messages/$conversationId', params: { conversationId: notification.relatedId.toString() } });
    } else if ((notification.notificationType === 'like' || notification.notificationType === 'comment') && notification.relatedId) {
      navigate({ to: '/post/$postId', params: { postId: notification.relatedId.toString() } });
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:bg-accent/5 transition-colors ${!notification.read ? 'border-primary/50' : ''}`}
      onClick={handleNotificationClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            {getNotificationIcon(notification.notificationType)}
          </div>
          <Avatar className="h-10 w-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={relatedUser?.displayName} />
            ) : (
              <AvatarFallback>{initials || 'U'}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">{getNotificationText()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatTimestamp(notification.timestamp)}
            </p>
          </div>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function NotificationsPage() {
  const { data: notifications, isLoading } = useGetNotifications();

  return (
    <div className="space-y-4 p-4">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id.toString()} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bell className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">No notifications yet</h2>
          <p className="text-muted-foreground">
            When someone likes, comments, or follows you, you'll see it here.
          </p>
        </div>
      )}
    </div>
  );
}
