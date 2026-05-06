import { ID } from "@/features/common/data/media-query";
import { SeriesInfoB } from "@/features/media/series/info/series-info-b";
import { SeriesInfoA } from "@/features/media/series/info/series-info-a";
import { useFeatureFlag } from "@/features/general/posthog/hook/use-feature-flag";
import { useTrackTimeSpent } from "@/features/general/posthog/hook/use-track-time-spent";

type Props = {
  seriesId: ID;
  inScreen: boolean;
};

export const SeriesInfo = ({ seriesId, inScreen }: Props) => {
  const layoutVariant = useFeatureFlag("details-layout");

  // Track time spent on this screen
  useTrackTimeSpent(seriesId, "series");

  return layoutVariant === "test" ? (
    <SeriesInfoB seriesId={seriesId} inScreen={inScreen} />
  ) : (
    // "control" variant or flag not yet loaded — show default layout
    <SeriesInfoA seriesId={seriesId} inScreen={inScreen} />
  );
};
