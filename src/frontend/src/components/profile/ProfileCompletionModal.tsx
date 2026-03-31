import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
import { useState } from "react";

const DEPARTMENTS = [
  "Arts",
  "Sciences",
  "Engineering",
  "Law",
  "Medicine",
  "Education",
  "Social Sciences",
  "Business & Management",
  "Agriculture",
  "Pharmacy",
  "Architecture",
];

interface ProfileCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (department: string, birthday: string) => void;
  onSkip: () => void;
}

export function ProfileCompletionModal({
  open,
  onOpenChange,
  onComplete,
  onSkip,
}: ProfileCompletionModalProps) {
  const [department, setDepartment] = useState("");
  const [birthday, setBirthday] = useState("");

  function handleSave() {
    if (!department) return;
    onComplete(department, birthday);
  }

  function handleSkip() {
    onSkip();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm rounded-2xl p-0 overflow-hidden"
        data-ocid="profile_completion.dialog"
      >
        {/* Gradient header */}
        <div
          className="px-6 pt-7 pb-5"
          style={{
            background: "linear-gradient(135deg, #E8432D 0%, #ff6b4a 100%)",
          }}
        >
          <div className="flex items-center justify-center mb-3">
            <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
          </div>
          <DialogHeader className="text-center space-y-1">
            <DialogTitle className="text-white text-xl font-bold">
              Complete your profile 🎓
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm">
              Help us personalise your CLIQ experience
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Department */}
          <div className="space-y-2">
            <Label
              htmlFor="department-select"
              className="text-sm font-semibold text-foreground"
            >
              Department / Faculty
            </Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger
                id="department-select"
                className="rounded-[40px] border-[#EEEEEE] h-11"
                data-ocid="profile_completion.department.select"
              >
                <SelectValue placeholder="Select your faculty" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Used for content recommendations and study group suggestions
            </p>
          </div>

          {/* Birthday */}
          <div className="space-y-2">
            <Label
              htmlFor="birthday-input"
              className="text-sm font-semibold text-foreground"
            >
              Birthday{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <input
              id="birthday-input"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              className="w-full h-11 rounded-[40px] border border-[#EEEEEE] bg-background px-4 text-sm text-foreground focus:outline-none focus:border-[#E8432D] focus:ring-1 focus:ring-[#E8432D] transition-colors"
              data-ocid="profile_completion.birthday.input"
            />
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <span>🔒</span> Only visible to you
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 pb-6 flex flex-col gap-2">
          <Button
            onClick={handleSave}
            disabled={!department}
            className="w-full rounded-[40px] font-semibold h-11"
            style={{ backgroundColor: "#E8432D" }}
            data-ocid="profile_completion.save_button"
          >
            Save & Personalise
          </Button>
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="w-full rounded-[40px] text-muted-foreground hover:text-foreground h-10 text-sm"
            data-ocid="profile_completion.skip_button"
          >
            Skip for now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
