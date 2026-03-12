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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

interface RoomieProfile {
  lookingFor: string;
  budgetMin: number;
  budgetMax: number;
  moveInDate: string;
  gender: string;
  genderPref: string;
  cleanliness: number;
  sleep: string;
  lifestyle: string[];
  vibe: string[];
  dealbreakers: string;
  about: string;
}

interface Match {
  id: string;
  name: string;
  university: string;
  matchPct: number;
  avatar: string;
  vibe: string[];
  favorited: boolean;
}

const MOCK_MATCHES: Match[] = [
  {
    id: "1",
    name: "Adaeze Okonkwo",
    university: "University of Lagos (UNILAG)",
    matchPct: 94,
    avatar: "👩🏾",
    vibe: ["Study-focused", "Quiet", "Homebody"],
    favorited: false,
  },
  {
    id: "2",
    name: "Toluwani Adeyemi",
    university: "University of Lagos (UNILAG)",
    matchPct: 87,
    avatar: "👩🏽",
    vibe: ["Social", "Study-focused", "Early bird"],
    favorited: false,
  },
  {
    id: "3",
    name: "Chinonso Eze",
    university: "University of Lagos (UNILAG)",
    matchPct: 82,
    avatar: "🧑🏿",
    vibe: ["Homebody", "Quiet", "Adventurer"],
    favorited: true,
  },
  {
    id: "4",
    name: "Fatima Aliyu",
    university: "University of Lagos (UNILAG)",
    matchPct: 79,
    avatar: "👩🏾",
    vibe: ["Party", "Social", "Night owl"],
    favorited: false,
  },
  {
    id: "5",
    name: "Kelechi Nwachukwu",
    university: "University of Lagos (UNILAG)",
    matchPct: 76,
    avatar: "🧑🏽",
    vibe: ["Study-focused", "Adventurer"],
    favorited: false,
  },
  {
    id: "6",
    name: "Blessing Osei",
    university: "University of Lagos (UNILAG)",
    matchPct: 71,
    avatar: "👩🏿",
    vibe: ["Social", "Party", "Homebody"],
    favorited: false,
  },
];

const VIBE_OPTIONS = [
  "Social",
  "Quiet",
  "Study-focused",
  "Party",
  "Homebody",
  "Adventurer",
];
const STEPS = 10;

