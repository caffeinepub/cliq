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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { getMockUser } from "../hooks/useMockAuth";
import { getUniversityAcronym } from "../lib/universityAcronyms";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const user = getMockUser();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Toggle states
  const [twoFA, setTwoFA] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [postLikes, setPostLikes] = useState(true);
  const [comments, setComments] = useState(true);
  const [mentions, setMentions] = useState(true);
  const [dms, setDms] = useState(true);
  const [communityUpdates, setCommunityUpdates] = useState(false);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [hideOnline, setHideOnline] = useState(false);
  const [allowTagging, setAllowTagging] = useState(true);

  const initials = (user?.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const uniAcronym = user?.university
    ? getUniversityAcronym(user.university)
    : "N/A";

  function SectionHeader({ title }: { title: string }) {
    return (
      <p className="text-[11px] font-semibold tracking-widest text-[#E8432D] uppercase px-4 mb-1 mt-6">
        {title}
      </p>
    );
  }

  function TappableRow({
    label,
    subtitle,
    value,
    isLast,
    danger,
    onClick,
    ocid,
  }: {
    label: string;
    subtitle?: string;
    value?: string;
    isLast?: boolean;
    danger?: boolean;
    onClick?: () => void;
    ocid?: string;
  }) {
    return (
      <button
        type="button"
        className={`flex items-center justify-between px-4 min-h-[44px] py-2 w-full bg-background hover:bg-muted/50 cursor-pointer transition-colors text-left ${
          !isLast ? "border-b border-[#F0F0F0] dark:border-zinc-800" : ""
        }`}
        onClick={onClick || (() => toast.info("Coming soon"))}
        data-ocid={ocid}
      >
        <div className="flex flex-col justify-center">
          <span
            className={`text-sm font-medium ${
              danger ? "text-red-500" : "text-foreground"
            }`}
          >
            {label}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {value && (
            <span className="text-sm text-muted-foreground">{value}</span>
          )}
          {!value && (
            <ChevronRight
              className={`h-4 w-4 ${
                danger ? "text-red-400" : "text-muted-foreground"
              }`}
            />
          )}
        </div>
      </button>
    );
  }

  function InfoRow({
    label,
    value,
    isLast,
  }: {
    label: string;
    value: string;
    isLast?: boolean;
  }) {
    return (
      <div
        className={`flex items-center justify-between px-4 min-h-[44px] py-2 bg-background ${
          !isLast ? "border-b border-[#F0F0F0] dark:border-zinc-800" : ""
        }`}
      >
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
    );
  }

  function ToggleRow({
    label,
    subtitle,
    checked,
    onChange,
    isLast,
    ocid,
  }: {
    label: string;
    subtitle?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    isLast?: boolean;
    ocid?: string;
  }) {
    return (
      <div
        className={`flex items-center justify-between px-4 min-h-[44px] py-2 bg-background ${
          !isLast ? "border-b border-[#F0F0F0] dark:border-zinc-800" : ""
        }`}
      >
        <div className="flex flex-col justify-center mr-3">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {subtitle && (
            <span className="text-xs text-muted-foreground mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onChange}
          data-ocid={ocid}
          className="data-[state=checked]:bg-[#E8432D] flex-shrink-0"
        />
      </div>
    );
  }

  function SectionBlock({ children }: { children: React.ReactNode }) {
    return (
      <div className="bg-white dark:bg-zinc-950 rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-none">
        {children}
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Page header */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-[#E8432D]">
            <AvatarFallback
              className="font-bold text-lg text-white"
              style={{ backgroundColor: "#E8432D" }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-bold text-foreground">
              {user?.displayName || "User"}
            </p>
            <p className="text-sm text-muted-foreground">
              @{user?.username || "username"} · {uniAcronym}
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-foreground mt-4">
          Settings
        </h1>
      </div>

      {/* ACCOUNT */}
      <SectionHeader title="Account" />
      <SectionBlock>
        <TappableRow
          label="Profile Photo"
          subtitle="Update your profile picture"
        />
        <TappableRow
          label="Display Name"
          subtitle={user?.displayName || "Not set"}
          ocid="settings.displayname.button"
        />
        <TappableRow
          label="Username"
          subtitle={`@${user?.username || "username"}`}
          ocid="settings.username.button"
        />
        <TappableRow
          label="Email Address"
          subtitle={user?.email || "Manage your email"}
          ocid="settings.email.button"
        />
        <TappableRow
          label="University"
          subtitle={user?.university || "Not set"}
          isLast
          ocid="settings.university.button"
        />
      </SectionBlock>

      {/* SECURITY */}
      <SectionHeader title="Security" />
      <SectionBlock>
        <TappableRow
          label="Change Password"
          ocid="settings.change_password.button"
        />
        <ToggleRow
          label="Two-Factor Authentication"
          subtitle="Add extra security to your account"
          checked={twoFA}
          onChange={setTwoFA}
          ocid="settings.two_fa.switch"
        />
        <TappableRow
          label="Login History"
          subtitle="See recent sign-in activity"
          ocid="settings.login_history.button"
        />
        <TappableRow
          label="Active Sessions"
          isLast
          ocid="settings.active_sessions.button"
        />
      </SectionBlock>

      {/* NOTIFICATIONS */}
      <SectionHeader title="Notifications" />
      <SectionBlock>
        <ToggleRow
          label="Push Notifications"
          subtitle="Likes, comments, follows"
          checked={pushNotifs}
          onChange={setPushNotifs}
          ocid="settings.push_notifs.switch"
        />
        <ToggleRow
          label="Email Notifications"
          subtitle="Weekly digest and alerts"
          checked={emailNotifs}
          onChange={setEmailNotifs}
          ocid="settings.email_notifs.switch"
        />
        <ToggleRow
          label="New Followers"
          checked={newFollowers}
          onChange={setNewFollowers}
          ocid="settings.new_followers.switch"
        />
        <ToggleRow
          label="Post Likes"
          checked={postLikes}
          onChange={setPostLikes}
          ocid="settings.post_likes.switch"
        />
        <ToggleRow
          label="Comments on your posts"
          checked={comments}
          onChange={setComments}
          ocid="settings.comments.switch"
        />
        <ToggleRow
          label="Mentions"
          checked={mentions}
          onChange={setMentions}
          ocid="settings.mentions.switch"
        />
        <ToggleRow
          label="Direct Messages"
          checked={dms}
          onChange={setDms}
          ocid="settings.dms.switch"
        />
        <ToggleRow
          label="Community Updates"
          checked={communityUpdates}
          onChange={setCommunityUpdates}
          isLast
          ocid="settings.community_updates.switch"
        />
      </SectionBlock>

      {/* APPEARANCE */}
      <SectionHeader title="Appearance" />
      <SectionBlock>
        <ToggleRow
          label="Dark Mode"
          checked={theme === "dark"}
          onChange={(v) => setTheme(v ? "dark" : "light")}
          ocid="settings.darkmode.switch"
        />
        <TappableRow
          label="Font Size"
          subtitle="Medium"
          ocid="settings.font_size.button"
        />
        <TappableRow
          label="Language"
          subtitle="English"
          isLast
          ocid="settings.language.button"
        />
      </SectionBlock>

      {/* PRIVACY */}
      <SectionHeader title="Privacy" />
      <SectionBlock>
        <ToggleRow
          label="Private Account"
          subtitle="Only followers can see your posts"
          checked={privateAccount}
          onChange={setPrivateAccount}
          ocid="settings.private_account.switch"
        />
        <ToggleRow
          label="Hide Online Status"
          checked={hideOnline}
          onChange={setHideOnline}
          ocid="settings.hide_online.switch"
        />
        <TappableRow
          label="Blocked Users"
          subtitle="0 blocked"
          ocid="settings.blocked_users.button"
        />
        <TappableRow
          label="Muted Users"
          subtitle="0 muted"
          ocid="settings.muted_users.button"
        />
        <ToggleRow
          label="Allow Tagging"
          checked={allowTagging}
          onChange={setAllowTagging}
          isLast
          ocid="settings.allow_tagging.switch"
        />
      </SectionBlock>

      {/* ACADEMIC */}
      <SectionHeader title="Academic (Private)" />
      <SectionBlock>
        <TappableRow
          label="Department"
          subtitle="e.g. Computer Science"
          ocid="settings.department.button"
        />
        <TappableRow
          label="Year of Study"
          subtitle="e.g. 300 Level"
          ocid="settings.year_of_study.button"
        />
        <TappableRow
          label="Student ID"
          subtitle="Used for verification only"
          isLast
          ocid="settings.student_id.button"
        />
      </SectionBlock>
      <p className="text-xs text-muted-foreground italic px-4 mt-2">
        Academic info is never shown publicly
      </p>

      {/* DATA & STORAGE */}
      <SectionHeader title="Data &amp; Storage" />
      <SectionBlock>
        <InfoRow label="Storage Used" value="24.3 MB" />
        <TappableRow
          label="Clear Cache"
          onClick={() =>
            toast.success("Cache cleared successfully! (0.0 MB freed)")
          }
          ocid="settings.clear_cache.button"
        />
        <TappableRow
          label="Download My Data"
          ocid="settings.download_data.button"
        />
        <TappableRow
          label="Manage Media Auto-Download"
          ocid="settings.media_download.button"
        />
        <TappableRow
          label="Delete Account"
          danger
          isLast
          onClick={() => setDeleteOpen(true)}
          ocid="settings.delete_account.button"
        />
      </SectionBlock>

      {/* ABOUT */}
      <SectionHeader title="About" />
      <SectionBlock>
        <InfoRow label="App Version" value="v2.0.0 (Build 40)" />
        <TappableRow label="Terms of Service" ocid="settings.terms.button" />
        <TappableRow
          label="Privacy Policy"
          ocid="settings.privacy_policy.button"
        />
        <TappableRow
          label="Community Guidelines"
          ocid="settings.guidelines.button"
        />
        <TappableRow label="Contact Support" ocid="settings.support.button" />
        <TappableRow label="Rate CLIQ" isLast ocid="settings.rate.button" />
      </SectionBlock>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground py-6 px-4">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="text-[#E8432D] font-semibold"
        >
          caffeine.ai
        </a>
      </p>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent data-ocid="settings.delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone. All your posts,
              messages, and data will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="settings.delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => {
                setDeleteOpen(false);
                toast.success("Account deletion requested.");
              }}
              data-ocid="settings.delete.confirm_button"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
