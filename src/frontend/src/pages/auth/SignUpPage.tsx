import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle, Eye, EyeOff, Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { setMockUser } from "../../hooks/useMockAuth";

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

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.23.07 2.08.62 2.79.64.95-.18 1.86-.74 3.15-.8 1.3-.07 2.31.46 3.06 1.32-2.74 1.62-2.28 5.17.5 6.18-.53 1.45-1.2 2.88-1.5 5.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(
    null,
  );

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleGoogleSignUp = async () => {
    setOauthLoading("google");
    await new Promise((r) => setTimeout(r, 1000));
    const mockEmail = "student@gmail.com";
    const emailPrefix = mockEmail
      .split("@")[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_");
    setMockUser({
      id: `google_${Math.random().toString(36).slice(2, 10)}`,
      email: mockEmail,
      username: emailPrefix,
      displayName: "Google Student",
      university: "University of Lagos",
    });
    setOauthLoading(null);
    toast.success("Account created with Google! Welcome to CLIQ 🧡");
    navigate({ to: "/" });
    window.location.reload();
  };

  const handleAppleSignUp = async () => {
    setOauthLoading("apple");
    await new Promise((r) => setTimeout(r, 1000));
    const appleId = Math.random().toString(36).slice(2, 10);
    const relayEmail = `${appleId}@privaterelay.appleid.com`;
    setMockUser({
      id: `apple_${appleId}`,
      email: relayEmail,
      username: `user_${appleId.slice(0, 6)}`,
      displayName: "Apple User",
      university: "University of Lagos",
    });
    setOauthLoading(null);
    toast.success("Account created with Apple! Welcome to CLIQ 🧡");
    navigate({ to: "/" });
    window.location.reload();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !username.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setMockUser({
      id: `user_${Math.random().toString(36).slice(2, 10)}`,
      email: email.trim(),
      username: username.trim().toLowerCase(),
      displayName: username.trim(),
      university: "University of Lagos",
    });
    setLoading(false);
    toast.success("Account created! Welcome to CLIQ 🧡");
    navigate({ to: "/" });
    window.location.reload();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    setForgotLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setForgotLoading(false);
    setForgotSent(true);
  };

  const closeForgotModal = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
    setForgotLoading(false);
    setForgotSent(false);
  };

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #222" }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/assets/uploads/IMG-20260226-WA0003-1.jpg"
            alt="CLIQ"
            className="h-9 w-9"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-2xl font-black tracking-tight text-white">
            CLIQ
          </span>
        </div>
        <Link to="/signin">
          <Button
            variant="outline"
            className="rounded-full font-bold"
            style={{
              borderColor: "#444",
              color: "white",
              backgroundColor: "transparent",
            }}
          >
            Sign In
          </Button>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Join CLIQ
            </h1>
            <p className="font-medium" style={{ color: "#9ca3af" }}>
              Your campus, connected 🧡
            </p>
          </div>

          {/* OAuth Buttons — Google → Apple → Email */}
          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={!!oauthLoading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-3 font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#fff", color: "#111" }}
              data-ocid="signup.google.button"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={handleAppleSignUp}
              disabled={!!oauthLoading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-3 font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "#1c1c1e",
                color: "#fff",
                border: "1px solid #444",
              }}
              data-ocid="signup.apple.button"
            >
              {oauthLoading === "apple" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <AppleIcon />
              )}
              Continue with Apple
            </button>

            {/* Privacy note for Apple */}
            <p className="text-center text-xs" style={{ color: "#6b7280" }}>
              Apple sign-in supports hiding your email for privacy.
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex items-center">
            <div
              className="flex-grow"
              style={{ borderTop: "1px solid #333" }}
            />
            <span
              className="mx-3 flex-shrink text-xs font-semibold uppercase tracking-wider"
              style={{ color: "#6b7280" }}
            >
              or sign up with email
            </span>
            <div
              className="flex-grow"
              style={{ borderTop: "1px solid #333" }}
            />
          </div>

          {/* Email form — Email, Username, Password */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="su-email" className="font-bold text-white">
                Email
              </Label>
              <Input
                id="su-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl font-medium text-white placeholder:text-gray-500"
                style={{ backgroundColor: "#1a1a1a", borderColor: "#333" }}
                autoComplete="email"
                data-ocid="signup.email.input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="font-bold text-white">
                Username
              </Label>
              <Input
                id="username"
                placeholder="ada_okonkwo"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  )
                }
                className="h-12 rounded-xl font-medium text-white placeholder:text-gray-500"
                style={{ backgroundColor: "#1a1a1a", borderColor: "#333" }}
                autoComplete="username"
                data-ocid="signup.username.input"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="su-password" className="font-bold text-white">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-medium hover:underline"
                  style={{ color: "#E8432D" }}
                  data-ocid="signup.forgot_password.button"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="su-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl font-medium pr-12 text-white placeholder:text-gray-500"
                  style={{ backgroundColor: "#1a1a1a", borderColor: "#333" }}
                  autoComplete="new-password"
                  data-ocid="signup.password.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#6b7280" }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !!oauthLoading}
              className="w-full h-12 rounded-full font-bold text-base mt-2"
              style={{ backgroundColor: "#E8432D", color: "white" }}
              data-ocid="signup.submit.button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p
            className="text-center text-sm font-medium"
            style={{ color: "#9ca3af" }}
          >
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-bold hover:underline"
              style={{ color: "#E8432D" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <footer
        className="py-5 text-center text-xs"
        style={{ borderTop: "1px solid #222", color: "#6b7280" }}
      >
        © {new Date().getFullYear()} CLIQ. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai/?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:underline"
          style={{ color: "#E8432D" }}
        >
          caffeine.ai
        </a>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={closeForgotModal}
          onKeyDown={(e) => e.key === "Escape" && closeForgotModal()}
          data-ocid="forgot_password.modal"
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 space-y-5"
            style={{ backgroundColor: "#161616", border: "1px solid #2a2a2a" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white">
                  Reset Password
                </h2>
                <p className="text-sm" style={{ color: "#9ca3af" }}>
                  Enter your email and we&apos;ll send you a reset link
                </p>
              </div>
              <button
                type="button"
                onClick={closeForgotModal}
                className="rounded-full p-1 transition-colors hover:bg-white/10"
                style={{ color: "#6b7280" }}
                data-ocid="forgot_password.close.button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {forgotSent ? (
              /* Success state */
              <div className="space-y-5">
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <CheckCircle
                    className="h-14 w-14"
                    style={{ color: "#E8432D" }}
                  />
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-white">
                      Check your email!
                    </p>
                    <p className="text-sm" style={{ color: "#9ca3af" }}>
                      We&apos;ve sent a reset link to
                    </p>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#E8432D" }}
                    >
                      {forgotEmail}
                    </p>
                  </div>
                  <div
                    className="w-full rounded-xl px-4 py-3 text-xs text-center"
                    style={{
                      backgroundColor: "#1a1a1a",
                      color: "#9ca3af",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    🧪 Demo mode: reset link would be sent to{" "}
                    <span className="font-semibold text-white">
                      {forgotEmail}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={closeForgotModal}
                  className="w-full h-12 rounded-full font-bold"
                  style={{ backgroundColor: "#E8432D", color: "white" }}
                  data-ocid="forgot_password.done.button"
                >
                  Done
                </Button>
              </div>
            ) : (
              /* Form state */
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="forgot-email"
                    className="font-bold text-white text-sm"
                  >
                    Email address
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="h-12 rounded-xl font-medium text-white placeholder:text-gray-500"
                    style={{ backgroundColor: "#1a1a1a", borderColor: "#333" }}
                    autoComplete="email"
                    data-ocid="forgot_password.email.input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full h-12 rounded-full font-bold"
                  style={{ backgroundColor: "#E8432D", color: "white" }}
                  data-ocid="forgot_password.submit.button"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <p className="text-center">
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="text-sm font-medium hover:underline"
                    style={{ color: "#9ca3af" }}
                    data-ocid="forgot_password.cancel.button"
                  >
                    Back to Sign Up
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
