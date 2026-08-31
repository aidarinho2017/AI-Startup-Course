import unittest
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

from app.config import settings
from app.services import chat_service
from app.services.gemini_client import prepare_contents


class GeminiClientTest(unittest.TestCase):
    def test_prepare_contents_separates_system_and_maps_assistant_role(self):
        contents, system_instruction = prepare_contents(
            [
                {"role": "system", "content": "Be practical."},
                {"role": "user", "content": "Help me validate an idea."},
                {"role": "assistant", "content": "Interview five users."},
            ]
        )

        self.assertEqual(system_instruction, "Be practical.")
        self.assertEqual(
            contents,
            [
                {"role": "user", "parts": [{"text": "Help me validate an idea."}]},
                {"role": "model", "parts": [{"text": "Interview five users."}]},
            ],
        )


class GeminiStreamTest(unittest.IsolatedAsyncioTestCase):
    async def test_stream_chat_keeps_existing_sse_contract(self):
        class FakeDb:
            def __init__(self):
                self.added = []

            def add(self, value):
                self.added.append(value)

            async def commit(self):
                pass

        class FakeModels:
            async def generate_content_stream(self, **request):
                self.request = request

                async def chunks():
                    yield SimpleNamespace(text="Hello")
                    yield SimpleNamespace(text=" founder")

                return chunks()

        models = FakeModels()
        client = SimpleNamespace(aio=SimpleNamespace(models=models))
        history = [SimpleNamespace(role="user", content="Help me validate an idea.")]
        db = FakeDb()

        with (
            patch.object(chat_service, "get_client", return_value=client),
            patch.object(chat_service, "load_history", new=AsyncMock(return_value=history)),
        ):
            frames = [
                frame
                async for frame in chat_service.stream_chat(
                    db, SimpleNamespace(id=1), "build-simple", history[0].content
                )
            ]

        self.assertEqual(
            frames,
            [
                'data: {"delta": "Hello"}\n\n',
                'data: {"delta": " founder"}\n\n',
                "data: [DONE]\n\n",
            ],
        )
        self.assertEqual(models.request["model"], settings.GEMINI_MODEL)
        self.assertEqual(db.added[-1].content, "Hello founder")


if __name__ == "__main__":
    unittest.main()
