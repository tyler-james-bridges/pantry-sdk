# Conversion Copy Playbook

> UI copy and pricing placement strategy for PantrySDK's free → paid journey.
> Covers human visitors and agent consumers alike.

---

## 1. Hero Copy Options

Three directions depending on landing context:

### A — Utility-forward (recommended for launch)
> **Cook smarter, not harder.**
> Free recipes. Paid superpowers — scaling, substitutions, meal plans — priced per use, starting at $0.01.

### B — Price-transparency-forward
> **Every recipe is free. Every tool has a price tag.**
> No subscriptions. No accounts. Pay per action — pennies, not dollars.

### C — Agent-forward (for developer/API docs)
> **The recipe API that charges by the byte.**
> x402 native. Your agent reads the recipe for free, pays a few cents when it needs to think.

### Usage guidance
- **A** works best on the public-facing site where most visitors are home cooks.
- **B** works when users land on a pricing or "how it works" page.
- **C** is for the developer docs / API landing page where the audience builds agents.

---

## 2. CTA Variants

### Primary action buttons (paid)

| Action | Default CTA | Urgency variant | Casual variant |
|---|---|---|---|
| Scale recipe | **Scale to {n} servings · $0.01** | Scale now · $0.01 | Resize this recipe · $0.01 |
| Shopping list | **Build shopping list · $0.02** | Get my list · $0.02 | What do I need? · $0.02 |
| Substitution | **Find a substitute · $0.01** | Swap it · $0.01 | What else works? · $0.01 |
| Meal plan | **Generate meal plan · $0.03** | Plan my week · $0.03 | Make it easy · $0.03 |

### Rules for CTA copy
1. **Always show the price.** No "Premium" without a number.
2. **Verb first.** "Scale to 8" not "8 servings scaling."
3. **One CTA per card.** If the utility panel has 4 actions, each gets its own row — no combined button.
4. **Disabled state copy:** "Choose a recipe first" (not grayed-out silence).

### Free action CTAs
- "View full recipe" — no price tag, no badge
- "Browse all recipes" — clean link, no upsell wrapper
- "Add to planner" (free action) — just the verb, no adornment

---

## 3. Premium Badge Language

### Badge hierarchy

```
┌─────────────────────────────┐
│  ✦ $0.03                    │   ← Price badge (default)
│  ✦ Paid                     │   ← Fallback when price unknown
│  ✦ Premium                  │   ← Never use alone; always pair with price
└─────────────────────────────┘
```

### Badge placement
- **Sticky utility panel:** Badge sits right-aligned on the same row as the action label.
- **Recipe card (list view):** Small badge in the bottom-right corner of the card, only on cards that expose a paid shortcut (e.g., "Quick plan" on a recipe card).
- **Inline text:** When mentioning a paid feature in body copy, use: `Generate a meal plan (✦ $0.03)` — inline, parenthetical, never a separate line.

### Copy patterns

| Context | Copy |
|---|---|
| Badge on button | `✦ $0.03` |
| Badge tooltip | "This action costs $0.03, settled instantly via x402." |
| First-time explanation | "Paid actions are priced per use — no account needed. You pay only when you click." |
| Returning visitor | Badge only, no explanation (cookie/localStorage flag) |

### What to avoid
- ❌ "Unlock premium" (implies subscription)
- ❌ "Upgrade" (nothing to upgrade from)
- ❌ "Pro" (no tiers)
- ❌ "Buy" (too transactional for micro-amounts)
- ❌ Price without the ✦ symbol (loses visual consistency)

---

## 4. x402 Payment Moments

### The three-beat rhythm

Every paid interaction follows this cadence:

```
1. INTENT    →  User clicks a priced CTA
2. SETTLE    →  x402 payment challenge resolves (< 1s ideal)
3. DELIVER   →  Result appears with confirmation
```

### Copy at each beat

#### Beat 1 — Intent
Button label already contains the price. On click:
- Show a brief inline loader: **"Settling payment…"**
- No modal. No redirect. No confirmation dialog for amounts under $0.10.
- For amounts ≥ $0.10: show a one-line confirmation — "Generate full weekly plan for $0.10?" with **Confirm** / **Cancel**.

#### Beat 2 — Settle
- **Success (invisible):** Transition straight to delivery. No "Payment successful!" toast for micro-payments — it's noise.
- **Failure — insufficient funds:** "Payment couldn't be completed. Check your wallet balance."
- **Failure — network:** "Something went wrong settling the payment. Your wallet wasn't charged. Try again?"
- **Failure — 402 not supported (agent):** Return structured JSON: `{ "error": "payment_required", "amount": "0.03", "currency": "USD", "protocol": "x402" }`

#### Beat 3 — Deliver
- Result slides in (drawer or inline expansion, per ui-ux-direction.md).
- Subtle confirmation line at the bottom of the result: **"Settled · $0.03"** in muted text.
- Result is copyable / exportable. No paywall on the output once paid.

### Agent flow (402 challenge-response)

```
Agent: GET /scale-recipe?id=abc&servings=12
Server: 402 Payment Required
        X-Payment-Amount: 0.01
        X-Payment-Currency: USD
        X-Payment-Protocol: x402
Agent: [settles payment, retries with proof]
Server: 200 OK { scaledRecipe: { ... } }
```

