# Concept

## What it is

Seedbank is a fullstack learning project. My goal was to learn Next.js infrastructure end to end, not follow a textbook tutorial where all the ideas are already decided for you. The game and currency concept exists mainly to give that infrastructure something real to be built around, and I leaned on a mix of crypto wallet and casino app as the general theme to shape it.

> The app isn't meant to be perfect, but it is the result of my perfectionism.

## The name

Seed + bank. Seed is a metaphor for currency that can grow, if a bet lands. Bank is the thing that stores it, similar to how a real bank holds deposits.

## The currency

The concept draws some inspiration from crypto. I originally thought about theming the app around a meme coin, or at least something closer to a crypto wallet feel, before settling on where it ended up.

SEED is the app's virtual currency. You earn it through:

- A daily claim
- Winning games
- Receiving transfers from other players
- Stealing from other players

And you lose it through:

- Losing games
- Sending transfers
- Failed steal attempts
- Successful steals from you by others

## Design decisions

**Dark mode only, no toggle.**  
I was never going to support light mode, so building a toggle for it would've just been wasted effort. Committing to one theme also kept the color system a lot simpler for me to manage.

**Green as the primary color.**  
Seed as a word evokes green for most people, and green reads as calm rather than alarming, which fits a currency-focused app better than something more aggressive would.

**Supabase without its extra features.**  
Supabase offers built in functions and other platform features, but my goal here was to learn classic backend architecture: a service layer making direct queries, not leaning on a platform to handle logic for me. I kept the database layer intentionally basic on purpose.

---

[Back to docs/index](/docs/index.md)