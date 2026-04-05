# PantrySDK UI v3 — 48-Hour Sprint Plan

> **Goal:** Transform PantrySDK from a functional prototype into a polished, Pinterest-style recipe product that feels lovable on first visit.
>
> **Start:** Saturday morning · **Ship:** Monday morning
>
> **Stack:** Astro 6 (SSR) + React islands + Cloudflare Workers · EmDash CMS · PantrySDK API

---

## Architecture Snapshot (Current → Target)

| Area | Now | After Sprint |
|---|---|---|
| Home (`/`) | Generic EmDash posts list | Hero + Pinterest masonry recipe feed |
| Recipe feed (`/recipes`) | Gradient placeholder cards, single search | Photo-ready cards, live filter chips, infinite-feel feed |
| Recipe detail (`/recipes/[slug]`) | Plain ingredient list + sticky panel | Hero image slot, step-by-step UX, animated utility panel |
| Meal planner (`/meal-planner`) | Checkbox form | Drag-to-plan board with live shopping list |
| Components | 2 (RecipeCard, StickyUtilityPanel) | 12+ purpose-built components |
| Global styling | Inline `<style>` per page | Design-token system + shared CSS |
| Mobile | Basic responsive columns | Touch-first, bottom-sheet utilities, swipeable cards |
| Animations | None | Micro-interactions on save, scale, plan |

---

## Day 1 — Foundation & Feed (≈10 working hours)

### Hour 0–1: Design Tokens & Global Styles

**Tasks:**
- Create `src/styles/tokens.css` — CSS custom properties for the entire app
- Create `src/styles/global.css` — reset, typography, utilities
- Wire into `Base.astro` layout

**File changes:**
| File | Action |
|---|---|
| `src/styles/tokens.css` | **CREATE** |
| `src/styles/global.css` | **CREATE** |
| `src/layouts/Base.astro` | **EDIT** — import global styles, add meta viewport, structured header/footer |

**Token palette:**
```
--color-bg:          #faf7f2
--color-bg-card:     #ffffff
--color-bg-warm:     #fff8f0
--color-text:        #1a1a1a
--color-text-muted:  #6b5b4b
--color-accent:      #e60023       (Pinterest red — save buttons)
--color-accent-warm: #d4731a       (CTA warm amber)
--color-border:      #e8dccd
--color-border-light:#f2e8dc
--radius-card:       20px
--radius-pill:       999px
--radius-btn:        12px
--shadow-card:       0 2px 8px rgba(42,25,7,0.06)
--shadow-hover:      0 14px 32px rgba(42,25,7,0.14)
--font-display:      'DM Serif Display', Georgia, serif
--font-body:         'Inter', -apple-system, sans-serif
--space-xs: 4px  --space-sm: 8px  --space-md: 16px  --space-lg: 24px  --space-xl: 40px
```

**Acceptance criteria:**
- [ ] All hardcoded colors in existing components replaced with tokens
- [ ] Google Fonts loaded (DM Serif Display + Inter)
- [ ] Dark/light mode CSS variables wired (light default, respect `prefers-color-scheme`)

---

### Hour 1–3: RecipeCard v3 — Pinterest-Grade

**Tasks:**
- Rewrite `RecipeCard.astro` with image placeholder system (gradient + SVG food icons until real photos exist)
- Add variable-height masonry sizing (4 height tiers based on content)
- Implement hover states: lift + shadow + save button reveal
- Add "Save" button (Pinterest-style red pill, top-right)
- Add prep-time / difficulty badge overlay
- Add author avatar placeholder row

**File changes:**
| File | Action |
|---|---|
| `src/components/RecipeCard.astro` | **REWRITE** |
| `src/components/SaveButton.astro` | **CREATE** — reusable save/heart button |
| `src/components/BadgePill.astro` | **CREATE** — small pill for tags, prices, difficulty |