export function RoomiePage() {
  const [hasProfile, setHasProfile] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [profile, setProfile] = useState<Partial<RoomieProfile>>({});
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [, setPendingMatchId] = useState<string | null>(null);

  const updateProfile = (key: keyof RoomieProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const toggleVibe = (v: string) => {
    const current = (profile.vibe || []) as string[];
    if (current.includes(v)) {
      updateProfile(
        "vibe",
        current.filter((x) => x !== v),
      );
    } else if (current.length < 3) {
      updateProfile("vibe", [...current, v]);
    } else {
      toast.error("Select up to 3 vibes");
    }
  };

  const handleMessageMatch = (id: string) => {
    setPendingMatchId(id);
    setSafetyOpen(true);
  };

  const toggleFavorite = (id: string) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, favorited: !m.favorited } : m)),
    );
  };

  if (!hasProfile) {
    // Landing / Wizard
    if (wizardStep === 0) {
      return (
        <div className="p-6 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-6xl space-x-2">
              <span>😫</span>
              <span className="text-3xl text-muted-foreground">→</span>
              <span>😌</span>
              <span className="text-3xl text-muted-foreground">→</span>
              <span>🏠</span>
              <span className="text-3xl text-muted-foreground">→</span>
              <span>❤️</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              From stressed...
              <br />
              <span className="text-primary">to settled.</span>
            </h1>
            <p className="text-muted-foreground text-base">
              Find your perfect roommate match at your university. Answer 10
              quick questions and we'll handle the rest.
            </p>
          </motion.div>
          <Button
            size="lg"
            className="rounded-full px-10 font-bold"
            onClick={() => setWizardStep(1)}
            data-ocid="roomie.primary_button"
          >
            Get Started
          </Button>
        </div>
      );
    }

    return (
      <div className="p-4">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
            disabled={wizardStep === 1}
            data-ocid="roomie.secondary_button"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>
                Step {wizardStep} of {STEPS}
              </span>
              <span>{Math.round((wizardStep / STEPS) * 100)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(wizardStep / STEPS) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={wizardStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {wizardStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">
                  What are you looking for?
                </h2>
                <RadioGroup
                  value={profile.lookingFor}
                  onValueChange={(v) => updateProfile("lookingFor", v)}
                >
                  {["Room only", "Roommate only", "Room + Roommate"].map(
                    (option) => (
                      <div
                        key={option}
                        className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer hover:border-primary transition-colors"
                        data-ocid={`roomie.radio.${option.toLowerCase().replace(/[^a-z0-9]/g, "_")}`}
                      >
                        <RadioGroupItem value={option} id={option} />
                        <Label
                          htmlFor={option}
                          className="cursor-pointer font-semibold"
                        >
                          {option}
                        </Label>
                      </div>
                    ),
                  )}
                </RadioGroup>
              </div>
            )}

            {wizardStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">Budget Range (₦/month)</h2>
                <div className="space-y-6 py-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Min: ₦{(profile.budgetMin || 10000).toLocaleString()}
                    </Label>
                    <Slider
                      min={5000}
                      max={200000}
                      step={5000}
                      value={[profile.budgetMin || 10000]}
                      onValueChange={([v]) => updateProfile("budgetMin", v)}
                      className="mt-2"
                      data-ocid="roomie.budget_min.toggle"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Max: ₦{(profile.budgetMax || 50000).toLocaleString()}
                    </Label>
                    <Slider
                      min={5000}
                      max={500000}
                      step={5000}
                      value={[profile.budgetMax || 50000]}
                      onValueChange={([v]) => updateProfile("budgetMax", v)}
                      className="mt-2"
                      data-ocid="roomie.budget_max.toggle"
                    />
                  </div>
                </div>
              </div>
            )}

            {wizardStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">
                  When do you want to move in?
                </h2>
                <input
                  type="date"
                  className="w-full rounded-xl border-2 p-3 text-base bg-background"
                  value={profile.moveInDate || ""}
                  onChange={(e) => updateProfile("moveInDate", e.target.value)}
                  data-ocid="roomie.input"
                />
              </div>
            )}

            {wizardStep === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">Gender & Preference</h2>
                <div>
                  <Label className="text-sm font-semibold">Your gender</Label>
                  <RadioGroup
                    className="flex gap-3 mt-2"
                    value={profile.gender}
                    onValueChange={(v) => updateProfile("gender", v)}
                  >
                    {["Male", "Female"].map((g) => (
                      <div
                        key={g}
                        className="flex-1 flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer"
                        data-ocid={"roomie.gender.radio"}
                      >
                        <RadioGroupItem value={g} id={`gender-${g}`} />
                        <Label
                          htmlFor={`gender-${g}`}
                          className="cursor-pointer font-semibold"
                        >
                          {g}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-sm font-semibold">
                    Roommate preference
                  </Label>
                  <RadioGroup
                    className="flex gap-3 mt-2"
                    value={profile.genderPref}
                    onValueChange={(v) => updateProfile("genderPref", v)}
                  >
                    {["Male", "Female", "Either"].map((g) => (
                      <div
                        key={g}
                        className="flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer"
                        data-ocid={"roomie.pref.radio"}
                      >
                        <RadioGroupItem value={g} id={`pref-${g}`} />
                        <Label
                          htmlFor={`pref-${g}`}
                          className="cursor-pointer font-semibold"
                        >
                          {g}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {wizardStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">Cleanliness Level</h2>
                <p className="text-muted-foreground text-sm">
                  1 = A little messy, 5 = Super clean
                </p>
                <div className="py-4">
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[profile.cleanliness || 3]}
                    onValueChange={([v]) => updateProfile("cleanliness", v)}
                    data-ocid="roomie.cleanliness.toggle"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>
                <p className="text-center text-2xl font-black text-primary">
                  {
                    ["😅", "🙂", "😊", "✨", "🧹"][
                      (profile.cleanliness || 3) - 1
                    ]
                  }
                </p>
              </div>
            )}

            {wizardStep === 6 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">Sleep Schedule</h2>
                <RadioGroup
                  value={profile.sleep}
                  onValueChange={(v) => updateProfile("sleep", v)}
                >
                  {[
                    "Night Owl 🦉 (sleep after 12am)",
                    "Early Bird 🐦 (sleep before 10pm)",
                    "Flexible 😴 (depends on the day)",
                  ].map((option) => (
                    <div
                      key={option}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer"
                      data-ocid="roomie.sleep.radio"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label
                        htmlFor={option}
                        className="cursor-pointer font-semibold"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {wizardStep === 7 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">Lifestyle</h2>
                <div className="space-y-3">
                  {["Smoking", "Drinking", "Guests often", "Pets"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 p-4 rounded-xl border-2"
                        data-ocid={"roomie.lifestyle.checkbox"}
                      >
                        <Checkbox
                          checked={(profile.lifestyle || []).includes(item)}
                          onCheckedChange={(checked) => {
                            const curr = profile.lifestyle || [];
                            updateProfile(
                              "lifestyle",
                              checked
                                ? [...curr, item]
                                : curr.filter((x) => x !== item),
                            );
                          }}
                        />
                        <Label className="font-semibold cursor-pointer">
                          {item}
                        </Label>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {wizardStep === 8 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">Your Vibe (pick 3)</h2>
                <div className="grid grid-cols-2 gap-3">
                  {VIBE_OPTIONS.map((v) => {
                    const selected = (profile.vibe || []).includes(v);
                    return (
                      <button
                        type="button"
                        key={v}
                        className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${
                          selected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleVibe(v)}
                        data-ocid={"roomie.vibe.toggle"}
                      >
                        {v}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {wizardStep === 9 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">Dealbreakers</h2>
                <Textarea
                  placeholder="e.g. No smoking, no loud music after 10pm..."
                  value={profile.dealbreakers || ""}
                  onChange={(e) =>
                    updateProfile("dealbreakers", e.target.value)
                  }
                  rows={5}
                  data-ocid="roomie.textarea"
                />
              </div>
            )}

            {wizardStep === 10 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black">About You</h2>
                <Textarea
                  placeholder="Tell potential roommates about yourself..."
                  value={profile.about || ""}
                  onChange={(e) => updateProfile("about", e.target.value)}
                  rows={6}
                  data-ocid="roomie.about.textarea"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8">
          {wizardStep < STEPS ? (
            <Button
              className="w-full rounded-full"
              onClick={() => setWizardStep(wizardStep + 1)}
              data-ocid="roomie.primary_button"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="w-full rounded-full"
              onClick={() => {
                setHasProfile(true);
                toast.success("Profile created! Finding your matches...");
              }}
              data-ocid="roomie.submit_button"
            >
              Find My Matches 🎉
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Matches view
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Your Matches 🏠
          </h1>
          <p className="text-sm text-muted-foreground">
            {matches.length} compatible roommates found
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => {
            setHasProfile(false);
            setWizardStep(1);
          }}
          data-ocid="roomie.secondary_button"
        >
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {matches.map((match, i) => (
          <Card
            key={match.id}
            className="border-2 hover:shadow-bold transition-all"
            data-ocid={`roomie.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl shrink-0">{match.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-base">{match.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-black text-primary">
                        {match.matchPct}%
                      </span>
                      <Heart className="h-3 w-3 text-primary fill-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {match.university}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {match.vibe.map((v) => (
                      <Badge key={v} variant="secondary" className="text-xs">
                        {v}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="rounded-full gap-2 flex-1"
                      onClick={() => handleMessageMatch(match.id)}
                      data-ocid={`roomie.message.button.${i + 1}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Message
                    </Button>
                    <Button
                      variant={match.favorited ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => toggleFavorite(match.id)}
                      data-ocid={`roomie.toggle.${i + 1}`}
                    >
                      <Star
                        className={`h-3.5 w-3.5 ${match.favorited ? "fill-current" : ""}`}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={safetyOpen} onOpenChange={setSafetyOpen}>
        <AlertDialogContent data-ocid="roomie.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Safety Reminder</AlertDialogTitle>
            <AlertDialogDescription>
              Before messaging this person, remember to: • Meet in a public
              place first • Tell a friend or family member your plans • Trust
              your instincts — if something feels off, it probably is • Never
              share financial details before meeting
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="roomie.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setSafetyOpen(false);
                toast.success("Starting conversation...");
              }}
              data-ocid="roomie.confirm_button"
            >
              I Understand, Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
