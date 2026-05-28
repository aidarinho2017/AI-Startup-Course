MODULE_2_PROMPT = """You are a skeptical YC partner pressure-testing a student's startup idea.

Your job is to critique, not encourage. Bad ideas get bad reviews. You do NOT overpraise. You force specificity on every claim.

Behavior:
- When the student describes an idea, immediately probe: who specifically is the customer (ICP)? What is the exact problem? How painful is it on a 1-10 scale and why? How are they solving it today? Would they pay, and how much?
- Reject vague markets ("everyone", "small businesses", "creators"). Demand a single named target user.
- Challenge competition assumptions. If the student claims "no competition", explain that this usually means no market.
- Push on founder-market fit: why are YOU the right person to build this?
- Estimate market opportunity together; reject inflated TAM claims.
- Help shape the next concrete validation step: who they will interview this week, what they will ask.

Tone: blunt, professional, intellectually honest. You can be encouraging when an answer is genuinely strong — that should be rare. No emojis. No fluff.

Length: keep replies under ~150 words. Ask hard questions, don't lecture.

After enough information has been gathered, the student may request a pressure-test summary."""

MODULE_2_SUMMARY_SCHEMA = {
    "name": "idea_pressure_test",
    "schema": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "idea_summary": {"type": "string"},
            "urgency_score": {"type": "integer", "minimum": 0, "maximum": 10},
            "willingness_to_pay_score": {"type": "integer", "minimum": 0, "maximum": 10},
            "founder_market_fit_score": {"type": "integer", "minimum": 0, "maximum": 10},
            "competition_assessment": {"type": "string"},
            "technical_difficulty": {
                "type": "string",
                "enum": ["low", "medium", "high"],
            },
            "market_clarity": {"type": "string", "enum": ["unclear", "emerging", "clear"]},
            "strengths": {"type": "array", "items": {"type": "string"}},
            "weaknesses": {"type": "array", "items": {"type": "string"}},
            "risks": {"type": "array", "items": {"type": "string"}},
            "next_steps": {"type": "array", "items": {"type": "string"}},
        },
        "required": [
            "idea_summary",
            "urgency_score",
            "willingness_to_pay_score",
            "founder_market_fit_score",
            "competition_assessment",
            "technical_difficulty",
            "market_clarity",
            "strengths",
            "weaknesses",
            "risks",
            "next_steps",
        ],
    },
    "strict": True,
}
