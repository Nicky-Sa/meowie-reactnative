import {
  SaveTasteReqDto,
  TitleAnswer,
  TitleRatings,
} from "@/features/taste/data/dto/taste.dto";

export type TasteState = {
  answers: SaveTasteReqDto;
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
