import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, Eye, EyeOff, Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { setMockUser } from "../../hooks/useMockAuth";

type Direction = "forward" | "backward";
type AuthProvider = "google" | "apple" | "email" | null;

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  university: string;
  followed: string[];
  authProvider: AuthProvider;
  isReturningUser: boolean;
  verificationCode: string;
  mockCode: string;
}

const UNIVERSITIES = [
  { acronym: "UNILAG", name: "University of Lagos", badge: "🔥 Popular" },
  { acronym: "UI", name: "University of Ibadan", badge: "🔥 Popular" },
  { acronym: "OAU", name: "Obafemi Awolowo University", badge: "⭐ Popular" },
  { acronym: "UNN", name: "University of Nigeria, Nsukka", badge: "" },
  { acronym: "ABU", name: "Ahmadu Bello University", badge: "" },
];

const SUGGESTED = [
  { name: "Student Union", handle: "@studentunion_ng", emoji: "🏛️" },
  { name: "Textbook Exchange", handle: "@textbook_xchange", emoji: "📚" },
  { name: "Roomie Finder", handle: "@roomie_cliq", emoji: "🏠" },
  { name: "Campus Foodies", handle: "@campusfoodies", emoji: "🍔" },
  { name: "Study Buddy", handle: "@studybuddy_ng", emoji: "📖" },
  { name: "Night Market", handle: "@nightmarket_ng", emoji: "🌙" },
];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Dots({ current, total = 4 }: { current: number; total?: number }) {
  return (
    <div className="flex gap-2 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: dot position index is stable
          key={i}
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: i === current ? "#E8432D" : "#333",
            transform: i === current ? "scale(1.3)" : "scale(1)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Step 0: Splash (no tap-to-continue; buttons fade in after 1.2s) ────────
function Splash({
  onSignUp,
  onLogIn,
}: {
  onSignUp: () => void;
  onLogIn: () => void;
}) {
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setButtonsVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-between w-full h-full"
      style={{ background: "#0A0A0A" }}
      data-ocid="onboarding.splash.panel"
    >
      {/* Logo + tagline — centered in upper portion */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
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
          <div
            className="h-1 rounded-full w-16"
            style={{ background: "#E8432D", boxShadow: "0 0 12px #E8432D88" }}
          />
        </div>
        <p className="text-white/60 text-lg">Your campus, connected</p>
      </div>

      {/* Buttons fade in after delay */}
      <div
        className="w-full max-w-sm px-6 pb-12 flex flex-col gap-3 transition-all duration-700"
        style={{
          opacity: buttonsVisible ? 1 : 0,
          transform: buttonsVisible ? "translateY(0)" : "translateY(16px)",
          pointerEvents: buttonsVisible ? "auto" : "none",
        }}
      >
        <button
          type="button"
          onClick={onSignUp}
          className="w-full h-14 rounded-full font-bold text-base tracking-wide transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#E8432D", color: "#fff" }}
          data-ocid="onboarding.splash.signup_button"
        >
          SIGN UP
        </button>
        <button
          type="button"
          onClick={onLogIn}
          className="w-full h-14 rounded-full font-bold text-base tracking-wide transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "transparent",
            color: "#fff",
            border: "2px solid rgba(255,255,255,0.5)",
          }}
          data-ocid="onboarding.splash.login_button"
        >
          LOG IN
        </button>
      </div>
    </div>
  );
}

