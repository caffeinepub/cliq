import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getBoostedPosts } from "../lib/boostUtils";

function formatTimeRemaining(expiresAt: number): string {
  const ms = expiresAt - Date.now();
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}h ${minutes}m remaining`;
}

function timeProgressPercent(boostedAt: number, expiresAt: number): number {
  const total = expiresAt - boostedAt;
  const elapsed = Date.now() - boostedAt;
  return Math.max(0, Math.min(100, 100 - (elapsed / total) * 100));
}

export function BoostsPage() {
  const boosts = getBoostedPosts();
  const now = Date.now();
  const active = boosts.filter((b) => b.expiresAt > now);
  const past = boosts.filter((b) => b.expiresAt <= now);

  return (
    <div data-ocid="boosts_page.page" className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black">My Boosts 🚀</h1>
      </div>

      {boosts.length === 0 && (
        <div
          data-ocid="boosts_page.empty_state"
          className="flex flex-col items-center gap-4 py-16 text-center"
        >
          <span className="text-5xl">🚀</span>
          <p className="font-bold text-lg">No active boosts</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Boost a post for ₦500/24h to reach more students on campus.
          </p>
        </div>
      )}

      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-bold text-primary uppercase tracking-wide">
            Active Boosts
          </h2>
          {active.map((boost, idx) => {
            const costPerResult = (
              500 / Math.max(boost.views + boost.messages, 1)
            ).toFixed(2);
            const ocid = `boosts_page.item.${idx + 1}` as const;
            return (
              <Card
                key={boost.postId}
                data-ocid={ocid}
                className="border-2 rounded-2xl"
              >
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-xs text-muted-foreground font-medium">
                        Post ID
                      </p>
                      <p className="text-sm font-bold font-mono">
                        {boost.postId.toString().slice(0, 12)}…
                      </p>
                    </div>
                    <Badge className="rounded-full font-bold text-xs bg-primary text-primary-foreground">
                      {boost.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-muted p-2">
                      <p className="text-xl font-black">{boost.views}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                        Views
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted p-2">
                      <p className="text-xl font-black">{boost.messages}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                        Messages
                      </p>
                    </div>
                    <div className="rounded-xl bg-primary/10 p-2">
                      <p className="text-xl font-black text-primary">
                        ₦{costPerResult}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                        Per result
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground font-medium">
                        {formatTimeRemaining(boost.expiresAt)}
                      </span>
                      <span className="font-bold text-primary">₦500</span>
                    </div>
                    <Progress
                      value={timeProgressPercent(
                        boost.boostedAt,
                        boost.expiresAt,
                      )}
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-bold text-muted-foreground uppercase tracking-wide">
            Past Boosts
          </h2>
          {past.map((boost) => (
            <div
              key={boost.postId}
              className="flex items-center justify-between rounded-xl border-2 px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold font-mono">
                  {boost.postId.toString().slice(0, 12)}…
                </p>
                <p className="text-xs text-muted-foreground">
                  {boost.views} views · {boost.messages} messages
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-full font-bold text-xs"
              >
                {boost.label}
              </Badge>
            </div>
          ))}
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="underline hover:text-primary"
          target="_blank"
          rel="noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
