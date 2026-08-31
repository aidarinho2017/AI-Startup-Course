"""Active course mission definitions used by backend tracking.

Static lesson display content such as resource links, YouTube titles, and page
copy lives in the frontend. The backend keeps only the mission records and
submission validation shape needed for progress, deadlines, instructor review,
Telegram, and AI mentor chat.
"""

from datetime import datetime
from typing import NotRequired, TypedDict


class FieldSpec(TypedDict, total=False):
    key: str
    label: str
    type: str  # "text" | "textarea" | "url" | "link_list"
    required: bool
    placeholder: str


class VideoSpec(TypedDict):
    youtube_id: str
    title: str


class ModuleSpec(TypedDict):
    slug: str
    title: str
    description: str
    order_index: int
    has_chatbot: bool
    due_at: NotRequired[datetime | None]
    videos: list[VideoSpec]
    submission_fields: list[FieldSpec]


ENGLISH_MODULES: list[ModuleSpec] = [
    {
        "slug": "build-simple",
        "title": "Mission 1 - Start with Simple",
        "description": "Use Lovable to build anything simple and submit your project link.",
        "order_index": 1,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "lovable_url",
                "label": "Lovable link",
                "type": "url",
                "required": True,
                "placeholder": "https://...",
            },
        ],
    },
    {
        "slug": "build-vibe-coding",
        "title": "Mission 2 - Learn Vibe Coding",
        "description": "Learn what vibe coding is, then create or improve a no-code website.",
        "order_index": 2,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "website_url",
                "label": "Website link",
                "type": "url",
                "required": True,
                "placeholder": "https://...",
            },
        ],
    },
    {
        "slug": "build-real-vibe-coding",
        "title": "Mission 3 - Learn Real Vibe Coding",
        "description": "Choose one coding-agent tutorial and submit a GitHub repo with code.",
        "order_index": 3,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "github_url",
                "label": "GitHub link with code",
                "type": "url",
                "required": True,
                "placeholder": "https://github.com/...",
            },
        ],
    },
    {
        "slug": "discover-find-problem",
        "title": "Mission 4 - Find the Problem",
        "description": "Identify real problems around you and connect each problem to a possible solution.",
        "order_index": 4,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "problems_and_solutions",
                "label": "Problems and solutions",
                "type": "textarea",
                "required": True,
                "placeholder": "Write 5 existing problems you have and 5 solutions for how you would solve them.",
            },
        ],
    },
    {
        "slug": "discover-talk-to-people",
        "title": "Mission 5 - Talk to People",
        "description": "Get out of the building and learn from real conversations.",
        "order_index": 5,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "conversation_insights",
                "label": "Conversation insights",
                "type": "textarea",
                "required": True,
                "placeholder": "Write 5 insights about who you talked to and what they told you.",
            },
        ],
    },
    {
        "slug": "discover-evaluate-ideas",
        "title": "Mission 6 - Find and Evaluate Your Startup Ideas",
        "description": "Turn problems and conversations into ambitious startup ideas.",
        "order_index": 6,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "startup_ideas",
                "label": "Startup ideas",
                "type": "textarea",
                "required": True,
                "placeholder": "Write down your 5 most ambitious startup ideas.",
            },
        ],
    },
    {
        "slug": "launch-build-mvp",
        "title": "Mission 7 - Build an MVP",
        "description": "Build a minimum viable product that can test your product hypotheses.",
        "order_index": 7,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "mvp_url",
                "label": "MVP link",
                "type": "url",
                "required": True,
                "placeholder": "https://...",
            },
        ],
    },
    {
        "slug": "launch-product-online",
        "title": "Mission 8 - Launch Your Product Online",
        "description": "Let everyone know what you are building by posting about your product online.",
        "order_index": 8,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "social_account_links",
                "label": "Social account links",
                "type": "link_list",
                "required": True,
                "placeholder": "https://...",
            },
        ],
    },
    {
        "slug": "launch-first-customers",
        "title": "Mission 9 - How to Get Your First Customers",
        "description": "Describe who you are selling to and how you plan to reach your first customers.",
        "order_index": 9,
        "has_chatbot": True,
        "videos": [],
        "submission_fields": [
            {
                "key": "customer_plan",
                "label": "Customer and sales plan",
                "type": "textarea",
                "required": True,
                "placeholder": "Describe your customers, who you are selling to, and how you plan to sell.",
            },
        ],
    },
]

