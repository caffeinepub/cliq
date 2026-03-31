import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DEMO_ACCOUNTS } from "../../data/mockUsers";
import { setMockUser } from "../../hooks/useMockAuth";

// Google SVG icon
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

// Apple SVG icon
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.23.07 2.08.62 2.79.64.95-.18 1.86-.74 3.15-.8 1.3-.07 2.31.46 3.06 1.32-2.74 1.62-2.28 5.17.5 6.18-.53 1.45-1.2 2.88-1.5 5.51zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(
    null,
  );

  const fillDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  const handleGoogleSignIn = async () => {
    setOauthLoading("google");
    await new Promise((r) => setTimeout(r, 1000));
    // Mock: simulate Google OAuth response
    const mockGoogleUser = {
      id: `google_${Math.random().toString(36).slice(2, 10)}`,
      email: "student@gmail.com",
      username: "student",
      displayName: "Google Student",
      university: "University of Lagos",
    };
    setMockUser(mockGoogleUser);
    setOauthLoading(null);
    toast.success("Signed in with Google!");
    navigate({ to: "/" });
    window.location.reload();
  };

  const handleAppleSignIn = async () => {
    setOauthLoading("apple");
    await new Promise((r) => setTimeout(r, 1000));
    // Mock: simulate Apple OAuth response (privacy relay email)
    const appleId = Math.random().toString(36).slice(2, 10);
    const mockAppleUser = {
      id: `apple_${appleId}`,
      email: `${appleId}@privaterelay.appleid.com`,
      username: `user_${appleId.slice(0, 6)}`,
      displayName: "Apple User",
      university: "University of Lagos",
    };
    setMockUser(mockAppleUser);
    setOauthLoading(null);
    toast.success("Signed in with Apple!");
    navigate({ to: "/" });
    window.location.reload();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const demoAccount = DEMO_ACCOUNTS.find(
      (a) => a.email === email.trim().toLowerCase(),
    );

    if (demoAccount) {
      setMockUser({
        id: demoAccount.id,
        email: demoAccount.email,
        username: demoAccount.username,
        displayName: demoAccount.displayName,
        university: demoAccount.university,
      });
    } else {
      setMockUser({
        id: `user_${Math.random().toString(36).slice(2, 10)}`,
        email: email.trim(),
        username: email
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "_"),
        displayName: email.split("@")[0],
        university: "University of Lagos",
      });
    }

    setLoading(false);
    toast.success("Welcome back!");
    navigate({ to: "/" });
    window.location.reload();
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
        <Link to="/signup">
          <Button
            variant="outline"
            className="rounded-full font-bold"
            style={{
              borderColor: "#444",
              color: "white",
              backgroundColor: "transparent",
            }}
          >
            Sign Up
          </Button>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Welcome back
            </h1>
            <p className="font-medium" style={{ color: "#9ca3af" }}>
              Sign in to your campus community
            </p>
          </div>

          {/* OAuth Buttons — Google → Apple → Email */}
          <div className="space-y-3">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={!!oauthLoading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-3 font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#fff", color: "#111" }}
              data-ocid="signin.google.button"
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
              onClick={handleAppleSignIn}
              disabled={!!oauthLoading}
              className="w-full h-12 rounded-full flex items-center justify-center gap-3 font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "#1c1c1e",
                color: "#fff",
                border: "1px solid #444",
              }}
              data-ocid="signin.apple.button"
            >
              {oauthLoading === "apple" ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <AppleIcon />
              )}
              Continue with Apple
            </button>
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
              or sign in with email
            </span>
            <div
              className="flex-grow"
              style={{ borderTop: "1px solid #333" }}
            />
          </div>

          {/* Email / Password form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl font-medium text-white placeholder:text-gray-500"
                style={{ backgroundColor: "#1a1a1a", borderColor: "#333" }}
                autoComplete="email"
                data-ocid="signin.email.input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold text-white">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl font-medium pr-12 text-white placeholder:text-gray-500"
                  style={{ backgroundColor: "#1a1a1a", borderColor: "#333" }}
                  autoComplete="current-password"
                  data-ocid="signin.password.input"
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
              className="w-full h-12 rounded-full font-bold text-base"
              style={{ backgroundColor: "#E8432D", color: "white" }}
              data-ocid="signin.submit.button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In with Email"
              )}
            </Button>
          </form>

          <p
            className="text-center text-sm font-medium"
            style={{ color: "#9ca3af" }}
          >
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-bold hover:underline"
              style={{ color: "#E8432D" }}
            >
              Sign Up
            </Link>
          </p>

          {/* Demo Accounts */}
          <div className="space-y-3">
            <div className="relative flex items-center">
              <div
                className="flex-grow"
                style={{ borderTop: "1px solid #333" }}
              />
              <span
                className="mx-3 flex-shrink text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#6b7280" }}
              >
                Or try a demo account
              </span>
              <div
                className="flex-grow"
                style={{ borderTop: "1px solid #333" }}
              />
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((account, i) => (
                <div
                  key={account.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                  }}
                  data-ocid={`signin.demo.item.${i + 1}`}
                >
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage
                      src={account.avatarUrl}
                      alt={account.displayName}
                    />
                    <AvatarFallback className="text-xs font-bold">
                      {account.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-tight truncate text-white">
                      {account.displayName}
                    </p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>
                      {account.universityAcronym} · @{account.username}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      fillDemoAccount(account.email, account.password)
                    }
                    className="flex-shrink-0 rounded-full h-7 px-3 text-xs font-bold"
                    style={{
                      borderColor: "#E8432D",
                      color: "#E8432D",
                      backgroundColor: "transparent",
                    }}
                    data-ocid={`signin.demo.use.button.${i + 1}`}
                  >
                    Use →
                  </Button>
                </div>
              ))}
            </div>

            <p className="text-center text-xs" style={{ color: "#6b7280" }}>
              Password for all demo accounts:{" "}
              <span className="font-bold text-white">campus123</span>
            </p>
          </div>
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
    </div>
  );
}
