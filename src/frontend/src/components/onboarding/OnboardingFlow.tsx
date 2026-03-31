import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, Eye, EyeOff, Search } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { setMockUser } from "../../hooks/useMockAuth";

type Direction = "forward" | "backward";

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  university: string;
  followed: string[];
}

const UNIVERSITIES = [
  {
    acronym: "UNILAG",
    name: "University of Lagos",
    badge: "\uD83D\uDD25 Popular",
  },
  {
    acronym: "UI",
    name: "University of Ibadan",
    badge: "\uD83D\uDD25 Popular",
  },
  {
    acronym: "OAU",
    name: "Obafemi Awolowo University",
    badge: "\u2B50 Popular",
  },
  { acronym: "UNN", name: "University of Nigeria, Nsukka", badge: "" },
  { acronym: "ABU", name: "Ahmadu Bello University", badge: "" },
];

const SUGGESTED = [
  {
    name: "Student Union",
    handle: "@studentunion_ng",
    emoji: "\uD83C\uDFDB\uFE0F",
  },
  {
    name: "Textbook Exchange",
    handle: "@textbook_xchange",
    emoji: "\uD83D\uDCDA",
  },
  { name: "Roomie Finder", handle: "@roomie_cliq", emoji: "\uD83C\uDFE0" },
  { name: "Campus Foodies", handle: "@campusfoodies", emoji: "\uD83C\uDF54" },
  { name: "Study Buddy", handle: "@studybuddy_ng", emoji: "\uD83D\uDCD6" },
  { name: "Night Market", handle: "@nightmarket_ng", emoji: "\uD83C\uDF19" },
];

function Dots({ current }: { current: number }) {
  return (
    <div className="flex gap-2 justify-center mb-6">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: i === current ? "#E8432D" : "#333333",
            transform: i === current ? "scale(1.25)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

function Splash({ onNext }: { onNext: () => void }) {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center w-full h-full cursor-pointer select-none border-0"
      style={{ background: "#0A0A0A" }}
      onClick={onNext}
      data-ocid="onboarding.splash.panel"
    >
      <div className="flex flex-col items-center gap-4 mb-16">
        {/* Logo with E8432D glow ring */}
        <div
          className="rounded-2xl p-0.5"
          style={{ background: "linear-gradient(135deg, #E8432D, #ff6b35)" }}
        >
          <img
            src="/assets/uploads/IMG-20260226-WA0003-1.jpg"
            alt="CLIQ"
            className="w-24 h-24 rounded-2xl object-cover block"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-white text-6xl font-black tracking-tight">
            CLIQ
          </h1>
          {/* Accent underline */}
          <div
            className="h-1 rounded-full w-16"
            style={{ background: "#E8432D", boxShadow: "0 0 12px #E8432D88" }}
          />
        </div>
        <p className="text-white/60 text-lg">Your campus, connected</p>
      </div>
      <p className="text-white/40 text-sm tracking-widest uppercase animate-pulse">
        Tap anywhere to start
      </p>
    </button>
  );
}

function SignUp({
  data,
  onChange,
  onNext,
}: {
  data: FormData;
  onChange: (p: Partial<FormData>) => void;
  onNext: () => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.fullName.trim()) e.fullName = "Full name is required";
    if (!data.username.trim()) e.username = "Username is required";
    else if (!/^[a-z0-9_]+$/.test(data.username))
      e.username = "Letters, numbers and _ only";
    if (!data.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = "Enter a valid email";
    if (!data.password) e.password = "Password is required";
    else if (data.password.length < 6) e.password = "At least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#0A0A0A" }}
      data-ocid="onboarding.signup.panel"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-5 pt-12 pb-6">
          <Dots current={0} />
          <h2 className="text-[28px] font-black text-white mb-1">
            Join CLIQ \uD83E\uDDE1
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Create your campus identity
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={data.fullName}
                onChange={(e) => onChange({ fullName: e.target.value })}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#E8432D] transition-colors"
                data-ocid="onboarding.signup.input"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Username"
                value={data.username}
                onChange={(e) =>
                  onChange({
                    username: e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, ""),
                  })
                }
                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#E8432D] transition-colors"
                data-ocid="onboarding.username.input"
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#E8432D] transition-colors"
                data-ocid="onboarding.email.input"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) => onChange({ password: e.target.value })}
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white placeholder-white/30 outline-none focus:border-[#E8432D] transition-colors"
                  data-ocid="onboarding.password.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-sm mx-auto w-full px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={() => {
            if (validate()) onNext();
          }}
          className="w-full h-12 rounded-full text-white font-semibold text-sm active:opacity-80"
          style={{ backgroundColor: "#E8432D" }}
          data-ocid="onboarding.signup.submit_button"
        >
          Continue \u2192
        </button>
      </div>
    </div>
  );
}

