import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  BarChart2,
  Calendar,
  Camera,
  Eye,
  Image,
  Plus,
  Timer,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PostComposer } from "./PostComposer";

interface DropdownItem {
  icon: React.ReactNode;
  label: string;
  action: () => void;
}

export function FeedComposer() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const dropdownItems: DropdownItem[] = [
    {
      icon: <Camera className="h-5 w-5" />,
      label: "Camera",
      action: () => {
        setDropdownOpen(false);
        cameraInputRef.current?.click();
      },
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Video",
      action: () => {
        setDropdownOpen(false);
        videoInputRef.current?.click();
      },
    },
    {
      icon: <Image className="h-5 w-5" />,
      label: "Gallery",
      action: () => {
        setDropdownOpen(false);
        galleryInputRef.current?.click();
      },
    },
    {
      icon: <BarChart2 className="h-5 w-5" />,
      label: "Poll",
      action: () => {
        setDropdownOpen(false);
        toast("Poll coming soon");
      },
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule",
      action: () => {
        setDropdownOpen(false);
        toast("Schedule coming soon");
      },
    },
    {
      icon: <Timer className="h-5 w-5" />,
      label: "Auto-delete",
      action: () => {
        setDropdownOpen(false);
        toast("Auto-delete coming soon");
      },
    },
  ];

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={() => setComposerOpen(true)}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="hidden"
        onChange={() => setComposerOpen(true)}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={() => setComposerOpen(true)}
      />

      <div className="flex items-center gap-3 border-b-2 border-border bg-background px-4 py-3">
        {/* Left: + button with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            data-ocid="feed_composer.add_button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-bold transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Add content"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
          >
            <Plus className="h-5 w-5" strokeWidth={3} />
          </button>

          {/* Animated dropdown */}
          <div
            data-ocid="feed_composer.add_dropdown_menu"
            role="menu"
            aria-label="Content type menu"
            className={[
              "absolute left-0 top-[calc(100%+8px)] z-50 min-w-[180px] overflow-hidden rounded-2xl border-2 border-border bg-background shadow-bold",
              "origin-top-left transition-all duration-200 ease-out",
              dropdownOpen
                ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                : "pointer-events-none -translate-y-2 scale-95 opacity-0",
            ].join(" ")}
          >
            {dropdownItems.map((item) => (
              <button
                type="button"
                key={item.label}
                role="menuitem"
                onClick={item.action}
                className="flex w-full items-center gap-3 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                style={{ minHeight: "44px" }}
              >
                <span className="text-primary">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: placeholder pill */}
        <button
          type="button"
          data-ocid="feed_composer.placeholder_input"
          onClick={() => setComposerOpen(true)}
          className="flex flex-1 cursor-pointer items-center rounded-full bg-muted px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{ minHeight: "40px" }}
        >
          What&apos;s happening on campus?
        </button>

        {/* Right: anonymous toggle */}
        <button
          type="button"
          data-ocid="feed_composer.anonymous_toggle"
          onClick={() => setAnonymous((v) => !v)}
          aria-label={
            anonymous ? "Disable anonymous mode" : "Enable anonymous mode"
          }
          aria-pressed={anonymous}
          className={[
            "flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            anonymous
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted",
          ].join(" ")}
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>

      {/* Full composer dialog */}
      <Dialog open={composerOpen} onOpenChange={setComposerOpen}>
        <DialogContent className="max-w-lg overflow-hidden rounded-2xl p-0">
          <div className="p-6">
            <PostComposer />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
