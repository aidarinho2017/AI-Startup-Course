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
} from "lucide-react";

const navItems = [
  { href: "#result", label: "Результат" },
  { href: "#process", label: "Процесс" },
  { href: "#audience", label: "Для кого" },
  { href: "#launch", label: "Запуск" },
];

const badges = ["MVP за 30 дней", "AI-first workflow", "Первые пользователи"];

const workflowSteps = ["Идея", "MVP", "Запуск", "Рост"];

const checklistItems = [
  { label: "Проблема сформулирована", done: true },
  { label: "MVP собран", done: true },
  { label: "Лендинг опубликован", done: true },
  { label: "Первые пользователи", done: false },
];

const resultItems = [
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
];

const processSteps = [
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
];

const audienceCards = [
  {
    title: "Launch",
    description: "Запуск продукта за 30 дней",
    caption: "Для фаундеров и команд",
    icon: Rocket,
    accent: "emerald",
  },
  {
    title: "University",
    description: "15-недельная система продуктового обучения",
    caption: "Для университетов и innovation labs",
    icon: Building2,
    accent: "cyan",
  },
  {
    title: "Enterprise",
    description: "Запуск внутренних AI-продуктов",
    caption: "Для компаний",
    icon: TrendingUp,
    accent: "amber",
  },
];

const primaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300";

const secondaryButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

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

function ProductCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: typeof Rocket;
}) {
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

function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[calc(100vw-2.5rem)] sm:max-w-xl">
      <div className="absolute -inset-px rounded-[8px] bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(52,211,153,0.16),rgba(34,211,238,0.1))]" />
      <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-black/50 p-4 shadow-2xl shadow-emerald-950/30 backdrop-blur md:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-emerald-300">AI Product Builder</p>
            <p className="mt-1 truncate text-sm leading-6 text-zinc-400">Идея - MVP - Запуск - Рост</p>
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
            {workflowSteps.map((step, index) => (
              <div
                key={step}
                className="min-h-[104px] min-w-0 rounded-[8px] border border-white/10 bg-white/[0.05] p-3 transition duration-300 hover:border-white/20 hover:bg-white/[0.08]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-zinc-500">{String(index + 1).padStart(2, "0")}</span>
                  <span className="size-2 rounded-full bg-emerald-300" />
                </div>
                <div className="mt-5 text-base font-semibold text-white">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[8px] border border-white/10 bg-black/35 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">Launch checklist</p>
                <p className="mt-1 text-xs text-zinc-500">30-day sprint</p>
              </div>
              <ListChecks className="size-5 text-emerald-300" aria-hidden="true" />
            </div>
            <div className="space-y-3">
              {checklistItems.map((item) => (
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
                <p className="text-sm font-medium text-white">AI assistant</p>
                <Sparkles className="size-4 text-cyan-200" aria-hidden="true" />
              </div>
              <p className="mt-3 text-xs leading-5 text-zinc-400">Собрать MVP экран и первый оффер.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-3">
                <BarChart3 className="mb-4 size-4 text-emerald-300" aria-hidden="true" />
                <p className="text-2xl font-semibold text-white">72%</p>
                <p className="mt-1 text-xs text-zinc-500">MVP ready</p>
              </div>
              <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-3">
                <Users className="mb-4 size-4 text-amber-300" aria-hidden="true" />
                <p className="text-2xl font-semibold text-white">18</p>
                <p className="mt-1 text-xs text-zinc-500">user leads</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessWorkflow() {
  return (
    <div className="mt-16">
      <div className="grid gap-4 lg:grid-cols-5">
        {processSteps.map((step, index) => (
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
            {index < processSteps.length - 1 ? (
              <div className="absolute -right-2 top-1/2 hidden size-4 -translate-y-1/2 rotate-45 border-r border-t border-white/15 bg-[#0a0a0a] lg:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-white text-black">
              <BrainCircuit className="size-4" aria-hidden="true" />
            </span>
            <span className="max-w-[10rem] truncate text-sm font-semibold text-white sm:max-w-none">
              AI Product Builder
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-zinc-400 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-[8px] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Войти
            </Link>
            <Link href="/signup" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:min-h-11 sm:px-5 sm:py-3">
              Начать
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
              AI-first запуск продуктов
            </p>
            <h1 className="max-w-full break-words text-4xl font-semibold leading-[1.04] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="md:hidden">
                <span className="block">Запусти свой</span>
                <span className="block">продукт</span>
                <span className="block">за 30 дней</span>
              </span>
              <span className="hidden md:inline">Запусти свой продукт за 30 дней</span>
            </h1>
            <p className="mt-7 max-w-[22rem] break-words text-lg leading-8 text-zinc-300 sm:max-w-2xl md:text-xl">
              От идеи до MVP, лендинга и первых пользователей с помощью AI.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className={primaryButton}>
                <Rocket className="size-4" aria-hidden="true" />
                Начать
              </Link>
              <a href="#result" className={secondaryButton}>
                <ArrowRight className="size-4" aria-hidden="true" />
                Что получится
              </a>
            </div>

            <div className="mt-8 flex max-w-full flex-wrap gap-2">
              {badges.map((badge) => (
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

          <HeroDashboard />
        </div>
      </section>

      <section id="result" className="border-b border-white/10 bg-[#050505] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Результат"
            title="Что получишь через 30 дней"
            description="Не сертификат. Реальный продукт."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resultItems.map((item) => (
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
            eyebrow="Процесс"
            title="Просто. Быстро. Практично."
            description="Каждый шаг двигает продукт ближе к рынку: от проблемы до MVP, обратной связи и упакованного кейса."
          />
          <ProcessWorkflow />
        </div>
      </section>

      <section id="audience" className="border-b border-white/10 bg-[#050505] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Для кого"
            title="Один продуктовый workflow. Три формата запуска."
            description="Сначала продукт и результат. Формат выбирается под команду, университет или компанию."
          />

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {audienceCards.map((card) => (
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
                  href="https://t.me/aidarissakhanov"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-emerald-200"
                >
                  Обсудить запуск
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="launch" className="relative flex min-h-[78vh] items-center overflow-hidden bg-white px-5 py-24 text-black md:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0))]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-semibold text-zinc-600">AI Product Builder</p>
          <h2 className="text-4xl font-semibold leading-[1.04] md:text-7xl">
            <span className="block">Хватит учиться.</span>
            <span className="block">Начни создавать.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 md:text-xl">
            Через 30 дней у тебя будет продукт, а не просто знания.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            >
              <Rocket className="size-4" aria-hidden="true" />
              Запустить продукт
            </Link>
          </div>
          <p className="mt-8 text-sm text-zinc-500">Идея - MVP - первые пользователи.</p>
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
            <p>Алматы, Толе Би 59</p>
            <p>Qasynda Group 2026</p>
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