// ─── Sign In component (Log In path) ───────────────────────────────────────
function SignIn({
  onBack,
  onSuccess,
  onGoogle,
  googleLoading,
}: {
  onBack: () => void;
  onSuccess: () => void;
  onGoogle: () => void;
  googleLoading: boolean;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!identifier.trim() || !password) {
      toast.error("Please enter your username/email and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onSuccess();
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#0A0A0A" }}
      data-ocid="onboarding.signin.panel"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-5 pt-12 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-white/50 hover:text-white"
            data-ocid="onboarding.signin.back_button"
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-[28px] font-black text-white mb-1">
            Welcome back
          </h2>
          <p className="text-white/50 text-sm mb-8">Sign in to your account</p>

          <div className="flex flex-col gap-4">
            {/* Username or Email */}
            <div>
              <input
                type="text"
                placeholder="Username or Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#E8432D] transition-colors"
                data-ocid="onboarding.signin.identifier_input"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSignIn();
                }}
                className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white placeholder-white/30 outline-none focus:border-[#E8432D] transition-colors"
                data-ocid="onboarding.signin.password_input"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Sign In button */}
          <button
            type="button"
            onClick={handleSignIn}
            disabled={loading}
            className="w-full h-12 rounded-full text-white font-semibold text-sm mt-6 flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#E8432D" }}
            data-ocid="onboarding.signin.submit_button"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative flex items-center my-5">
            <div
              className="flex-grow"
              style={{ borderTop: "1px solid #333" }}
            />
            <span
              className="mx-3 flex-shrink text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#555" }}
            >
              or
            </span>
            <div
              className="flex-grow"
              style={{ borderTop: "1px solid #333" }}
            />
          </div>

          {/* Continue with Google */}
          <button
            type="button"
            onClick={onGoogle}
            disabled={googleLoading || loading}
            className="w-full h-12 rounded-full flex items-center justify-center gap-3 font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#fff", color: "#111" }}
            data-ocid="onboarding.signin.google_button"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Email Signup ──────────────────────────────────────────────────
