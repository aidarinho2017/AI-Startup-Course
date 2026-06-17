import { SubmissionFieldSpec } from "@/lib/types";

export type CourseSectionId = "build" | "discover" | "launch" | "scale";

export type CourseVideo = {
  title: string;
  youtubeId: string;
};

export type CourseResource = {
  label: string;
  href: string;
};

export type CourseMission = {
  slug: string;
  sectionId: CourseSectionId;
  title: string;
  shortTitle: string;
  description: string;
  brief: string;
  artifact: string;
  resources: CourseResource[];
  videos: CourseVideo[];
  submissionFields: SubmissionFieldSpec[];
};

export type CourseSection = {
  id: CourseSectionId;
  title: string;
  description: string;
  status: "active" | "coming-soon";
  missionSlugs: string[];
};

export const BUILD_MISSIONS: CourseMission[] = [
  {
    slug: "build-simple",
    sectionId: "build",
    title: "Mission 1 - Start with Simple",
    shortTitle: "Start with Simple",
    description: "Open Lovable, use the invite link for extra credits, and build anything simple.",
    brief: "Do not overthink the idea. The goal is to create a working artifact and get comfortable shipping quickly.",
    artifact: "Lovable link",
    resources: [
      {
        label: "Lovable invite",
        href: "https://lovable.dev/invite/LNGUZ6X",
      },
    ],
    videos: [
      {
        title: "Mission 1 video",
        youtubeId: "rqvtLxwMklo",
      },
    ],
    submissionFields: [
      {
        key: "lovable_url",
        label: "Lovable link",
        type: "url",
        required: true,
        placeholder: "https://...",
      },
    ],
  },
  {
    slug: "build-vibe-coding",
    sectionId: "build",
    title: "Mission 2 - Learn Vibe Coding",
    shortTitle: "Learn Vibe Coding",
    description: "Learn what vibe coding is, then create a new website or improve your first mission.",
    brief: "Use any no-code or AI coding tool such as Replit, Lovable, or Bolt.",
    artifact: "Website link",
    resources: [],
    videos: [
      {
        title: "What is vibe coding",
        youtubeId: "-LFB8D9WV-g",
      },
    ],
    submissionFields: [
      {
        key: "website_url",
        label: "Website link",
        type: "url",
        required: true,
        placeholder: "https://...",
      },
    ],
  },
  {
    slug: "build-real-vibe-coding",
    sectionId: "build",
    title: "Mission 3 - Learn Real Vibe Coding",
    shortTitle: "Learn Real Vibe Coding",
    description: "Choose one coding-agent tutorial, try the workflow, and submit a GitHub repository with code.",
    brief: "You do not need to learn every tool. Pick Claude Code, Cursor, or Codex and use it to create code you can share.",
    artifact: "GitHub link with code",
    resources: [],
    videos: [
      {
        title: "Claude Code Tutorial",
        youtubeId: "ntDIxaeo3Wg",
      },
      {
        title: "Cursor Tutorial",
        youtubeId: "ocMOZpuAMw4",
      },
      {
        title: "Codex",
        youtubeId: "0TitiOk7hbI",
      },
    ],
    submissionFields: [
      {
        key: "github_url",
        label: "GitHub link with code",
        type: "url",
        required: true,
        placeholder: "https://github.com/...",
      },
    ],
  },
];

export const DISCOVER_MISSIONS: CourseMission[] = [
  {
    slug: "discover-find-problem",
    sectionId: "discover",
    title: "Mission 4 - Find the Problem",
    shortTitle: "Find the Problem",
    description: "Identify real problems around you and connect each problem to a possible solution.",
    brief: "Business's main goal is to solve problems and earn money.",
    artifact: "5 existing problems and 5 solutions",
    resources: [],
    videos: [
      {
        title: "Find the problem",
        youtubeId: "vDXkpJw16os",
      },
    ],
    submissionFields: [
      {
        key: "problems_and_solutions",
        label: "Problems and solutions",
        type: "textarea",
        required: true,
        placeholder: "Write 5 existing problems you have and 5 solutions for how you would solve them.",
      },
    ],
  },
  {
    slug: "discover-talk-to-people",
    sectionId: "discover",
    title: "Mission 5 - Talk to People",
    shortTitle: "Talk to People",
    description: "Get out of the building and learn from real conversations.",
    brief: "Talk to people directly. Focus on what they actually do, what hurts, and what surprised you.",
    artifact: "5 customer conversation insights",
    resources: [],
    videos: [
      {
        title: "Get out of the building",
        youtubeId: "xr2zFXblSRM",
      },
    ],
    submissionFields: [
      {
        key: "conversation_insights",
        label: "Conversation insights",
        type: "textarea",
        required: true,
        placeholder: "Write 5 insights about who you talked to and what they told you.",
      },
    ],
  },
  {
    slug: "discover-evaluate-ideas",
    sectionId: "discover",
    title: "Mission 6 - Find and Evaluate Your Startup Ideas",
    shortTitle: "Find and Evaluate Startup Ideas",
    description: "Turn problems and conversations into ambitious startup ideas.",
    brief: "Aim for ideas that are ambitious, specific, and connected to real problems.",
    artifact: "5 ambitious startup ideas",
    resources: [],
    videos: [
      {
        title: "Find and evaluate startup ideas",
        youtubeId: "vDXkpJw16os",
      },
    ],
    submissionFields: [
      {
        key: "startup_ideas",
        label: "Startup ideas",
        type: "textarea",
        required: true,
        placeholder: "Write down your 5 most ambitious startup ideas.",
      },
    ],
  },
];