**Acceptance criteria:**
- [ ] Cards have 4 distinct heights (240, 300, 360, 420px) for masonry variety
- [ ] Hover lifts card 4px with shadow transition (160ms ease)
- [ ] Save button appears on hover (mobile: always visible)
- [ ] Card links to `/recipes/[slug]`
- [ ] Gradient hero fills are food-tone appropriate (warm ambers, not garish)

---

### Hour 3–5: Homepage Redesign (`/` → recipe-first)

**Tasks:**
- Replace EmDash posts feed with recipe-first landing
- Hero section: big tagline + search bar + category chips
- Pinterest-style masonry grid below the fold
- "What's for dinner?" personalization prompt (static v1)
- Footer CTAs: "Browse all recipes" and "Start meal planning"

**File changes:**
| File | Action |
|---|---|
| `src/pages/index.astro` | **REWRITE** |
| `src/components/HeroSearch.astro` | **CREATE** — search bar + chip filters |
| `src/components/CategoryChip.astro` | **CREATE** — clickable filter pills |
| `src/components/MasonryGrid.astro` | **CREATE** — CSS-column masonry wrapper |

**Acceptance criteria:**
- [ ] Above-the-fold hero communicates product value in <3 seconds
- [ ] Search bar is prominent (pill-shaped, centered, placeholder: "Search recipes...")
- [ ] Category chips filter feed (dessert, dinner, breakfast, vegan, quick)
- [ ] Masonry grid is 1-col mobile / 2-col tablet / 4-col desktop
- [ ] No "No posts yet" empty state visible

---

### Hour 5–7: Recipe Detail Page — Editorial Layout

**Tasks:**
- Redesign `/recipes/[slug]` with editorial food-magazine feel
- Full-width hero image area (gradient placeholder for now)
- Ingredient list with checkbox interaction (React island)
- Step-by-step instructions with numbering and visual rhythm
- Sticky utility panel redesign with better visual hierarchy

**File changes:**
| File | Action |
|---|---|
| `src/pages/recipes/[slug].astro` | **REWRITE** |
| `src/components/RecipeHero.astro` | **CREATE** — full-width hero with title overlay |
| `src/components/IngredientList.tsx` | **CREATE** — React island, checkable ingredients |
| `src/components/StepList.astro` | **CREATE** — numbered steps with visual rhythm |
| `src/components/StickyUtilityPanel.astro` | **REWRITE** — better hierarchy, animated actions |
| `src/components/PriceBadge.astro` | **CREATE** — premium action price indicator |
| `src/components/ScaleControl.astro` | **CREATE** — serving size adjuster (−/+/presets) |

**Acceptance criteria:**
- [ ] Recipe name renders in display font at 2.4rem+
- [ ] Ingredient checkboxes persist during session (React state)
- [ ] Scale control shows 3 presets + custom input
- [ ] Utility panel has clear visual separation between free and paid actions
- [ ] Price badges show exact cost ($0.01, $0.03) with tooltip explaining why
- [ ] Back-to-feed navigation is prominent

---

### Hour 7–9: Recipe Feed Page (`/recipes`) Polish

**Tasks:**
- Integrate new MasonryGrid + RecipeCard v3
- Add animated filter chips that actually filter (client-side)
- Add sort options (default, alphabetical, servings)
- Empty state for zero-results
- Feed header with recipe count

**File changes:**
| File | Action |
|---|---|
| `src/pages/recipes/index.astro` | **REWRITE** |
| `src/components/RecipeFeedFilter.tsx` | **CREATE** — React island for client-side filtering |

**Acceptance criteria:**
- [ ] Clicking a chip filters cards with CSS transition (fade out / in)
- [ ] Recipe count updates on filter ("Showing 3 of 5 recipes")
- [ ] Empty filter state shows friendly message + "clear filters" link
- [ ] Page loads in <1s on local dev

---

### Hour 9–10: Day 1 Integration & QA

**Tasks:**
- Full page-by-page click-through
- Fix any broken links or missing imports
- Verify `astro build` compiles without errors
- Test on mobile viewport (375px)
- Commit: `feat: UI v3 day 1 — design system, feed, detail page`

