import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UNIVERSITIES } from "../../constants/universities";
import { setMockUser } from "../../hooks/useMockAuth";

export function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [university, setUniversity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !email.trim() ||
      !password.trim() ||
      !username.trim() ||
      !displayName.trim() ||
      !university
    ) {
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
      displayName: displayName.trim(),
      university,
    });
    setLoading(false);
    toast.success("Account created! Welcome to CLIQ 🧡");
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
        <Link to="/signin">
          <Button
            variant="outline"
            className="rounded-full font-bold"
            data-ocid="signup.signin.link"
          >
            Sign In
          </Button>
        </Link>
      </header>

      <main className="flex flex-1 justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-7">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Join CLIQ</h1>
            <p className="text-muted-foreground font-medium">
              Your campus, connected 🧡
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="font-bold">
                Full Name
              </Label>
              <Input
                id="displayName"
                placeholder="Ada Okonkwo"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="h-12 rounded-xl border-2 font-medium"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="font-bold">
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
                className="h-12 rounded-xl border-2 font-medium"
                data-ocid="signup.username.input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="su-email" className="font-bold">
                Email
              </Label>
              <Input
                id="su-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-2 font-medium"
                autoComplete="email"
                data-ocid="signup.email.input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="su-password" className="font-bold">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="su-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-2 font-medium pr-12"
                  autoComplete="new-password"
                  data-ocid="signup.password.input"
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

            <div className="space-y-2">
              <Label className="font-bold">University</Label>
              <Select value={university} onValueChange={setUniversity}>
                <SelectTrigger
                  className="h-12 rounded-xl border-2 font-medium"
                  data-ocid="signup.university.select"
                >
                  <SelectValue placeholder="Select your university" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {UNIVERSITIES.map((uni) => (
                    <SelectItem key={uni} value={uni} className="font-medium">
                      {uni}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full font-bold text-base shadow-bold mt-2"
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

          <p className="text-center text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-bold text-primary hover:underline"
            >
              Sign In
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
