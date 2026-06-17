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


MODULES: list[ModuleSpec] = [
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

ACTIVE_MODULE_SLUGS: tuple[str, ...] = tuple(module["slug"] for module in MODULES)