_RUSSIAN_COPY: dict[str, tuple[str, str, str, str]] = {
    "build-simple": (
        "Миссия 1 — Начните с простого",
        "Создайте что-нибудь простое в Lovable и отправьте ссылку на проект.",
        "Ссылка на Lovable",
        "https://...",
    ),
    "build-vibe-coding": (
        "Миссия 2 — Освойте вайб-кодинг",
        "Узнайте, что такое вайб-кодинг, затем создайте или улучшите сайт без кода.",
        "Ссылка на сайт",
        "https://...",
    ),
    "build-real-vibe-coding": (
        "Миссия 3 — Попробуйте настоящий вайб-кодинг",
        "Выберите один инструмент для программирования с ИИ и отправьте репозиторий GitHub с кодом.",
        "Ссылка на GitHub с кодом",
        "https://github.com/...",
    ),
    "discover-find-problem": (
        "Миссия 4 — Найдите проблему",
        "Найдите реальные проблемы вокруг себя и предложите возможное решение для каждой.",
        "Проблемы и решения",
        "Опишите 5 реальных проблем и 5 способов их решения.",
    ),
    "discover-talk-to-people": (
        "Миссия 5 — Поговорите с людьми",
        "Выйдите из офиса и узнайте новое из реальных разговоров.",
        "Выводы из разговоров",
        "Запишите 5 выводов: с кем вы говорили и что узнали.",
    ),
    "discover-evaluate-ideas": (
        "Миссия 6 — Найдите и оцените идеи стартапа",
        "Превратите найденные проблемы и разговоры в амбициозные идеи стартапов.",
        "Идеи стартапов",
        "Запишите 5 самых амбициозных идей стартапов.",
    ),
    "launch-build-mvp": (
        "Миссия 7 — Создайте MVP",
        "Создайте минимально жизнеспособный продукт для проверки гипотез.",
        "Ссылка на MVP",
        "https://...",
    ),
    "launch-product-online": (
        "Миссия 8 — Запустите продукт онлайн",
        "Расскажите о продукте, опубликовав материалы о нём в интернете.",
        "Ссылки на аккаунты в соцсетях",
        "https://...",
    ),
    "launch-first-customers": (
        "Миссия 9 — Найдите первых клиентов",
        "Опишите, кому вы продаёте и как собираетесь найти первых клиентов.",
        "План поиска клиентов и продаж",
        "Опишите своих клиентов, каналы поиска и первые шаги продаж.",
    ),
}

