import { useGetAllUserProfiles } from '../../../hooks/useAdminQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Users } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function UsersPanel() {
  const { data: profiles, isLoading, isError } = useGetAllUserProfiles();

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
          <p className="text-destructive">Failed to load user profiles</p>
        </CardContent>
      </Card>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">No user profiles found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profiles</CardTitle>
        <CardDescription>Total users: {profiles.length}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-4">
            {profiles.map((profile, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                <Avatar className="h-12 w-12">
                  {profile.avatar && (
                    <AvatarImage src={profile.avatar.getDirectURL()} alt={profile.displayName} />
                  )}
                  <AvatarFallback>{profile.displayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{profile.displayName}</p>
                  <p className="text-sm text-muted-foreground">@{profile.username}</p>
                  <p className="text-sm text-muted-foreground">{profile.university}</p>
                  {profile.bio && <p className="mt-1 text-sm">{profile.bio}</p>}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
