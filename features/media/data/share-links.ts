import { WEBSITE_URL } from "@/lib/consts";
import { ID } from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";

export const getShareLink = (mediaType: MediaType, id: ID) =>
  `${WEBSITE_URL}/${mediaType}/${id}`;

const SHARED_MEDIA_LINK =
  /^(?:https:\/\/meowie\.app)?\/(movie|series)\/(\d+)\/?(?:[?#].*)?$/;

/** Turns a shared link like `https://meowie.app/movie/155` into the matching details screen. */
export const getDetailsPathFromLink = (link: string) => {
  const match = link.match(SHARED_MEDIA_LINK);
  if (!match) {
    return null;
  }
  const [, mediaType, id] = match;
  return mediaType === "movie"
    ? (`/movie/${id}/details` as const)
    : (`/series/${id}/details` as const);
};
