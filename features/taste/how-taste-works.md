# How the taste journey works

A guide to the taste flow: what each screen does, what gets saved, and how the
feed uses it. Covers both repos — the wizard lives in the app, the data and the
scoring live in the backend.

## The short version

The user picks films and shows they like. From those picks the app guesses which
genres they're into, asks four either/or questions, and asks what to avoid. All
of that is saved as one row in the `taste` table. The feed then uses that row to
decide what to show them.

```mermaid
flowchart LR
    A[User picks posters<br/>and answers questions] --> B[Wizard state<br/>held in memory]
    B -->|PUT /v1/taste| C[(taste table<br/>one row per user)]
    C --> D[Feed engine<br/>picks and ranks titles]
    C --> E[Personality card<br/>just for fun]
```

## The six screens

Every screen reads from one shared in-memory object (`tasteOnboardingAtom`).
Nothing is sent to the backend until the last screen.

| # | Route | What the user does | Rule |
|---|---|---|---|
| 1 | `/taste` (movies) | Taps film posters | Must pick **at least 4** to continue |
| 2 | `/taste/series` | Taps show posters | Optional — "Skip, I mostly watch movies" |
| 3 | `/taste/genres` | Adds genre chips | Genres from their picks are **on and locked** — see below |
| 4 | `/taste/questions/1..4` | Four either/or questions | Each has a third "no preference" option |
| 5 | `/taste/preferences` | Taps things to avoid, sets an "how adventurous" slider | Both optional |
| 6 | `/taste/result` | Nothing — waits | Saves to the backend, shows the personality card |

Screen 1 also loads any previously saved taste, so a returning user sees their
old answers instead of a blank form.

The poster lists and the genre chips are not hardcoded in the app. They come
from one call to `GET /v1/taste/journey` made on screen 1, which returns the
poster pools, the chips, the four questions, the avoid chips and the slider
labels.

## What gets saved

One row in the `taste` table, one row per user. This is everything the product
knows about a user's taste:

| Column | Example | What it's for |
|---|---|---|
| `movieIds` | `[157336, 129, 155, 313369]` | Feeds the "more like this" source, and names the personality |
| `seriesIds` | `[1396]` | Same |
| `seriesSkipped` | `false` | Remembers the skip so the wizard can be re-opened |
| `genreIds` | `[18, 878, 16]` | **The main feed signal** |
| `era` | `classic` / `new-release` / `both` | Boosts older or newer titles |
| `reality` | `realistic` / `fantasy` / `both` | Boosts grounded or escapist genres |
| `tasteAuthority` | `popular` / `critics-choice` / `both` | Boosts crowd-pleasers or high-rated |
| `commitment` | `short` / `long` / `both` | Sets a film length window |
| `avoid` | `["horror", "long-watches"]` | Hard block — those titles never show. Stores stable ids, not the labels shown on screen |
| `exploreLevel` | `0`–`4` | How far the feed may stray from the taste |

Saving also wipes the user's cached feed, so the change shows up right away.

**The confirmed genres are the most important field.** They are used twice: to
ask TMDB for candidate titles in the first place, and to score how well each
candidate matches. If the genres are wrong, the whole feed is wrong. The four
answers and the slider only re-order what the genres already brought in.

The personality card ("you're a ...") is decoration. It's worked out fresh on
every save and never stored, and the feed never reads it.

### What the picked titles do

Until 2026-07-24 the picked films were used only to guess genres and to name the
personality — the titles themselves were thrown away. Someone who picked
Interstellar and Dune was treated exactly like anyone else who likes sci-fi.

They now also go to the feed as title ids, where `CandidateGenerator` asks TMDB
"what's similar to this?" for the user's 5 most-liked titles. Saves and ratings
outrank wizard picks, so the picks mainly help new users, whose library is
empty. Full details in `src/feed/how-the-feed-works.md` in the backend.

One thing to expect: those picked films no longer show up in the user's own
feed, because the same list is used to hide titles they already know.

## Screen 3: the genre chips

Every genre carried by a title the user picked is **on and locked**. They can add
any other genre they like, but they can't turn off the ones their own picks
produced — unticking "Drama" right after picking three dramas never made sense.

The list is worked out on the phone, in `features/taste/logic/genres.ts`. It's
just a set: collect the genre ids of every picked title, remove duplicates, done.
No ranking, no cap, no rarity. The four films above produce nine locked genres:
Drama, Sci-Fi, Adventure, Animation, Fantasy, Action, Crime, Romance, Music.

The chips show only the emoji and the genre name. They used to carry example
titles ("La La Land" under Music), which collided with the user's own picks — a
chip could name a film they had just picked while sitting unticked.

Locked genres follow the picks. Going back to change titles and returning to this
step adds the new genres; anything extra the user ticked stays.

### Why there's no ranking any more

Two earlier rules both had problems:

| Rule | Problem |
|---|---|
| `count × rarity ≥ 1.6` (the original bug) | One pick of a rare genre beat three picks of a common one. Picking Interstellar, Spirited Away, Dark Knight and La La Land ticked **only Music**. |
| Count first, rarity for ties, top 5 | Fairer, but the cap was arbitrary — 10 varied picks still gave 5 genres, and the cut was invisible to the user. |

Now the app doesn't judge at all. It hands the feed every genre the user's picks
imply, and the feed's own scoring decides how much each one counts. Rarity
weights still exist on the backend, but only the personality card uses them now
(`topGenre` in `personality.ts`).

## Where things live

| What | File |
|---|---|
| Wizard screens | `features/taste/steps/*/screen.tsx` (app) |
| Shared wizard state | `features/taste/state.ts` + `tasteOnboardingAtom` (app) |
| **Genre auto-tick rule** | `features/taste/logic/genres.ts` (app) |
| Loads saved taste on entry | `features/taste/hooks/use-start-taste.ts` (app) |
| Poster pools | `src/taste/constants/pools.constant.ts` (backend) |
| Chips, questions, thresholds | `src/taste/constants/journey.constant.ts` (backend) |
| Rarity weights from TMDB | `src/taste/genre-rarity.service.ts` (backend) |
| Save / load / feed copy | `src/taste/taste.service.ts` (backend) |
| Personality card | `src/taste/personality.ts` (backend) |
| How the feed uses all this | `src/feed/how-the-feed-works.md` (backend) |
