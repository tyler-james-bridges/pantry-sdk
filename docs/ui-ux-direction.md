# PantrySDK UI/UX Direction (Expert-style v0.1)

## Product feel
- Calm, modern, editorial-first (not dashboard-heavy)
- Food-first visuals, utility-first interactions
- One primary action per screen

## Information architecture
1. Home: featured recipes + "What can I do?" utility cards
2. Recipe page: ingredients/steps + sticky utility panel
3. Meal Planner: pick recipes, servings, generate list
4. Pantry Match: input ingredients, get ranked recipes

## Recipe page layout
- Left column: ingredients + scaling control
- Right column (sticky):
  - Substitute
  - Add to planner
  - Generate shopping list
  - "Premium" badge on paid actions

## UX principles
- Free content readable without friction
- Paid actions are clear, priced, and optional
- Keep response format stable and copyable
- Show deterministic outputs (no mystery AI blob)

## Microcopy examples
- Button: "Scale to 12 servings"
- Premium CTA: "Generate premium meal plan ($0.03)"
- Paid success: "Done. Payment settled."
- Paid blocked: "Payment required to continue"

## Visual tokens
- Typography: large readable recipe headings
- Cards: rounded medium with light border
- Spacing: 8/12/16 rhythm
- Accent color: warm food-forward (amber/orange)

## MVP components to build next
- RecipeCard
- StickyUtilityPanel
- PriceBadge
- IngredientLineItem
- PlannerSelectionRow
- ResultDrawer (for shopping list and plan output)

## Conversion flow (human)
1. Read recipe for free
2. Click one utility action
3. See clear price + result expectation
4. Complete action and receive structured output

## Conversion flow (agent)
1. Fetch recipe metadata
2. Call utility endpoint
3. Handle 402 challenge
4. Receive machine-readable result + settlement proof

## "Lovable" checklist
- No dead ends
- No hidden pricing
- Outputs can be copied/exported
- Errors explain exactly what to do next
- Every page has one obvious next action
