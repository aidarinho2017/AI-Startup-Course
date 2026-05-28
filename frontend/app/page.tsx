import Link from "next/link";
import { cn } from "@/lib/utils";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 h-11 px-6 text-base";
const btnPrimary = "bg-primary text-primary-foreground hover:opacity-90";
const btnOutline =
  "border border-border bg-background hover:bg-accent hover:text-accent-foreground";

const MODULES = [
  { n: 1, title: "Deciding to Start", desc: "Founder readiness and reality check." },
  { n: 2, title: "Startup Ideas", desc: "Generate and pressure-test your idea." },
  { n: 3, title: "Founding Team", desc: "Find your role and cofounders." },
  { n: 4, title: "MVP Building", desc: "Ship a minimum viable product with AI tools." },
  { n: 5, title: "Launch", desc: "Launch publicly and get your first users." },
  { n: 6, title: "Growth & Monetization", desc: "Grow, retain, and make money." },
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
      <div className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Execution-based learning
        </p>
        <h1 className="text-5xl font-semibold tracking-tight">
          AI Startup Course
        </h1>
        <p className="text-lg text-muted-foreground">
          A YC-inspired course that takes you from idea to launch using
          AI mentors, real homework, and shipped artifacts. Not a code
          generator. Not a no-code builder. A real startup execution path.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/signup" className={cn(btnBase, btnPrimary)}>
            Start
          </Link>
          <Link href="/login" className={cn(btnBase, btnOutline)}>
            I already have an account
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MODULES.map((m) => (
          <div
            key={m.n}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="text-xs text-muted-foreground">Module {m.n}</div>
            <div className="mt-1 font-medium">{m.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{m.desc}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
