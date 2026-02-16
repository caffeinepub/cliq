import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';
import type { UserProfile } from '../../backend';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
}

export function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const avatarUrl = profile.avatar?.getDirectURL();
  const initials = profile.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20 border-2 border-border">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={profile.displayName} />
          ) : (
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 space-y-1">
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
        </div>
      </div>

      {profile.bio && <p className="text-sm">{profile.bio}</p>}

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{profile.university}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>Joined {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="flex gap-4 text-sm">
        <button className="hover:underline">
          <span className="font-semibold">0</span> <span className="text-muted-foreground">Following</span>
        </button>
        <button className="hover:underline">
          <span className="font-semibold">0</span> <span className="text-muted-foreground">Followers</span>
        </button>
      </div>

      {isOwnProfile && (
        <Badge variant="secondary" className="w-fit">
          Your Profile
        </Badge>
      )}
    </div>
  );
}
