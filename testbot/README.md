# Test Telegram Bot Harness

This folder is for checking the Telegram integration with a separate BotFather test bot.
It is not a second bot backend. The existing FastAPI backend remains the only webhook
handler for Telegram updates.

## Architecture

```text
Telegram test bot
  -> ngrok public URL
  -> backend POST /telegram/webhook
  -> database user link state
  -> Telegram Bot API sendMessage
```

Telegram supports one active webhook URL per bot token, so do not run a polling bot
with the same token while testing the webhook flow.

## Local Setup

1. Create a test bot in BotFather and copy its token and username.

2. Start a public tunnel to the local backend:

   ```bash
   ngrok http 8000
   ```

3. Update `backend/.env` with the test bot values:

   ```env
   TELEGRAM_BOT_TOKEN=123456:your-test-token
   TELEGRAM_BOT_USERNAME=your_test_bot
   TELEGRAM_WEBHOOK_SECRET=replace-with-random-secret
   TELEGRAM_WEBHOOK_URL=https://your-ngrok-domain.ngrok-free.app/telegram/webhook
   ```

   Generate a secret with:

   ```bash
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

4. Restart the backend after changing the env file. On startup, the backend calls
   Telegram `setWebhook` using `TELEGRAM_WEBHOOK_URL` and `TELEGRAM_WEBHOOK_SECRET`.

5. Optionally copy this folder's example env for diagnostics:

   ```bash
   cp testbot/.env.example testbot/.env
   ```

   Put the same bot token in `testbot/.env`. Set either `TELEGRAM_WEBHOOK_URL` or
   `BACKEND_PUBLIC_URL`.

## Check Webhook State

Run:

```bash
python3 testbot/check_webhook.py
```

The script reads `backend/.env`, then `testbot/.env`, then shell environment values.
Empty values in later env files do not replace earlier non-empty values. Shell values
always win. It calls Telegram `getWebhookInfo` and prints the active webhook URL,
pending update count, allowed updates, and the latest Telegram delivery error.

Useful results:

- `OK`: Telegram webhook URL matches the expected local URL.
- `MISMATCH`: backend probably has an old ngrok URL, or another process changed the webhook.
- `NOT SET`: backend did not configure the webhook, usually because the backend has not
  been restarted or `TELEGRAM_WEBHOOK_URL` is empty.

## Manual Test Scenarios

### Telegram disabled

Leave `TELEGRAM_BOT_TOKEN` empty in `backend/.env`, restart the backend, and open the
dashboard. Telegram should be shown as unavailable, and `POST /telegram/link-code`
should return 501.

### Successful link

1. Start backend, frontend, and ngrok.
2. Log in to the frontend.
3. Open the dashboard and generate a Telegram link code.
4. Open the test bot link or send this manually in Telegram:

   ```text
   /start YOURCODE
   ```

5. The bot should reply that notifications are linked.
6. Refresh the dashboard. Telegram should show `Linked`.

### Invalid or expired code

Send a random code to the bot. It should reply that the code is invalid or expired, and
the dashboard should stay unlinked.

### Duplicate Telegram chat

Try to link the same Telegram chat to a second course account. The bot should reply that
this chat is already linked to another account.

### Submission notification

After linking Telegram, submit homework for a module for the first time. The bot should
send:

```text
You've done the task: <module title>.
```

### Deadline reminders

Deadline reminders require module `due_at` values. For a local test, configure a module
deadline within the reminder windows, run the backend reminder loop, and use a linked
Telegram account with no submission for that module.

## Troubleshooting

- If `check_webhook.py` shows an old URL, restart the backend after updating ngrok.
- If Telegram reports connection errors, confirm backend is running on port 8000 and ngrok
  is forwarding to that port.
- If the backend returns 403 for webhook calls, keep `TELEGRAM_WEBHOOK_SECRET` unchanged
  in `backend/.env` and restart so Telegram receives the same secret via `setWebhook`.
- If the bot link opens but no message arrives, paste `/start YOURCODE` manually into
  the test bot chat.