**Acceptance criteria:**
- [ ] `npm run build` succeeds
- [ ] All 5 recipes render on feed page
- [ ] Each recipe detail page loads with scaled ingredients
- [ ] No console errors in browser
- [ ] Mobile layout doesn't overflow horizontally

---

## Day 2 — Interactions, Planner & Polish (≈10 working hours)

### Hour 10–12: Meal Planner Redesign

**Tasks:**
- Replace checkbox form with card-based selection UI
- Recipe cards in planner are mini-versions with +/− servings inline
- Selected recipes show in a "plan tray" at bottom (or sidebar on desktop)
- Generate button triggers API call and renders results inline
- Shopping list renders as grouped, copyable list

**File changes:**
| File | Action |
|---|---|
| `src/pages/meal-planner.astro` | **REWRITE** |
| `src/components/PlannerCard.astro` | **CREATE** — mini recipe card for planner |
| `src/components/PlanTray.tsx` | **CREATE** — React island, selected recipes tray |
| `src/components/ShoppingList.astro` | **CREATE** — grouped ingredient list with copy button |
| `src/components/ServingsControl.tsx` | **CREATE** — React island, +/− stepper |

**Acceptance criteria:**
- [ ] Adding a recipe to plan is one click (not a checkbox)
- [ ] Servings can be adjusted per-recipe with +/− buttons
- [ ] Plan tray shows selected count and total servings
- [ ] Shopping list groups by ingredient category when possible
- [ ] "Copy list" button copies plain text to clipboard
- [ ] Empty plan state says "Pick recipes to start planning"

---

### Hour 12–14: Micro-Interactions & Animations

**Tasks:**
- Add CSS transitions to all interactive elements
- Card entrance animation (fade-up stagger on feed pages)
- Save button pulse animation on click
- Smooth scroll between sections on recipe detail
- Utility panel actions: loading spinner → result animation
- Page transition fade (Astro view transitions if compatible)

**File changes:**
| File | Action |
|---|---|
| `src/styles/animations.css` | **CREATE** |
| `src/components/RecipeCard.astro` | **EDIT** — add entrance animation class |
| `src/components/SaveButton.astro` | **EDIT** — add click feedback animation |
| `src/layouts/Base.astro` | **EDIT** — import animations, add view transition meta if using |

**Acceptance criteria:**
- [ ] Cards stagger-fade-in on page load (50ms delay per card)
- [ ] Save button shows heart pulse on click
- [ ] Utility panel buttons show brief loading state on action
- [ ] No animation causes layout shift (CLS = 0)
- [ ] All animations respect `prefers-reduced-motion`

---

### Hour 14–16: 404 Page & Empty States

**Tasks:**
- Redesign 404 page with personality
- Add empty states for: no recipes, no plan results, no search results
- Add loading skeletons for recipe cards

**File changes:**
| File | Action |
|---|---|
| `src/pages/404.astro` | **REWRITE** |
| `src/components/EmptyState.astro` | **CREATE** — reusable empty state with icon + message + CTA |
| `src/components/RecipeCardSkeleton.astro` | **CREATE** — loading placeholder |

**Acceptance criteria:**
- [ ] 404 page has a food pun and link back to feed
- [ ] Every page handles zero-data gracefully
- [ ] Skeleton cards match actual card dimensions

---

### Hour 16–17: Mobile-First Audit & Touch UX

**Tasks:**
- Audit every page at 375px, 428px, 768px, 1024px, 1440px
- Fix any overflow, truncation, or tap-target issues
- Ensure touch targets are ≥44px
- Bottom-sheet style for utility panel on mobile (CSS-only)
- Swipe hint on horizontally scrollable chip rows

**File changes:**
| File | Action |
|---|---|
| `src/styles/responsive.css` | **CREATE** — breakpoint-specific overrides |
| Various components | **EDIT** — mobile fixes |

