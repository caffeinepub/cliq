import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Building2, EyeOff, Globe, Plus, Send, Users } from "lucide-react";
import { useState } from "react";
import { PostComposer } from "./PostComposer";

interface FeedComposerProps {
  userAvatarUrl?: string;
  userInitials?: string;
}

export function FeedComposer({
  userAvatarUrl,
  userInitials = "U",
}: FeedComposerProps) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [activeScope, setActiveScope] = useState<
    "following" | "campus" | "globe"
  >("globe");

  return (
    <>
      <div
        data-ocid="feed_composer.card"
        className="mx-4 my-3 rounded-2xl bg-card border border-border overflow-hidden"
      >
        {/* Top row: avatar + placeholder */}
        <div className="flex items-start gap-3 px-4 pt-4 pb-3">
          {/* Avatar */}
          <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground font-semibold text-base">
                {userInitials}
              </span>
            )}
          </div>

          {/* Placeholder */}
          <button
            type="button"
            data-ocid="feed_composer.placeholder_input"
            onClick={() => setComposerOpen(true)}
            className="flex flex-1 items-center text-left text-base text-muted-foreground font-normal pt-3 focus-visible:outline-none"
          >
            {anonymous ? (
              <span className="flex items-center gap-1.5">
                <span>🥷</span>
                <span className="text-primary font-semibold">
                  Anonymous mode on
                </span>
              </span>
            ) : (
              "What\u2019s happening on campus?"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="border-b border-border" />

        {/* Bottom action row */}
        <div className="flex items-center px-3 py-2 gap-2">
          {/* Left cluster */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="feed_composer.add_button"
              onClick={() => setComposerOpen(true)}
              aria-label="Add content"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none"
            >
              <Plus className="h-4 w-4" />
            </button>

            <button
              type="button"
              data-ocid="feed_composer.anonymous_toggle"
              onClick={() => setAnonymous((v) => !v)}
              aria-label={
                anonymous ? "Disable anonymous mode" : "Enable anonymous mode"
              }
              aria-pressed={anonymous}
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none",
                anonymous
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              ].join(" ")}
            >
              <EyeOff className="h-4 w-4" />
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right cluster */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              data-ocid="feed_composer.following_scope"
              onClick={() => setActiveScope("following")}
              aria-label="Post to following"
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none",
                activeScope === "following"
                  ? "bg-background text-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              ].join(" ")}
            >
              <Users className="h-4 w-4" />
            </button>

            <button
              type="button"
              data-ocid="feed_composer.campus_scope"
              onClick={() => setActiveScope("campus")}
              aria-label="Post to campus"
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none",
                activeScope === "campus"
                  ? "bg-background text-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              ].join(" ")}
            >
              <Building2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              data-ocid="feed_composer.globe_scope"
              onClick={() => setActiveScope("globe")}
              aria-label="Post globally"
              className={[
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none",
                activeScope === "globe"
                  ? "bg-background text-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/70",
              ].join(" ")}
            >
              <Globe className="h-4 w-4" />
            </button>

            {/* Send button */}
            <button
              type="button"
              data-ocid="feed_composer.submit_button"
              onClick={() => setComposerOpen(true)}
              aria-label="Create post"
              style={{ backgroundColor: "#e8432d" }}
              className="flex h-9 items-center justify-center rounded-full px-4 text-white gap-1.5 transition-opacity hover:opacity-90 focus-visible:outline-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full composer dialog */}
      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent
          className="max-w-lg overflow-hidden rounded-2xl p-0"
          data-ocid="feed_composer.dialog"
        >
          <div className="p-6">
            <PostComposer isAnonymous={anonymous} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
