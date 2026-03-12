import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  GraduationCap,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import {
  useFollowUser,
  useIsFollowing,
  useSearchUsers,
} from "../hooks/useQueries";

export function UserProfilePage() {
  const { username } = useParams({ from: "/profile/$username" });
  const navigate = useNavigate();
  const { data: users, isLoading } = useSearchUsers(username, null);
  const followUser = useFollowUser();

  const user = users?.find((u) => u.username === username);
  const avatarUrl = user?.avatar?.getDirectURL();
  const initials = user?.displayName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleFollow = async () => {
    if (!user) return;
    try {
      await followUser.mutateAsync(user.username);
      toast.success(`Following ${user.displayName}!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to follow user");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/" })}
            data-ocid="profile.back_button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-black">Profile</h1>
        </div>
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="profile.empty_state"
        >
          <p className="font-semibold">User not found</p>
          <p className="text-sm">@{username} doesn't exist on CLIQ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="sticky top-0 bg-card border-b-2 p-4 z-10 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
          data-ocid="profile.back_button"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-black text-lg">{user.displayName}</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <Avatar className="h-20 w-20 border-2 border-primary">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={user.displayName} />
            ) : (
              <AvatarFallback className="font-black text-2xl bg-primary text-primary-foreground">
                {initials || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-2"
              onClick={handleFollow}
              data-ocid="profile.follow.primary_button"
            >
              <UserPlus className="h-4 w-4" /> Follow
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              data-ocid="profile.message.secondary_button"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-black">{user.displayName}</h2>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>

        {user.bio && <p className="text-sm">{user.bio}</p>}

        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-primary" />
          <Badge variant="secondary" className="text-xs font-semibold">
            {user.university}
          </Badge>
        </div>

        <Card className="border-2" data-ocid="profile.card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Follow {user.displayName} to see their posts in your feed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
