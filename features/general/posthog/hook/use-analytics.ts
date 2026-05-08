import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import {
  MovieFilters,
  ID,
  SeriesFilters,
} from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { CollectionSourceType } from "@/features/explore/collections/collection.dto";
import { CreditInfo } from "@/features/common/data/models/credit";
import { useMemo } from "react";

/**
 * Unified analytics hook for tracking PostHog events.
 * Organizes events into logical domains (media, discovery, auth, interaction, people).
 */
export const useAnalytics = () => {
  const { capture } = useCaptureEvent();

  return useMemo(
    () => ({
      /**
       * Media-related tracking (movies, series, trailers, ratings)
       */
      media: {
        trackView: ({
          mediaId,
          mediaType,
          durationMs,
        }: {
          mediaId: ID;
          mediaType: MediaType;
          durationMs: number;
        }): void =>
          capture("media_details_viewed", {
            media_id: mediaId,
            media_type: mediaType,
            duration_ms: durationMs,
          }),

        trackClick: ({
          mediaId,
          mediaType,
        }: {
          mediaId: ID;
          mediaType: MediaType;
        }): void =>
          capture("poster_clicked", {
            media_id: mediaId,
            media_type: mediaType,
          }),

        trackLongPress: ({
          mediaId,
          mediaType,
        }: {
          mediaId: ID;
          mediaType: MediaType;
        }): void =>
          capture("poster_long_pressed", {
            media_id: mediaId,
            media_type: mediaType,
          }),

        trackExpand: ({
          mediaId,
          mediaType,
          mediaTitle,
        }: {
          mediaId: ID;
          mediaType: MediaType;
          mediaTitle: string;
        }): void =>
          capture("poster_expanded", {
            media_id: mediaId,
            media_type: mediaType,
            media_title: mediaTitle,
          }),

        trackSave: (media: {
          id: ID;
          type: MediaType;
          title: string;
          genres: string[];
        }): void =>
          capture("media_save_clicked", {
            media_id: media.id,
            media_type: media.type,
            media_title: media.title,
            genres: media.genres,
          }),

        trackUnsave: (media: {
          id: ID;
          type: MediaType;
          title: string;
          genres: string[];
        }): void =>
          capture("media_unsave_clicked", {
            media_id: media.id,
            media_type: media.type,
            media_title: media.title,
            genres: media.genres,
          }),

        trackSeen: (media: {
          id: ID;
          type: MediaType;
          title: string;
          genres: string[];
        }): void =>
          capture("media_seen_clicked", {
            media_id: media.id,
            media_type: media.type,
            media_title: media.title,
            genres: media.genres,
          }),

        trackUnseen: (media: {
          id: ID;
          type: MediaType;
          title: string;
          genres: string[];
        }): void =>
          capture("media_unseen_clicked", {
            media_id: media.id,
            media_type: media.type,
            media_title: media.title,
            genres: media.genres,
          }),

        trackRated: ({
          media,
          rating,
          isFirstTime,
        }: {
          media: { id: ID; type: MediaType; title: string; genres: string[] };
          rating: number | null;
          isFirstTime: boolean;
        }): void =>
          capture("media_rated", {
            media_id: media.id,
            media_type: media.type,
            media_title: media.title,
            genres: media.genres,
            rating,
            is_first_time_rating: isFirstTime,
          }),

        trackRatingSkipped: (media: {
          id: ID;
          type: MediaType;
          title: string;
          genres: string[];
        }): void =>
          capture("media_rating_skipped", {
            media_id: media.id,
            media_type: media.type,
            media_title: media.title,
            genres: media.genres,
          }),

        trackTrailerPlayed: ({
          media,
          autoplay,
        }: {
          media: { id: ID; type: MediaType; title: string };
          autoplay: boolean;
        }): void =>
          capture("trailer_played", {
            media_id: media.id,
            media_type: media.type,
            media_title: media.title,
            autoplay,
          }),

        trackTrailerPaused: (media: {
          id: ID;
          type: MediaType;
          title: string;
        }): void =>
          capture("trailer_paused", {
            media_id: media.id,
            media_type: media.type,
            media_title: media.title,
          }),

        trackWatchProvidersClicked: ({
          mediaId,
          mediaType,
        }: {
          mediaId: ID;
          mediaType: MediaType;
        }): void =>
          capture("watch_providers_clicked", {
            media_id: mediaId,
            media_type: mediaType,
          }),

        trackTicketsClicked: ({
          mediaId,
          mediaType,
        }: {
          mediaId: ID;
          mediaType: MediaType;
        }): void =>
          capture("tickets_clicked", {
            media_id: mediaId,
            media_type: mediaType,
          }),

        trackSeeMoreRecommendations: ({
          mediaId,
          mediaType,
        }: {
          mediaId: ID;
          mediaType: MediaType;
        }): void =>
          capture("recommendations_see_more_clicked", {
            media_id: mediaId,
            media_type: mediaType,
          }),
      },

      /**
       * Discovery and Search tracking
       */
      discovery: {
        trackSearch: ({ query }: { query: string }): void =>
          capture("search_submitted", { query }),

        trackFiltersOpened: (): void => capture("filters_opened", undefined),

        trackFiltersApplied: ({
          filters,
          mediaType,
        }: {
          filters: MovieFilters | SeriesFilters;
          mediaType: string;
        }): void => capture("filters_applied", { filters, mediaType }),

        trackSortOpened: (): void => capture("sort_opened", undefined),

        trackSortApplied: ({ sortType }: { sortType: string }): void =>
          capture("sort_applied", { sort_type: sortType }),

        trackCollectionClick: ({
          id,
          title,
          sourceType,
        }: {
          id: number;
          title: string;
          sourceType: CollectionSourceType;
        }): void => capture("collection_clicked", { id, title, sourceType }),

        trackGenreClick: ({
          genreId,
          genreName,
          mediaType,
        }: {
          genreId: ID;
          genreName: string;
          mediaType: MediaType;
        }): void =>
          capture("genre_clicked", {
            genre_id: genreId,
            genre_name: genreName,
            media_type: mediaType,
          }),
      },

      /**
       * People/Person related tracking
       */
      people: {
        trackClick: ({ person }: { person: CreditInfo }): void =>
          capture("person_clicked", {
            person_id: person.id,
            person_name: person.name,
            role: person.role === "Director" ? "director" : "cast",
          }),
      },

      /**
       * Authentication and User related tracking
       */
      auth: {
        trackLogin: ({ isNewUser }: { isNewUser: boolean }): void =>
          capture("login_completed", { is_new_user: isNewUser }),

        trackLogout: (): void => capture("logout", undefined),

        trackAccountDeleted: ({
          churnReasonId,
        }: {
          churnReasonId?: string;
        }): void =>
          capture("account_deleted", { churn_reason_id: churnReasonId }),

        trackOtpRequested: (): void => capture("otp_requested", undefined),

        trackAuthSkipped: (): void => capture("auth_skipped", undefined),
      },

      /**
       * UI, Navigation, and Settings tracking
       */
      interaction: {
        trackNavigation: ({ destination }: { destination: string }): void =>
          capture("navigation_clicked", { destination }),

        trackProfileTabChange: ({ tabName }: { tabName: string }): void =>
          capture("profile_tab_changed", { tab_name: tabName }),

        trackProfileSavedTabClick: (): void =>
          capture("profile_saved_tab_clicked", undefined),

        trackProfileSeenTabClick: (): void =>
          capture("profile_seen_tab_clicked", undefined),

        trackAutoplayToggled: ({ autoplay }: { autoplay: boolean }): void =>
          capture("autoplay_toggled", { autoplay }),

        trackCacheCleared: (): void => capture("cache_cleared", undefined),
      },
    }),
    [capture],
  );
};
