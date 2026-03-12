import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../../backend";
import type { ExternalBlob } from "../../backend";
import { UNIVERSITIES } from "../../constants/universities";
import { useSaveCallerUserProfile } from "../../hooks/useQueries";
import { AvatarUploader } from "./AvatarUploader";

export function ProfileSetupModal() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [university, setUniversity] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState<ExternalBlob | undefined>(undefined);

  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !displayName.trim() || !university) {
      toast.error("Please fill in all required fields");
      return;
    }

    const profile: UserProfile = {
      username: username.trim(),
      displayName: displayName.trim(),
      university,
      bio: bio.trim(),
      avatar,
    };

    try {
      await saveProfile.mutateAsync(profile);
      toast.success("Profile created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile");
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to CLIQ!</DialogTitle>
          <DialogDescription>
            Set up your profile to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AvatarUploader value={avatar} onChange={setAvatar} />

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="@johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              placeholder="John Doe"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="university">University *</Label>
            <Select value={university} onValueChange={setUniversity} required>
              <SelectTrigger id="university">
                <SelectValue placeholder="Select your university" />
              </SelectTrigger>
              <SelectContent>
                {UNIVERSITIES.map((uni) => (
                  <SelectItem key={uni} value={uni}>
                    {uni}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              "Create Profile"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
