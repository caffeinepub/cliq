import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Copy, Mail, MoreHorizontal, Twitter } from "lucide-react";
import { SiGmail, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

const MOCK_MUTUALS = [
  {
    id: "1",
    displayName: "Chioma Okafor",
    username: "chi_okafor",
    avatar: null,
  },
  { id: "2", displayName: "Emeka Nwosu", username: "emeka_n", avatar: null },
  { id: "3", displayName: "Fatima Aliyu", username: "fati_a", avatar: null },
  { id: "4", displayName: "Tunde Adeyemi", username: "tunde_a", avatar: null },
  { id: "5", displayName: "Ngozi Eze", username: "ngozi_e", avatar: null },
];

interface ShareModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  postId: string;
}

export function ShareModal({ open, onOpenChange, postId }: ShareModalProps) {
  const postUrl = `${window.location.origin}/post/${postId}`;

  const handleSendToDMs = (name: string) => {
    toast.success(`Sent to ${name}'s DMs!`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      toast.success("Link copied!");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const handleGmail = () => {
    window.open(
      `https://mail.google.com/mail/?view=cm&body=${encodeURIComponent(postUrl)}`,
      "_blank",
    );
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`, "_blank");
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`,
      "_blank",
    );
  };

  const handleMore = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          url: postUrl,
          title: "Check out this CLIQ post",
        });
      } catch {
        // user cancelled
      }
    } else {
      toast.info("Copy the link to share elsewhere");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm" data-ocid="share.dialog">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>

        {/* Mutuals section */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Send to Mutuals
          </p>
          <div className="space-y-2">
            {MOCK_MUTUALS.map((m, i) => {
              const initials = m.displayName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3"
                  data-ocid={`share.mutual.item.${i + 1}`}
                >
                  <Avatar className="h-9 w-9 border-2 border-border">
                    <AvatarFallback className="text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {m.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{m.username}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-full text-xs shrink-0 h-8"
                    style={{ backgroundColor: "#2C8A7A" }}
                    onClick={() => handleSendToDMs(m.displayName)}
                    data-ocid={`share.mutual.button.${i + 1}`}
                  >
                    Send
                  </Button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-[#2C8A7A] hover:underline"
            data-ocid="share.view_all_mutuals.link"
          >
            View all mutuals →
          </button>
        </div>

        <Separator />

        {/* Share via section */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Share via
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              data-ocid="share.copy_link.button"
              className="flex items-center gap-2.5 rounded-xl border-2 border-border px-3 py-2.5 text-sm font-semibold hover:bg-accent/10 transition-colors"
            >
              <Copy className="h-4 w-4 shrink-0" />
              Copy link
            </button>
            <button
              type="button"
              onClick={handleGmail}
              data-ocid="share.gmail.button"
              className="flex items-center gap-2.5 rounded-xl border-2 border-border px-3 py-2.5 text-sm font-semibold hover:bg-accent/10 transition-colors"
            >
              <SiGmail className="h-4 w-4 shrink-0 text-red-500" />
              Gmail
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              data-ocid="share.whatsapp.button"
              className="flex items-center gap-2.5 rounded-xl border-2 border-border px-3 py-2.5 text-sm font-semibold hover:bg-accent/10 transition-colors"
            >
              <SiWhatsapp className="h-4 w-4 shrink-0 text-green-500" />
              WhatsApp
            </button>
            <button
              type="button"
              onClick={handleTwitter}
              data-ocid="share.twitter.button"
              className="flex items-center gap-2.5 rounded-xl border-2 border-border px-3 py-2.5 text-sm font-semibold hover:bg-accent/10 transition-colors"
            >
              <Twitter className="h-4 w-4 shrink-0" />
              Twitter / X
            </button>
            <button
              type="button"
              onClick={handleMore}
              data-ocid="share.more.button"
              className="col-span-2 flex items-center justify-center gap-2.5 rounded-xl border-2 border-border px-3 py-2.5 text-sm font-semibold hover:bg-accent/10 transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 shrink-0" />
              More
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
