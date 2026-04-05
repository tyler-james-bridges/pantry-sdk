# UI Benchmark Patterns — PantrySDK EmDash

> Audited from Pinterest feed UX, Sally's Baking Addiction, The Novice Chef, I Heart Eating, Stress Baking, and general food-blog conventions.
> Each pattern maps to current pages: `/recipes` (feed), `/recipes/[slug]` (detail), `/meal-planner`.

---

## 1. Hero Photography with Lazy-Loaded Placeholder Shimmer

**What:** Replace the gradient `heroBg` placeholder on `RecipeCard` with actual food photos (API-served or user-uploaded) plus a CSS shimmer skeleton while loading.

**Why it matters:** Every top-performing food blog leads with high-quality imagery. The current gradient cards look like a prototype — users scroll past cards without photos. Pinterest's entire engagement model is photo-first.

**Where to apply:**
- `/recipes` — `RecipeCard.astro` hero area (replace `linear-gradient` with `<img>` + `loading="lazy"` + shimmer `div`)
- `/recipes/[slug]` — add a full-width hero image above the title

**Effort:** 🟡 Medium — requires image field in recipe data model + upload/URL storage, but the card component change itself is small.

---

## 2. Prep/Cook Time Badges on Cards

**What:** Show prep time, cook time, and total time as compact pill badges on each card (e.g. "15 min prep · 25 min cook").

**Why it matters:** The Novice Chef and Sally's both surface times prominently — it's the #1 scanning signal for "can I make this tonight?" Novice Chef even shows times directly in their feed grid. Without it, users must click into every recipe to evaluate feasibility.

**Where to apply:**
- `/recipes` — `RecipeCard.astro` content area, below title
- `/recipes/[slug]` — metadata row under the `<h1>`

**Effort:** 🟢 Quick win — add `prepMinutes` / `cookMinutes` to recipe schema, render two `<span>` pills. CSS already has the pill/chip pattern from `.chips` and `.recipe-card__tags`.

---

## 3. Star Ratings + Review Count

**What:** Display a 5-star visual rating and review count on cards and detail pages (even if initially seeded/placeholder).

**Why it matters:** I Heart Eating and Sally's both show star ratings and "★★★★★ (1,247 reviews)" — this is the strongest social proof signal in food content and directly impacts click-through. Pinterest pins with ratings get 2-3× more saves.

**Where to apply:**
- `/recipes` — `RecipeCard.astro`, below servings line
- `/recipes/[slug]` — directly under `<h1>`, above ingredients

**Effort:** 🟡 Medium — needs a ratings data model or aggregate. Quick-win variant: hardcode 5-star display with "Be the first to review" CTA until backend exists.

---

## 4. "Jump to Recipe" Sticky Button on Detail Page

**What:** A fixed/sticky button that scrolls past any intro text directly to the recipe card (ingredients + steps).

**Why it matters:** This is the single most expected UX pattern on food blogs — Sally's, Novice Chef, and virtually every WP Recipe Card plugin includes it. Users are trained to look for it. Without it, any future intro/story content creates friction.

**Where to apply:**
- `/recipes/[slug]` — fixed button at top of page or floating bottom bar

**Effort:** 🟢 Quick win — anchor link + `position: sticky` or `position: fixed` bar. ~20 lines of HTML/CSS.

---

## 5. Structured Recipe Card Box (Schema.org-ready)

**What:** Wrap ingredients + steps in a visually distinct, bordered "recipe card" container with clear sections, print button, and JSON-LD `Recipe` schema markup.

**Why it matters:** Every serious food blog uses a distinct recipe card box (WP Recipe Maker, Tasty Recipes, etc.). It: (a) makes the recipe scannable, (b) enables Google rich results with star ratings and cook time in search, (c) allows printing. Current detail page renders ingredients/steps as plain HTML with no visual container.

**Where to apply:**
- `/recipes/[slug]` — wrap the ingredients `<ul>` and steps `<ol>` in a `RecipeCardBox` component with background, border-radius, and print stylesheet

