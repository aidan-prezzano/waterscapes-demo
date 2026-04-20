# Next 2 Hours — Template Fix Workflow

Goal: ship a template that feels *inevitable, not flashy* at both 1440px and 375px. Audit first, fix second, verify third. No scope creep.

## Convention

All project docs (`PROJECT_CONTEXT.md`, `WORKFLOW.md`, future specs) live at the repo root next to `index.html`. Don't nest them.

## Session startup (5 min)

1. Read `PROJECT_CONTEXT.md` (once re-pasted) — business context, brand rules.
2. Read this file.
3. Confirm MCP Playwright is alive: `browser_navigate` to `shoreline-template.vercel.app`. If it errors, `pkill -f mcp-chrome && rm -rf ~/Library/Caches/ms-playwright/mcp-chrome-*` and retry.
4. `git status` — confirm clean working tree before starting.

## Phase 1 — Audit (45 min, no edits)

Walk the live site section-by-section at **1440px** then **375px**. For each section report:

1. **Working** — what earns its place.
2. **Broken** — functional/layout bugs.
3. **Risky** — over-styled, unclear, off-brand, or generic.

Sections in order:
- Hero
- Nav
- Credentials strip
- Featured project (Courtyard)
- Projects grid (4 variants)
- Services (3 cards)
- Process / approach
- Contact / footer

Output: a single markdown list, no fixes. Aidan prioritizes before any edits.

## Phase 2 — Fix top 3 (60 min)

From the audit, pick the 3 highest-leverage issues. For each:

1. State the fix in one sentence before editing.
2. Edit → `git push` → poll Vercel until live.
3. Screenshot at 1440px and 375px.
4. Side-by-side check: does it actually feel more *inevitable*, or just different?

Stop at 3. Ship partial polish, not full rewrites.

## Phase 3 — Verify (15 min)

- Full-page screenshots at both viewports, post-fix.
- Compare against brand direction: editorial restraint, coastal not Vegas, no motion-gimmicks, photography carries the weight.
- Note anything left for next session in a `TODO` section at the bottom of the audit doc.

## Rules

- **Don't edit during audit.** Reporting and fixing in the same pass = sloppy priorities.
- **Mobile is primary.** If desktop looks great and mobile doesn't, mobile wins.
- **Photos over gradients.** Any `.ph` placeholder still showing a gradient is a bug.
- **No new features this session.** Forms, animations, extra pages — all deferred.

## Model guidance

- **Opus** (current) — audits, design judgment, prioritization, copy.
- **Sonnet** — bulk edits once direction is set (photo swaps, CSS tweaks across variants).
- **Haiku** — mechanical tasks only (rename, find-replace, deploy polling).

Switch down when the decisions are made; switch up when taste matters.
