import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { boostPost } from "../../lib/boostUtils";

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

interface BoostPostModalProps {
  postId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function BoostPostModal({
  postId,
  open,
  onOpenChange,
}: BoostPostModalProps) {
  const [label, setLabel] = useState<"Sponsored" | "Promoted">("Sponsored");
  const [loading, setLoading] = useState(false);

  const loadPaystack = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Paystack"));
      document.head.appendChild(script);
    });
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      await loadPaystack();
      const handler = window.PaystackPop.setup({
        key: "pk_test_demo",
        email: "user@cliq.app",
        amount: 50000,
        currency: "NGN",
        callback: () => {
          boostPost(postId, label);
          toast.success("Post boosted for 24 hours! 🚀");
          onOpenChange(false);
          setLoading(false);
        },
        onClose: () => {
          setLoading(false);
        },
      });
      handler.openIframe();
    } catch {
      toast.error("Could not load payment. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-ocid="boost_modal.dialog"
        className="max-w-sm rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-black flex items-center gap-2">
            🚀 Boost this post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Price */}
          <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3">
            <span className="font-bold text-sm">Duration</span>
            <span className="font-black text-primary text-lg">₦500 / 24h</span>
          </div>

          {/* Label selector */}
          <div className="space-y-2">
            <Label className="text-sm font-bold">Choose label</Label>
            <RadioGroup
              value={label}
              onValueChange={(v) => setLabel(v as "Sponsored" | "Promoted")}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="Sponsored"
                  id="sponsored"
                  data-ocid="boost_modal.sponsored_radio"
                />
                <Label
                  htmlFor="sponsored"
                  className="font-semibold cursor-pointer"
                >
                  Sponsored
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="Promoted"
                  id="promoted"
                  data-ocid="boost_modal.promoted_radio"
                />
                <Label
                  htmlFor="promoted"
                  className="font-semibold cursor-pointer"
                >
                  Promoted
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* What you get */}
          <div className="space-y-2">
            <Label className="text-sm font-bold">What you get</Label>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span>🚀</span>
                <span>Appears in feeds with {label} badge</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🎯</span>
                <span>Reach more Nigerian students</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📊</span>
                <span>Analytics: views, messages, cost per result</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 rounded-full font-bold border-2"
              onClick={() => onOpenChange(false)}
              data-ocid="boost_modal.cancel_button"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-full font-bold shadow-bold"
              onClick={handlePay}
              disabled={loading}
              data-ocid="boost_modal.pay_button"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Pay ₦500"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