**Acceptance criteria:**
- [ ] No horizontal scroll on any page at 375px
- [ ] All tap targets ≥ 44×44px
- [ ] Utility panel collapses to bottom of page on mobile
- [ ] Chip rows scroll horizontally on mobile with fade edge hint
- [ ] Text is readable without zooming (min 14px body)

---

### Hour 17–18: SEO & Performance

**Tasks:**
- Add proper `<meta>` tags (description, og:image, og:title) to all pages
- Add structured data (Recipe schema) to recipe detail pages
- Verify font loading doesn't block render (font-display: swap)
- Add proper `<title>` per page
- Ensure all images have `alt` text
- Add favicon

**File changes:**
| File | Action |
|---|---|
| `src/layouts/Base.astro` | **EDIT** — SEO meta, structured data slot |
| `src/pages/recipes/[slug].astro` | **EDIT** — Recipe JSON-LD |
| `public/favicon.svg` | **CREATE** |

**Acceptance criteria:**
- [ ] Each recipe page has valid JSON-LD Recipe schema
- [ ] OpenGraph tags present on all pages
- [ ] Lighthouse Performance score ≥ 90
- [ ] Lighthouse Accessibility score ≥ 95
- [ ] No render-blocking resources

---

### Hour 18–19: Final Integration, QA & Screenshots

**Tasks:**
- Full regression test: every page, every interaction
- Fix any remaining visual bugs
- Take launch screenshots (see checklist below)
- Final commit: `feat: UI v3 complete — Pinterest-style recipe product`
- Deploy to Cloudflare: `npm run deploy`

---

## Complete File Change Map

### New Files (16)
| File | Purpose |
|---|---|
| `src/styles/tokens.css` | Design token custom properties |
| `src/styles/global.css` | Reset, typography, base styles |
| `src/styles/animations.css` | Shared keyframes and transitions |
| `src/styles/responsive.css` | Breakpoint overrides |
| `src/components/HeroSearch.astro` | Homepage search + chips |
| `src/components/CategoryChip.astro` | Filterable tag pill |
| `src/components/MasonryGrid.astro` | CSS-column masonry wrapper |
| `src/components/SaveButton.astro` | Pinterest-style save button |
| `src/components/BadgePill.astro` | Reusable small badge |
| `src/components/PriceBadge.astro` | Premium action price tag |
| `src/components/RecipeHero.astro` | Full-width recipe hero |
| `src/components/IngredientList.tsx` | Checkable ingredient list (React) |
| `src/components/StepList.astro` | Numbered instruction steps |
| `src/components/ScaleControl.astro` | Serving size adjuster |
| `src/components/RecipeFeedFilter.tsx` | Client-side filter (React) |
| `src/components/PlannerCard.astro` | Mini card for planner |
| `src/components/PlanTray.tsx` | Selected recipes tray (React) |
| `src/components/ShoppingList.astro` | Grouped shopping output |
| `src/components/ServingsControl.tsx` | +/− stepper (React) |
| `src/components/EmptyState.astro` | Zero-state component |
| `src/components/RecipeCardSkeleton.astro` | Loading skeleton |
| `public/favicon.svg` | App favicon |

### Modified Files (8)
| File | Changes |
|---|---|
| `src/layouts/Base.astro` | Global CSS imports, structured header/nav, SEO meta, footer redesign |
| `src/pages/index.astro` | Full rewrite → recipe-first homepage |
| `src/pages/recipes/index.astro` | Full rewrite → Pinterest masonry feed with filters |
| `src/pages/recipes/[slug].astro` | Full rewrite → editorial recipe detail |
| `src/pages/meal-planner.astro` | Full rewrite → card-based planner |
| `src/pages/404.astro` | Rewrite with personality |
| `src/components/RecipeCard.astro` | Full rewrite → Pinterest-grade card |
| `src/components/StickyUtilityPanel.astro` | Rewrite → better hierarchy + animations |

