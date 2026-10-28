import { WEBSITE_URL } from "@/lib/consts";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";

export type ShareTrigger = "button" | "screenshot";

export const getShareLink = (mediaType: MediaType, id: ID) =>
  `${WEBSITE_URL}/${mediaType}/${id}`;

const SHARED_MEDIA_LINK =
  /^(?:https:\/\/meowie\.app)?\/(movie|series)\/(\d+)\/?(?:[?#].*)?$/;

/** Reads a shared link like `https://meowie.app/movie/155` and gives back its media and matching details screen. */
export const getSharedMediaFromLink = (link: string) => {
  const match = link.match(SHARED_MEDIA_LINK);
  if (!match) {
    return null;
  }
  const [, mediaType, id] = match;
  switch (mediaType) {
    case "movie":
      return {
        mediaType: "movie" as const,
        id,
        detailsPath: `/movie/${id}/details` as const,
      };
    case "series":
      return {
        mediaType: "series" as const,
        id,
        detailsPath: `/series/${id}/details` as const,
      };
    default:
      return null;
  }
};
