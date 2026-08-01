// The cat the backend picked from the saved profile. PRESENTATION ONLY — never
// feeds the recommendation taste vector. `image` is the finished share card:
// the name, tagline, description and rarity are drawn into the picture, so the
// app only shows the picture. `name` is for the share message.
export type Personality = {
  name: string;
  image: string;
};

export type TitleAnswer = "like" | "dislike" | "not-seen";

// TMDB id → what the user said about it in the poster deck.
export type TitleRatings = Record<number, TitleAnswer>;

export type SaveTasteReqDto = {
  movieRatings: TitleRatings;
  seriesRatings: TitleRatings;
  era: string;
  authority: string;
  avoid: string[];
  exploreLevel: number;
};

// The cat is all that comes back. The answers stay on the server: the journey
// always starts blank and the feed reads them there.
export type TasteResDto = {
  personality: Personality;
};
