import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Moon,
  Music2,
  Shield,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const FEATURES = [
  {
    icon: "🏠",
    title: "Match Your Lifestyle",
    bullets: [
      "Budget range that actually works",
      "Preferred location on campus",
      "Daily habits & routines",
    ],
  },
  {
    icon: "✅",
    title: "Safe & Verified",
    bullets: [
      "Students only — no randos",
      "University email required",
      "Zero tolerance for scammers",
    ],
  },
  {
    icon: "💬",
    title: "Chat & Connect",
    bullets: [
      "Message matches directly",
      "Meet before committing",
      "Built-in safety tips",
    ],
  },
];

const STEPS = [
  {
    num: 1,
    emoji: "📝",
    title: "Create your profile",
    sub: "Takes just 2 minutes",
  },
  {
    num: 2,
    emoji: "🤝",
    title: "Get matched",
    sub: "Based on your preferences",
  },
  {
    num: 3,
    emoji: "🏠",
    title: "Chat, meet, move in",
    sub: "Connect and find your place",
  },
];

const FAQS = [
  {
    q: "Is it free?",
    a: "Yes, CLIQ Roomie is completely free for all students. No hidden fees, no premium tiers — just connect and find your match.",
  },
  {
    q: "Which universities are supported?",
    a: "We support 50+ Nigerian universities including UNILAG, UI, OAU, LASU, ABU, FUTA, UNIBEN, and more. If your school isn't listed yet, you can request it and we'll add it within 48 hours.",
  },
  {
    q: "How does matching work?",
    a: "Our algorithm matches you based on budget overlap, sleep schedule, cleanliness level, lifestyle habits, and overall vibe. The higher the score, the more compatible you are as roommates.",
  },
  {
    q: "Is it safe?",
    a: "All users are verified with a university email address. We encourage meeting in a public place first and provide built-in safety tips before every first connection.",
  },
];

