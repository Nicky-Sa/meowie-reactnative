# Release hardening notes

Written during the crash-risk sweep on 2026-11-14, from reading the code at commit `1110cdd` plus the uncommitted
PostHog and toast changes. Part 1 is the screen map for writing the end-to-end flows. Part 2 is the list of findings.

## Part 1: Screen map

Labels are copied from the code, so a flow can tap or assert on them. "→" means "goes to".

### Launch

| Route         | What is on it                                                                               | Where it goes                                                                                            |
|---------------|---------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| `/`           | Splash animation. It stays until the Lato and Mazius fonts and `/user/current` have loaded. | Not onboarded → `/onboarding`. Onboarded → `/home`, then a waiting share link or Siri link opens on top. |
| `/onboarding` | Three slides: "Scroll to Discover", "Filters", "Saved Favorites". Button "Let's Go".        | "Let's Go" marks the phone as onboarded → `/taste`.                                                      |

### Taste

| Route                | What is on it                                                                                                                                                                                       | Where it goes                                               |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------|
| `/taste`             | "Your taste" with "Skip" at the top right, and a back arrow only when there is a screen to go back to. A 3-column grid of movies and series to pick. The button says "Pick N to continue", then "Continue (1/N)" and stays disabled until N picks, then "Continue (N picked)". | "Skip" → `/home`. "Continue" → `/taste/result`.            |
| `/taste/result`      | Loading animation for at least 5 seconds while the taste is sent.                                                                                                                                   | Guest → `/auth` with `returnTo=/home`. Logged in → `/home`. |

Error texts: the grid shows the shared load error, like "We couldn't reach Meowie…", and the result screen shows "We
couldn't save your taste. Check your connection and try again.", both with "Try again".

### Tabs

The bottom bar has Home, Explore and Profile.

| Route      | What is on it                                                                                                                                                                                                                                                                              | Where it goes                                                                                                      |
|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `/home`    | Logo at the top left with a badge when there is a new release note. Toggle "Movie" / "Series". A full-screen feed, one title per page: trailer, "Save", "Seen", "Details", genres. Pull down to refresh. First visit shows the spotlight tour, then the feed peeks at the next title once. | Logo → `/release-notes`. "Details" → `/movie/[id]/details` or `/series/[id]/details`. Genre → `/discover/posters`. |
| `/explore` | Filter icon, toggle "Movie" / "Series", search icon (the only control with an accessibility label, "Search"). Tabs come from the backend. Each tab is a poster grid.                                                                                                                       | Filter icon → `/filters`. Search icon → `/search`. Poster → `/discover/media-list`.                                |
| `/profile` | Logo and a settings icon. Tabs "Saved" and "Seen". Guest: "Sign in to start building your watchlist." or "Sign in to keep track of what you've seen.", with "Login or Sign Up". Logged in: poster lists, or "You haven't saved anything yet." / "You haven't marked anything as seen yet." | Settings icon → `/settings`. "Login or Sign Up" → `/auth`. Poster → `/library/[category]`.                         |

### Search, filters and lists

| Route                                                               | What is on it                                                                                                                                             | Where it goes                                                                 |
|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `/search`                                                           | Input "Search anything...", "Cancel". Results are people, movies, series and genres. Empty: "Please try something else."                                  | "Cancel" → back. Person → `/person/[id]`. Genre → `/discover/posters`.        |
| `/filters`                                                          | Title "Filter". Rows "Genre", "Decade", "Languages", "Ratings (TMDB)" and "Format". Each row opens a sheet with "Clear" and "Apply". Main button "Apply". | "Apply" → `/discover/posters`, titled "Filtered movies" or "Filtered series". |
| `/discover/posters`                                                 | Three-column poster grid, with a filter count when filters are set. Empty with filters: "Please try different filters."                                   | Poster → `/discover/media-list`                                               |
| `/discover/media-list`, `/library/[category]`, `/person/[id]/media` | The same full-screen paged list as Home, opened at the tapped poster.                                                                                     | "Details" → the details screen                                                |
| `/person/[id]`                                                      | Photo, name, "known for …", three-column poster grid. Empty: "This person has no known media!"                                                            | Poster → `/person/[id]/media`                                                 |

### Movie and series

