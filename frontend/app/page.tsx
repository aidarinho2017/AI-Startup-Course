import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Box,
  BrainCircuit,
  Building2,
  Check,
  ClipboardCheck,
  Code2,
  FileText,
  Globe2,
  GraduationCap,
  Laptop,
  Lightbulb,
  Megaphone,
  MessageSquare,
  PenLine,
  Play,
  Presentation,
  Rocket,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

const badges = [
  "AI Native",
  "MVP First",
  "Product Thinking",
  "Portfolio Based",
  "No-Code & Vibe Coding",
];

const pipelineSteps = ["Idea", "PRD", "MVP", "Launch", "Growth", "Pitch"];

const oldEducation = [
  "Пишешь лабораторные",
  "Решаешь абстрактные задачи",
  "Учишь теорию бизнеса",
  "Получаешь оценки",
];

const productEducation = [
  "Создаешь реальный продукт",
  "Общаешься с пользователями",
  "Собираешь MVP",
  "Формируешь портфолио",
  "Учишься запускать стартапы",
];

const portfolioItems = [
  { title: "Product Requirements Document", icon: FileText },
  { title: "Рабочий MVP", icon: Laptop },
  { title: "Лендинг продукта", icon: Globe2 },
  { title: "Метрики и аналитика", icon: BarChart3 },
  { title: "Контент-стратегия", icon: Megaphone },
  { title: "Pitch Deck", icon: Presentation },
  { title: "Стартап-команда", icon: Users },
  { title: "Startup Portfolio", icon: Rocket },
];

const roadmap = [
  { week: "Неделя 1", title: "Идея" },
  { week: "Неделя 2", title: "Проблема и пользователи" },
  { week: "Неделя 3", title: "Customer Discovery" },
  { week: "Неделя 4", title: "PRD" },
  { week: "Неделя 5", title: "Первый MVP" },
  { week: "Неделя 6-10", title: "Разработка и тестирование" },
  { week: "Неделя 11", title: "Лендинг" },
  { week: "Неделя 12", title: "Контент" },
  { week: "Неделя 13", title: "Запуск" },
  { week: "Неделя 14", title: "Питч" },
  { week: "Неделя 15", title: "Demo Day" },
];

const aiMentor = [
  { title: "Помогает искать идеи", icon: Lightbulb },
  { title: "Проверяет домашние задания", icon: ClipboardCheck },
  { title: "Анализирует интервью", icon: MessageSquare },
  { title: "Помогает писать PRD", icon: PenLine },
  { title: "Помогает создавать контент", icon: Sparkles },
  { title: "Помогает улучшать продукт", icon: BrainCircuit },
];

const tools = ["ChatGPT", "Claude", "Cursor", "Lovable", "Bolt", "Replit", "Windsurf"];

const outcomes = [
  { title: "Основать собственный стартап", icon: Rocket },
  { title: "Создавать цифровые продукты", icon: Box },
  { title: "Работать Product Manager", icon: TrendingUp },
  { title: "Создавать AI-продукты", icon: Bot },
  { title: "Проверять гипотезы", icon: Target },
  { title: "Запускать продукты на рынок", icon: Megaphone },
];

const demoItems = [
  "MVP",
  "Pitch Deck",
  "Landing Page",
  "Метрики",
  "Контент-план",
  "Startup Portfolio",
];

const universityItems = [
  "Готовая программа",
  "15-недельный syllabus",
  "AI-наставник",
  "Практико-ориентированное обучение",
  "Аналитика и отчеты",
  "Интеграция в учебный процесс",
];

