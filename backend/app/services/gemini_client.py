from functools import lru_cache

from google import genai

from app.config import settings


@lru_cache
def get_client() -> genai.Client:
    if not settings.GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured")
    return genai.Client(api_key=settings.GEMINI_API_KEY)


def prepare_contents(messages: list[dict[str, str]]) -> tuple[list[dict], str]:
    system_instruction = "\n\n".join(
        message["content"] for message in messages if message["role"] == "system"
    )
    contents = [
        {
            "role": "model" if message["role"] == "assistant" else "user",
            "parts": [{"text": message["content"]}],
        }
        for message in messages
        if message["role"] != "system"
    ]
    return contents, system_instruction