### Unchanged Files
| File | Reason |
|---|---|
| `src/lib/pantry-client.ts` | API client is stable, no UI changes needed |
| `src/worker.ts` | Worker config unchanged |
| `src/live.config.ts` | EmDash boilerplate |
| `astro.config.mjs` | Build config stable |
| `seed/seed.json` | CMS schema unchanged |
| `content/placeholder-recipes.json` | Recipe data unchanged |

---

## Screenshot Checklist for Launch

Capture at **1440px desktop** and **375px mobile** for each:

| # | Screen | What to Show | Desktop | Mobile |
|---|---|---|---|---|
| 1 | **Homepage hero** | Search bar, tagline, category chips | ☐ | ☐ |
| 2 | **Homepage feed** | 4-column masonry with varied card heights | ☐ | ☐ |
| 3 | **Recipe feed** | Filter chips active, recipe count, full grid | ☐ | ☐ |
| 4 | **Recipe feed — filtered** | One chip selected, filtered results | ☐ | ☐ |
| 5 | **Recipe detail — top** | Hero area, recipe title, serving controls | ☐ | ☐ |
| 6 | **Recipe detail — ingredients** | Checkable list with some checked | ☐ | ☐ |
| 7 | **Recipe detail — utility panel** | Sticky panel with price badges visible | ☐ | ☐ |
| 8 | **Meal planner — empty** | Card grid, empty plan tray | ☐ | ☐ |
| 9 | **Meal planner — with plan** | Selected recipes + generated shopping list | ☐ | ☐ |
| 10 | **404 page** | Fun empty state with CTA | ☐ | ☐ |
| 11 | **Card hover state** | Single card lifted with shadow + save button | ☐ | N/A |
| 12 | **Mobile utility panel** | Bottom-positioned panel on recipe detail | N/A | ☐ |

---

## Acceptance Criteria — Ship/No-Ship Gate

### Must-have (blocks launch):
- [ ] All 5 recipes render in feed with Pinterest-style cards
- [ ] Recipe detail page shows ingredients, steps, and utility panel
- [ ] Meal planner generates shopping list from selected recipes
- [ ] `npm run build` succeeds with zero errors
- [ ] Mobile layout works at 375px without horizontal scroll
- [ ] All links work (no 404s except the 404 page itself)
- [ ] Design tokens are consistently applied (no hardcoded colors)

### Should-have (polish, do if time allows):
- [ ] Card entrance stagger animation
- [ ] Ingredient checkbox persistence
- [ ] Copy-to-clipboard on shopping list
- [ ] Recipe JSON-LD structured data
- [ ] Lighthouse Performance ≥ 90

### Nice-to-have (skip if behind):
- [ ] Dark mode
- [ ] View transitions between pages
- [ ] Skeleton loading states
- [ ] Horizontal chip scroll with fade hints

---

## Risk Register

| Risk | Mitigation |
|---|---|
| PantrySDK API is down | All pages degrade gracefully; show empty states, not errors |
| No real recipe photos | Gradient placeholders with food-tone palettes look intentional |
| React hydration issues | Keep islands minimal; only IngredientList, PlanTray, ServingsControl, RecipeFeedFilter need React |
| EmDash conflicts with custom routes | Recipe pages don't use EmDash collections — they call PantrySDK API directly |
| Scope creep on animations | Time-box animations to 2 hours; cut dark mode and view transitions first |

---

## Commit Strategy

```
Day 1, end of Hour 1:   chore: add design token system and global styles
Day 1, end of Hour 5:   feat: homepage and recipe card v3 with masonry grid
Day 1, end of Hour 9:   feat: recipe detail editorial layout with utility panel
Day 1, end of Hour 10:  chore: day 1 QA pass and build verification
Day 2, end of Hour 12:  feat: meal planner redesign with plan tray
Day 2, end of Hour 14:  feat: micro-interactions and animations
Day 2, end of Hour 17:  fix: mobile audit and responsive polish
Day 2, end of Hour 19:  feat: UI v3 complete — Pinterest-style recipe product
```

---

*Last updated: 2026-04-04*
