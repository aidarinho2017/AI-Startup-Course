import { SubmissionFieldSpec } from "@/lib/types";

export type CourseId = "en" | "ru";
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

export type Course = {
  id: CourseId;
  name: string;
  description: string;
  missions: CourseMission[];
  sections: CourseSection[];
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

type MissionTranslation = Pick<
  CourseMission,
  "title" | "shortTitle" | "description" | "brief" | "artifact" | "videos" | "submissionFields"
>;

const RUSSIAN_MISSION_COPY: Record<string, MissionTranslation> = {
  "build-simple": {
    title: "Миссия 1 — Начните с простого",
    shortTitle: "Начните с простого",
    description: "Откройте Lovable по ссылке с дополнительными кредитами и создайте что-нибудь простое.",
    brief: "Не усложняйте идею. Цель — создать работающий результат и привыкнуть быстро запускать проекты.",
    artifact: "Ссылка на Lovable",
    videos: [{ title: "Lovable AI: сайт и хостинг за 5 минут", youtubeId: "nkPYaKZzW6o" }],
    submissionFields: [{ key: "lovable_url", label: "Ссылка на Lovable", type: "url", required: true, placeholder: "https://..." }],
  },
  "build-vibe-coding": {
    title: "Миссия 2 — Освойте вайб-кодинг",
    shortTitle: "Освойте вайб-кодинг",
    description: "Узнайте, что такое вайб-кодинг, затем создайте новый сайт или улучшите результат первой миссии.",
    brief: "Используйте любой no-code или AI-инструмент, например Replit, Lovable или Bolt.",
    artifact: "Ссылка на сайт",
    videos: [{ title: "Что такое вайб-кодинг", youtubeId: "w3K1EguBrTc" }],
    submissionFields: [{ key: "website_url", label: "Ссылка на сайт", type: "url", required: true, placeholder: "https://..." }],
  },
  "build-real-vibe-coding": {
    title: "Миссия 3 — Попробуйте настоящий вайб-кодинг",
    shortTitle: "Настоящий вайб-кодинг",
    description: "Выберите один урок по работе с AI-агентом, попробуйте этот процесс и отправьте репозиторий GitHub с кодом.",
    brief: "Не нужно изучать все инструменты. Выберите Claude Code, Cursor или Codex и создайте код, которым можно поделиться.",
    artifact: "Ссылка на GitHub с кодом",
    videos: [
      { title: "Claude Code для начинающих", youtubeId: "jmJaHWVSwOo" },
      { title: "Обзор Cursor AI", youtubeId: "23in9xpt-FE" },
      { title: "Обзор OpenAI Codex", youtubeId: "hqBSEvgSf40" },
    ],
    submissionFields: [{ key: "github_url", label: "Ссылка на GitHub с кодом", type: "url", required: true, placeholder: "https://github.com/..." }],
  },
  "discover-find-problem": {
    title: "Миссия 4 — Найдите проблему",
    shortTitle: "Найдите проблему",
    description: "Найдите реальные проблемы вокруг себя и предложите возможное решение для каждой.",
    brief: "Главная задача бизнеса — решать проблемы и зарабатывать деньги.",
    artifact: "5 реальных проблем и 5 решений",
    videos: [{ title: "Как найти идею для IT-стартапа", youtubeId: "b96WmfzlBoc" }],
    submissionFields: [{ key: "problems_and_solutions", label: "Проблемы и решения", type: "textarea", required: true, placeholder: "Опишите 5 реальных проблем и 5 способов их решения." }],
  },
  "discover-talk-to-people": {
    title: "Миссия 5 — Поговорите с людьми",
    shortTitle: "Поговорите с людьми",
    description: "Выйдите из офиса и узнайте новое из реальных разговоров.",
    brief: "Говорите с людьми напрямую. Узнайте, что они действительно делают, что причиняет им боль и что вас удивило.",
    artifact: "5 выводов из разговоров с клиентами",
    videos: [{ title: "Что такое проблемное интервью и зачем оно нужно", youtubeId: "BmNX3eCy5JY" }],
    submissionFields: [{ key: "conversation_insights", label: "Выводы из разговоров", type: "textarea", required: true, placeholder: "Запишите 5 выводов: с кем вы говорили и что узнали." }],
  },
  "discover-evaluate-ideas": {
    title: "Миссия 6 — Найдите и оцените идеи стартапа",
    shortTitle: "Найдите и оцените идеи",
    description: "Превратите найденные проблемы и разговоры в амбициозные идеи стартапов.",
    brief: "Ищите амбициозные и конкретные идеи, связанные с реальными проблемами.",
    artifact: "5 амбициозных идей стартапов",
    videos: [{ title: "Как протестировать бизнес-идею: 5 шагов к MVP", youtubeId: "_-SQM9EwHLM" }],
    submissionFields: [{ key: "startup_ideas", label: "Идеи стартапов", type: "textarea", required: true, placeholder: "Запишите 5 самых амбициозных идей стартапов." }],
  },
  "launch-build-mvp": {
    title: "Миссия 7 — Создайте MVP",
    shortTitle: "Создайте MVP",
    description: "Создайте минимально жизнеспособный продукт для проверки продуктовых гипотез.",
    brief: "MVP — это минимально жизнеспособный продукт. Проверьте гипотезы с помощью самой маленькой полезной версии.",
    artifact: "Ссылка на MVP",
    videos: [{ title: "MVP для стартапа", youtubeId: "dJDPjR44AbM" }],
    submissionFields: [{ key: "mvp_url", label: "Ссылка на MVP", type: "url", required: true, placeholder: "https://..." }],
  },
  "launch-product-online": {
    title: "Миссия 8 — Запустите продукт онлайн",
    shortTitle: "Запустите продукт онлайн",
    description: "Расскажите всем о своём продукте, публикуя материалы о нём в интернете.",
    brief: "Опубликуйте 10 постов о продукте в Instagram, Threads или LinkedIn. Отправьте ссылки на аккаунты с этими публикациями.",
    artifact: "Ссылки на аккаунты в соцсетях",
    videos: [{ title: "Схема продвижения во всех соцсетях", youtubeId: "B7QMtvVj7zE" }],
    submissionFields: [{ key: "social_account_links", label: "Ссылки на аккаунты в соцсетях", type: "link_list", required: true, placeholder: "https://..." }],
  },
  "launch-first-customers": {
    title: "Миссия 9 — Найдите первых клиентов",
    shortTitle: "Найдите первых клиентов",
    description: "Опишите, кому вы продаёте и как собираетесь найти первых клиентов.",
    brief: "Конкретно опишите клиентов, где они проводят время и какие первые шаги продаж вы сделаете.",
    artifact: "План поиска клиентов и продаж",
    videos: [{ title: "Как и где стартапу найти первых клиентов", youtubeId: "lWwkb8d_4q0" }],
    submissionFields: [{ key: "customer_plan", label: "План поиска клиентов и продаж", type: "textarea", required: true, placeholder: "Опишите своих клиентов, каналы поиска и первые шаги продаж." }],
  },
};

export const RUSSIAN_COURSE_MISSIONS: CourseMission[] = COURSE_MISSIONS.map((mission) => ({
  ...mission,
  ...RUSSIAN_MISSION_COPY[mission.slug],
  slug: `ru-${mission.slug}`,
  resources: mission.resources.map((resource) => ({ ...resource, label: "Приглашение Lovable" })),
}));

const RUSSIAN_SECTION_COPY: Record<CourseSectionId, Pick<CourseSection, "title" | "description">> = {
  build: { title: "Создание", description: "Создайте первые продукты с помощью ИИ и опубликуйте рабочие ссылки." },
  discover: { title: "Исследование", description: "Изучите клиентов, уточните проблемы и найдите сильные идеи стартапов." },
  launch: { title: "Запуск", description: "Покажите продукт реальным пользователям и получите первые отзывы." },
  scale: { title: "Рост", description: "Улучшайте удержание, каналы роста и монетизацию после запуска." },
};

export const RUSSIAN_COURSE_SECTIONS: CourseSection[] = COURSE_SECTIONS.map((section) => ({
  ...section,
  ...RUSSIAN_SECTION_COPY[section.id],
  missionSlugs: section.missionSlugs.map((slug) => `ru-${slug}`),
}));

export const COURSES: Course[] = [
  {
    id: "en",
    name: "English Course",
    description: "Build, validate, and launch an AI product through nine practical missions.",
    missions: COURSE_MISSIONS,
    sections: COURSE_SECTIONS,
  },
  {
    id: "ru",
    name: "Курс на русском",
    description: "Создайте, проверьте и запустите AI-продукт за девять практических миссий.",
    missions: RUSSIAN_COURSE_MISSIONS,
    sections: RUSSIAN_COURSE_SECTIONS,
  },
];

export const ALL_COURSE_MISSIONS = COURSES.flatMap((course) => course.missions);

export function getCourse(courseId: string): Course | undefined {
  return COURSES.find((course) => course.id === courseId);
}

export function getCourseMission(slug: string): CourseMission | undefined {
  return ALL_COURSE_MISSIONS.find((mission) => mission.slug === slug);
}

export function getSectionMissions(section: CourseSection): CourseMission[] {
  return section.missionSlugs
    .map((slug) => getCourseMission(slug))
    .filter((mission): mission is CourseMission => Boolean(mission));
}

export function getMissionSection(mission: CourseMission): CourseSection {
  return getMissionCourse(mission).sections.find((section) => section.id === mission.sectionId)!;
}

export function getMissionCourse(mission: CourseMission): Course {
  return COURSES.find((course) => course.missions.some((item) => item.slug === mission.slug))!;
}
