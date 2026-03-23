import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  Heart,
  Loader2,
  MessageCircle,
  Settings,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import type { Notification } from "../backend";
import { WeeklyDigestSlides } from "../components/notifications/WeeklyDigestSlides";
import { useGetNotifications } from "../hooks/useNotifications";
import { useGetUserProfile } from "../hooks/useQueries";

function NotificationItem({ notification }: { notification: Notification }) {
  const navigate = useNavigate();
  const { data: relatedUser } = useGetUserProfile(
    notification.relatedUser?.toString(),
  );
  const avatarUrl = relatedUser?.avatar?.getDirectURL();
  const initials = relatedUser?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1000000)));
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-5 w-5 text-chart-1" />;
      case "comment":
        return <MessageCircle className="h-5 w-5 text-chart-2" />;
      case "follow":
        return <UserPlus className="h-5 w-5 text-chart-3" />;
      case "message":
        return <MessageCircle className="h-5 w-5 text-chart-4" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getText = () => {
    const name = relatedUser?.displayName || "Someone";
    switch (notification.notificationType) {
      case "like":
        return `${name} liked your post`;
      case "comment":
        return `${name} commented on your post`;
      case "follow":
        return `${name} started following you`;
      case "message":
        return `${name} sent you a message`;
      default:
        return "New notification";
    }
  };

  const handleClick = () => {
    if (notification.notificationType === "message" && notification.relatedId) {
      navigate({
        to: "/messages/$conversationId",
        params: { conversationId: notification.relatedId.toString() },
      });
    } else if (
      (notification.notificationType === "like" ||
        notification.notificationType === "comment") &&
      notification.relatedId
    ) {
      navigate({
        to: "/post/$postId",
        params: { postId: notification.relatedId.toString() },
      });
    }
  };

  return (
    <Card
      className={`cursor-pointer hover:bg-accent/5 transition-colors rounded-2xl ${
        !notification.read ? "border-primary/50" : ""
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">{getIcon(notification.notificationType)}</div>
          <Avatar className="h-10 w-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={relatedUser?.displayName} />
            ) : (
              <AvatarFallback>{initials || "U"}</AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">{getText()}</p>
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

const NOTIF_PREFS = [
  { key: "likes", label: "Likes on my posts", default: true },
  { key: "comments", label: "Comments on my posts", default: true },
  { key: "follows", label: "New followers", default: true },
  { key: "mentions", label: "Mentions (@me)", default: true },
  { key: "messages", label: "Direct messages", default: true },
  { key: "digest", label: "Weekly digest", default: true },
  { key: "push", label: "Push notifications", default: false },
];

export function NotificationsPage() {
  const { data: notifications, isLoading } = useGetNotifications();
  const [digestOpen, setDigestOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_PREFS.map((p) => [p.key, p.default])),
  );

  return (
    <div className="space-y-4 p-4">
      {/* Page header */}
      <div className="flex items-center justify-between border-b pb-4 rounded-none">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          type="button"
          onClick={() => setPrefsOpen(true)}
          className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Notification preferences"
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Weekly Digest card */}
      <Card
        className="border border-[#FF6B35]/30 cursor-pointer hover:shadow-md transition rounded-2xl bg-gradient-to-r from-[#FF6B35]/5 to-transparent"
        onClick={() => setDigestOpen(true)}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-[#FF6B35] flex items-center justify-center text-xl shrink-0 shadow-sm">
            📊
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Your Weekly Digest</p>
            <p className="text-xs text-muted-foreground">
              Top posts, new followers & your best content
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-[#FF6B35] font-semibold">
              5 slides
            </span>
            <ChevronRight className="h-4 w-4 text-[#FF6B35]" />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id.toString()}
              notification={notification}
            />
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

      {/* Weekly Digest Slides overlay */}
      <WeeklyDigestSlides
        open={digestOpen}
        onClose={() => setDigestOpen(false)}
      />

      {/* Notification Preferences Sheet */}
      <Sheet open={prefsOpen} onOpenChange={setPrefsOpen}>
        <SheetContent side="right">
          <SheetHeader className="mb-6">
            <SheetTitle className="font-black">
              Notification Settings
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4">
            {NOTIF_PREFS.map((pref) => (
              <div
                key={pref.key}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-sm font-medium">{pref.label}</p>
                  {pref.key === "push" && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enable in browser settings
                    </p>
                  )}
                </div>
                <Switch
                  checked={prefs[pref.key] ?? pref.default}
                  onCheckedChange={(v) =>
                    setPrefs((prev) => ({ ...prev, [pref.key]: v }))
                  }
                />
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