| Route                                         | What is on it                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/movie/[id]`, `/series/[id]`                 | Title "Movie Info" or "Series Info". One feed card.                                                                                                                                                                                                                                                                                                                                                                           |
| `/movie/[id]/details`, `/series/[id]/details` | Title "Movie Details" or "Series Details". Share icon at the top right. Poster, "Save", "Seen", ratings, "Cast" and "Crew" (each person → `/person/[id]`), where to watch ("Provided by JUSTWATCH", "No platforms in your region.", "See others"), tickets for movies in cinemas ("Currently in cinemas", "Find tickets"), "More like this" with "See more" → `/discover/posters`. Taking a screenshot opens the share sheet. |

"Save" shows "Save" or "Saved". A guest gets a popup with "You'll need an account to keep track of movies you want to
watch." and "Login or Sign Up". Saving a seen title opens a sheet "Move to Saved?" with "Yes, move to saved".

"Seen" opens a sheet "Rate this movie" (or "Rate this series", or "Update Rating"). It has a slider with Skip and 1 to
10, "Submit", and "Unseen this movie" when the title is already seen. A guest gets a popup with "You'll need an account
to track what you've seen."

### Sign-in

| Route               | What is on it                                                                                                                                                                                                              | Where it goes                                                |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------|
| `/auth`             | "Login to Meowie". "Skip" at the top right opens a sheet "Explore without a profile?" with "Continue as guest" and "Let's login". Buttons "Continue with Email", "Continue with Google", and on iOS "Continue with Apple". | "Continue with Email" → `/auth/otp/request`                  |
| `/auth/otp/request` | Title "Enter your email". Field "Email", placeholder "Enter your email". "Next".                                                                                                                                           | → `/auth/otp/verify`                                         |
| `/auth/otp/verify`  | Title "Verification code". Field placeholder "Enter the code". "Resend code (120)" counts down. "Verify code".                                                                                                             | Toast "Welcome to Meowie!" → the `returnTo` screen, or back. |

### Settings

| Route                   | What is on it                                                                                                                                                                                                                                                 | Where it goes                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------|
| `/settings`             | "Send feedback". "Empty cache" opens a sheet with "Cancel" and "Empty Cache". "Privacy policy" opens the in-app browser. Logged in only: "Delete account" and "Logout". "Logout" opens a sheet "Are you sure you want to logout?" with "Cancel" and "Logout". | "Logout" → `/home`                                                  |
| `/settings/feedback`    | Title "Send Feedback". Text area "Write your feedback here". "Send".                                                                                                                                                                                          | Toast "Thanks for your feedback! 🍿" → back                         |
| `/settings/delete-user` | Title "Delete Account". Warning text, optional reason, a field to type the account email, "Delete Account".                                                                                                                                                   | Toast "Your account has been deleted successfully." → `/onboarding` |
| `/release-notes`        | Title "Release notes". A list of notes. Empty: "No data to show."                                                                                                                                                                                             |                                                                     |

### Screens that can appear anywhere

- No connection: the whole app is replaced by "Please check your internet settings." and "Try again".
- Connection but YouTube is unreachable: a popup with the VPN text and "Ok, understood."
- Any failed load: an error picture, the error text and "Try again".
- An urgent update: toast "Update downloaded! 😻", then the app restarts after 3 seconds.
- A link that matches no screen: an empty bowl picture, "This screen does not exist." and a "Go to home screen" button that opens `/home`.

### Ways into the app from outside

- `https://meowie.app/movie/<id>` and `https://meowie.app/series/<id>` open the details screen. On a cold start the
  splash and Home load first.
- Siri "save" opens the details screen with `action=save`. Siri "search" opens `/search` with the query.
- `meowie://<any route>` opens that route directly.

### What the flows have to work around

- No control has a `testID`. Icon-only buttons have no text to tap: filter, settings, share, the logo and the bottom bar
  icons.
- Feed, explore tabs and posters come from the backend, so a flow can't assert on a fixed title.
- Email login needs a code from an email.
- "Continue with Apple" fails on a simulator that has no Apple Account. "Continue with Google" opens a web page.
- The taste result screen always waits 5 seconds. "Resend code" is disabled for 120 seconds.
- The tour and the scroll peek play only on the first visit to Home.

## Part 2: Findings

How the code was checked: a one-off lint pass with `no-floating-promises`, `no-misused-promises` and
`no-non-null-assertion` gave 43 places; a one-off type check with `noUncheckedIndexedAccess` gave 38 places. Each was
read. The screens, the request layer and the session code were read too. Nothing below was run on a phone unless it says
so.

