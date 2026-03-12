import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2, LogOut, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { NIGERIAN_UNIVERSITIES } from "../constants/universities";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "../hooks/useQueries";

export function SettingsPage() {
  const { clear } = useInternetIdentity();
  const { theme, setTheme } = useTheme();
  const { data: profile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [university, setUniversity] = useState(profile?.university || "");
  const [avatarUrl, setAvatarUrl] = useState(
    profile?.avatar?.getDirectURL() || "",
  );
  const [avatarBlob, setAvatarBlob] = useState<ExternalBlob | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const initials = (profile?.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const blob = ExternalBlob.fromBytes(bytes);
    setAvatarBlob(blob);
    setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!displayName.trim() || !username.trim() || !university) {
      toast.error("Display name, username, and university are required");
      return;
    }
    setIsSaving(true);
    try {
      await saveProfile.mutateAsync({
        displayName,
        username,
        bio,
        university,
        avatar: avatarBlob || profile?.avatar,
      });
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-10">
      <h1 className="text-2xl font-black tracking-tight">Settings</h1>

      {/* Profile Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base font-black">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-primary">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} />
                ) : (
                  <AvatarFallback className="font-black text-xl bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-bold">
                  <Camera className="h-4 w-4" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  data-ocid="settings.upload_button"
                />
              </label>
            </div>
            <div>
              <p className="font-bold">{profile?.displayName}</p>
              <p className="text-sm text-muted-foreground">
                @{profile?.username}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              data-ocid="settings.displayname.input"
            />
          </div>

          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
              data-ocid="settings.username.input"
            />
          </div>

          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself..."
              rows={3}
              data-ocid="settings.bio.textarea"
            />
          </div>

          <div className="space-y-2">
            <Label>University</Label>
            <Select value={university} onValueChange={setUniversity}>
              <SelectTrigger data-ocid="settings.university.select">
                <SelectValue placeholder="Select university" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_UNIVERSITIES.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full rounded-full"
            onClick={handleSave}
            disabled={isSaving}
            data-ocid="settings.save_button"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base font-black">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                Switch between light and dark theme
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              data-ocid="settings.darkmode.switch"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Push Notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive alerts for likes, comments, follows
              </p>
            </div>
            <Switch defaultChecked data-ocid="settings.notifications.switch" />
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-base font-black">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full rounded-full justify-start gap-3"
            onClick={() => setLogoutOpen(true)}
            data-ocid="settings.logout.open_modal_button"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent data-ocid="settings.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out of your CLIQ account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="settings.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => clear()}
              data-ocid="settings.confirm_button"
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground pb-4">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="text-primary font-semibold"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
