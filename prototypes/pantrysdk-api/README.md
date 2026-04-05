# PantrySDK MVP (SLC)

Simple. Lovable. Complete.

## What this is
A tiny local API that turns recipe content into useful utilities:
- scale a recipe
- generate a shopping list from multiple recipes
- suggest substitutions
- generate a mini meal-plan summary
- transform recipes for dietary goals
- pantry matching + leftovers remix ideas
- batch-prep planning blocks

## Quick start

```bash
cd prototypes/pantrysdk-api
npm install
npm run dev
```

Server runs at: `http://localhost:8787`

## Endpoints

### `GET /recipes`
List available recipes.

### `POST /scale-recipe`
```json
{
  "recipeId": "banana-bread",
  "targetServings": 12
}
```

### `POST /shopping-list`
```json
{
  "recipeIds": ["banana-bread", "choc-chip-cookies"]
}
```

### `POST /substitute`
```json
{
  "ingredient": "egg"
}
```

### `POST /plan-meal`
```json
{
  "recipes": [
    { "recipeId": "perfect-cc-cookies", "servings": 16 },
    { "recipeId": "banana-bread", "servings": 8 }
  ]
}
```

### `POST /recipe/:id/transform`
```json
{
  "dietaryProfile": "dairy-free",
  "maxSugarCup": 0.75,
  "servings": 12
}
```

### `POST /pantry-match`
```json
{
  "pantryItems": ["flour", "egg", "butter", "sugar", "banana"],
  "limit": 3
}
```

### `POST /leftovers-remix`
```json
{
  "leftovers": ["rice", "chicken"],
  "pantry": ["egg", "soy sauce", "green onion"]
}
```

### `POST /batch-prep`
```json
{
  "days": 4,
  "recipes": [
    { "recipeId": "perfect-cc-cookies", "servings": 16 },
    { "recipeId": "banana-bread", "servings": 8 }
  ]
}
```

## Demo script

```bash
npm run demo
```

Prints one JSON blob with:
- scaled recipe
- combined shopping list
- substitution suggestions

## x402 setup (optional, paid mode)

Paid mode gates premium endpoints when x402 is enabled.

### 1) Add env vars
Create `.env` in this folder:

```env
X402_NETWORK=base-sepolia
X402_PAY_TO=0x3b899D6Ec64B654B3385E50Fa8f238066e1da0C7
BOT_ONLY_MODE=true
```

### 2) Restart server

```bash
npm run dev
```

### 3) Verify x402 status

```bash
curl -s http://localhost:8787/
```

Look for:

```json
"x402": { "enabled": true, "network": "base-sepolia" }
```

### 4) Run a paid-call proof (official x402 client + viem)

Install deps in this folder:

```bash
npm install
```

Then run:

```bash
PRIVATE_KEY=0xYOUR_EVM_PRIVATE_KEY \
PANTRY_API_URL=https://YOUR_PUBLIC_URL/plan-meal \
npm run pay:test
```

This uses `@x402/fetch` + `@x402/evm` and will:
- request the paid endpoint
- handle 402 payment flow automatically
- print paid response and payment metadata

### Premium endpoints (paid when enabled)
- `POST /shopping-list`
- `POST /substitute`
- `POST /plan-meal`
- `POST /recipe/:id/transform`
- `POST /pantry-match`
- `POST /leftovers-remix`
- `POST /batch-prep`

If `X402_PAY_TO` is missing, app runs in free mode.

If `BOT_ONLY_MODE=true`, likely bot/agent user-agents are challenged with x402 while human browsers pass through.

## Next step
Drop your custom recipe into `recipes.json` and re-run calls.