export const LAUNCH_MISSIONS: CourseMission[] = [
  {
    slug: "launch-build-mvp",
    sectionId: "launch",
    title: "Mission 7 - Build an MVP",
    shortTitle: "Build an MVP",
    description: "Build a minimum viable product that can test your product hypotheses.",
    brief: "MVP means Minimum Viable Product. Use it to check your hypotheses about your product with the smallest useful version.",
    artifact: "MVP link",
    resources: [],
    videos: [
      {
        title: "How to build an MVP",
        youtubeId: "QRZ_l7cVzzU",
      },
      {
        title: "MVP lesson",
        youtubeId: "GTNgiTK-ic8",
      },
    ],
    submissionFields: [
      {
        key: "mvp_url",
        label: "MVP link",
        type: "url",
        required: true,
        placeholder: "https://...",
      },
    ],
  },
  {
    slug: "launch-product-online",
    sectionId: "launch",
    title: "Mission 8 - Launch Your Product Online",
    shortTitle: "Launch Your Product Online",
    description: "Let everyone know what you are building by posting about your product online.",
    brief: "Publish 10 posts about your product on Instagram, Threads, or LinkedIn. Submit the social account links where those posts can be found.",
    artifact: "Social account links",
    resources: [],
    videos: [
      {
        title: "How to launch",
        youtubeId: "u36A-YTxiOw",
      },
    ],
    submissionFields: [
      {
        key: "social_account_links",
        label: "Social account links",
        type: "link_list",
        required: true,
        placeholder: "https://...",
      },
    ],
  },
  {
    slug: "launch-first-customers",
    sectionId: "launch",
    title: "Mission 9 - How to Get Your First Customers",
    shortTitle: "Get Your First Customers",
    description: "Describe who you are selling to and how you plan to reach your first customers.",
    brief: "Be specific about your customers, where they spend time, and the first sales actions you will take.",
    artifact: "Customer and sales plan",
    resources: [],
    videos: [
      {
        title: "How to get your first customers",
        youtubeId: "hyYCn_kAngI",
      },
    ],
    submissionFields: [
      {
        key: "customer_plan",
        label: "Customer and sales plan",
        type: "textarea",
        required: true,
        placeholder: "Describe your customers, who you are selling to, and how you plan to sell.",
      },
    ],
  },
];

export const COURSE_MISSIONS: CourseMission[] = [
  ...BUILD_MISSIONS,
  ...DISCOVER_MISSIONS,
  ...LAUNCH_MISSIONS,
];

export const COURSE_SECTIONS: CourseSection[] = [
  {
    id: "build",
    title: "Build",
    description: "Create your first AI-built artifacts and publish real links.",
    status: "active",
    missionSlugs: BUILD_MISSIONS.map((mission) => mission.slug),
  },
  {
    id: "discover",
    title: "Discover",
    description: "Customer discovery, problem clarity, and stronger startup ideas.",
    status: "active",
    missionSlugs: DISCOVER_MISSIONS.map((mission) => mission.slug),
  },
  {
    id: "launch",
    title: "Launch",
    description: "Put the product in front of real users and collect early feedback.",
    status: "active",
    missionSlugs: LAUNCH_MISSIONS.map((mission) => mission.slug),
  },
  {
    id: "scale",
    title: "Scale",
    description: "Improve retention, growth loops, and monetization after launch.",
    status: "coming-soon",
    missionSlugs: [],
  },
];

export function getCourseMission(slug: string): CourseMission | undefined {
  return COURSE_MISSIONS.find((mission) => mission.slug === slug);
}

export function getSectionMissions(section: CourseSection): CourseMission[] {
  return section.missionSlugs
    .map((slug) => getCourseMission(slug))
    .filter((mission): mission is CourseMission => Boolean(mission));
}

export function getMissionSection(mission: CourseMission): CourseSection {
  return COURSE_SECTIONS.find((section) => section.id === mission.sectionId)!;
}
