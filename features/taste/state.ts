import {
  SubmitTasteReqDto,
  TitleAnswer,
  TitleRatings,
} from "@/features/taste/data/dto/taste.dto";
import { Title } from "@/features/taste/data/dto/journey.dto";

export type TasteState = {
  answers: SubmitTasteReqDto;
  completed: boolean;
};

export const initialTasteState = (): TasteState => ({
  answers: {
    movieRatings: {},
    seriesRatings: {},
    avoid: [],
  },
  completed: false,
});

// "Haven't seen it" says nothing about their taste, so it doesn't count.
export const countOpinions = (ratings: TitleRatings) =>
  Object.values(ratings).filter((answer) => answer !== "not-seen").length;

export const countAnswer = (
  ratings: TitleRatings,
  answerToCount: TitleAnswer,
) => Object.values(ratings).filter((answer) => answer === answerToCount).length;

// Opens just past the furthest answer, so skipped cards stay behind the user.
export const startIndexForDeck = (items: Title[], ratings: TitleRatings) => {
  const lastAnswered = items.findLastIndex((item) => item.tmdbId in ratings);
  return Math.min(lastAnswered + 1, items.length - 1);
};
