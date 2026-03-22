import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { setMockUser } from "../../hooks/useMockAuth";

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    // Mock sign-in — accept any credentials
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
    setLoading(false);
    toast.success("Welcome back!");
    navigate({ to: "/" });
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b-2">
        <div className="flex items-center gap-3">
          <img
            src="/assets/uploads/IMG-20260226-WA0003-1.jpg"
            alt="CLIQ"
            className="h-9 w-9"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-2xl font-black tracking-tight">CLIQ</span>
        </div>
        <Link to="/signup">
          <Button
            variant="outline"
            className="rounded-full font-bold"
            data-ocid="signin.signup.link"
          >
            Sign Up
          </Button>
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground font-medium">
              Sign in to your campus community
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-2 font-medium"
                autoComplete="email"
                data-ocid="signin.email.input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-2 font-medium pr-12"
                  autoComplete="current-password"
                  data-ocid="signin.password.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
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
              disabled={loading}
              className="w-full h-12 rounded-full font-bold text-base shadow-bold"
              data-ocid="signin.submit.button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-primary hover:underline"
              data-ocid="signin.signup.link"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CLIQ. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai/?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
