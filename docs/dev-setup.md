# Development Setup

## 1. Clone the repository

```bash
git clone <this repo link>
cd seedbank
```

## 2. Set up Supabase

- Create an account and project at https://supabase.com
- Go to the SQL editor
- Paste the contents of `/database/schema.sql`
- Run the query

## 3. Set up hCaptcha

- Create a free account at https://www.hcaptcha.com and grab a sitekey and secret from your dashboard
- hCaptcha ships test keys that always pass verification, use those instead and skip account setup entirely

[more info here](https://docs.hcaptcha.com/)

## 4. Environment variables

Create `.env.local` in the project root with the following:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
HCAPTCHA_SECRET=
```

If you're using the hCaptcha test keys from step 3, the values are:

```
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=10000000-ffff-ffff-ffff-000000000001
HCAPTCHA_SECRET=0x0000000000000000000000000000000000000000
```

## 5. Install and run

This project uses pnpm. Using npm or yarn is blocked at the engine level.

```bash
pnpm install
pnpm run dev
```

## Available scripts

| Script | Purpose |
| --- | --- |
| `pnpm run dev` | Start the local dev server |
| `pnpm run build` | Build for production |
| `pnpm run start` | Run the production build |
| `pnpm run lint` | Lint with Biome |
| `pnpm run format` | Format with Biome |
| `pnpm run test` | Run the test suite with Vitest |
| `pnpm run check` | Type check with `tsc`, no output emitted |

## Testing

Tests are split into api, services, and server utils.

`Api` tests hit each route handler and assert status codes plus JSend shape for both success and error paths.  
`Service` tests cover the business logic and error throwing underneath.  
`Server` tests cover standalone pieces like captcha and the profanity filter.  
Shared mocks and request helpers under `tests/helpers` keep setup consistent across all three.  

## Package manager and engine

The package manager is pinned via the `packageManager` field, currently `pnpm@11.6.0`. Both npm and yarn are explicitly blocked through the `engines` field, so anyone running `npm install` or `yarn` gets a clear message to use pnpm instead.

## Deploying (optional)

The live app is hosted on Vercel, connected directly to the repo for automatic deploys on push. If you want to deploy your own copy:

- Import the repo at https://vercel.com/new
- Add the same environment variables from step 4 in your Vercel project settings
- Deploy

Rate limiting on the live app runs through Vercel's WAF, configured per protected route (daily, play, transfer, steal, etc.) from the Firewall tab in the dashboard.

---

[Back to docs/index](/docs/index.md)