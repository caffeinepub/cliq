import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

export function SignedOutLanding() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/IMG-20260226-WA0003-1.jpg"
              alt="CLIQ"
              className="h-12 w-12"
            />
            <span className="text-3xl font-black tracking-tight">CLIQ</span>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="rounded-full px-8 font-bold shadow-bold"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-4xl">
          <h1 className="mb-8 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Connect with students
            <br />
            <span className="text-primary">on your campus</span>
          </h1>
          <p className="mb-12 text-xl font-semibold text-muted-foreground sm:text-2xl">
            Share ideas, discover events, buy and sell items, and build your
            campus community.
          </p>
          <div className="mb-12 overflow-hidden rounded-3xl border-4 border-border shadow-bold-lg">
            <img
              src="/assets/generated/cliq-hero.dim_1600x900.png"
              alt="Students connecting"
              className="w-full"
            />
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            size="lg"
            className="rounded-full px-16 py-7 text-xl font-bold shadow-bold-lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </main>

      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm font-medium text-muted-foreground">
          <p>
            © {new Date().getFullYear()} CLIQ. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary underline hover:text-primary/80"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
