# 🌱 Seedbank

![Next.js](https://img.shields.io/badge/Next.js-23272f?logo=nextdotjs&logoColor=fff&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-23272f?logo=typescript&logoColor=3178c6&style=for-the-badge)
![React](https://img.shields.io/badge/React-23272f?logo=react&logoColor=61dafb&style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-23272f?logo=supabase&logoColor=3ecf8e&style=for-the-badge)
![MUI](https://img.shields.io/badge/MUI-23272f?logo=mui&logoColor=007fff&style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-23272f?logo=vercel&logoColor=fff&style=for-the-badge)

A fullstack web app where players earn, play minigames, and steal from each other over a virtual currency.

🔗 Live App: https://seedbank-play.vercel.app  
📄 API Docs: https://seedbank-play.vercel.app/api/docs  
📚 Full Documentation: [Documentation Index](./docs/index.md)  

![Seedbank preview](./public/assets/images/banner.png)

## ✨ Features

- Play different games (card, coinflip, color cube, mines, roulette, slots)
- Win and lose SEEDs
- Steal from other players, or send them SEEDs instead
- Claim free daily reward
- Check other player activity through their profile page
- Compare standings on a public leaderboard

## ⚓ Tech Stack

| Technology | Purpose |
| --- | --- |
| Vercel | hosting, rate limiting |
| Next.js | framework, routing, API routes |
| Supabase | database |
| React | UI components |
| MUI | component library, theming |
| TypeScript | type safety |
| SWR | data fetching, caching |
| Axios | HTTP client |
| obscenity | profanity filtering |
| hCaptcha | bot protection on login and register |
| jose | JWT auth |
| bcryptjs | password hashing |
| Zod | schema validation |
| Scalar (OpenAPI) | API reference |
| Vitest | testing |
| Anime.js | animations |
| Howler | sound effects |
| canvas-confetti | win celebration effects |


## ⚡ Applied Concepts

- SQL: remote database setup, schema design, queries
- REST API design: request and response contracts, status codes
- Layered architecture: separation between API, service, and database concerns
- User auth: password hashing, JWT, protected routes
- Rate limiting at the edge
- React and Next.js: hooks, routing, server vs client components
- Input validation and sanitization on both client and server
- Error normalization: a shared error map and response shape across all routes
- Automated testing with Vitest across services and API routes
- API documentation via OpenAPI, generated from Zod schemas

## 👨‍🍳 Development

Clone the repo and install dependencies with [pnpm](https://pnpm.io):

```bash
git clone <this repo>
cd seedbank
pnpm install
pnpm run dev
```

Full setup, including Supabase and environment variables, is covered in [docs/dev-setup.md](./docs/dev-setup.md).

---

For architecture, design decisions, FAQs, and everything else, see [docs/index.md](./docs/index.md).
