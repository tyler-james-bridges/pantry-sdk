# PantrySDK

Pinterest-style recipe experience with EmDash CMS on Cloudflare, plus paid utility actions powered by x402-style micropayments.

## Live URLs

- Base site: `https://0x402.sh`
- Pantry app + EmDash admin: `https://pantry.0x402.sh`
- Admin: `https://pantry.0x402.sh/_emdash/admin`

## Stack

- **Frontend:** Astro
- **CMS:** EmDash
- **Runtime:** Cloudflare Workers
- **Database:** Cloudflare D1 (`pantry-sdk-db`)
- **Storage:** Cloudflare R2 (`pantry-sdk-media`)
- **Base site hosting:** Vercel (for non-pantry root flows)

## Key Project Docs

- Deployment journey + postmortem: `docs/deployment-journey.md`
- Conversion copy strategy: `docs/conversion-copy-playbook.md`
- Product spec: `SLC-SPEC.md`

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- The project includes fallback sample content for resilience when API/CMS reads are unavailable during static build contexts.
- Current production routing keeps pantry/EmDash on Cloudflare via `pantry.0x402.sh`.
