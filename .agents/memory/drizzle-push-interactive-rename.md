---
name: drizzle-kit push interactive rename prompts
description: What to do when `npm run db:push` hangs on an interactive column-rename prompt (e.g. switching a table's primary key type or column set)
---

When a Drizzle schema change alters a table enough that column identities become ambiguous (e.g. changing `users` from serial-int PK with username/password to varchar PK with email/firstName/lastName for Replit Auth), `drizzle-kit push` drops into an interactive "is this a rename or a new column?" prompt. This blocks non-interactive shells indefinitely (piping input does not resolve it reliably).

**Why:** drizzle-kit's push command can't safely infer intent for structural PK/column changes, so it always asks interactively — there's no CLI flag to force "create" for all ambiguous columns in one shot.

**How to apply:** If the table's old data isn't needed (e.g. demo/seed data, not real user data), drop the conflicting table(s) directly via SQL (`DROP TABLE ... CASCADE` on the table and anything with FKs to it) before rerunning `db:push`. With no old columns left to compare against, drizzle-kit sees a clean create and applies without prompting.
