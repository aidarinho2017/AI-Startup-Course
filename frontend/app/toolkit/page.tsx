"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "AI Assistants",
  "Research",
  "Vibe Coding",
  "Design",
  "Marketing",
  "Content Creation",
  "Analytics",
  "Pitching",
  "Productivity",
] as const;

type Category = (typeof CATEGORIES)[number];
type CategoryFilter = "All" | Category;

type ToolkitTool = {
  name: string;
  category: Category;
  description: string;
  bestFor: string;
  url: string;
};

const TOOLS: ToolkitTool[] = [
  {
    name: "ChatGPT",
    category: "AI Assistants",
    description:
      "AI assistant for brainstorming, writing, research, planning, and startup strategy.",
    bestFor: "Idea generation, copywriting, strategy",
    url: "https://chatgpt.com",
  },
  {
    name: "Claude",
    category: "AI Assistants",
    description:
      "AI assistant useful for long-form writing, reasoning, coding help, and document analysis.",
    bestFor: "Writing, analysis, coding support",
    url: "https://claude.ai",
  },
  {
    name: "Perplexity",
    category: "Research",
    description:
      "AI-powered research engine for finding market data, competitors, trends, and sources.",
    bestFor: "Market research, competitor research",
    url: "https://www.perplexity.ai",
  },
  {
    name: "NotebookLM",
    category: "Research",
    description:
      "Tool for uploading sources and turning them into summaries, insights, and study materials.",
    bestFor: "Research synthesis, source analysis",
    url: "https://notebooklm.google.com",
  },
  {
    name: "Cursor",
    category: "Vibe Coding",
    description:
      "AI code editor for building and editing software products faster.",
    bestFor: "Building real MVPs with code",
    url: "https://cursor.com",
  },
  {
    name: "Lovable",
    category: "Vibe Coding",
    description:
      "AI app builder that helps create full-stack apps and websites from prompts.",
    bestFor: "Fast MVPs, prototypes, web apps",
    url: "https://lovable.dev",
  },
  {
    name: "Bolt",
    category: "Vibe Coding",
    description:
      "AI builder for creating websites, apps, and prototypes using natural language.",
    bestFor: "Quick prototypes and web apps",
    url: "https://bolt.new",
  },
  {
    name: "Replit",
    category: "Vibe Coding",
    description:
      "Online development platform for coding, hosting, and deploying projects.",
    bestFor: "Student projects, quick deployment",
    url: "https://replit.com",
  },
  {
    name: "Figma",
    category: "Design",
    description:
      "Design and prototyping tool for UI, wireframes, user flows, and product mockups.",
    bestFor: "UI design, prototypes",
    url: "https://figma.com",
  },
  {
    name: "v0",
    category: "Design",
    description:
      "AI interface generation tool for quickly creating frontend UI components.",
    bestFor: "UI generation, landing pages",
    url: "https://v0.dev",
  },
  {
    name: "Canva",
    category: "Content Creation",
    description:
      "Design tool for creating social media posts, pitch visuals, posters, and simple videos.",
    bestFor: "Marketing visuals, social content",
    url: "https://canva.com",
  },
  {
    name: "CapCut",
    category: "Content Creation",
    description:
      "Video editing tool for creating short-form startup content for TikTok, Reels, and YouTube Shorts.",
    bestFor: "Short videos, founder content",
    url: "https://www.capcut.com",
  },
  {
    name: "Gamma",
    category: "Pitching",
    description:
      "AI presentation tool for creating pitch decks, reports, and startup presentations.",
    bestFor: "Pitch decks, demo day slides",
    url: "https://gamma.app",
  },
  {
    name: "PostHog",
    category: "Analytics",
    description:
      "Product analytics platform for tracking users, funnels, events, and product behavior.",
    bestFor: "MVP analytics, user behavior",
    url: "https://posthog.com",
  },
  {
    name: "Google Analytics",
    category: "Analytics",
    description:
      "Website analytics tool for tracking traffic, acquisition channels, and user behavior.",
    bestFor: "Landing page analytics",
    url: "https://analytics.google.com",
  },
  {
    name: "Notion",
    category: "Productivity",
    description:
      "Workspace for notes, docs, roadmaps, task tracking, and startup team organization.",
    bestFor: "Roadmaps, team docs, planning",
    url: "https://notion.so",
  },
  {
    name: "Trello",
    category: "Productivity",
    description:
      "Simple kanban board for managing startup tasks, sprints, and team workflows.",
    bestFor: "Task management",
    url: "https://trello.com",
  },
  {
    name: "Typeform",
    category: "Marketing",
    description:
      "Form builder for surveys, waitlists, user research, and lead collection.",
    bestFor: "Surveys, waitlists, user feedback",
    url: "https://typeform.com",
  },
  {
    name: "Mailchimp",
    category: "Marketing",
    description:
      "Email marketing platform for newsletters, waitlists, and early user communication.",
    bestFor: "Email campaigns, newsletters",
    url: "https://mailchimp.com",
  },
];

const FILTERS: CategoryFilter[] = ["All", ...CATEGORIES];

const externalLinkClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20";

export default function ToolkitPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === "All" || tool.category === selectedCategory;

      const searchableText = [
        tool.name,
        tool.category,
        tool.description,
        tool.bestFor,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        (!normalizedQuery || searchableText.includes(normalizedQuery))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10 sm:py-14">
      <Link
        href="/"
        className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
      >
        AI Startup Course
      </Link>

      <section className="mt-8 max-w-3xl space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Startup Toolkit
        </h1>
        <p className="text-lg text-muted-foreground">
          Tools to help you research, build, launch, market, and pitch your
          startup.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        <div className="relative max-w-xl">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-9"
            placeholder="Search tools"
            type="search"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((category) => (
            <Button
              key={category}
              type="button"
              size="sm"
              variant={selectedCategory === category ? "default" : "outline"}
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </section>

      {filteredTools.length > 0 ? (
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Card
              key={tool.name}
              className="flex h-full flex-col transition-colors hover:border-foreground/30 hover:bg-accent/50"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-xl">{tool.name}</CardTitle>
                  <Badge variant="outline" className="shrink-0">
                    {tool.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {tool.description}
                </p>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    Best for
                  </div>
                  <div className="mt-1 text-sm font-medium">
                    {tool.bestFor}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(externalLinkClass, "w-full")}
                >
                  Open tool
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </section>
      ) : (
        <section className="mt-8 rounded-lg border border-border bg-card p-8 text-center">
          <h2 className="text-lg font-semibold">No tools found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another search term or category.
          </p>
        </section>
      )}
    </main>
  );
}
