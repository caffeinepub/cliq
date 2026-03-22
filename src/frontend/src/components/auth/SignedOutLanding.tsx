import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function SignedOutLanding() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b-2 bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <img
              src="/assets/uploads/IMG-20260226-WA0003-1.jpg"
              alt="CLIQ"
              className="h-10 w-10"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-3xl font-black tracking-tight">CLIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/signin">
              <Button
                variant="outline"
                className="rounded-full font-bold px-6"
                data-ocid="landing.signin.link"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                className="rounded-full font-bold px-6 shadow-bold"
                data-ocid="landing.signup.link"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-2xl space-y-8">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
              🇳🇬 For Nigerian University Students
            </span>
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-[1.05]">
            Your campus, <span className="text-primary">connected</span>
          </h1>
          <p className="text-xl font-semibold text-muted-foreground max-w-lg mx-auto">
            Share ideas, discover opportunities, buy and sell items, find a
            roommate — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="rounded-full px-12 py-6 text-lg font-bold shadow-bold-lg w-full sm:w-auto"
                data-ocid="landing.cta.primary_button"
              >
                Join CLIQ Free
              </Button>
            </Link>
            <Link to="/signin">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-12 py-6 text-lg font-bold border-2 w-full sm:w-auto"
                data-ocid="landing.cta.secondary_button"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {[
              { emoji: "📱", label: "Social Feed" },
              { emoji: "🛍️", label: "Marketplace" },
              { emoji: "💬", label: "Messaging" },
              { emoji: "🥷", label: "Anonymous" },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-2xl border-2 bg-card p-4 text-center space-y-1"
              >
                <span className="text-2xl">{f.emoji}</span>
                <p className="text-sm font-bold">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
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