function University({
  selected,
  onSelect,
  onNext,
  onBack,
}: {
  selected: string;
  onSelect: (u: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = UNIVERSITIES.filter(
    (u) =>
      u.acronym.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#0A0A0A" }}
      data-ocid="onboarding.university.panel"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-5 pt-12 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-white/50 hover:text-white"
            data-ocid="onboarding.university.button"
          >
            <ChevronLeft size={20} />
          </button>
          <Dots current={1} />
          <h2 className="text-[28px] font-black text-white mb-1">
            Your University \uD83C\uDFDB\uFE0F
          </h2>
          <p className="text-white/50 text-sm mb-6">Where do you study?</p>
          <div className="relative mb-4">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Search universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 rounded-full border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#E8432D] transition-colors"
              data-ocid="onboarding.university.search_input"
            />
          </div>
          <div className="border border-white/10 rounded-2xl overflow-hidden">
            {filtered.map((uni, i) => (
              <button
                type="button"
                key={uni.acronym}
                onClick={() => onSelect(uni.acronym)}
                className="w-full flex items-center gap-3 px-4 py-4 text-left cursor-pointer transition-colors"
                style={{
                  borderBottom:
                    i < filtered.length - 1
                      ? "1px solid rgba(255,255,255,0.08)"
                      : undefined,
                  backgroundColor:
                    selected === uni.acronym
                      ? "rgba(232,67,45,0.1)"
                      : "rgba(255,255,255,0.02)",
                  borderLeft:
                    selected === uni.acronym
                      ? "3px solid #E8432D"
                      : "3px solid transparent",
                }}
                data-ocid={`onboarding.university.item.${i + 1}`}
              >
                <span className="font-black text-[#E8432D] text-sm w-16 shrink-0">
                  {uni.acronym}
                </span>
                <span className="text-white/80 text-sm flex-1 text-left">
                  {uni.name}
                </span>
                {uni.badge && (
                  <span className="text-xs bg-[#E8432D]/20 text-[#E8432D] px-2 py-0.5 rounded-full shrink-0">
                    {uni.badge}
                  </span>
                )}
                {selected === uni.acronym && (
                  <Check size={16} className="text-[#E8432D] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-sm mx-auto w-full px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={onNext}
          disabled={!selected}
          className="w-full h-12 rounded-full text-white font-semibold text-sm disabled:opacity-40"
          style={{ backgroundColor: "#E8432D" }}
          data-ocid="onboarding.university.submit_button"
        >
          Continue \u2192
        </button>
      </div>
    </div>
  );
}

function Follow({
  followed,
  onToggle,
  onNext,
  onSkip,
  onBack,
}: {
  followed: string[];
  onToggle: (h: string) => void;
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}) {
  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#0A0A0A" }}
      data-ocid="onboarding.follow.panel"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-5 pt-12 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-white/50 hover:text-white"
            data-ocid="onboarding.follow.button"
          >
            <ChevronLeft size={20} />
          </button>
          <Dots current={2} />
          <h2 className="text-[28px] font-black text-white mb-1">
            Follow People \uD83D\uDC65
          </h2>
          <p className="text-white/50 text-sm mb-6">Get your feed started</p>
          <div className="grid grid-cols-2 gap-3">
            {SUGGESTED.map((acc, i) => {
              const isFollowing = followed.includes(acc.handle);
              return (
                <div
                  key={acc.handle}
                  className="rounded-2xl border border-white/10 bg-white/3 p-3 flex flex-col items-center gap-2 text-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  data-ocid={`onboarding.follow.item.${i + 1}`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      backgroundColor: "rgba(232,67,45,0.15)",
                      border: "1px solid rgba(232,67,45,0.3)",
                    }}
                  >
                    {acc.emoji}
                  </div>
                  <p className="font-bold text-sm text-white leading-tight">
                    {acc.name}
                  </p>
                  <p className="text-xs text-white/40">{acc.handle}</p>
                  <button
                    type="button"
                    onClick={() => onToggle(acc.handle)}
                    className="w-full h-8 rounded-full text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: isFollowing ? "transparent" : "#E8432D",
                      color: isFollowing ? "rgba(255,255,255,0.4)" : "white",
                      border: isFollowing
                        ? "1px solid rgba(255,255,255,0.15)"
                        : "none",
                    }}
                    data-ocid={`onboarding.follow.toggle.${i + 1}`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-center text-sm text-white/40 mt-6 py-2"
            data-ocid="onboarding.follow.secondary_button"
          >
            Skip for now \u2192
          </button>
        </div>
      </div>
      <div className="max-w-sm mx-auto w-full px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={onNext}
          className="w-full h-12 rounded-full text-white font-semibold text-sm active:opacity-80"
          style={{ backgroundColor: "#E8432D" }}
          data-ocid="onboarding.follow.submit_button"
        >
          Continue \u2192
        </button>
      </div>
    </div>
  );
}

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("forward");
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    university: "",
    followed: [],
  });

  const patch = (p: Partial<FormData>) => setForm((f) => ({ ...f, ...p }));

  const goTo = (next: number, dir: Direction) => {
    if (animating) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setDirection(dir);
    setPrevStep(step);
    setStep(next);
    setAnimating(true);
    timerRef.current = setTimeout(() => {
      setPrevStep(null);
      setAnimating(false);
    }, 450);
  };

  const forward = () => goTo(step + 1, "forward");
  const back = () => goTo(step - 1, "backward");

  const complete = () => {
    setMockUser({
      id: `user_${Date.now()}`,
      email: form.email,
      username: form.username,
      displayName: form.fullName,
      university: form.university,
    });
    toast.success(`Welcome to CLIQ, @${form.username}! \uD83E\uDDE1`);
    navigate({ to: "/" });
  };

  const slideStyle = (s: number, isCurrent: boolean): React.CSSProperties => {
    if (isCurrent) {
      if (s === 1 && prevStep === 0)
        return {
          animation: "ob_fromTop 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
        };
      if (direction === "forward")
        return {
          animation: "ob_fromRight 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
        };
      return {
        animation: "ob_fromLeft 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
      };
    }
    if (s === 0 && step === 1)
      return {
        animation: "ob_fadeOut 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
      };
    if (direction === "forward")
      return { animation: "ob_toLeft 0.4s cubic-bezier(0.4,0,0.2,1) forwards" };
    return { animation: "ob_toRight 0.4s cubic-bezier(0.4,0,0.2,1) forwards" };
  };

  const renderStep = (s: number, isCurrent: boolean) => {
    const style: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      ...slideStyle(s, isCurrent),
    };
    const steps: Record<number, React.ReactNode> = {
      0: <Splash onNext={forward} />,
      1: <SignUp data={form} onChange={patch} onNext={forward} />,
      2: (
        <University
          selected={form.university}
          onSelect={(u) => patch({ university: u })}
          onNext={forward}
          onBack={back}
        />
      ),
      3: (
        <Follow
          followed={form.followed}
          onToggle={(h) =>
            patch({
              followed: form.followed.includes(h)
                ? form.followed.filter((x) => x !== h)
                : [...form.followed, h],
            })
          }
          onNext={complete}
          onSkip={complete}
          onBack={back}
        />
      ),
    };
    return (
      <div key={s} style={style}>
        {steps[s]}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes ob_fromRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes ob_toLeft { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        @keyframes ob_fromLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes ob_toRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
        @keyframes ob_fromTop { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        @keyframes ob_fadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
      <div
        style={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          zIndex: 9999,
        }}
      >
        {prevStep !== null && renderStep(prevStep, false)}
        {renderStep(step, true)}
      </div>
    </>
  );
}