**Effort:** 🟡 Medium — component + JSON-LD generation. Visual part is quick; schema requires mapping recipe fields.

---

## 6. Ingredient Checkbox Interaction

**What:** Each ingredient line gets a checkbox. Tapping it strikes through the text and persists state in `localStorage`.

**Why it matters:** Stress Baking and modern recipe sites treat the ingredient list as a shopping/cooking checklist. This is table-stakes for "cooking mode" — users in the kitchen tap ingredients as they go. It also sets up the PantrySDK utility story (checked items → shopping list integration).

**Where to apply:**
- `/recipes/[slug]` — each `<li>` in the ingredients list

**Effort:** 🟢 Quick win — small client-side JS + CSS `text-decoration: line-through` on checked. ~30 lines.

---

## 7. Category/Tag Icon Chips with Illustrations

**What:** Replace plain text chips on the feed page with icon-paired category pills (🍪 Cookies, 🧈 Brown Butter, ⏱ 30 min) that actually filter results.

**Why it matters:** The Novice Chef's category bar (30 min, Breakfast, Dinner, Desserts, Slow Cooker) drives navigation. I Heart Eating similarly uses visual category blocks. Current chips are static `<span>` elements with no interactivity — they look clickable but do nothing.

**Where to apply:**
- `/recipes` — `.chips` section → convert to `<a>` tags linking to `/category/[slug]` or `/tag/[slug]`
- `/meal-planner` — add a filter row to narrow recipe selection

**Effort:** 🟢 Quick win — chips already exist visually; make them `<a href="/category/...">` and add emoji prefixes. Category pages already exist at `/category/[slug].astro`.

---

## 8. Masonry Card Height Variation with "Feature" Slots

**What:** Make the first 1-2 cards in the feed larger (2× height, spanning a column) as editorial "featured" picks, similar to Pinterest's promoted/hero pins.

**Why it matters:** Pinterest's feed isn't uniform — featured content gets visual priority. The Novice Chef has "Today's Dinner" and "Today's Dessert" hero slots above the grid. Currently all cards are equal weight, making the feed feel flat. A featured slot creates editorial hierarchy and a place to highlight premium/seasonal content.

**Where to apply:**
- `/recipes` — first card in `.masonry` gets a `.featured` class with `break-inside: avoid; grid-row: span 2;` (or use CSS grid instead of columns)

**Effort:** 🟡 Medium — may require switching from CSS `column-count` masonry to CSS Grid or a JS masonry library for reliable spanning.

---

## 9. Inline Servings Adjuster on Detail Page

**What:** Replace the current "Scale to: 4 | 8 | 16" text links with an inline +/− stepper or slider widget that updates ingredients in real-time (client-side or via fetch).

**Why it matters:** Sally's and modern recipe cards use an interactive servings slider or stepper. The current scale links trigger a full-page reload with `?servings=N` — it breaks flow. An inline adjuster feels instant and delightful.

**Where to apply:**
- `/recipes/[slug]` — replace the `options.map` scale links with a `<button>−</button> <span>8</span> <button>+</button>` stepper that fetches `/api/scale` or does client-side math

**Effort:** 🟡 Medium — needs client-side JS (Astro island or `<script>` block) and either client-side scaling logic or an API call. The scaling API already exists server-side.

---

## 10. Print-Friendly Recipe View

**What:** A dedicated print stylesheet (or "Print Recipe" button) that strips nav, sidebar, and ads, rendering only the recipe card with clean typography.

