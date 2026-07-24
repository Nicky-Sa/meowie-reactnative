import { GenreId } from "@/features/taste/data/dto/journey.dto";

// The cat the backend picked from the saved profile. PRESENTATION ONLY — never
// feeds the recommendation taste vector. `image` is the finished share card:
// the name, tagline, description and rarity are drawn into the picture, so the
// app only shows the picture. `name` is for the share message.
export type Personality = {
  name: string;
  image: string;
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
  personality: Personality;
};
