import { useCaptureEvent } from "@/features/general/posthog/hook/use-capture-event";
import {
  MovieFilters,
  ID,
  SeriesFilters,
} from "@/features/common/data/media-query";
import { MediaType } from "@/features/common/data/models/media-type";
import { CollectionSourceType } from "@/features/explore/collections/collection.dto";
import { CreditInfo } from "@/features/common/data/models/credit";
import { ShareTrigger } from "@/features/media/data/share-links";
import { useMemo } from "react";

/**
 * Unified analytics hook for tracking PostHog events.
 * Organizes events into logical domains (media, explore, filters, search, auth, interaction, profile, settings, taste).
 */
export const useAnalytics = () => {
  const { capture } = useCaptureEvent();

  return useMemo(
    () => ({
      /**
       * Media-related tracking (movies, series, trailers, ratings)
       */
      media: {
        trackTimeOnCard: ({
          mediaId,
          mediaType,
          timeOnCardSeconds,
        }: {
          mediaId: ID;
          mediaType: MediaType;
          timeOnCardSeconds: number;
        }): void =>
          capture("media_card_time_spent", {
            media_id: mediaId,
            media_type: mediaType,
            time_on_card_seconds: timeOnCardSeconds,
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

        trackMediaDetailsClick: ({
          mediaId,
          mediaType,
        }: {
          mediaId: ID;
          mediaType: MediaType;
        }): void =>
          capture("media_details_clicked", {
            media_id: mediaId,
            media_type: mediaType,
          }),

        trackShare: ({
          mediaId,
          mediaType,
          trigger,
        }: {
          mediaId: ID;
          mediaType: MediaType;
          trigger: ShareTrigger;
        }): void =>
          capture("media_shared", {
            media_id: mediaId,
            media_type: mediaType,
            trigger,
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
          hasProviders,
        }: {
          mediaId: ID;
          mediaType: MediaType;
          hasProviders: boolean;
        }): void =>
          capture("watch_providers_clicked", {
            media_id: mediaId,
            media_type: mediaType,
            has_providers: hasProviders,
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

        trackFeedRefreshed: ({ mediaType }: { mediaType: MediaType }): void =>
          capture("feed_refreshed", { media_type: mediaType }),

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

        trackPersonClick: ({ person }: { person: CreditInfo }): void =>
          capture("person_clicked", {
            person_id: person.id,
            person_name: person.name,
            role: person.role,
            job: person.job,
          }),
      },

      /**
       * Explore screen tabs and collections
       */
      explore: {
        trackCollectionClick: ({
          id,
          title,
          sourceType,
        }: {
          id: number;
          title: string;
          sourceType: CollectionSourceType;
        }): void =>
          capture("collection_clicked", {
            id,
            title,
            source_type: sourceType,
          }),

        trackTabChanged: ({
          tabSlug,
          mediaType,
        }: {
          tabSlug: string;
          mediaType: MediaType;
        }): void =>
          capture("explore_tab_changed", {
            tab_slug: tabSlug,
            media_type: mediaType,
          }),

        trackRefreshed: ({
          tabSlug,
          mediaType,
        }: {
          tabSlug: string;
          mediaType: MediaType;
        }): void =>
          capture("explore_refreshed", {
            tab_slug: tabSlug,
            media_type: mediaType,
          }),
      },

      /**
       * Filters screen
       */
      filters: {
        trackFiltersOpened: (): void => capture("filters_opened"),

        trackFiltersApplied: ({
          filters,
          mediaType,
        }: {
          filters: MovieFilters | SeriesFilters;
          mediaType: MediaType;
        }): void =>
          capture("filters_applied", { filters, media_type: mediaType }),
      },

      /**
       * Search screen
       */
      search: {
        trackSearch: ({ query }: { query: string }): void =>
          capture("search_submitted", { query }),
      },

      /**
       * Authentication and User related tracking
       */
      auth: {
        trackLogin: ({ isNewUser }: { isNewUser: boolean }): void =>
          capture("login_completed", { is_new_user: isNewUser }),

        trackLogout: (): void => capture("logout"),

        trackAccountDeleted: ({
          churnReasonId,
        }: {
          churnReasonId?: string;
        }): void =>
          capture("account_deleted", { churn_reason_id: churnReasonId }),

        trackOtpRequested: (): void => capture("otp_requested"),

        trackAuthSkipped: (): void => capture("auth_skipped"),
      },

      /**
       * UI and Navigation tracking
       */
      interaction: {
        trackNavigation: ({ destination }: { destination: string }): void =>
          capture("navigation_clicked", { destination }),

        trackReleaseNotesOpened: ({
          hasNewNote,
        }: {
          hasNewNote: boolean;
        }): void =>
          capture("release_notes_opened", { has_new_note: hasNewNote }),
      },

      /**
       * Profile screen tabs
       */
      profile: {
        trackTabChanged: ({ tabName }: { tabName: string }): void =>
          capture("profile_tab_changed", { tab_name: tabName }),
      },

      /**
       * Settings screen
       */
      settings: {
        trackAutoplayToggled: ({ autoplay }: { autoplay: boolean }): void =>
          capture("autoplay_toggled", { autoplay }),

        trackCacheCleared: (): void => capture("cache_cleared"),
      },

      /**
       * Taste journey and the feed card that leads to it
       */
      taste: {
        trackCardShown: ({ mediaType }: { mediaType: MediaType }): void =>
          capture("taste_card_shown", { media_type: mediaType }),

        trackCardClicked: ({ mediaType }: { mediaType: MediaType }): void =>
          capture("taste_card_clicked", { media_type: mediaType }),

        trackSkipped: ({
          movieAnswerCount,
        }: {
          movieAnswerCount: number;
        }): void =>
          capture("taste_skipped", { movie_answer_count: movieAnswerCount }),

        trackSaved: (): void => capture("taste_saved"),
      },
    }),
    [capture],
  );
};