**Why it matters:** Every benchmark blog (Sally's, Novice Chef, I Heart Eating) includes a print button inside the recipe card. Printing recipes is still extremely common — it's a core use case for the kitchen. It also signals "this is a real recipe site."

**Where to apply:**
- `/recipes/[slug]` — `@media print` stylesheet + a "🖨 Print" button inside the recipe card box (Pattern #5)

**Effort:** 🟢 Quick win — `@media print { .utility-panel, nav, footer { display: none; } }` plus a `window.print()` button. ~15 lines.

---

## 11. Visual Meal Planner with Drag-and-Drop or Card Selection

**What:** Replace the current checkbox list on `/meal-planner` with visual recipe cards (reusing `RecipeCard`) in a selectable grid, showing selected cards in a "Your Plan" sidebar/section with running totals.

**Why it matters:** The current meal planner is a raw `<ul>` of checkboxes and number inputs — it's functional but feels like a form, not a planning experience. Pinterest boards, Mealime, and modern planners use card-based selection with visual feedback (border highlight, count badge). This is the primary conversion surface for PantrySDK's paid features.

**Where to apply:**
- `/meal-planner` — replace `<ul>` form with a card grid + selected-state styling + summary sidebar

**Effort:** 🔴 Deeper work — requires component refactor, client-side state management, and visual design for selected states. But it's the highest-impact upgrade for the paid utility funnel.

---

## 12. Sticky Mobile Bottom Bar with Primary Actions

**What:** On mobile viewports, show a persistent bottom bar with 1-2 primary actions: "Add to Meal Plan" and "Print" on detail pages; "Generate Plan ($0.03)" on the planner.

**Why it matters:** Mobile-first food browsing (Pinterest, Instagram recipe saves) relies on thumb-zone actions. The current `StickyUtilityPanel` is a right sidebar that collapses to inline on mobile, pushing CTAs below the fold. A sticky bottom bar keeps conversion actions visible during scroll — this is standard on Pinterest, Instacart, and every food delivery app.

**Where to apply:**
- `/recipes/[slug]` — mobile-only `position: fixed; bottom: 0` bar with "Add to Plan" + price badge
- `/meal-planner` — mobile bottom bar with "Generate Plan" button + item count

**Effort:** 🟡 Medium — new component, but mostly CSS (`@media (max-width: 900px)`) + duplicating existing action buttons into the bar.

---

## Summary Matrix

| # | Pattern | Pages | Effort | Priority |
|---|---------|-------|--------|----------|
| 1 | Hero photography + shimmer | feed, detail | 🟡 Medium | High |
| 2 | Prep/cook time badges | feed, detail | 🟢 Quick win | High |
| 3 | Star ratings + review count | feed, detail | 🟡 Medium | Medium |
| 4 | "Jump to Recipe" button | detail | 🟢 Quick win | High |
| 5 | Structured recipe card box + schema | detail | 🟡 Medium | High |
| 6 | Ingredient checkboxes | detail | 🟢 Quick win | High |
| 7 | Interactive category chips | feed, planner | 🟢 Quick win | Medium |
| 8 | Featured card slots | feed | 🟡 Medium | Low |
| 9 | Inline servings stepper | detail | 🟡 Medium | Medium |
| 10 | Print-friendly view | detail | 🟢 Quick win | Medium |
| 11 | Visual card-based planner | planner | 🔴 Deeper | High |
| 12 | Sticky mobile bottom bar | detail, planner | 🟡 Medium | High |

### Recommended implementation order (quick wins first):

1. **#6** Ingredient checkboxes — instant UX upgrade, ~30 min
2. **#4** Jump to Recipe — expected pattern, ~20 min
3. **#10** Print view — `@media print` + button, ~30 min
4. **#2** Prep/cook time badges — schema addition + 2 pills, ~1 hr
5. **#7** Interactive category chips — wire existing chips to routes, ~1 hr
6. **#12** Sticky mobile bottom bar — high conversion impact, ~2-3 hr
7. **#5** Recipe card box + JSON-LD — SEO + visual structure, ~3-4 hr
8. **#9** Inline servings stepper — replace reload-based scaling, ~3-4 hr
9. **#1** Hero photography — needs data model work, ~4-6 hr
10. **#3** Star ratings — needs data model, ~4-6 hr
11. **#8** Featured card slots — grid refactor, ~4-6 hr
12. **#11** Visual planner — biggest lift, biggest payoff, ~1-2 days