In a release build a promise that fails without a handler does not crash the app. It leaves the person with no message.
A crash comes from an error while a screen draws, or from an error thrown directly in a tap handler.

### The person gets wrong or missing feedback

1. **Save, Seen and rating fail without a message.** `use-mark-as-saved.ts`, `use-remove-saved.ts`,
   `use-mark-as-seen.ts`, `use-update-rating.ts` and `use-remove-seen.ts` catch the failed request, put the old state
   back and say nothing. The button turns to "Saved" and then back to "Save". `save.tsx` and `seen.tsx` then still run
   their tracking callback, so PostHog counts a save or a rating that never happened.
2. **Logout fails without a message.** `handleLogout` in `features/settings/items/logout.tsx` has no try/catch. When the
   request fails, the sheet stays open and nothing else happens. This also breaks the project rule about `Button`
   handlers.
3. **A guest can see "Delete account" and "Logout".** `features/settings/screen.tsx` uses `data?.user !== null`. While
   `/user/current` is loading or has failed, `data` is undefined, so the check is true. The profile screen uses
   `!!data?.user`.
4. **"Resend code" fails without a message.** `otp-form.tsx` returns the request promise to `ResendCode`, which drops
   it. The 120-second countdown restarts as if the code was sent.
5. **Error screens show code words.** `ErrorState` shows `String(error)`. A failed request reads "FetcherError: Network
   Error". A failed request whose body is not our error format reads just "FetcherError".
6. **The not-found screen is the unstyled Expo template.** `app/+not-found.tsx` uses default text with no colours, on
   the app's dark background.
7. **Release notes and the person header have no error state.** A failed release notes load shows "No data to show."
   with no retry. A failed person load leaves the header skeleton up for good.
8. **Three smaller ones.** "Privacy policy" has no handler for a browser that fails to open. "Empty cache" logs a
   failure with `console.log`, so PostHog never sees it. "Send" on feedback shows "Survey not initialized" when the
   survey has not loaded. The text stays in the field.

### Launch and connection

9. **A slow backend keeps the splash up for a long time.** The splash waits for `/user/current`, which tries 4 times
   with a 10-second timeout and 3 seconds between tries. That is up to 49 seconds.
10. **A cold start from a `meowie://` link skips the splash.** Only the share links go through it. The fonts are loaded
    in the splash screen, and the onboarding check is there too. Seen once on the simulator: the sign-in screen opened
    by link showed the system font.
11. **Going offline shows nothing, and a cold start offline hangs on the splash.** The offline view only appeared when
    the connection check ran while offline, which happened only after an earlier failed check or a tap on "Try again".
    React Query pauses every request while NetInfo says offline, so screens kept their skeletons with no message, and
    the splash waited for a paused `/user/current` forever. When the view did show, it replaced the whole app.

### No crash guard

12. **No error boundary.** One error while a screen draws takes down the whole app. Step 6 of the plan adds error boundaries for this.

### Low risk

13. `trailer-player.tsx` has 7 player and volume calls whose promises nobody handles. PostHog has no such errors in the
    last 30 days.
14. The response interceptor in `axios.ts` reads `error.response?.data.errors`. A failed response with an empty JSON
    body would throw there and hide the real error.
15. Metro prints warnings that come from libraries. "ImageBackground is deprecated" comes from NativeWind's runtime,
    `react-native-css-interop`, which sets up `className` for it on load. "Writing to `value` during component render"
    and part of "Dependencies should only be used on the web" come from NativeWind's `animate-pulse`, which
    `SkeletonItem` used. The rest of the "Dependencies" warnings come from `react-native-collapsible-tab-view` 8.0.1 on
    Profile and Explore. One "Reading from `value` during component render" comes from a component inside a `forwardRef`
    that the stack doesn't name.

### Checked and fine

- All 38 unsafe list reads are guarded or read fixed lists.
- A bad id in a link gives the error screen.
- The backend fills in fallbacks for the movie details fields: poster, credits, certification, colour and trailer key.
- Sign-in, both OTP forms, delete account, share, tickets, where to watch and taste submit all handle their own errors.

### Not checked

- The app's response types against the backend, apart from movie details.
- Inside these parts: filter rows, search result rows, the taste poster deck, the bottom bar, the tour and the bottom
  sheet.
