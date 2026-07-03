# FAQ

## Is this a gambling app?

No. SEED has no real world value, can't be bought with real money, and can't be cashed out. There's no way to convert it into anything outside the app. This project exists to practice fullstack development, the game and currency concept just gives that practice something to be built around. See [concept.md](./concept.md) for more on that.

## What information do you collect from me?

Just your username, password, balance, and your history of in-app actions (games played, transfers, steals). No email, no personal info, no tracking beyond what's needed for the app to function.

Your password is [hashed](https://supertokens.com/blog/password-hashing-salting#what-is-password-hashing) with `bcryptjs` before it ever touches the database, only the hash is stored; that means even a hacker or me can't see your actual password.

## How long did this take?

The commit history gives the best estimate. The actual time was longer because it doesn't include planning, learning unfamiliar concepts, redesigns, or time spent away from the code.

## Why use Supabase but not its built in features?

The goal was to learn backend architecture: service layers, direct database queries, and explicit error handling. Relying heavily on Supabase's higher-level features would have hidden those details, so I intentionally built them myself.

## What is your background knowledge before starting?

- CLI usage (linux)
- Programming concepts from Python, carried over to JavaScript
- HTML, CSS, and JS fundamentals
- Basic SQL, covered formally in university but not deeply practiced
- Simple webpage layouts and how frontend and backend interact
- Python web apps using Flask and jQuery
- REST API concepts: HTTP, payloads, status codes
- Deploying static and live apps on various platforms
- Git basics: push, commit, branches, SSH auth
- Very early exposure to modern frontend tooling (seen from my previous projects)

## What did you learn from this project?

- Planning before coding. Early frontend work was done without a clear plan, which ended up costing more time than it saved. Sketching the userflow first, even roughly, would have avoided a lot of mid build indecision.
- Knowing when to stop. Features that didn't matter kept getting added along the way. Now they go into a list instead of getting built immediately, and flexibility gets added later, only when it's actually needed.
- Practical experience with Next.js structure, JWT auth, layered backend architecture, component isolation, and the rest of the stack listed in the README.

## What is your development environment?

Built on VS Code, on Windows, using Debian through WSL, with fish as the shell.

## Why migrate to pnpm from npm?

Faster installs and a stricter dependency structure. fnm was picked up around the same time for managing Node versions. Part of the motivation was also reducing exposure to [supply chain attacks](https://www.cloudflare.com/learning/security/what-is-a-supply-chain-attack/), which pnpm handles better than npm's flatter resolution.

## How much did this project costs you in dollars?

aside from unlimited internet access, a working laptop, food, water, electricity, shelter...  
$0 (zero). Every tech used in this project is free.

## Did you use AI to build this?

Yes. Claude Sonnet (free web version) was used throughout, and I often hit the usage limits. The workflow was closer to directing than one-shotting: I planned first, then had the AI write code, while decisions around UX, architecture, refactoring, and long-term maintainability were made independently by me. The initial frontend UI pass was the main exception, relying more directly on AI, and it resulted in lower-quality code. During the second refactor, I revisited those parts and improved them. Aside from coding, I also learned how to write better prompts. 😉

---

In the end, speed matters more than elegance. At least for the first version. You can't improve what doesn't exist yet.

---

[Back to docs/index](/docs/index.md)