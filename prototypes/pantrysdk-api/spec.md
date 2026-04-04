# PantrySDK v0.1 — Rapid Spec (MVP)

## Goal
Turn recipe content into structured, callable utilities for humans and agents.

## 7-day MVP scope
1. Structured recipe JSON schema
2. Utility functions:
   - scale recipe by servings
   - generate shopping list from selected recipes
   - simple substitution suggestions
3. API shape (future x402 wrapping):
   - `POST /scale-recipe`
   - `POST /shopping-list`
   - `POST /substitute`
4. MCP-friendly response shapes

## Immediate 10-20 minute tangible demo
- Local script that:
  - loads sample recipes
  - scales a recipe
  - produces combined shopping list for a mini meal plan
  - prints deterministic JSON output

## API contracts (draft)

### POST /scale-recipe
Input:
```json
{ "recipeId": "banana-bread", "targetServings": 12 }
```
Output:
```json
{
  "recipeId": "banana-bread",
  "originalServings": 8,
  "targetServings": 12,
  "factor": 1.5,
  "ingredients": [
    { "name": "banana", "amount": 4.5, "unit": "count" }
  ]
}
```

### POST /shopping-list
Input:
```json
{ "recipeIds": ["banana-bread", "choc-chip-cookies"] }
```
Output:
```json
{
  "items": [
    { "name": "flour", "amount": 4.25, "unit": "cup" }
  ]
}
```

### POST /substitute
Input:
```json
{ "ingredient": "egg" }
```
Output:
```json
{
  "ingredient": "egg",
  "substitutions": [
    "1 tbsp ground flax + 3 tbsp water"
  ]
}
```

## Demo definition of done (today)
- One command run prints:
  - scaled recipe object
  - shopping list object
  - substitution object
- Output is valid JSON and copy/paste-able for post/demo
