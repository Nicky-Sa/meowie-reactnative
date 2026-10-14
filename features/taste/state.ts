import {
  SaveTasteReqDto,
  TitleRatings,
} from "@/features/taste/data/dto/taste.dto";

// Held in memory across the steps and sent whole when saving.
export type TasteJourneyState = SaveTasteReqDto;

export const initialTasteJourneyState = (): TasteJourneyState => ({
  movieRatings: {},
  seriesRatings: {},
  avoid: [],
});

// "Haven't seen it" says nothing about their taste, so it doesn't count.
export const countOpinions = (ratings: TitleRatings) =>
  Object.values(ratings).filter((answer) => answer !== "not-seen").length;

// The movies step needs likes, not just answers: the feed builds out from liked
// titles, so dislikes give it nowhere to start. The backend rejects the rest.
export const countLikes = (ratings: TitleRatings) =>
  Object.values(ratings).filter((answer) => answer === "like").length;
