import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "lucide-react";
import type { UserProfile } from "../../backend";

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  postsCount?: number;
  followingCount?: number;
  followersCount?: number;
}

function getUniversityAcronym(university: string): string {
  return university
    .split(" ")
    .filter((w) => w.length > 2 && !/^(of|the|and|in|for|at)$/i.test(w))
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 6);
}

type BioPart =
  | { type: "text"; text: string }
  | { type: "link"; url: string; display: string };

function parseBio(bio: string): BioPart[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const parts: BioPart[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  // biome-ignore lint/suspicious/noAssignInExpressions: intentional regex loop
  while ((match = urlRegex.exec(bio)) !== null) {
    if (match.index > last)
      parts.push({ type: "text", text: bio.slice(last, match.index) });
    const url = match[0];
    const clean = url.replace(/^https?:\/\//, "");
    const display = clean.length > 30 ? `${clean.slice(0, 30)}...` : clean;
    parts.push({ type: "link", url, display });
    last = match.index + url.length;
  }
  if (last < bio.length) parts.push({ type: "text", text: bio.slice(last) });
  return parts;
}

function renderBioWithLinks(bio: string) {
  const parts = parseBio(bio);
  return parts.map((part) => {
    if (part.type === "text") {
      return <span key={part.text.slice(0, 20)}>{part.text}</span>;
    }
    return (
      <a
        key={part.url}
        href={part.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#E8432D] hover:underline inline-flex items-center gap-0.5 break-all"
        onClick={(e) => e.stopPropagation()}
      >
        <Link size={12} className="flex-shrink-0" />
        {part.display}
      </a>
    );
  });
}

export function ProfileHeader({
  profile,
  isOwnProfile,
  postsCount = 0,
  followingCount = 0,
  followersCount = 0,
}: ProfileHeaderProps) {
  const avatarUrl = profile.avatar?.getDirectURL();
  const initials = profile.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const uniAcronym = getUniversityAcronym(profile.university);

  return (
    <div className="p-4 max-w-full overflow-hidden">
      <div className="flex items-start gap-3 max-w-full overflow-hidden">
        <Avatar className="h-14 w-14 flex-shrink-0 border border-[#F0F0F0]">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={profile.displayName} />
          ) : (
            <AvatarFallback className="bg-[#E8432D] text-white text-base font-bold">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0 overflow-hidden">
          <h1 className="text-base font-semibold text-[#212529] truncate">
            {profile.displayName}
            {isOwnProfile && (
              <span className="ml-2 text-[10px] font-normal bg-[#FFF5F2] text-[#E8432D] border border-[#FFE0D6] px-1.5 py-0.5 rounded-full align-middle">
                You
              </span>
            )}
          </h1>
          <p className="text-[13px] text-[#6C757D] truncate">
            @{profile.username}
          </p>

          <div className="flex items-center gap-1 mt-1 text-[12px] text-[#212529] flex-wrap">
            <button type="button" className="hover:underline">
              <span className="font-semibold">{postsCount}</span>
              <span className="text-[#6C757D] ml-0.5">Posts</span>
            </button>
            <span className="text-[#ADB5BD]">·</span>
            <button type="button" className="hover:underline">
              <span className="font-semibold">{followingCount}</span>
              <span className="text-[#6C757D] ml-0.5">Following</span>
            </button>
            <span className="text-[#ADB5BD]">·</span>
            <button type="button" className="hover:underline">
              <span className="font-semibold">{followersCount}</span>
              <span className="text-[#6C757D] ml-0.5">Followers</span>
            </button>
          </div>

          {profile.university && (
            <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-[#E8432D] text-white text-[10px] font-medium">
              🏛️ {uniAcronym}
            </span>
          )}
        </div>
      </div>

      {profile.bio && (
        <p className="mt-3 text-sm text-[#212529] leading-relaxed break-words whitespace-pre-wrap max-w-full overflow-hidden">
          {renderBioWithLinks(profile.bio)}
        </p>
      )}
    </div>
  );
}