export function RoomieLandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: "#FF6B35" }}
            >
              C
            </div>
            <span className="font-bold text-foreground">CLIQ Roomie</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
              data-ocid="roomie_landing.link"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
              data-ocid="roomie_landing.link"
            >
              How it works
            </a>
            <a
              href="#faq"
              className="hover:text-foreground transition-colors"
              data-ocid="roomie_landing.link"
            >
              FAQ
            </a>
          </nav>
          <Link to="/roomie-match">
            <Button
              size="sm"
              className="rounded-full px-5 font-semibold"
              style={{ backgroundColor: "#FF6B35", color: "white" }}
              data-ocid="roomie_landing.primary_button"
            >
              Find Your Match →
            </Button>
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div className="space-y-6">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Badge
                className="rounded-full px-3 py-1 text-xs font-semibold mb-4"
                style={{
                  backgroundColor: "#FFF5F0",
                  color: "#FF6B35",
                  border: "1px solid #FF6B3544",
                }}
              >
                🏠 Roommate Matching for Nigerian Students
              </Badge>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-foreground"
            >
              Find your perfect{" "}
              <span style={{ color: "#FF6B35" }}>roommate</span> on campus
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Match by budget, lifestyle, sleep schedule, and more. No stress,
              no scammers — just real students finding real roommates.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link to="/roomie-match">
                <Button
                  size="lg"
                  className="rounded-full px-8 font-semibold min-h-[44px] w-full sm:w-auto"
                  style={{ backgroundColor: "#FF6B35", color: "white" }}
                  data-ocid="roomie_landing.primary_button"
                >
                  Find Your Match <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3"
            >
              {["5,000+ students matched", "50+ Nigerian universities"].map(
                (badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium"
                    style={{
                      backgroundColor: "#FFF5F0",
                      color: "#FF6B35",
                      border: "1px solid #FF6B3530",
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {badge}
                  </div>
                ),
              )}
            </motion.div>
          </div>

          {/* Right — Match card */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-sm">
              {/* Decorative blob */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-10 blur-2xl"
                style={{ backgroundColor: "#FF6B35" }}
              />

              <Card
                className="relative rounded-2xl shadow-bold-lg"
                style={{ border: "1px solid #E5E5E5" }}
                data-ocid="roomie_landing.card"
              >
                <CardContent className="p-6 space-y-4">
                  {/* Avatar + match % */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #FF6B35, #FF9A6C)",
                      }}
                    >
                      S
                    </div>
                    <div>
                      <p
                        className="text-3xl font-bold leading-none"
                        style={{ color: "#FF6B35" }}
                      >
                        96% match
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        with you
                      </p>
                    </div>
                  </div>

                  {/* Name + uni */}
                  <div>
                    <p className="font-semibold text-base text-foreground">
                      Sarah O.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      University of Lagos
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid #E5E5E5" }} />

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <div
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#F8F9FA",
                        color: "#6C757D",
                        border: "1px solid #E5E5E5",
                      }}
                    >
                      <Wallet
                        className="h-3 w-3"
                        style={{ color: "#FF6B35" }}
                      />
                      ₦15k–20k/mo
                    </div>
                    <div
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#F8F9FA",
                        color: "#6C757D",
                        border: "1px solid #E5E5E5",
                      }}
                    >
                      <Moon className="h-3 w-3" style={{ color: "#FF6B35" }} />
                      Night owl
                    </div>
                    <div
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        backgroundColor: "#F8F9FA",
                        color: "#6C757D",
                        border: "1px solid #E5E5E5",
                      }}
                    >
                      <Music2
                        className="h-3 w-3"
                        style={{ color: "#FF6B35" }}
                      />
                      Music lover
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    size="sm"
                    className="w-full rounded-full font-semibold min-h-[44px]"
                    style={{ backgroundColor: "#FF6B35", color: "white" }}
                    data-ocid="roomie_landing.secondary_button"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Send Message →
                  </Button>
                </CardContent>
              </Card>

              {/* Floating compatibility pill */}
              <div
                className="absolute -top-3 -right-3 rounded-full px-3 py-1.5 text-xs font-bold shadow-bold flex items-center gap-1"
                style={{ backgroundColor: "#FF6B35", color: "white" }}
              >
                ✨ Top Match
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="py-16 md:py-24"
        style={{ backgroundColor: "#F8F9FA" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Everything you need to find the right match
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Built for Nigerian campus life.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card
                  className="rounded-2xl h-full"
                  style={{
                    border: "1px solid #E5E5E5",
                    backgroundColor: "white",
                  }}
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="text-4xl">{f.icon}</div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <ul className="space-y-2">
                      {f.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2
                            className="h-4 w-4 mt-0.5 shrink-0"
                            style={{ color: "#FF6B35" }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-4 py-16 md:py-24"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Get matched in 3 easy steps
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            From signup to move-in, we've got you covered.
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop connector line */}
          <div
            className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px"
            style={{ borderTop: "2px dashed #FF6B35", opacity: 0.4 }}
          />

          <div className="grid md:grid-cols-3 gap-8 relative">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-4"
              >
                {/* Number badge */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 relative"
                  style={{ backgroundColor: "#FF6B35" }}
                >
                  {step.num}
                </div>

                <div className="text-4xl">{step.emoji}</div>

                <div>
                  <h3 className="font-semibold text-base text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Link to="/roomie-match">
            <Button
              size="lg"
              className="rounded-full px-10 font-semibold min-h-[44px]"
              style={{ backgroundColor: "#FF6B35", color: "white" }}
              data-ocid="roomie_landing.primary_button"
            >
              Start Matching Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ── TESTIMONIALS PLACEHOLDER ── */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "#F8F9FA" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              What students say
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <div
              className="rounded-2xl p-10 text-center space-y-4"
              style={{
                backgroundColor: "#FFF5F0",
                border: "2px dashed #FF6B3566",
              }}
              data-ocid="roomie_landing.card"
            >
              <div className="text-5xl">💬</div>
              <p className="text-xl font-semibold text-foreground">
                Real student stories coming soon
              </p>
              <p className="text-muted-foreground text-sm">
                Be the first to share your Roomie success story!
              </p>
              <Link to="/roomie-match">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full mt-2 font-semibold min-h-[44px]"
                  style={{ borderColor: "#FF6B35", color: "#FF6B35" }}
                  data-ocid="roomie_landing.secondary_button"
                >
                  I found my roommate →
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Accordion
            type="single"
            collapsible
            className="space-y-3"
            data-ocid="roomie_landing.panel"
          >
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`item-${i}`}
                className="rounded-xl px-5"
                style={{
                  border: "1px solid #E5E5E5",
                  backgroundColor: "white",
                }}
                data-ocid={`roomie_landing.item.${i + 1}`}
              >
                <AccordionTrigger
                  className="text-left font-semibold text-base py-4 hover:no-underline"
                  style={{ color: "#212529" }}
                >
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: "#FF6B35" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-4 text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="h-6 w-6 text-white/80" />
            <span className="text-white/80 text-sm font-medium">
              Safe. Free. Verified.
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Ready to find your person?
          </h2>
          <p className="text-white/80 text-lg">
            Join 5,000+ students already matched on CLIQ
          </p>
          <Link to="/roomie-match">
            <Button
              size="lg"
              className="rounded-full px-10 font-semibold min-h-[44px] mt-2"
              style={{ backgroundColor: "white", color: "#FF6B35" }}
              data-ocid="roomie_landing.primary_button"
            >
              Get Started Free →
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ── SITE FOOTER ── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: "#FF6B35" }}
            >
              C
            </div>
            <span>CLIQ Roomie — Your campus, connected</span>
          </div>
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