_KAZAKH_COPY: dict[str, tuple[str, str, str, str]] = {
    "build-simple": (
        "1-миссия — Қарапайымнан бастаңыз",
        "Lovable арқылы қарапайым жоба жасап, жоба сілтемесін жіберіңіз.",
        "Lovable сілтемесі",
        "https://...",
    ),
    "build-vibe-coding": (
        "2-миссия — Вайб-кодингті үйреніңіз",
        "Вайб-кодингпен танысып, жаңа сайт жасаңыз немесе алғашқы жобаңызды жақсартыңыз.",
        "Сайт сілтемесі",
        "https://...",
    ),
    "build-real-vibe-coding": (
        "3-миссия — Нағыз вайб-кодингті қолданып көріңіз",
        "AI-кодинг құралын таңдап, коды бар GitHub репозиторийін жіберіңіз.",
        "Коды бар GitHub сілтемесі",
        "https://github.com/...",
    ),
    "discover-find-problem": (
        "4-миссия — Мәселені табыңыз",
        "Айналаңыздағы нақты мәселелерді тауып, әрқайсысына ықтимал шешім ұсыныңыз.",
        "Мәселелер мен шешімдер",
        "5 нақты мәселе мен оларды шешудің 5 жолын жазыңыз.",
    ),
    "discover-talk-to-people": (
        "5-миссия — Адамдармен сөйлесіңіз",
        "Ықтимал пайдаланушылармен сөйлесіп, олардың нақты тәжірибесінен жаңа нәрсе біліңіз.",
        "Сұхбаттан алынған қорытындылар",
        "Кіммен сөйлескеніңізді және не білгеніңізді көрсететін 5 қорытынды жазыңыз.",
    ),
    "discover-evaluate-ideas": (
        "6-миссия — Стартап идеяларын тауып, бағалаңыз",
        "Табылған мәселелер мен сұхбаттарды нақты стартап идеяларына айналдырыңыз.",
        "Стартап идеялары",
        "Ең өршіл 5 стартап идеяңызды жазыңыз.",
    ),
    "launch-build-mvp": (
        "7-миссия — MVP жасаңыз",
        "Өнім гипотезасын тексеретін минималды өміршең өнім жасаңыз.",
        "MVP сілтемесі",
        "https://...",
    ),
    "launch-product-online": (
        "8-миссия — Өнімді онлайн іске қосыңыз",
        "Өніміңіз туралы әлеуметтік желілерде жариялап, аудиторияға таныстырыңыз.",
        "Әлеуметтік желідегі аккаунт сілтемелері",
        "https://...",
    ),
    "launch-first-customers": (
        "9-миссия — Алғашқы клиенттерді табыңыз",
        "Кімге сататыныңызды және алғашқы клиенттерге қалай жететініңізді сипаттаңыз.",
        "Клиенттерді табу және сату жоспары",
        "Клиенттеріңізді, арналарды және сатудың алғашқы қадамдарын сипаттаңыз.",
    ),
}


def _russian_module(module: ModuleSpec) -> ModuleSpec:
    title, description, label, placeholder = _RUSSIAN_COPY[module["slug"]]
    fields = [dict(field) for field in module["submission_fields"]]
    fields[0]["label"] = label
    fields[0]["placeholder"] = placeholder
    return {
        **module,
        "slug": f"ru-{module['slug']}",
        "title": title,
        "description": description,
        "submission_fields": fields,
    }


def _kazakh_module(module: ModuleSpec) -> ModuleSpec:
    title, description, label, placeholder = _KAZAKH_COPY[module["slug"]]
    fields = [dict(field) for field in module["submission_fields"]]
    fields[0]["label"] = label
    fields[0]["placeholder"] = placeholder
    return {
        **module,
        "slug": f"kk-{module['slug']}",
        "title": title,
        "description": description,
        "submission_fields": fields,
    }


RUSSIAN_MODULES: list[ModuleSpec] = [_russian_module(module) for module in ENGLISH_MODULES]
KAZAKH_MODULES: list[ModuleSpec] = [_kazakh_module(module) for module in ENGLISH_MODULES]
MODULES: list[ModuleSpec] = [*ENGLISH_MODULES, *RUSSIAN_MODULES, *KAZAKH_MODULES]
COURSE_MODULE_SLUGS: dict[str, tuple[str, ...]] = {
    "en": tuple(module["slug"] for module in ENGLISH_MODULES),
    "ru": tuple(module["slug"] for module in RUSSIAN_MODULES),
    "kk": tuple(module["slug"] for module in KAZAKH_MODULES),
}
ACTIVE_MODULE_SLUGS: tuple[str, ...] = tuple(module["slug"] for module in MODULES)


def base_module_slug(slug: str) -> str:
    return slug.removeprefix("ru-").removeprefix("kk-")


def course_id_for_slug(slug: str) -> str:
    if slug.startswith("ru-"):
        return "ru"
    return "kk" if slug.startswith("kk-") else "en"