Agent-facing copy lives in HTTP headers and JSON error bodies, not in HTML.

---

## 5. Objection-Handling Microcopy

### "Why does this cost anything?"

> **Placement:** FAQ section + first-time tooltip on any ✦ badge.
> **Copy:** "Scaling, substitutions, and meal planning run real compute. Instead of showing you ads or locking content behind a subscription, we charge a few pennies per action. You only pay for what you use."

### "How do I pay?"

> **Placement:** Below the first paid CTA a new visitor encounters.
> **Copy:** "Payments settle instantly through your browser wallet — no sign-up, no card on file. Most actions cost less than a nickel."

### "What if I don't have a wallet?"

> **Placement:** Error state when 402 challenge fails due to no wallet.
> **Copy:** "You'll need a web3 wallet to use paid features. [Set one up in 2 minutes →] — then come back and pick up where you left off."
> **Fallback:** Consider a Stripe-based fallback for users without wallets (future milestone).

### "Is my payment data safe?"

> **Placement:** Privacy/FAQ page.
> **Copy:** "We never see your payment credentials. Transactions settle peer-to-peer on-chain. There's no account, no stored card, nothing to breach."

### "Can I get a refund?"

> **Placement:** FAQ.
> **Copy:** "Because results are delivered instantly and payments are final on-chain, we can't reverse transactions. But at a few cents per action, you'll know what you're getting before you pay."

### "I don't want to pay for every little thing"

> **Placement:** Tooltip or FAQ.
> **Copy:** "Most people use 2–3 paid actions per cooking session — that's under a dime. No subscription fatigue, no forgotten charges. You're always in control."

---

## 6. A/B Test Ideas

### Test 1 — Price display format
- **Control:** `✦ $0.03`
- **Variant A:** `3¢`
- **Variant B:** `~3 cents`
- **Metric:** Click-through rate on paid CTAs.
- **Hypothesis:** Cent symbols feel smaller than dollar notation and increase conversion.

### Test 2 — Badge vs. no badge on free actions
- **Control:** Free actions have no badge.
- **Variant:** Free actions show a `Free` badge.
- **Metric:** Paid CTA click-through (does labeling "Free" create stronger contrast that nudges paid clicks?).

### Test 3 — Confirmation threshold
- **Control:** No confirmation dialog for any amount.
- **Variant:** Confirmation dialog for amounts ≥ $0.05.
- **Metric:** Completion rate + repeat usage. Does the speed bump increase trust or add friction?

### Test 4 — "Settled" confirmation visibility
- **Control:** Subtle muted "Settled · $0.03" below result.
- **Variant:** Green checkmark toast: "✓ Paid $0.03 — here's your result."
- **Metric:** Repeat purchase rate. Does visible confirmation build confidence?

### Test 5 — CTA verb style
- **Control:** Functional — "Scale to 8 servings · $0.01"
- **Variant:** Conversational — "Make this feed 8 · $0.01"
- **Metric:** CTR on recipe pages. Does casual copy outperform utility copy?

### Test 6 — First-visit education placement
- **Control:** Tooltip on first ✦ badge hover.
- **Variant:** Banner at top of first recipe page: "Recipes are free. Tools cost pennies."
- **Metric:** Paid action adoption within first session.

### Test 7 — Wallet setup nudge timing
- **Control:** Show wallet setup prompt only on 402 failure.
- **Variant:** Proactive banner after 3+ free recipe views: "Set up a wallet to unlock tools."
- **Metric:** Wallet setup completion rate + subsequent paid action usage.

---

## 7. Copy Component Reference

Quick lookup for developers implementing UI components:

| Component | Key copy slots | Notes |
|---|---|---|
| `RecipeCard` | Title, meta line, optional ✦ badge | Badge only if card exposes a paid shortcut |
| `StickyUtilityPanel` | Action label, price badge, disabled hint | Each action is its own row |
| `PriceBadge` | `✦ {price}` or `✦ Paid` | Use CSS `::before` for the ✦ to keep it out of screen readers |
| `ResultDrawer` | Result content, "Settled · {price}" footer, copy/export buttons | Footer is muted, not celebratory |
| `ErrorState` | Error headline, explanation, retry CTA | Always explain what happened AND what to do next |
| `WalletPrompt` | Setup headline, 1-line explanation, setup link | Only shown on 402 failure, not proactively (unless A/B testing) |

---

## 8. Tone & Voice Rules

1. **Direct over clever.** "Scale to 8 servings" beats "Supersize it!"
2. **Prices are facts, not apologies.** State them plainly. No "just" or "only" — those signal insecurity about pricing.
3. **Errors are conversations.** Every error message answers: What happened? Was I charged? What do I do now?
4. **Free content never feels like a teaser.** Recipes are complete and useful. Paid tools are genuinely additive, not artificial gates.
5. **No dark patterns.** No pre-checked boxes, no "Are you sure you don't want to save money?", no guilt copy.
6. **Warm, not cute.** The brand is a capable kitchen companion, not a cartoon chef.
