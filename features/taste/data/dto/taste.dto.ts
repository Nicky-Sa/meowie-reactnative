import { GenreId } from "@/features/taste/data/dto/journey.dto";

// Resolved server-side from the stored profile. PRESENTATION ONLY — never
// feeds the recommendation taste vector.
export type ResolvedPersonality = {
  name: string;
  source: string;
  description: string;
  rarityPercent: number;
  isOmnivore: boolean;
  // Movie poster of the character's source title, used as the reveal card
  // backdrop. Empty for the omnivore (no single source).
  poster: string;
  flair: string;
};

export type SaveTasteReqDto = {
  movieIds: number[];
  seriesIds: number[];
  seriesSkipped: boolean;
  genreIds: GenreId[];
  era: string;
  reality: string;
  tasteAuthority: string;
  commitment: string;
  avoid: string[];
  exploreLevel: number;
};

export type TasteResDto = SaveTasteReqDto & {
  personality: ResolvedPersonality;
};
