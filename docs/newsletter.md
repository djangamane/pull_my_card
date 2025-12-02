# Scout AI + Kid Reporter Newsletter

Lightweight local workflow modeled after the Montecrypto build.

## Env variables
- `GEMINI_API_KEY` — required to generate drafts.
- `PERPLEXITY_API_KEY` — optional; adds a “Card Watch” section sourced from Perplexity (model defaults to `sonar-pro`).
- `PERPLEXITY_MODEL` or `PERPLEXITY_COIN_MODEL` — override the model (optional).
- `RESEND_API_KEY` and `RESEND_FROM_EMAIL` — required to send emails.
- `NEWSLETTER_RECIPIENTS` — comma-separated fallback recipient list (e.g. `you@example.com,fan@example.com`).

## CLI commands
All commands run from the repo root:

```bash
# Generate a draft briefing (prints JSON)
node scripts/newsletter-cli.mjs generate "Fanatics marketplace shifts" > briefing.json

# Publish into data/newsletters.json (status respected; set status=published to mark live)
node scripts/newsletter-cli.mjs publish briefing.json

# Send the latest published issue (or pass an explicit id)
node scripts/newsletter-cli.mjs send
```

- Storage lives in `data/newsletters.json` (auto-created). Add `data/subscribers.json` for a file-based email list (array of emails or `{ "email": "" }` objects), or set `NEWSLETTER_RECIPIENTS`.
- Email body includes a Perplexity-powered “Card Watch” block when `PERPLEXITY_API_KEY` is present.
- Prompts prioritize timely hobby news plus Fanatics/Topps marketplace moves so affiliate stories get pulled in.

## What to hand the kid reporter’s dad
Share the env list above and the CLI commands. Gemini + Resend are required for end-to-end runs; Perplexity is optional but recommended for the Card Watch section.
