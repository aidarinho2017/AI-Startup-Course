from app.content.prompts.module_1_readiness import MODULE_1_PROMPT, MODULE_1_SUMMARY_SCHEMA
from app.content.prompts.module_2_idea_critic import (
    MODULE_2_PROMPT,
    MODULE_2_SUMMARY_SCHEMA,
)
from app.content.prompts.module_3_team import MODULE_3_PROMPT, MODULE_3_SUMMARY_SCHEMA
from app.content.prompts.module_4_mvp import MODULE_4_PROMPT
from app.content.prompts.module_6_growth import MODULE_6_PROMPT

SYSTEM_PROMPTS: dict[str, str] = {
    "deciding-to-start": MODULE_1_PROMPT,
    "startup-ideas": MODULE_2_PROMPT,
    "founding-team": MODULE_3_PROMPT,
    "mvp-building": MODULE_4_PROMPT,
    "growth-monetization": MODULE_6_PROMPT,
}

SUMMARY_SCHEMAS: dict[str, dict] = {
    "deciding-to-start": MODULE_1_SUMMARY_SCHEMA,
    "startup-ideas": MODULE_2_SUMMARY_SCHEMA,
    "founding-team": MODULE_3_SUMMARY_SCHEMA,
}
