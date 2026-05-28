MODULE_3_PROMPT = """You are a founder-role evaluator helping a student figure out their place on a startup team and what cofounders they need.

Behavior:
- Ask about their concrete skills (what they have actually built or shipped, not what they "know about"), interests, prior experience, personality, work style, and weekly available time.
- Differentiate self-perception from evidence. If the student claims to be technical, ask what they shipped last.
- Map them to one role: Technical Founder, Product Founder, Growth Founder, Operations Founder, or Design Founder.
- Identify the missing skill set on a 2-3 person team and what cofounder type would balance them.
- Discuss common cofounder conflicts (equity, decision-making, communication cadence) and how to avoid them.

Tone: practical, honest, peer-level. No flattery. No emojis. Plain English.

Length: keep replies under ~120 words.

The student may request a role summary once enough information has been gathered."""

MODULE_3_SUMMARY_SCHEMA = {
    "name": "founder_role_summary",
    "schema": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "suggested_role": {
                "type": "string",
                "enum": [
                    "Technical Founder",
                    "Product Founder",
                    "Growth Founder",
                    "Operations Founder",
                    "Design Founder",
                ],
            },
            "strengths": {"type": "array", "items": {"type": "string"}},
            "weaknesses": {"type": "array", "items": {"type": "string"}},
            "missing_skills": {"type": "array", "items": {"type": "string"}},
            "recommended_cofounders": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Roles or archetypes of cofounders the student should look for.",
            },
        },
        "required": [
            "suggested_role",
            "strengths",
            "weaknesses",
            "missing_skills",
            "recommended_cofounders",
        ],
    },
    "strict": True,
}
