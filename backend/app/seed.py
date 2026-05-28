"""Idempotent seed script. Run with: python -m app.seed"""

import asyncio

from sqlalchemy import select

from app.content.modules_seed import MODULES
from app.db import SessionLocal
from app.models import Module, Video


async def seed() -> None:
    async with SessionLocal() as db:
        for spec in MODULES:
            module = await db.scalar(select(Module).where(Module.slug == spec["slug"]))
            if module is None:
                module = Module(
                    slug=spec["slug"],
                    title=spec["title"],
                    description=spec["description"],
                    order_index=spec["order_index"],
                    has_chatbot=spec["has_chatbot"],
                )
                db.add(module)
                await db.flush()
            else:
                module.title = spec["title"]
                module.description = spec["description"]
                module.order_index = spec["order_index"]
                module.has_chatbot = spec["has_chatbot"]

            existing_videos = {
                v.youtube_id: v
                for v in (await db.scalars(select(Video).where(Video.module_id == module.id))).all()
            }
            for i, vspec in enumerate(spec["videos"]):
                v = existing_videos.get(vspec["youtube_id"])
                if v is None:
                    db.add(
                        Video(
                            module_id=module.id,
                            youtube_id=vspec["youtube_id"],
                            title=vspec["title"],
                            order_index=i,
                        )
                    )
                else:
                    v.title = vspec["title"]
                    v.order_index = i

            spec_ids = {v["youtube_id"] for v in spec["videos"]}
            for youtube_id, video in existing_videos.items():
                if youtube_id not in spec_ids:
                    await db.delete(video)

        await db.commit()
    print(f"Seeded {len(MODULES)} modules.")


if __name__ == "__main__":
    asyncio.run(seed())
