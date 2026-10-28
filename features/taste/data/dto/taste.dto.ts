export type TitleAnswer = "like" | "dislike" | "not-seen";

// TMDB id → what the user said about it in the poster deck.
export type TitleRatings = Record<number, TitleAnswer>;

export type SubmitTasteReqDto = {
  movieRatings: TitleRatings;
  seriesRatings: TitleRatings;
  avoid: string[];
};

export type SubmitTasteResDto = {
  successful: boolean;
};
