import { ID } from "@/features/common/data/media-query";
import { SeriesDetailsB } from "@/features/media/series/series-details-b";
import { SeriesDetailsA } from "@/features/media/series/series-details-a";
import { useFeatureFlag } from "@/features/general/posthog/hook/use-feature-flag";
import { useTrackTimeSpent } from "@/features/general/posthog/hook/use-track-time-spent";

type Props = {
  seriesId: ID;
  inScreen: boolean;
};

export const SeriesDetails = ({ seriesId, inScreen }: Props) => {
  const layoutVariant = useFeatureFlag("details-layout");

  // Track time spent on this screen
  useTrackTimeSpent("media_details_viewed", seriesId, "series");

  return layoutVariant === "test" ? (
    <SeriesDetailsB seriesId={seriesId} inScreen={inScreen} />
  ) : (
    // "control" variant or flag not yet loaded — show default layout
    <SeriesDetailsA seriesId={seriesId} inScreen={inScreen} />
  );
};
