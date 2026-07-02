# Frontend

## Why MUI

[Shadcn](https://github.com/shadcn-ui/ui/issues) was the original choice, but it led to unmaintained package versions and a config setup that was hard to keep track of. I already had experience with Tailwind, so I switched to MUI instead as a chance to learn a different approach to styling, one built around a component library and its own theming system rather than utility classes.

## Pages

Pages own their data. Each page calls the relevant hooks and functions, then passes the result down. Components stay presentational and just render what they're given, no fetching or filtering inside them. Helper functions handle the data shaping a component needs, for example the chart helpers that take a raw history array and filter it into what a specific chart needs.

```
Page (owns data, fetches, decides layout)
├─ calls hooks, gets raw data
├─ passes data through helper functions (shaping, filtering)
└─ renders components, passing them only what they need
└─ Component (presentational, no fetching, no filtering)
```

Pages also decide layout and sizing. Components are kept flexible and generic so pages can stretch or constrain them as needed.

## Games

Every game page shares the same structure:

- `phase`: `"idle" | "pending" | "animating"`, controls locking and flow
- `amount`: the current bet
- `result`: the API response once resolved
- `isLocked`: global lock for the components
- `handleFinish()`: game box render finish handler
- `handlePlay()`: the API play caller

The page handles the API call and passes a `GameBox` component everything it needs. The GameBox owns the actual game experience: choices, animation, rendering. Nothing about the game's internal state leaks back to the page. This isolation makes it straightforward to add a new game without touching existing ones.

[Anime.js](https://animejs.com/) handles the animations, chosen for how much it simplified sequencing compared to writing transitions by hand.

## Data fetching

[SWR](https://swr.vercel.app/) handles caching and revalidation across the app, used heavily in the hooks under `lib/client/hooks/data.ts`.

Requests go through an Axios instance (`lib/client/axios.ts`) wrapped with an interceptor. The interceptor attaches the auth token to every request and catches errors, mapping them to a shared snackbar function so any part of the app can surface a user friendly error message without repeating that logic.

## Auth

- The token is stored client side and attached automatically by the Axios interceptor
- `/` redirects to `/dashboard` if a valid token exists, otherwise to `/login`
- Requests that fail auth, most commonly `/users/me`, redirect back to `/login`

Password hashing, JWT signing, and hCaptcha verification all happen server side, covered in [backend.md](/docs/backend.md).

## Other Decisions

**Layout**  
Mobile uses a bottom navigation bar, similar to native app conventions. Desktop uses an always visible sidebar rather than a collapsible one, since a collapsed sidebar would leave the layout feeling empty.

**Registry**  
A registry (`lib/client/registry`) centralizes static data like sound identifiers, icon references, nav items, and history labels. Having one place for these means not having to hunt across the codebase to find or update them.

**Assets**  
SVGs are treated as code and edited directly rather than imported as static files, since SVG markup is straightforward to adjust by hand. Iconify is used across the app for general icons, alongside the custom SVG set.

**Sound and effects**  
Sound effects come from [myinstants](https://www.myinstants.com/). [Howler](https://howlerjs.com/) handles playback, [canvas-confetti](https://www.kirilv.com/canvas-confetti/) handles the win celebration effect.

**Charts**  
[Recharts](https://recharts.github.io/) is used for data visualization over MUI's built in chart components, mainly for more flexibility in styling and layout.

---

[Back to docs/index](/docs/index.md)