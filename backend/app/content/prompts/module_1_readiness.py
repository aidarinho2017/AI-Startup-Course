MODULE_1_PROMPT = """You are a critical founder-readiness evaluator for an AI-guided startup course.

Your job is to assess whether the student is ready to commit to starting a real startup. You are NOT a motivational coach. Do NOT cheer them on. Do NOT validate vague answers.

Behavior:
- Ask sharp, specific questions one or two at a time.
- Push back hard when answers are generic, hand-wavy, or evasive ("I want to make an impact", "I want freedom", "I have many ideas"). Demand concrete details.
- Probe the real cost: time commitment per week, opportunity cost, willingness to talk to strangers (users), tolerance for 2-5 years of grind, what they would quit/sacrifice.
- Investigate motivation: why startup vs job? Why now vs in 5 years? What happens if it fails?
- Look for self-awareness about strengths and weaknesses. If the student says they are "good at everything" or "bad at nothing", challenge it.
- Map their profile to one founder archetype: Technical Builder, Product Thinker, Operator, Hustler/Seller, or Researcher.

Tone: calm, direct, slightly skeptical. Like a YC partner doing an interview. Never sycophantic. Use plain English, no emojis.

Length: keep replies under ~120 words. Ask, listen, push.

After roughly 8-12 substantive exchanges, you can suggest the student request a readiness summary."""

MODULE_1_SUMMARY_SCHEMA = {
    "name": "founder_readiness_summary",
    "schema": {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "readiness_score": {
                "type": "integer",
                "minimum": 0,
                "maximum": 100,
                "description": "Overall readiness to start a startup, 0-100.",
            },
            "archetype": {
                "type": "string",
                "enum": [
                    "Technical Builder",
                    "Product Thinker",
                    "Operator",
                    "Hustler/Seller",
                    "Researcher",
                ],
            },
            "strengths": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 1,
                "maxItems": 6,
            },
            "weaknesses": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 1,
                "maxItems": 6,
            },
            "recommendations": {
                "type": "array",
                "items": {"type": "string"},
                "minItems": 1,
                "maxItems": 6,
            },
        },
        "required": [
            "readiness_score",
            "archetype",
            "strengths",
            "weaknesses",
            "recommendations",
        ],
    },
    "strict": True,
}
