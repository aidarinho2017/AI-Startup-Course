import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  Check,
  ClipboardCheck,
  FileText,
  Globe2,
  Layers3,
  ListChecks,
  Megaphone,
  MessageSquare,
  Presentation,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

type Locale = "en" | "ru" | "kk";
type Accent = "emerald" | "cyan" | "amber";
type SearchParams = {
  lang?: string | string[];
};

type ProductItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type AudienceCard = ProductItem & {
  caption: string;
  accent: Accent;
  ctaHref: string;
  ctaLabel: string;
};

type LandingCopy = {
  navItems: Array<{ href: string; label: string }>;
  header: {
    login: string;
    start: string;
    languageLabel: string;
  };
  badges: string[];
  hero: {
    eyebrow: string;
    titleMobile: string[];
    titleDesktop: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  dashboard: {
    flow: string;
    workflowSteps: string[];
    checklistTitle: string;
    checklistSubtitle: string;
    checklistItems: Array<{ label: string; done: boolean }>;
    assistantTitle: string;
    assistantText: string;
    mvpReady: string;
    userLeads: string;
  };
  result: {
    eyebrow: string;
    title: string;
    description: string;
    items: ProductItem[];
  };
  process: {
    eyebrow: string;
    title: string;
    description: string;
    steps: ProductItem[];
  };
  audience: {
    eyebrow: string;
    title: string;
    description: string;
    cards: AudienceCard[];
  };
  finalCta: {
    eyebrow: string;
    titleLines: string[];
    description: string;
    cta: string;
    footnote: string;
  };
  footer: {
    address: string;
    company: string;
  };
};

const landingCopy: Record<Locale, LandingCopy> = {
  en: {
    navItems: [
      { href: "#result", label: "Result" },
      { href: "#process", label: "Process" },
      { href: "#audience", label: "For whom" },
      { href: "#launch", label: "Launch" },
    ],
    header: {
      login: "Log in",
      start: "Start",
      languageLabel: "Landing page language",
    },
    badges: ["MVP in 30 days", "AI-first workflow", "First users"],
    hero: {
      eyebrow: "AI-first product launch",
      titleMobile: ["Launch your", "product", "in 30 days"],
      titleDesktop: "Launch your product in 30 days",
      description:
        "Go from idea to MVP, landing page, and first users with an AI-first workflow.",
      primaryCta: "Start",
      secondaryCta: "See what you'll build",
    },
    dashboard: {
      flow: "Idea - MVP - Launch - Growth",
      workflowSteps: ["Idea", "MVP", "Launch", "Growth"],
      checklistTitle: "Launch checklist",
      checklistSubtitle: "30-day sprint",
      checklistItems: [
        { label: "Problem defined", done: true },
        { label: "MVP built", done: true },
        { label: "Landing page published", done: true },
        { label: "First users", done: false },
      ],
      assistantTitle: "AI assistant",
      assistantText: "Shape the first MVP screen and offer.",
      mvpReady: "MVP ready",
      userLeads: "user leads",
    },
    result: {
      eyebrow: "Result",
      title: "What you'll have after 30 days",
      description: "Not a certificate. A real product.",
      items: [
        {
          title: "MVP",
          description: "A working product version you can show to the market.",
          icon: Layers3,
        },
        {
          title: "Landing page",
          description: "A product page with a clear offer and CTA.",
          icon: Globe2,
        },
        {
          title: "First users",
          description: "Hypotheses, interviews, feedback, and your first leads.",
          icon: Users,
        },
        {
          title: "Pitch Deck",
          description: "A concise deck for partners, universities, or investors.",
          icon: Presentation,
        },
        {
          title: "Product Portfolio",
          description: "A case study that shows the actual product and your process.",
          icon: FileText,
        },
        {
          title: "Content Plan",
          description: "A launch and publishing plan for testing demand.",
          icon: Megaphone,
        },
      ],
    },
    process: {
      eyebrow: "Process",
      title: "Simple. Fast. Practical.",
      description:
        "Every step moves the product closer to market: problem, MVP, feedback, and a packaged case study.",
      steps: [
        {
          title: "Find a problem",
          description: "Focus on audience pain, not an abstract idea.",
          icon: Target,
        },
        {
          title: "Build with AI",
          description: "Create MVP screens, copy, interfaces, and logic faster.",
          icon: Bot,
        },
        {
          title: "Get feedback",
          description: "Show the product to real people and sharpen the offer.",
          icon: MessageSquare,
        },
        {
          title: "Launch the MVP",
          description: "Publish the landing page, collect leads, and track early signals.",
          icon: Rocket,
        },
        {
          title: "Package the case",
          description:
            "Turn the product, decisions, and results into a strong portfolio case.",
          icon: ClipboardCheck,
        },
      ],
    },
    audience: {
      eyebrow: "For whom",
      title: "One product workflow. Three launch formats.",
      description:
        "Start with the product and outcome. Choose the format for a team, university, or company.",
      cards: [
        {
          title: "Launch",
          description: "Launch a product in 30 days",
          caption: "For founders and teams",
          icon: Rocket,
          accent: "emerald",
          ctaHref: "/login",
          ctaLabel: "Start",
        },
        {
          title: "University",
          description: "A 15-week product education system",
          caption: "For universities and innovation labs",
          icon: Building2,
          accent: "cyan",
          ctaHref: "https://t.me/aidarissakhanov",
          ctaLabel: "Discuss University plan",
        },
        {
          title: "Enterprise",
          description: "Launch internal AI products",
          caption: "For companies",
          icon: TrendingUp,
          accent: "amber",
          ctaHref: "https://t.me/aidarissakhanov",
          ctaLabel: "Discuss Enterprise plan",
        },
      ],
    },
    finalCta: {
      eyebrow: "AI Product Builder",
      titleLines: ["Stop only learning.", "Start building."],
      description: "In 30 days, you'll have a product, not just knowledge.",
      cta: "Launch your product",
      footnote: "Idea - MVP - first users.",
    },
    footer: {
      address: "Almaty, Tole Bi 59",
      company: "Qasynda Group 2026",
    },
  },
  ru: {
    navItems: [
      { href: "#result", label: "Результат" },
      { href: "#process", label: "Процесс" },
      { href: "#audience", label: "Для кого" },
      { href: "#launch", label: "Запуск" },
    ],
    header: {
      login: "Войти",
      start: "Начать",
      languageLabel: "Язык лендинга",
    },
    badges: ["MVP за 30 дней", "AI-first workflow", "Первые пользователи"],
    hero: {
      eyebrow: "AI-first запуск продуктов",
      titleMobile: ["Запусти свой", "продукт", "за 30 дней"],
      titleDesktop: "Запусти свой продукт за 30 дней",
      description: "От идеи до MVP, лендинга и первых пользователей с помощью AI.",
      primaryCta: "Начать",
      secondaryCta: "Что получится",
    },
    dashboard: {
      flow: "Идея - MVP - Запуск - Рост",
      workflowSteps: ["Идея", "MVP", "Запуск", "Рост"],
      checklistTitle: "Launch checklist",
      checklistSubtitle: "30-day sprint",
      checklistItems: [
        { label: "Проблема сформулирована", done: true },
        { label: "MVP собран", done: true },
        { label: "Лендинг опубликован", done: true },
        { label: "Первые пользователи", done: false },
      ],
      assistantTitle: "AI assistant",
      assistantText: "Собрать MVP экран и первый оффер.",
      mvpReady: "MVP ready",
      userLeads: "user leads",
    },
    result: {
      eyebrow: "Результат",
      title: "Что получишь через 30 дней",
      description: "Не сертификат. Реальный продукт.",
      items: [
        {
          title: "MVP",
          description: "Рабочая версия продукта, которую можно показать рынку.",
          icon: Layers3,
        },
        {
          title: "Лендинг",
          description: "Страница продукта с понятным оффером и CTA.",
          icon: Globe2,
        },
        {
          title: "Первые пользователи",
          description: "Гипотезы, интервью, обратная связь и первые заявки.",
          icon: Users,
        },
        {
          title: "Pitch Deck",
          description: "Короткая презентация для партнеров, вузов или инвесторов.",
          icon: Presentation,
        },
        {
          title: "Product Portfolio",
          description: "Кейс, который показывает реальный продукт и процесс.",
          icon: FileText,
        },
        {
          title: "Контент-план",
          description: "План запуска и публикаций для проверки спроса.",
          icon: Megaphone,
        },
      ],
    },
    process: {
      eyebrow: "Процесс",
      title: "Просто. Быстро. Практично.",
      description:
        "Каждый шаг двигает продукт ближе к рынку: от проблемы до MVP, обратной связи и упакованного кейса.",
      steps: [
        {
          title: "Находишь проблему",
          description: "Фокусируешься на боли аудитории, а не на абстрактной идее.",
          icon: Target,
        },
        {
          title: "Создаешь продукт с AI",
          description: "Собираешь MVP, тексты, интерфейсы и логику быстрее обычного.",
          icon: Bot,
        },
        {
          title: "Получаешь обратную связь",
          description: "Показываешь продукт реальным людям и улучшаешь оффер.",
          icon: MessageSquare,
        },
        {
          title: "Запускаешь MVP",
          description: "Публикуешь лендинг, собираешь заявки и первые метрики.",
          icon: Rocket,
        },
        {
          title: "Собираешь портфолио",
          description: "Упаковываешь продукт, решения и результаты в сильный кейс.",
          icon: ClipboardCheck,
        },
      ],
    },
    audience: {
      eyebrow: "Для кого",
      title: "Один продуктовый workflow. Три формата запуска.",
      description:
        "Сначала продукт и результат. Формат выбирается под команду, университет или компанию.",
      cards: [
        {
          title: "Launch",
          description: "Запуск продукта за 30 дней",
          caption: "Для фаундеров и команд",
          icon: Rocket,
          accent: "emerald",
          ctaHref: "/login",
          ctaLabel: "Начать",
        },
        {
          title: "University",
          description: "15-недельная система продуктового обучения",
          caption: "Для университетов и innovation labs",
          icon: Building2,
          accent: "cyan",
          ctaHref: "https://t.me/aidarissakhanov",
          ctaLabel: "Обсудить University plan",
        },
        {
          title: "Enterprise",
          description: "Запуск внутренних AI-продуктов",
          caption: "Для компаний",
          icon: TrendingUp,
          accent: "amber",
          ctaHref: "https://t.me/aidarissakhanov",
          ctaLabel: "Обсудить Enterprise plan",
        },
      ],
    },
    finalCta: {
      eyebrow: "AI Product Builder",
      titleLines: ["Хватит учиться.", "Начни создавать."],
      description: "Через 30 дней у тебя будет продукт, а не просто знания.",
      cta: "Запустить продукт",
      footnote: "Идея - MVP - первые пользователи.",
    },
    footer: {
      address: "Алматы, Толе Би 59",
      company: "Qasynda Group 2026",
    },
  },
  kk: {
    navItems: [
      { href: "#result", label: "Нәтиже" },
      { href: "#process", label: "Үдеріс" },
      { href: "#audience", label: "Кімге арналған" },
      { href: "#launch", label: "Іске қосу" },
    ],
    header: {
      login: "Кіру",
      start: "Бастау",
      languageLabel: "Лендинг тілі",
    },
    badges: ["30 күнде MVP", "AI-first жұмыс үдерісі", "Алғашқы пайдаланушылар"],
    hero: {
      eyebrow: "AI-first өнімді іске қосу",
      titleMobile: ["Өніміңді", "30 күнде", "іске қос"],
      titleDesktop: "Өніміңді 30 күнде іске қос",
      description:
        "AI көмегімен идеядан MVP-ге, лендингке және алғашқы пайдаланушыларға дейін жет.",
      primaryCta: "Бастау",
      secondaryCta: "Не жасайтыныңды көр",
    },
    dashboard: {
      flow: "Идея - MVP - Іске қосу - Өсу",
      workflowSteps: ["Идея", "MVP", "Іске қосу", "Өсу"],
      checklistTitle: "Іске қосу тізімі",
      checklistSubtitle: "30 күндік спринт",
      checklistItems: [
        { label: "Мәселе анықталды", done: true },
        { label: "MVP жасалды", done: true },
        { label: "Лендинг жарияланды", done: true },
        { label: "Алғашқы пайдаланушылар", done: false },
      ],
      assistantTitle: "AI көмекші",
      assistantText: "MVP-дің алғашқы экраны мен ұсынысын әзірле.",
      mvpReady: "MVP дайын",
      userLeads: "ықтимал клиент",
    },
    result: {
      eyebrow: "Нәтиже",
      title: "30 күннен кейін қолыңда не болады",
      description: "Сертификат емес. Нақты өнім.",
      items: [
        {
          title: "MVP",
          description: "Нарыққа көрсетуге болатын өнімнің жұмыс істейтін нұсқасы.",
          icon: Layers3,
        },
        {
          title: "Лендинг",
          description: "Нақты ұсынысы мен әрекетке шақыруы бар өнім парақшасы.",
          icon: Globe2,
        },
        {
          title: "Алғашқы пайдаланушылар",
          description: "Гипотезалар, сұхбаттар, кері байланыс және алғашқы өтінімдер.",
          icon: Users,
        },
        {
          title: "Питч-дек",
          description:
            "Серіктестерге, университеттерге немесе инвесторларға арналған ықшам презентация.",
          icon: Presentation,
        },
        {
          title: "Өнім портфолиосы",
          description: "Нақты өнім мен оны жасау үдерісін көрсететін кейс.",
          icon: FileText,
        },
        {
          title: "Контент-жоспар",
          description: "Сұранысты тексеруге арналған іске қосу және жарияланымдар жоспары.",
          icon: Megaphone,
        },
      ],
    },
    process: {
      eyebrow: "Үдеріс",
      title: "Қарапайым. Жылдам. Іс жүзінде.",
      description:
        "Әр қадам өнімді нарыққа жақындатады: мәселе, MVP, кері байланыс және жинақталған кейс.",
      steps: [
        {
          title: "Мәселені тап",
          description: "Абстрактілі идеяға емес, аудиторияның мәселесіне назар аудар.",
          icon: Target,
        },
        {
          title: "AI көмегімен жаса",
          description: "MVP экрандарын, мәтіндерді, интерфейстерді және логиканы жылдамырақ жаса.",
          icon: Bot,
        },
        {
          title: "Кері байланыс ал",
          description: "Өнімді нақты адамдарға көрсетіп, ұсынысты жақсарт.",
          icon: MessageSquare,
        },
        {
          title: "MVP-ді іске қос",
          description: "Лендингті жариялап, өтінімдер жина және алғашқы көрсеткіштерді бақыла.",
          icon: Rocket,
        },
        {
          title: "Кейсті рәсімде",
          description: "Өнімді, шешімдерді және нәтижелерді мықты портфолио кейсіне айналдыр.",
          icon: ClipboardCheck,
        },
      ],
    },
    audience: {
      eyebrow: "Кімге арналған",
      title: "Бір өнім жасау үдерісі. Іске қосудың үш форматы.",
      description:
        "Алдымен өнім мен нәтиже. Командаға, университетке немесе компанияға сай форматты таңда.",
      cards: [
        {
          title: "Іске қосу",
          description: "Өнімді 30 күнде іске қосу",
          caption: "Құрылтайшылар мен командаларға",
          icon: Rocket,
          accent: "emerald",
          ctaHref: "/login",
          ctaLabel: "Бастау",
        },
        {
          title: "Университет",
          description: "15 апталық өнімдік білім беру жүйесі",
          caption: "Университеттер мен инновациялық зертханаларға",
          icon: Building2,
          accent: "cyan",
          ctaHref: "https://t.me/aidarissakhanov",
          ctaLabel: "Университет жоспарын талқылау",
        },
        {
          title: "Корпоративтік",
          description: "Компанияның ішкі AI өнімдерін іске қосу",
          caption: "Компанияларға",
          icon: TrendingUp,
          accent: "amber",
          ctaHref: "https://t.me/aidarissakhanov",
          ctaLabel: "Корпоративтік жоспарды талқылау",
        },
      ],
    },
    finalCta: {
      eyebrow: "AI Product Builder",
      titleLines: ["Тек оқи берме.", "Жасай баста."],
      description: "30 күннен кейін тек білім емес, дайын өнімің болады.",
      cta: "Өніміңді іске қос",
      footnote: "Идея - MVP - алғашқы пайдаланушылар.",
    },
    footer: {
      address: "Алматы, Төле би көшесі, 59",
      company: "Qasynda Group 2026",
    },
  },
};

const languageOptions: Array<{ locale: Locale; label: string }> = [
  { locale: "en", label: "EN" },
  { locale: "ru", label: "RU" },
  { locale: "kk", label: "KZ" },
];

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

function getLocale(searchParams?: SearchParams): Locale {
  const lang = Array.isArray(searchParams?.lang) ? searchParams.lang[0] : searchParams?.lang;

  return lang === "ru" || lang === "kk" ? lang : "en";
}

function getLanguageHref(locale: Locale) {
  return `/?lang=${locale}`;
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="mb-4 text-sm font-medium text-emerald-300">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold leading-tight text-white md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  return (
    <div
      aria-label={label}
      className="flex items-center rounded-[8px] border border-white/10 bg-white/[0.04] p-1 text-xs font-semibold"
    >
      {languageOptions.map((option) => {
        const isActive = option.locale === locale;

        return (
          <Link
            key={option.locale}
            href={getLanguageHref(option.locale)}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-[6px] px-2 py-1.5 transition ${
              isActive
                ? "bg-white text-black"
                : "text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

function ProductCard({
  title,
  description,
  icon: Icon,
}: ProductItem) {
  return (
    <div className="group min-h-[210px] rounded-[8px] border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/[0.07]">
      <div className="mb-8 flex size-11 items-center justify-center rounded-[8px] border border-emerald-300/20 bg-emerald-300/10 text-emerald-200 transition group-hover:border-emerald-300/40 group-hover:bg-emerald-300/15">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold leading-7 text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}

function HeroDashboard({
  dashboard,
}: {
  dashboard: LandingCopy["dashboard"];
}) {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[calc(100vw-2.5rem)] sm:max-w-xl">
      <div className="absolute -inset-px rounded-[8px] bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(52,211,153,0.16),rgba(34,211,238,0.1))]" />
      <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-black/50 p-4 shadow-2xl shadow-emerald-950/30 backdrop-blur md:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-300">AI Product Builder</p>
            <p className="mt-1 truncate text-sm leading-6 text-zinc-400">{dashboard.flow}</p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-emerald-300 text-black">
            <Rocket className="size-5" aria-hidden="true" />
          </div>
        </div>

        <div className="relative mt-6">
          <div className="relative mb-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-[linear-gradient(90deg,#34d399,#22d3ee,#fbbf24)]" />
            <div className="ai-flow-dot absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(52,211,153,0.9)]" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {dashboard.workflowSteps.map((step, index) => (
              <div
                key={step}
                className="min-h-[104px] min-w-0 rounded-[8px] border border-white/10 bg-white/[0.05] p-3 transition duration-300 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500">{String(index + 1).padStart(2, "0")}</span>
                  <span className="size-2 rounded-full bg-emerald-300" />
                </div>
                <div className="mt-5 break-words text-base font-semibold text-white">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[8px] border border-white/10 bg-black/35 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{dashboard.checklistTitle}</p>
                <p className="mt-1 text-xs text-zinc-500">{dashboard.checklistSubtitle}</p>
              </div>
              <ListChecks className="size-5 text-emerald-300" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              {dashboard.checklistItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm text-zinc-300">
                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-[6px] border ${
                      item.done
                        ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-200"
                        : "border-white/15 bg-white/[0.04] text-zinc-500"
                    }`}
                  >
                    {item.done ? <Check className="size-3" aria-hidden="true" /> : null}
                  </span>
                  <span className="min-w-0 truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[8px] border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-white">{dashboard.assistantTitle}</p>
                <Sparkles className="size-4 text-cyan-200" aria-hidden="true" />
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-400">{dashboard.assistantText}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-3">
                <BarChart3 className="mb-4 size-4 text-emerald-300" aria-hidden="true" />
                <p className="text-2xl font-semibold text-white">72%</p>
                <p className="mt-1 text-xs text-zinc-500">{dashboard.mvpReady}</p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-3">
                <Users className="mb-4 size-4 text-amber-300" aria-hidden="true" />
                <p className="text-2xl font-semibold text-white">18</p>
                <p className="mt-1 text-xs text-zinc-500">{dashboard.userLeads}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessWorkflow({
  steps,
}: {
  steps: ProductItem[];
}) {
  return (
    <div className="mt-16">
      <div className="grid gap-4 lg:grid-cols-5">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="group relative min-h-[230px] rounded-[8px] border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-white/[0.07]"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="flex size-10 items-center justify-center rounded-[8px] border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                <step.icon className="size-5" aria-hidden="true" />
              </div>
              <span className="text-sm text-zinc-500">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="text-lg font-semibold leading-7 text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
            {index < steps.length - 1 ? (
              <div className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border-r border-t border-white/15 bg-[#0a0a0a] lg:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

type LandingPageProps = {
  searchParams?: Promise<SearchParams>;
};

export default async function LandingPage({ searchParams }: LandingPageProps) {
  const locale = getLocale(searchParams ? await searchParams : undefined);
  const copy = landingCopy[locale];
  const rootHref = getLanguageHref(locale);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-5 md:gap-3 md:px-8">
          <Link href={rootHref} className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-white text-black">
              <BrainCircuit className="size-4" aria-hidden="true" />
            </span>
            <span className="max-w-[8rem] truncate text-sm font-semibold text-white sm:max-w-none">
              AI Product Builder
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-zinc-400 lg:flex">
            {copy.navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher locale={locale} label={copy.header.languageLabel} />
            <Link
              href="/login"
              className="hidden rounded-[8px] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              {copy.header.login}
            </Link>
            <Link href="/signup" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:min-h-11 sm:px-5 sm:py-3">
              {copy.header.start}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen border-b border-white/10 pt-16">
        <Image
          src="/images/ai-startup-school-hero.png"
          alt=""
          fill
          priority
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.88)_34%,rgba(5,5,5,0.38)_72%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.18),#050505_92%)]" />

        <div className="relative mx-auto grid w-full min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-5 py-16 md:px-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="w-full min-w-0 max-w-[calc(100vw-2.5rem)] lg:max-w-4xl">
            <p className="mb-6 inline-flex w-fit max-w-full rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-medium leading-6 text-emerald-200 [overflow-wrap:anywhere]">
              {copy.hero.eyebrow}
            </p>
            <h1 className="max-w-full break-words text-4xl font-semibold leading-[1.04] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="md:hidden">
                {copy.hero.titleMobile.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
              <span className="hidden md:inline">{copy.hero.titleDesktop}</span>
            </h1>
            <p className="mt-7 max-w-[22rem] break-words text-lg leading-8 text-zinc-300 sm:max-w-2xl md:text-xl">
              {copy.hero.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className={primaryButton}>
                <Rocket className="size-4" aria-hidden="true" />
                {copy.hero.primaryCta}
              </Link>
              <a href="#result" className={secondaryButton}>
                <ArrowRight className="size-4" aria-hidden="true" />
                {copy.hero.secondaryCta}
              </a>
            </div>

            <div className="mt-8 flex max-w-full flex-wrap gap-2">
              {copy.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex max-w-full basis-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-zinc-200 sm:basis-auto"
                >
                  <Check className="size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <HeroDashboard dashboard={copy.dashboard} />
        </div>
      </section>

      <section id="result" className="border-b border-white/10 bg-[#050505] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={copy.result.eyebrow}
            title={copy.result.title}
            description={copy.result.description}
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.result.items.map((item) => (
              <ProductCard
                key={item.title}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="process" className="border-b border-white/10 bg-[#0a0a0a] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={copy.process.eyebrow}
            title={copy.process.title}
            description={copy.process.description}
          />
          <ProcessWorkflow steps={copy.process.steps} />
        </div>
      </section>

      <section id="audience" className="border-b border-white/10 bg-[#050505] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow={copy.audience.eyebrow}
            title={copy.audience.title}
            description={copy.audience.description}
          />

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {copy.audience.cards.map((card) => {
              const isExternalCta = card.ctaHref.startsWith("http");

              return (
                <div
                  key={card.title}
                  className="group relative min-h-[300px] overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-px ${
                      card.accent === "emerald"
                        ? "bg-emerald-300"
                        : card.accent === "cyan"
                          ? "bg-cyan-300"
                          : "bg-amber-300"
                    } opacity-70`}
                  />
                  <div
                    className={`mb-10 flex size-12 items-center justify-center rounded-[8px] border ${
                      card.accent === "emerald"
                        ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                        : card.accent === "cyan"
                          ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                          : "border-amber-300/20 bg-amber-300/10 text-amber-200"
                    }`}
                  >
                    <card.icon className="size-6" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-zinc-500">{card.caption}</p>
                  <h3 className="mt-4 text-3xl font-semibold text-white">{card.title}</h3>
                  <p className="mt-5 text-base leading-7 text-zinc-300">{card.description}</p>
                  <Link
                    href={card.ctaHref}
                    target={isExternalCta ? "_blank" : undefined}
                    rel={isExternalCta ? "noreferrer" : undefined}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-emerald-200"
                  >
                    {card.ctaLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="launch" className="relative flex min-h-[78vh] items-center overflow-hidden border-b border-white/10 bg-[#050505] px-5 py-24 text-white md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.16),transparent_34%),linear-gradient(180deg,#0a0a0a_0%,#050505_76%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(52,211,153,0.6),rgba(34,211,238,0.5),transparent)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-semibold text-emerald-300">{copy.finalCta.eyebrow}</p>
          <h2 className="text-4xl font-semibold leading-[1.04] text-white md:text-7xl">
            {copy.finalCta.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl">
            {copy.finalCta.description}
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <Rocket className="size-4" aria-hidden="true" />
              {copy.finalCta.cta}
            </Link>
          </div>
          <p className="mt-8 text-sm text-zinc-500">{copy.finalCta.footnote}</p>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#050505] px-5 py-8 text-sm text-zinc-500 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-white">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-white text-black">
              <BrainCircuit className="size-4" aria-hidden="true" />
            </span>
            <span className="font-semibold">AI Product Builder</span>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <p>{copy.footer.address}</p>
            <p>{copy.footer.company}</p>
          </div>
        </div>
      </footer>

      <style>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #050505;
        }

        @keyframes ai-flow {
          0% {
            left: 0%;
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            left: calc(100% - 0.75rem);
            opacity: 0;
          }
        }

        .ai-flow-dot {
          animation: ai-flow 5.8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