function EmailSignup({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormData;
  onChange: (p: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
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
      data-ocid="onboarding.emailsignup.panel"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-5 pt-12 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-white/50 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <Dots current={0} total={3} />
          <h2 className="text-[28px] font-black text-white mb-1">
            Create Account
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Sign up with your campus email
          </p>

          <div className="flex flex-col gap-4">
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
                data-ocid="onboarding.emailsignup.username_input"
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
                data-ocid="onboarding.emailsignup.email_input"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password (min 6 chars)"
                  value={data.password}
                  onChange={(e) => onChange({ password: e.target.value })}
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-white placeholder-white/30 outline-none focus:border-[#E8432D] transition-colors"
                  data-ocid="onboarding.emailsignup.password_input"
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
          className="w-full h-12 rounded-full text-white font-semibold text-sm"
          style={{ backgroundColor: "#E8432D" }}
          data-ocid="onboarding.emailsignup.submit_button"
        >
          Send Verification Code →
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Email Verification ────────────────────────────────────────────
function EmailVerification({
  email,
  mockCode,
  onVerified,
  onBack,
}: {
  email: string;
  mockCode: string;
  onVerified: () => void;
  onBack: () => void;
}) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 1);
    const newDigits = [...digits];
    newDigits[index] = cleaned;
    setDigits(newDigits);
    setError("");
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
    if (cleaned && index === 5) {
      const code = [...newDigits.slice(0, 5), cleaned].join("");
      if (code.length === 6) verifyCode([...newDigits.slice(0, 5), cleaned]);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) newDigits[i] = pasted[i] || "";
      setDigits(newDigits);
      const focusIdx = Math.min(pasted.length, 5);
      inputRefs.current[focusIdx]?.focus();
      if (pasted.length === 6) verifyCode(newDigits);
    }
  };

  const verifyCode = (d: string[]) => {
    const entered = d.join("");
    if (entered === mockCode) {
      toast.success("Email verified! 🎉");
      onVerified();
    } else {
      setError("Incorrect code. Please try again.");
      setDigits(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  };

  const handleResend = async () => {
    setResending(true);
    await new Promise((r) => setTimeout(r, 800));
    setResending(false);
    setResendTimer(30);
    setDigits(["", "", "", "", "", ""]);
    setError("");
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
    toast.success(`Code resent to ${email}. Demo code: ${mockCode}`, {
      duration: 8000,
    });
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#0A0A0A" }}
      data-ocid="onboarding.verify.panel"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-sm mx-auto px-5 pt-12 pb-6">
          <button
            type="button"
            onClick={onBack}
            className="mb-6 text-white/50 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <Dots current={1} total={3} />
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{
              backgroundColor: "rgba(232,67,45,0.15)",
              border: "1px solid rgba(232,67,45,0.3)",
            }}
          >
            <span className="text-2xl">✉️</span>
          </div>
          <h2 className="text-[28px] font-black text-white mb-2">
            Check your email
          </h2>
          <p className="text-white/50 text-sm mb-1">
            We sent a 6-digit code to
          </p>
          <p className="text-[#E8432D] font-semibold text-sm mb-6 break-all">
            {email}
          </p>
          <div
            className="rounded-xl px-4 py-3 mb-6"
            style={{
              backgroundColor: "rgba(232,67,45,0.08)",
              border: "1px solid rgba(232,67,45,0.2)",
            }}
          >
            <p className="text-[#E8432D] text-xs font-medium">
              Demo mode — your code is:
            </p>
            <p className="text-white text-2xl font-black tracking-[0.3em] mt-1">
              {mockCode}
            </p>
          </div>
          <div className="flex gap-3 justify-center mb-4" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                // biome-ignore lint/suspicious/noArrayIndexKey: OTP digit position index is stable
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-black text-white rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: d
                    ? "rgba(232,67,45,0.15)"
                    : "rgba(255,255,255,0.05)",
                  border: d
                    ? "2px solid #E8432D"
                    : "2px solid rgba(255,255,255,0.1)",
                  caretColor: "#E8432D",
                }}
                data-ocid={`onboarding.verify.digit_${i + 1}`}
              />
            ))}
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}
          <div className="text-center">
            {resendTimer > 0 ? (
              <p className="text-white/40 text-sm">
                Resend code in{" "}
                <span style={{ color: "#E8432D" }}>{resendTimer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-sm font-semibold disabled:opacity-50"
                style={{ color: "#E8432D" }}
                data-ocid="onboarding.verify.resend_button"
              >
                {resending ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 size={14} className="animate-spin" /> Sending...
                  </span>
                ) : (
                  "Resend code"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-sm mx-auto w-full px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={() => verifyCode(digits)}
          disabled={digits.join("").length !== 6}
          className="w-full h-12 rounded-full text-white font-semibold text-sm disabled:opacity-40"
          style={{ backgroundColor: "#E8432D" }}
          data-ocid="onboarding.verify.submit_button"
        >
          Verify Email →
        </button>
      </div>
    </div>
  );
}

// ─── Step 3: University Selection ─────────────────────────────────────────
function University({
  selected,
  onSelect,
  onNext,
  onBack,
  showBack,
}: {
  selected: string;
  onSelect: (u: string) => void;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
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
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="mb-6 text-white/50 hover:text-white"
              data-ocid="onboarding.university.back_button"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <Dots current={showBack ? 2 : 0} total={3} />
          <h2 className="text-[28px] font-black text-white mb-1">
            Your University 🏛️
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
          Continue →
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Follow People ─────────────────────────────────────────────────
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
            data-ocid="onboarding.follow.back_button"
          >
            <ChevronLeft size={20} />
          </button>
          <Dots current={2} total={3} />
          <h2 className="text-[28px] font-black text-white mb-1">
            Follow People 👥
          </h2>
          <p className="text-white/50 text-sm mb-6">Get your feed started</p>
          <div className="grid grid-cols-2 gap-3">
            {SUGGESTED.map((acc, i) => {
              const isFollowing = followed.includes(acc.handle);
              return (
                <div
                  key={acc.handle}
                  className="rounded-2xl border border-white/10 p-3 flex flex-col items-center gap-2 text-center"
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
            data-ocid="onboarding.follow.skip_button"
          >
            Skip for now →
          </button>
        </div>
      </div>
      <div className="max-w-sm mx-auto w-full px-5 pb-8 pt-4">
        <button
          type="button"
          onClick={onNext}
          className="w-full h-12 rounded-full text-white font-semibold text-sm"
          style={{ backgroundColor: "#E8432D" }}
          data-ocid="onboarding.follow.submit_button"
        >
          Go to Feed →
        </button>
      </div>
    </div>
  );
}

// ─── Main OnboardingFlow ────────────────────────────────────────────────────
// Steps:
// 0 = Splash (auto-fade SIGN UP + LOG IN)
// 1 = Email Signup  (sign-up path)
// 2 = Email Verification (sign-up path)
// 3 = University Selection (sign-up path)
// 4 = Follow People (sign-up path)
// 5 = Sign In (log-in path)

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [prevStep, setPrevStep] = useState<number | null>(null);
  const [direction, setDirection] = useState<Direction>("forward");
  const [animating, setAnimating] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<AuthProvider>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    university: "",
    followed: [],
    authProvider: null,
    isReturningUser: false,
    verificationCode: "",
    mockCode: String(Math.floor(100000 + Math.random() * 900000)),
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

  const forward = (target?: number) => goTo(target ?? step + 1, "forward");

  // Google auth handler shared by sign-up and sign-in paths
  const handleGoogleAuth = async (fromSignIn = false) => {
    setOauthLoading("google");
    await new Promise((r) => setTimeout(r, 1000));
    const id = Math.random().toString(36).slice(2, 10);
    const mockEmail = `${id}@gmail.com`;
    const mockUsername = `user_${id.slice(0, 6)}`;
    if (fromSignIn) {
      // Log-in path: create user + go straight to feed
      setMockUser({
        id: `user_${Date.now()}`,
        email: mockEmail,
        username: mockUsername,
        displayName: "Google User",
        university: "UNILAG",
      });
      setOauthLoading(null);
      toast.success("Signed in with Google! Welcome back.");
      navigate({ to: "/" });
    } else {
      // Sign-up path: go to university selection
      patch({
        authProvider: "google",
        email: mockEmail,
        username: mockUsername,
        fullName: "Google User",
      });
      setOauthLoading(null);
      toast.success("Google account connected! Choose your university.");
      forward(3);
    }
  };

  const handleEmailNext = () => {
    patch({
      authProvider: "email",
      mockCode: String(Math.floor(100000 + Math.random() * 900000)),
    });
    toast.success("Verification code sent! Demo code shown on screen.", {
      duration: 4000,
    });
    forward(2);
  };

  const handleSignInSuccess = () => {
    const userId = `user_${Date.now()}`;
    setMockUser({
      id: userId,
      email: "demo@cliq.ng",
      username: "demo_user",
      displayName: "Demo User",
      university: "UNILAG",
    });
    toast.success("Welcome back to CLIQ!");
    navigate({ to: "/" });
  };

  const complete = () => {
    const userId = `user_${Date.now()}`;
    setMockUser({
      id: userId,
      email: form.email,
      username: form.username || `user_${userId.slice(-6)}`,
      displayName: form.fullName || form.username || "CLIQ User",
      university: form.university,
    });
    localStorage.setItem(
      `cliq_auth_${userId}`,
      JSON.stringify({
        email_verified: true,
        auth_provider: form.authProvider,
        verification_code: null,
        verification_expires: null,
      }),
    );
    localStorage.setItem("cliq_signed_up_at", new Date().toISOString());
    toast.success("Welcome to CLIQ!");
    navigate({ to: "/" });
  };

  const slideStyle = (_s: number, isCurrent: boolean): React.CSSProperties => {
    if (isCurrent) {
      if (direction === "forward")
        return {
          animation: "ob_fromRight 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
        };
      return {
        animation: "ob_fromLeft 0.4s cubic-bezier(0.4,0,0.2,1) forwards",
      };
    }
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
      // ── Splash ────────────────────────────────────────────────────────
      0: (
        <Splash
          onSignUp={() => {
            patch({ authProvider: "email" });
            forward(1);
          }}
          onLogIn={() => forward(5)}
        />
      ),

      // ── Sign-up path ──────────────────────────────────────────────────
      1: (
        <EmailSignup
          data={form}
          onChange={patch}
          onNext={handleEmailNext}
          onBack={() => goTo(0, "backward")}
        />
      ),
      2: (
        <EmailVerification
          email={form.email}
          mockCode={form.mockCode}
          onVerified={() => forward(3)}
          onBack={() => goTo(1, "backward")}
        />
      ),
      3: (
        <University
          selected={form.university}
          onSelect={(u) => patch({ university: u })}
          onNext={() => forward(4)}
          onBack={() => goTo(form.authProvider === "email" ? 2 : 0, "backward")}
          showBack={true}
        />
      ),
      4: (
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
          onBack={() => goTo(3, "backward")}
        />
      ),

      // ── Log-in path ───────────────────────────────────────────────────
      5: (
        <SignIn
          onBack={() => goTo(0, "backward")}
          onSuccess={handleSignInSuccess}
          onGoogle={() => handleGoogleAuth(true)}
          googleLoading={oauthLoading === "google"}
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
