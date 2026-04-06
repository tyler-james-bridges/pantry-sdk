# PantrySDK Deployment Journey (April 2026)

This document captures what happened, what failed, what fixed it, and the final stable architecture.

## Goal

Deploy PantrySDK + EmDash CMS with:
- Public site at `https://pantry.0x402.sh`
- EmDash admin at `https://pantry.0x402.sh/_emdash/admin`
- Cloudflare D1 + R2 backing content
- Vercel still serving the base site where needed

## Final Working State

### Production URLs
- Base site: `https://0x402.sh` (Vercel)
- Pantry app + EmDash admin: `https://pantry.0x402.sh` (Cloudflare Worker route)

### Infra
- Worker: `pantry-sdk`
- Session KV namespace ID: `a3d453c4400642e8bd023c7b16fc6f9c`
- D1: `pantry-sdk-db` (`f7805f4c-ff83-4f34-9d1b-af9911161f1b`)
- R2: `pantry-sdk-media`

## Major Blockers We Hit

### 1) Repeated KV namespace conflict (Cloudflare error 10014)
`wrangler deploy` repeatedly failed trying to create:
- `pantry-sdk-session`

But that namespace already existed.

#### Why
Auto-provisioning attempted resource creation instead of attaching existing namespace.

#### Fix
Explicitly bind existing namespace in `wrangler.jsonc`:
```json
"kv_namespaces": [
  {
    "binding": "SESSION",
    "id": "a3d453c4400642e8bd023c7b16fc6f9c",
    "preview_id": "a3d453c4400642e8bd023c7b16fc6f9c"
  }
]
```

### 2) Vercel static build failed on localhost API fetch
Vercel build error:
- `connect ECONNREFUSED 127.0.0.1:8787`

#### Why
`/recipes` page attempted API fetch during static generation.

#### Fix
Added fallback sample recipes in `src/pages/recipes/index.astro` if API fetch fails.

### 3) EmDash admin route behavior during cross-host setup
When domain and worker ownership were split, rewrite/redirect behavior was needed as interim workaround.

#### Final resolution
Moved DNS authority for `0x402.sh` into the Cloudflare account that owns the Worker and bound `pantry.0x402.sh` directly to the Worker.

## DNS / Routing Lessons Learned

1. Custom Worker domains must live in the same Cloudflare account as the Worker.
2. During nameserver cutover, stale A records can break SSL/routing.
3. Keep DNS minimal and explicit:
   - Worker route for `pantry.0x402.sh`
   - Clean apex/www records for base site behavior

## Recommended Ongoing Architecture

- `0x402.sh` and `www.0x402.sh`: base site (Vercel-compatible flow)
- `pantry.0x402.sh`: Cloudflare Worker + EmDash CMS
- No Vercel `/_emdash/*` redirect/rewrite dependency required in steady state

## What To Do Next

1. **Content modeling in EmDash**
   - Recipe type: title, slug, image, ingredients, instructions, cook time, difficulty, servings
2. **Seed initial recipes**
   - Publish 3–5 production-quality recipes via admin
3. **Wire frontend to CMS-first reads**
   - Keep fallback content only as resilience path
4. **Begin x402 integration (Phase 2)**
   - Scale recipe ($0.01)
   - Substitutions ($0.01)
   - Shopping list ($0.02)
   - Meal planner ($0.03)

## Incident Retrospective (Short)

What worked:
- Fast iterative deploy/test loop
- Reading full logs and tracing exact failing phase
- Binding existing KV namespace explicitly

What caused churn:
- Too many temporary config pivots while root cause stayed constant
- Mixed hosting ownership (Vercel + Cloudflare account split) complicated pathing

Hard rule for future:
- **If error is resource already exists on Cloudflare, bind existing ID first before trying naming tricks.**

---

_Last updated: 2026-04-05_
