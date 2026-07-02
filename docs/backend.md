# Backend

## Layered architecture

The backend is split into three layers, each with one responsibility. This makes it easier to refactor or add a new feature without touching unrelated code.

```mermaid
---
config:
    look: handDrawn
    theme: dark
---
flowchart LR
    Frontend <--> API

    subgraph server["Server"]
        API <--> Services["Services (Logic)"]
        Services <--> Database
    end
```

### API layer (`app/(api)/api`)

- Validates input with Zod, since client input can't be trusted
- Reads `x-user-id` from headers, injected by the auth middleware
- Calls a single service function and returns the result
- Catches every error and converts it into a proper response; this is the last line of defense for errors
- Holds no business logic

### Service layer (`lib/server/services`)

- Contains all business logic: validation, rules, checks
- Calls the DB layer underneath
- Throws a known error on failure, or lets a DB layer error bubble up

### DB layer (`lib/server/db`)

- Dumb Supabase queries only, no decisions
- No sanitation or verification; that belongs to the service layer
- Throws an error upward if something goes wrong, such as the database being unavailable or a user not existing

## Auth middleware

`proxy.ts` runs before any protected route (daily, play, transfer, steal, users/me, history). It reads the bearer token from the authorization header, verifies it with jose, then attaches `x-user-id` and `x-user-username` to the request headers. Routes never touch the JWT directly, they just read those two headers, already trusted by the time they get there. A missing or invalid token short circuits with a 401 before the route even runs.

## Response format

Responses follow the [JSend](https://github.com/omniti-labs/jsend) format. It's a simple convention with a consistent shape for success, fail, and error states, which made frontend error handling straightforward. Except that the "status" key ended up as a boolean instead of following JSend's string values, which I realized was a mistake while writing this; it's too late to refactor 🥀

## Error handling

Errors are defined in a single map (`errors.ts`), paired with a function that builds the API error response. Instead of manually catching and formatting errors in every route, routes reference a known error code and the response is built consistently.
The map currently covers:

400 - `INVALID_BODY`, `INVALID_USERNAME`, `CAPTCHA_FAILED`, `INSUFFICIENT_BALANCE`, `SELF_TRANSFER`, `TRANSFER_LIMIT`, `SELF_STEAL`, `STEAL_LIMIT`  
401 - `UNAUTHORIZED`, `INVALID_CREDENTIALS`  
404 - `USER_NOT_FOUND`, `HISTORY_NOT_FOUND`  
409 - `USERNAME_TAKEN`  
429 - `COOLDOWN_ACTIVE`  

Any error not found in the map defaults to 500 and printed in the console.

## The play route

All games route through a single `/api/play` endpoint. The endpoint receives a game type and a bet amount, then the outcome gets decided server side before anything else happens.

Win rate scales down as the bet size increases, using a formula along the lines of:  
`max(0, BASE_RATE * (1 - bet / 1_000_000))`  
At the max bet, win rate hits 0%.  

Once the outcome is decided, that boolean gets sent back as the result. The frontend never decides the outcome; it just reverse engineers a valid visual result from that boolean. This keeps game logic in one place and makes adding a new game a matter of extending one function, not building a new endpoint.

In short, [it is rigged](/src/lib/server/services/game.ts) ;)

## Other Decisions

**Config**  
All tunable values live in `lib/config.ts` and `lib/server/config.ts`. Centralizing them avoids scattering magic numbers or hardcoded values across services and routes.

**Password hashing**  
Passwords are hashed with [bcryptjs](https://github.com/dcodeIO/bcrypt.js) before ever touching the database, only the hash is stored. (I can't read them 😔) 

**hCaptcha**  
Login and register are gated behind [hCaptcha](https://www.hcaptcha.com/) as a minor layer of bot protection, verified server side before the request reaches the service layer.

**Profanity filtering**  
The [obscenity](https://github.com/jo3-l/obscenity) package filters usernames and other user submitted text.

**Scalar API Docs**  
API docs are generated with [Scalar](https://scalar.com/) from the Zod schemas via `zod-to-openapi`. Scalar was chosen over Swagger for a more modern look with less setup.

**Hosting**  
Hosted on [Vercel](https://vercel.com/). Vercel also handles rate limiting per route at the edge, which meant not having to build that layer manually. I tried Redis' rate limiting feature at one point, but it felt insufficient even during testing, since a single person doesn't mean a single request.

---

[Back to docs/index](/docs/index.md)