# Phase 1 Audit — 2026-04-19

Live site: `shoreline-template.vercel.app`. Viewports: **1440px desktop**, **375px mobile**. Observations only — no fixes in this pass.

---

## 1. Hero

**Desktop — working**
- Typography is the hero: `Water, shaped for the life you are building.` with italic accents carries the brand.
- Wireframe-grid backdrop reads like an architectural drawing. On-brand.
- Bottom-right micro-caption `FEATURED — PARADISE VALLEY RESIDENCE / ARIZONA / 2025` is restrained and premium.
- `CUSTOM POOL BUILDERS · SINCE 2007` eyebrow earns its place.

**Desktop — risky**
- Left + right vertical rail text (`SHORELINE · FILM REEL · 2025` etc.) — decorative-only, adds no meaning. On luxury sites it can read as a tic.
- No hero imagery. The whole hero is dark + linework; a pool *builder* never shows a pool above the fold. This is the single biggest brand risk — editorial restraint can tip into "where are the pools?"

**Mobile — broken**
- Massive dead space above the eyebrow. From `0→534px` the hero is essentially empty black. Fold feels wasted.
- No navigation exposed. `PROJECTS / PROCESS / SERVICES` are hidden, no hamburger replacement. User can only scroll or tap `Begin brief`.

**Mobile — risky**
- The editorial stillness that works on desktop reads as "unfinished" on mobile because there's nothing to anchor the eye in the empty space.

---

## 2. Nav

**Working**
- Centered `SHORELINE` wordmark, letter-spaced. Correct for the brand.
- Desktop phone number is visible without crowding.

**Broken**
- Mobile nav has zero link affordance. No menu, no hamburger — just logo + `Begin brief`. Users can't jump to Projects / Process / Services.

---

## 3. Projects (Selected projects)

**Desktop — working**
- `Selected projects.` headline + secondary paragraph is the right restraint.
- Featured project treatment (large image + `001 / 004` + location + copy + metadata) is genuinely editorial.
- Four real photos now load (no gradient fallbacks remaining in this section).

**Desktop — risky**
- Four projects may still be one too many. Three gives better curation signal ("small studio by choice"); four starts to read like a portfolio page.
- Project 2 (Montecito) blue-sky shot is much brighter than the others — inconsistent mood.

**Mobile — broken (high priority)**
- The asymmetric grid **does not collapse**. On projects 2 and 4, the body text is crammed into a narrow right column while the left column sits empty. This is the biggest layout bug on the site.
- Project 3 (Westlake) image+overlay scales but text spills awkwardly outside the image.
- `View all projects` CTA appears with no list follow-through (404 or missing page?).

---

## 4. Process ("A process of patience")

**Desktop — working**
- 4-column grid (Discovery / Design / Build / Beyond) with week ranges, body copy, and bullet deliverables. Clean and reassuring — exactly the "$200k feels unhurried" message.

**Mobile — working**
- Stacks cleanly, readable, no layout issues.

**Risky**
- `Beyond` is vague — "ongoing" doesn't tell a homeowner what they're buying. Consider `Care` or `Stewardship`.

---

## 5. Testimonials ("In their own words")

**Desktop — working**
- Large serif pull-quote + left-rail client list + attribution line is very Aman/editorial. On-brand.

**Mobile — broken (high priority)**
- Same asymmetric-grid bug as Projects. Left rail (`01 PARADISE VALLEY / 02 MONTECITO / 03 WESTLAKE`) sits in a squeezed column while the quote text overflows to the right, getting cut off (`We intervie... Shoreline w... walked our...`). Unreadable on phone.

---

## 6. Credentials ("Eighteen years of considered work")

**Desktop — working**
- Dark section break is well-timed — gives the page a "turn" after the warm testimonial.
- Stats grid + awards row is quiet and confident.

**Desktop — risky**
- **`3.5 / 5 client satisfaction, post-handover`** — this number reads as *mediocre*. Anything below 4.5/5 actively undermines the luxury pitch. Either raise it to 4.9/5 (if honest) or swap the metric (e.g. `9 / 10 repeat-or-refer rate`).
- `71% on-time project delivery` — same problem. 71% on-time means 29% late, which for a $200k project is alarming. Drop this stat or reframe.
- `AIA — Collaborative partner` feels soft as a credential next to `APSP Gold` and `Houzz Best of Design`.

**Mobile — working**
- Stats stack vertically, awards stack vertically, all readable.

---

## 7. Services ("Three ways we work")

**Desktop — working**
- Three cards (New builds / Renovations / Commercial), photos on top, 4-bullet deliverable list each. Legible scope signal.

**Risky**
- Commercial card undercuts the niche. PROJECT_CONTEXT says target is Gulf Coast custom-pool *homeowners*. Carrying a Commercial / Hospitality lane confuses the pitch and the portfolio. Consider cutting it or hiding it on the homepage.
- Renovations photo (aerial of lawn + deck) is the weakest of the three — no pool visible, reads generic.

**Mobile — working**
- Cards stack, photos hold up.

---

## 8. Quiz banner ("Tell us about your site…")

**Desktop — working**
- Giant serif sentence + single CTA + `7 questions · about 3 minutes · no obligation` is the right pre-form nudge.

**Mobile — broken**
- Headline font-size doesn't scale. Line breaks land badly: `Tell us about your / site, your vision, / and what you want / the / water to do — and / we will take it from / there.` The orphaned `the` on its own line is the tell.

---

## 9. Footer

**Working**
- Three-column structure (Service areas / Studio / Inquire + Follow) is standard and clean.
- Legal strip with `ROC #` and `CSLB #` adds trust.

**Risky — strategic (not layout)**
- Copy says `built across the Southwest since 2007`. Service areas list `Phoenix & Scottsdale · Paradise Valley · Montecito & Santa Barbara · Los Angeles · Austin & Westlake · Naples & Palm Beach`. Per PROJECT_CONTEXT the niche is **Gulf Coast / Florida Panhandle custom pool builders**. The current footer positions Shoreline as a broad Southwest studio, not a Gulf Coast specialist. This dilutes the pitch you'll use in outreach.
- `Quiet, considered pools for homeowners who notice the difference` — good line, but the geography mismatch undercuts it.

---

## Priority call (for Phase 2)

Ranked by leverage. We have 60 minutes for 3 fixes — my recommendation:

1. **Fix the mobile asymmetric grid** (Projects + Testimonials). Single bug, two sections, unblocks the entire mobile experience. Non-negotiable.
2. **Replace the two trust-destroying stats** (`3.5/5`, `71% on-time`) with metrics that actually support the luxury pitch.
3. **Fix mobile quiz-banner headline scaling.** Quick CSS win; last impression before form.

Deferred (good candidates for next session):
- Hero imagery decision (add a pool photo, or commit to the wireframe-only approach).
- Mobile nav menu.
- Geographic positioning (Southwest → Gulf Coast) — strategic, not a layout fix.
- Cut Commercial service lane.
- Rename `Beyond` → `Care`.
