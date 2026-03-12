import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export function ProfilePage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();

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
      </Tabs>
    </div>
  );
}
