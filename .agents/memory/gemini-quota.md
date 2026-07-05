---
name: Gemini API key quota issue
description: What to check when a project's GEMINI_API_KEY returns 429/403/404 errors from Google Generative AI
---

Observed on 2026-07-05: calling `@google/generative-ai` with the workspace's `GEMINI_API_KEY`:
- `gemini-2.0-flash` — valid model, but request fails with 429 "Quota exceeded... limit: 0" for the free tier.
- `gemini-1.5-flash`, `gemini-pro` — 404 Not Found (not available to this key/API version).
- `gemini-flash-latest`, `gemini-2.5-flash` — 403 Forbidden.

**Why:** The key's Google Cloud project appears to have no free-tier quota allocated and/or restricted model access. This is an account/billing-level constraint, not a code bug — code cannot work around a 0-quota project.

**How to apply:** If AI chat/features silently fall back to canned responses, check server logs for the underlying Gemini error before assuming the integration code is broken. Advise the user to check quota/billing at https://ai.dev/rate-limit or generate a fresh key from a project with billing enabled. Always keep a graceful fallback response path for when the AI call fails, since quota errors are common on free-tier keys.
