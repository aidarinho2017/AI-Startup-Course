"""Seed definitions for the 6 course modules.

The frontend `SubmissionForm` reads `submission_fields` from the module detail
endpoint to render module-specific inputs. The backend validates the submitted
JSON against the same shape.

YouTube IDs are placeholders — the user can swap them at any time by editing
this file and re-running `python -m app.seed`.
"""

from datetime import datetime
from typing import NotRequired, TypedDict


class FieldSpec(TypedDict, total=False):
    key: str
    label: str
    type: str  # "text" | "textarea" | "url"
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
        "slug": "deciding-to-start",
        "title": "Deciding to Start",
        "description": "Evaluate founder readiness and confront the reality of starting a startup.",
        "order_index": 1,
        "has_chatbot": True,
        "videos": [
            {"youtube_id": "CBYhVcO4WgI", "title": "How to Start a Startup — Sam Altman"},
            {"youtube_id": "ii1jcLg-eIQ", "title": "Before the Startup — Paul Graham"},
        ],
        "submission_fields": [
            {
                "key": "goals",
                "label": "Startup goals",
                "type": "textarea",
                "required": True,
                "placeholder": "What do you want to build, and what does success look like in 12 months?",
            },
            {
                "key": "weekly_hours",
                "label": "Weekly time commitment",
                "type": "text",
                "required": True,
                "placeholder": "e.g. 15 hours/week",
            },
            {
                "key": "why",
                "label": "Why you want to build a startup",
                "type": "textarea",
                "required": True,
                "placeholder": "Be specific. Why now? Why you?",
            },
        ],
    },
    {
        "slug": "startup-ideas",
        "title": "Startup Ideas",
        "description": "Generate, validate, and pressure-test your startup idea.",
        "order_index": 2,
        "has_chatbot": True,
        "videos": [
            {"youtube_id": "Th8JoIan4dg", "title": "How to Get Startup Ideas — Paul Graham"},
            {"youtube_id": "DOtCl5PU8F0", "title": "How to Evaluate Startup Ideas — Kevin Hale"},
        ],
        "submission_fields": [
            {
                "key": "idea",
                "label": "Startup idea",
                "type": "textarea",
                "required": True,
                "placeholder": "One paragraph: what is it, who is it for, what problem does it solve?",
            },
            {
                "key": "icp",
                "label": "Ideal customer profile (ICP)",
                "type": "textarea",
                "required": True,
                "placeholder": "Be specific: role, company size, current behavior, where to find them.",
            },
            {
                "key": "competitors",
                "label": "Competitor analysis",
                "type": "textarea",
                "required": True,
                "placeholder": "Who solves this today? What do they get right and wrong?",
            },
            {
                "key": "interviews",
                "label": "Customer interview summaries",
                "type": "textarea",
                "required": True,
                "placeholder": "Who did you talk to? What did you learn?",
            },
            {
                "key": "landing_page_url",
                "label": "Landing page URL (optional)",
                "type": "url",
                "required": False,
                "placeholder": "https://...",
            },
        ],
    },
    {
        "slug": "founding-team",
        "title": "Founding Team",
        "description": "Find your role and build a balanced team of cofounders.",
        "order_index": 3,
        "has_chatbot": True,
        "videos": [
            {"youtube_id": "Fk9BCr5pLTU", "title": "How To Find A Co-Founder — YC"},
            {"youtube_id": "dlfjs_eEEzs", "title": "Co-Founder Mistakes That Kill Companies & How To Avoid Them — YC"},
        ],
        "submission_fields": [
            {
                "key": "team_presentation_url",
                "label": "Team presentation URL",
                "type": "url",
                "required": True,
                "placeholder": "Link to a deck or doc with team photos, skills, achievements, and roles.",
            },
        ],
    },
    {
        "slug": "mvp-building",
        "title": "MVP Building",
        "description": "Build a minimum viable product using modern AI tools.",
        "order_index": 4,
        "has_chatbot": True,
        "videos": [
            {"youtube_id": "QRZ_l7cVzzU", "title": "How to Build an MVP — YC"},
        ],
        "submission_fields": [
            {
                "key": "mvp_url",
                "label": "MVP URL",
                "type": "url",
                "required": True,
                "placeholder": "https://your-mvp.vercel.app",
            },
            {
                "key": "repo_url",
                "label": "GitHub repository URL",
                "type": "url",
                "required": True,
                "placeholder": "https://github.com/...",
            },
            {
                "key": "explanation",
                "label": "Short product explanation",
                "type": "textarea",
                "required": True,
                "placeholder": "What does it do, who is it for, what's next?",
            },
        ],
    },
    {
        "slug": "launch",
        "title": "Launch",
        "description": "Launch your product publicly and get your first users.",
        "order_index": 5,
        "has_chatbot": False,
        "videos": [
            {"youtube_id": "u36A-YTxiOw", "title": "How to Launch — YC"},
            {"youtube_id": "hyYCn_kAngI", "title": "How to get your first users"},
        ],
        "submission_fields": [
            {
                "key": "launch_plan",
                "label": "Launch plan",
                "type": "textarea",
                "required": True,
                "placeholder": "Channels, timing, target audience, goals.",
            },
            {
                "key": "launch_post",
                "label": "Launch post copy",
                "type": "textarea",
                "required": True,
                "placeholder": "The text you will post on social / Product Hunt.",
            },
            {
                "key": "landing_page_url",
                "label": "Landing page URL",
                "type": "url",
                "required": True,
                "placeholder": "https://...",
            },
        ],
    },
    {
        "slug": "growth-monetization",
        "title": "Growth & Monetization",
        "description": "Grow your product and figure out how it makes money.",
        "order_index": 6,
        "has_chatbot": True,
        "videos": [
            {"youtube_id": "n_yHZ_vKjno", "title": "Growth — YC"},
            {"youtube_id": "URiIsrdplbo", "title": "Pricing and Monetization"},
        ],
        "submission_fields": [
            {
                "key": "monetization",
                "label": "Monetization strategy",
                "type": "textarea",
                "required": True,
                "placeholder": "Model, price points, why it fits your customer.",
            },
            {
                "key": "growth_experiments",
                "label": "Growth experiment ideas",
                "type": "textarea",
                "required": True,
                "placeholder": "List 3 experiments with hypotheses and success metrics.",
            },
            {
                "key": "retention",
                "label": "Retention ideas",
                "type": "textarea",
                "required": True,
                "placeholder": "What brings users back? How will you measure it?",
            },
        ],
    },
]
