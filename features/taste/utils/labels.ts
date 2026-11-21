import { PickTitle } from "@/features/taste/data/dto/journey.dto";

export const continueLabel = (pickCount: number, minPicks: number) => {
  if (pickCount === 0) return `Pick ${minPicks} to continue`;
  if (pickCount < minPicks) return `Continue (${pickCount}/${minPicks})`;
  return `Continue (${pickCount} picked)`;
};

export const posterSubtitle = ({ mediaType, year }: PickTitle) => {
  switch (mediaType) {
    case "movie":
      return `${year}`;
    case "series":
      return `Series · ${year}`;
  }
};
