import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Loader2 } from 'lucide-react';

export function SignedOutLanding() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/cliq-logo.dim_512x512.png" alt="CLIQ" className="h-10 w-10" />
          <span className="text-2xl font-bold tracking-tight">CLIQ</span>
        </div>
        <Button onClick={login} disabled={isLoggingIn} size="lg" className="rounded-full px-8">
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </header>

      <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            Connect with students
            <br />
            <span className="bg-gradient-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              on your campus
            </span>
          </h1>
          <p className="mb-12 text-xl text-muted-foreground sm:text-2xl">
            Share ideas, discover events, buy and sell items, and build your campus community.
          </p>
          <img
            src="/assets/generated/cliq-hero.dim_1600x900.png"
            alt="Students connecting"
            className="mx-auto mb-12 max-w-3xl rounded-2xl shadow-2xl"
          />
          <Button onClick={login} disabled={isLoggingIn} size="lg" className="rounded-full px-12 py-6 text-lg">
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} CLIQ. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