const navItems = [
  { href: "#portfolio", label: "Портфолио" },
  { href: "#program", label: "Программа" },
  { href: "#ai-first", label: "AI First" },
  { href: "#universities", label: "Университетам" },
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
      {eyebrow ? (
        <p className="mb-4 text-sm font-medium text-emerald-300">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-semibold text-white md:text-5xl">{title}</h2>
      {description ? (
        <p className="mt-5 text-base leading-7 text-zinc-400 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

function IconTile({
  title,
  icon: Icon,
}: {
  title: string;
  icon: typeof Rocket;
}) {
  return (
    <div className="group rounded-[8px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-emerald-300/40 hover:bg-white/[0.07]">
      <div className="mb-5 flex size-10 items-center justify-center rounded-[8px] border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold leading-6 text-white">{title}</h3>
    </div>
  );
}

function HeroPipeline() {
  return (
    <div className="relative mx-auto w-full min-w-0 max-w-[calc(100vw-2.5rem)] sm:max-w-xl">
      <div className="absolute -inset-px rounded-[8px] bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(52,211,153,0.14),rgba(34,211,238,0.08))]" />
      <div className="relative overflow-hidden rounded-[8px] border border-white/10 bg-black/45 p-5 shadow-2xl shadow-emerald-950/30 backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-medium text-emerald-300">15-week product pipeline</p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">Idea - PRD - MVP - Launch - Growth - Pitch</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-[8px] bg-emerald-300 text-black">
            <Rocket className="size-5" aria-hidden="true" />
          </div>
        </div>

        <div className="relative mt-6">
          <div className="relative mb-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-[linear-gradient(90deg,#34d399,#22d3ee,#fbbf24)]" />
            <div className="ai-flow-dot absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_rgba(52,211,153,0.9)]" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pipelineSteps.map((step, index) => (
              <div
                key={step}
                className="min-w-0 rounded-[8px] border border-white/10 bg-white/[0.05] p-4"
                style={{ animationDelay: `${index * 140}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-zinc-500">0{index + 1}</span>
                  <span className="size-2 rounded-full bg-emerald-300" />
                </div>
                <div className="mt-4 text-lg font-semibold text-white">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-zinc-400">
          <div className="rounded-[8px] border border-white/10 bg-black/30 p-3">
            <div className="mb-2 h-1.5 w-10 rounded-full bg-emerald-300" />
            Users
          </div>
          <div className="rounded-[8px] border border-white/10 bg-black/30 p-3">
            <div className="mb-2 h-1.5 w-12 rounded-full bg-cyan-300" />
            Build
          </div>
          <div className="rounded-[8px] border border-white/10 bg-black/30 p-3">
            <div className="mb-2 h-1.5 w-8 rounded-full bg-amber-300" />
            Pitch
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-5 md:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-white text-black">
              <BrainCircuit className="size-4" aria-hidden="true" />
            </span>
            <span className="truncate text-sm font-semibold text-white">AI Native Startup School</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-zinc-400 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-[8px] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Войти
            </Link>
            <Link
              href="/signup"
              className="hidden min-h-11 items-center justify-center gap-2 rounded-[8px] bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 sm:inline-flex"
            >
              Запустить
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
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.86)_34%,rgba(5,5,5,0.36)_72%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.18),#050505_92%)]" />

        <div className="relative mx-auto grid w-full min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-5 py-16 md:px-8 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="w-full min-w-0 max-w-[calc(100vw-2.5rem)] lg:max-w-4xl">
            <p className="mb-6 inline-flex w-fit max-w-full rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-medium leading-6 text-emerald-200 [overflow-wrap:anywhere]">
              AI-first программа для студентов, разработчиков и продуктовых команд
            </p>
            <h1 className="max-w-full break-words text-3xl font-semibold leading-[1.07] text-white sm:text-5xl md:text-7xl lg:text-8xl">
              <span className="md:hidden">
                <span className="block">Создай свой</span>
                <span className="block">AI-продукт</span>
                <span className="block">за 15 недель</span>
              </span>
              <span className="hidden md:inline">Создай свой AI-продукт за 15 недель</span>
            </h1>
            <p className="mt-7 max-w-[20rem] break-words text-lg leading-8 text-zinc-300 sm:max-w-2xl md:text-xl">
              <span className="block md:inline">От идеи до работающего MVP, лендинга,</span>{" "}
              <span className="block md:inline">контент-стратегии и инвестиционного питча.</span>{" "}
              <span className="block md:inline">Собери портфолио, которое покажет</span>{" "}
              <span className="block md:inline">работодателю больше, чем диплом.</span>
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className={primaryButton}>
                <Rocket className="size-4" aria-hidden="true" />
                Запустить стартап
              </Link>
              <a href="#program" className={secondaryButton}>
                <Play className="size-4" aria-hidden="true" />
                Посмотреть программу
              </a>
            </div>

            <div className="mt-8 flex max-w-full flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex max-w-full basis-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-zinc-200 sm:basis-auto"
                >
                  <Check className="size-4 text-emerald-300" aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <HeroPipeline />
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080808] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="Ты учишься создавать код. Мы учим создавать продукты." />

          <div className="mt-14 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div className="grid gap-3">
              {oldEducation.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[8px] border border-red-400/15 bg-red-400/[0.05] p-4 text-zinc-300">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-red-400/10 text-red-300">
                    <X className="size-4" aria-hidden="true" />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-white/10 bg-white text-sm font-bold text-black">
              VS
            </div>

            <div className="grid gap-3">
              {productEducation.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[8px] border border-emerald-300/20 bg-emerald-300/[0.07] p-4 text-white">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-emerald-300/15 text-emerald-200">
                    <Check className="size-4" aria-hidden="true" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="portfolio" className="border-b border-white/10 bg-[#050505] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Что ты получишь"
            title="Твое портфолио через 15 недель"
            description="Каждый артефакт создается на основе твоего собственного проекта."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {portfolioItems.map((item) => (
              <IconTile key={item.title} title={item.title} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section id="program" className="border-b border-white/10 bg-[#0a0a0a] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Как проходит обучение"
            title="Не курс. Настоящая стартап-студия."
            description="Roadmap устроен как продуктовый спринт: каждую неделю появляется новый результат, а не просто новая тема."
          />

          <div className="mt-16">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {roadmap.map((item, index) => (
                <div
                  key={`${item.week}-${item.title}`}
                  className="relative rounded-[8px] border border-white/10 bg-white/[0.04] p-5"
                >
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-emerald-300">{item.week}</span>
                    <span className="flex size-8 items-center justify-center rounded-[8px] bg-white/10 text-xs text-zinc-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <div className="mt-5 h-1 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-emerald-300" style={{ width: `${Math.min(100, (index + 1) * 9)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ai-first" className="border-b border-white/10 bg-[#050505] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-medium text-emerald-300">AI First</p>
              <h2 className="text-3xl font-semibold text-white md:text-5xl">
                Твой AI-наставник работает 24/7
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-400">
                Используй AI как настоящий фаундер нового поколения.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {aiMentor.map((item) => (
                <IconTile key={item.title} title={item.title} icon={item.icon} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0a0a0a] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-medium text-cyan-300">Vibe Coding</p>
              <h2 className="text-3xl font-semibold text-white md:text-5xl">
                Ты не обязан быть senior разработчиком
              </h2>
              <p className="mt-5 text-lg leading-8 text-zinc-400">
                Создавай продукты с помощью современных AI-инструментов.
              </p>
              <p className="mt-6 text-base leading-7 text-zinc-500">
                Главная задача - создать продукт, а не писать идеальный код.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="flex min-h-24 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.05] px-4 text-center text-lg font-semibold text-white transition hover:border-cyan-300/40 hover:bg-cyan-300/10"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#050505] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeader title="После программы ты сможешь" />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((item) => (
              <IconTile key={item.title} title={item.title} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0a0a0a] px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-medium text-amber-300">Demo Day</p>
            <h2 className="text-3xl font-semibold text-white md:text-5xl">Финал программы</h2>
            <p className="mt-5 text-lg leading-8 text-zinc-400">
              Каждый участник защищает собственный продукт.
            </p>
          </div>

          <div className="rounded-[8px] border border-white/10 bg-black/35 p-5">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-medium text-white">Startup Portfolio Review</p>
                <p className="mt-1 text-sm text-zinc-500">MVP, запуск, метрики, питч</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-[8px] bg-amber-300 text-black">
                <GraduationCap className="size-5" aria-hidden="true" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {demoItems.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-4 text-white">
                  <Check className="size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="universities" className="border-b border-white/10 bg-[#050505] px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <div className="mb-5 flex size-12 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.05] text-emerald-200">
              <Building2 className="size-6" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">
              Хотите запустить AI Startup School в вашем университете?
            </h2>
            <a href="mailto:hello@example.com" className={`${primaryButton} mt-8`}>
              Связаться
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {universityItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] p-4 text-zinc-200">
                <Check className="size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-white px-5 py-24 text-black md:px-8">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0))]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-semibold text-zinc-600">AI Native Startup School</p>
          <h2 className="text-4xl font-semibold leading-[1.06] md:text-7xl">
            Перестань изучать стартапы. Начни строить свой.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 md:text-xl">
            Через 15 недель у тебя будет продукт, а не просто сертификат.
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              href="/signup"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            >
              <Rocket className="size-4" aria-hidden="true" />
              Запустить стартап
            </Link>
          </div>
          <p className="mt-8 text-sm text-zinc-500">От идеи до продукта.</p>
        </div>
      </section>

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
