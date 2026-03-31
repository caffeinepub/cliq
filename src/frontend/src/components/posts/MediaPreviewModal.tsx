import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface MediaPreviewModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mediaFile: File | null;
  mediaType: "image" | "video" | null;
  onConfirm: (file: File) => void;
}

const FILTERS = ["Normal", "Warm", "Cool", "Vivid", "Mono"] as const;

const FILTER_CSS: Record<string, string> = {
  Normal: "",
  Warm: "sepia(0.3) saturate(1.3) brightness(1.05)",
  Cool: "hue-rotate(20deg) saturate(1.1) brightness(1.02)",
  Vivid: "saturate(1.8) contrast(1.1)",
  Mono: "grayscale(1)",
};

export function MediaPreviewModal({
  open,
  onOpenChange,
  mediaFile,
  mediaType,
  onConfirm,
}: MediaPreviewModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("Normal");

  if (!mediaFile) return null;

  const previewUrl = URL.createObjectURL(mediaFile);
  const filterCss = FILTER_CSS[selectedFilter] ?? "";

  const handleConfirm = () => {
    onConfirm(mediaFile);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-0">
          <DialogTitle className="text-base font-semibold">
            Preview Media
          </DialogTitle>
        </DialogHeader>

        {/* Media preview */}
        <div
          className="relative overflow-hidden bg-black"
          style={{ maxHeight: 320 }}
        >
          {mediaType === "image" ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-80 object-cover"
              style={{ filter: filterCss }}
            />
          ) : (
            <video
              src={previewUrl}
              controls
              playsInline
              className="w-full max-h-80"
            >
              <track kind="captions" />
            </video>
          )}
        </div>

        {/* Filter strip */}
        {mediaType === "image" && (
          <div className="px-4 py-3 border-b border-[#F0F0F0]">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Filter
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFilter(f)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    selectedFilter === f
                      ? "bg-[#E8432D] text-white border-[#E8432D]"
                      : "bg-white text-[#212529] border-[#F0F0F0] hover:border-[#E8432D]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Edit tools */}
        {mediaType === "image" && (
          <div className="flex gap-2 px-4 py-3 border-b border-[#F0F0F0]">
            {[
              { emoji: "✂️", label: "Crop", msg: "Crop tool coming soon" },
              { emoji: "🔤", label: "Text", msg: "Text overlay coming soon" },
              { emoji: "✏️", label: "Draw", msg: "Draw tool coming soon" },
            ].map((tool) => (
              <button
                key={tool.label}
                type="button"
                onClick={() => toast.info(tool.msg)}
                className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border border-[#EEEEEE] hover:border-[#E8432D] hover:bg-primary/5 transition-all"
              >
                <span className="text-xl">{tool.emoji}</span>
                <span className="text-[11px] font-medium text-[#6C757D]">
                  {tool.label}
                </span>
              </button>
            ))}
          </div>
        )}

        <DialogFooter className="px-4 py-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 rounded-full bg-[#E8432D] hover:bg-[#E8432D]/90 text-white font-semibold"
            onClick={handleConfirm}
          >
            Add to Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
