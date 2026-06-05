#!/usr/bin/env python3
"""Inspect Telegram webhook state for the local test bot."""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ENV_FILES = (ROOT / "backend" / ".env", ROOT / "testbot" / ".env")
DEFAULT_WEBHOOK_PATH = "/telegram/webhook"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Read local env files and compare Telegram getWebhookInfo with the expected webhook URL."
    )
    parser.add_argument(
        "--env-file",
        action="append",
        default=[],
        help="Additional env file to load after backend/.env and testbot/.env.",
    )
    parser.add_argument(
        "--expected-url",
        help="Expected webhook URL. Overrides TELEGRAM_WEBHOOK_URL and BACKEND_PUBLIC_URL.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print raw Telegram getWebhookInfo result as JSON.",
    )
    return parser.parse_args()


def load_env(files: list[Path]) -> dict[str, str]:
    values: dict[str, str] = {}
    for path in files:
        if not path.exists():
            continue
        for key, value in read_env_file(path).items():
            if value or key not in values:
                values[key] = value

    # Shell environment wins over file values, including empty overrides.
    values.update(os.environ)
    return values


def read_env_file(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[len("export ") :].strip()
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = strip_inline_comment(value.strip())
        values[key] = unquote(value)
    return values


def strip_inline_comment(value: str) -> str:
    quote: str | None = None
    escaped = False
    for index, char in enumerate(value):
        if escaped:
            escaped = False
            continue
        if char == "\\":
            escaped = True
            continue
        if char in {"'", '"'}:
            if quote == char:
                quote = None
            elif quote is None:
                quote = char
            continue
        if char == "#" and quote is None and (index == 0 or value[index - 1].isspace()):
            return value[:index].rstrip()
    return value


def unquote(value: str) -> str:
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def expected_webhook_url(env: dict[str, str], explicit: str | None) -> str | None:
    if explicit:
        return explicit.strip()
    configured = env.get("TELEGRAM_WEBHOOK_URL", "").strip()
    if configured:
        return configured

    public_url = env.get("BACKEND_PUBLIC_URL", "").strip().rstrip("/")
    if not public_url:
        return None
    path = env.get("TELEGRAM_WEBHOOK_PATH", DEFAULT_WEBHOOK_PATH).strip() or DEFAULT_WEBHOOK_PATH
    if not path.startswith("/"):
        path = f"/{path}"
    return f"{public_url}{path}"


def telegram_get_webhook_info(token: str) -> dict[str, Any]:
    url = f"https://api.telegram.org/bot{token}/getWebhookInfo"
    request = Request(url, headers={"User-Agent": "ai-startup-course-testbot/1.0"})
    try:
        with urlopen(request, timeout=15) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Telegram API returned HTTP {exc.code}: {body}") from exc
    except URLError as exc:
        raise RuntimeError(f"Could not reach Telegram API: {exc.reason}") from exc
    except TimeoutError as exc:
        raise RuntimeError("Telegram API request timed out") from exc

    if not payload.get("ok"):
        raise RuntimeError(f"Telegram API returned an error: {payload}")
    result = payload.get("result")
    if not isinstance(result, dict):
        raise RuntimeError(f"Telegram API returned an unexpected payload: {payload}")
    return result


def mask_token(token: str) -> str:
    if len(token) <= 10:
        return "***"
    return f"{token[:6]}:***{token[-4:]}"


def format_timestamp(value: Any) -> str:
    if not isinstance(value, int):
        return "none"
    return datetime.fromtimestamp(value, tz=timezone.utc).isoformat()


def print_human_report(info: dict[str, Any], env: dict[str, str], expected_url: str | None) -> int:
    actual_url = str(info.get("url") or "")
    if expected_url and actual_url == expected_url:
        status = "OK"
        exit_code = 0
    elif expected_url and actual_url:
        status = "MISMATCH"
        exit_code = 1
    elif expected_url and not actual_url:
        status = "NOT SET"
        exit_code = 1
    else:
        status = "NO EXPECTED URL"
        exit_code = 0

    print("Telegram webhook diagnostics")
    print(f"Token: {mask_token(env.get('TELEGRAM_BOT_TOKEN', ''))}")
    username = env.get("TELEGRAM_BOT_USERNAME", "").strip().lstrip("@")
    print(f"Bot username: {username or 'not set locally'}")
    print(f"Expected URL: {expected_url or 'not set locally'}")
    print(f"Actual URL: {actual_url or 'not set in Telegram'}")
    print(f"Status: {status}")
    print(f"Pending updates: {info.get('pending_update_count', 0)}")
    print(f"Allowed updates: {', '.join(info.get('allowed_updates') or []) or 'default'}")
    print(f"Last error date: {format_timestamp(info.get('last_error_date'))}")
    print(f"Last error message: {info.get('last_error_message') or 'none'}")
    print(f"Max connections: {info.get('max_connections', 'unknown')}")

    if env.get("TELEGRAM_WEBHOOK_SECRET", "").strip():
        print("Local secret: configured. Telegram does not expose it via getWebhookInfo.")
    else:
        print("Local secret: not configured.")

    return exit_code


def main() -> int:
    args = parse_args()
    env_files = [*DEFAULT_ENV_FILES, *(Path(path) for path in args.env_file)]
    env = load_env(env_files)

    token = env.get("TELEGRAM_BOT_TOKEN", "").strip()
    if not token:
        print(
            "TELEGRAM_BOT_TOKEN is empty. Set it in backend/.env, testbot/.env, or the shell.",
            file=sys.stderr,
        )
        return 2

    try:
        info = telegram_get_webhook_info(token)
    except RuntimeError as exc:
        print(str(exc), file=sys.stderr)
        return 1

    if args.json:
        print(json.dumps(info, ensure_ascii=False, indent=2, sort_keys=True))
        return 0

    expected_url = expected_webhook_url(env, args.expected_url)
    return print_human_report(info, env, expected_url)


if __name__ == "__main__":
    raise SystemExit(main())
