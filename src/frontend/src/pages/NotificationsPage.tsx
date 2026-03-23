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
      className={`cursor-pointer hover:bg-accent/5 transition-colors ${!notification.read ? "border-primary/50" : ""}`}
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

  const MOCK_DIGEST = {
    totalLikes: 147,
    totalComments: 32,
    newFollowers: 8,
    profileViews: 213,
    topPost: {
      content:
        "Exam tips from a 5.0 GPA student 🧵 — 1. Read past questions first — 70% of exams repeat...",
      likes: 445,
    },
    trending: ["#UNILAG", "#NaijaStudent", "#CampusLife"],
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between border-b pb-4">
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
        className="border border-[#E5E5E5] cursor-pointer hover:shadow-md transition"
        onClick={() => setDigestOpen(true)}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-xl shrink-0">
            📊
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Your Weekly Digest</p>
            <p className="text-xs text-muted-foreground">
              See your top posts and stats this week
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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

      {/* Weekly Digest Sheet */}
      <Sheet open={digestOpen} onOpenChange={setDigestOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[85vh] overflow-y-auto"
        >
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg font-black">
              📊 Your Weekly Digest
            </SheetTitle>
          </SheetHeader>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              {
                label: "Total Likes",
                value: MOCK_DIGEST.totalLikes,
                icon: "🔥",
              },
              {
                label: "Total Comments",
                value: MOCK_DIGEST.totalComments,
                icon: "💬",
              },
              {
                label: "New Followers",
                value: MOCK_DIGEST.newFollowers,
                icon: "👥",
              },
              {
                label: "Profile Views",
                value: MOCK_DIGEST.profileViews,
                icon: "👁️",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-[#F8F9FA] rounded-xl p-4 text-center border border-[#E5E5E5]"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-black text-[#212529]">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Top Post */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Your Top Post This Week
            </p>
            <div className="border border-[#E5E5E5] rounded-xl p-4">
              <p className="text-sm leading-relaxed text-[#212529] line-clamp-3">
                {MOCK_DIGEST.topPost.content}
              </p>
              <div className="flex items-center gap-1 mt-3">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold text-[#FF6B35]">
                  {MOCK_DIGEST.topPost.likes} likes
                </span>
              </div>
            </div>
          </div>

          {/* Trending */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Trending on Campus This Week
            </p>
            <div className="flex flex-wrap gap-2">
              {MOCK_DIGEST.trending.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary font-semibold text-sm px-3 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

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
