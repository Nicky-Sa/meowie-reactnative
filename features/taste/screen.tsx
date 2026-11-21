import { useCallback } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { InnerScreen } from "@/features/common/layout/inner-screen";
import { Button } from "@/features/common/ui/button";
import { EmptyState } from "@/features/general/empty-state";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import {
  GridPoster,
  PostersGrid,
} from "@/features/common/posters/posters-grid";
import { SelectablePoster } from "@/features/common/posters/selectable-poster";
import { useAnalytics } from "@/features/general/posthog/events/use-analytics";
import { useFetchJourney } from "@/features/taste/data/use-fetch-journey";
import { PickTitle } from "@/features/taste/data/dto/journey.dto";
import { usePicks } from "@/features/taste/hooks/use-picks";
import { countPicks, pickKey } from "@/features/taste/state";
import { continueLabel, posterSubtitle } from "@/features/taste/utils/labels";

export const Screen = () => {
  const router = useRouter();
  const { taste } = useAnalytics();
  const { data: journey, isLoading, error, refetch } = useFetchJourney();
  const { picks, isPicked, togglePick } = usePicks();

  const skipTaste = () => {
    taste.trackSkipped({
      moviePickCount: countPicks(picks, "movie"),
      seriesPickCount: countPicks(picks, "series"),
    });
    router.replace("/home");
  };

  const renderPoster = useCallback(
    ({ item }: GridPoster<PickTitle>) => (
      <SelectablePoster
        posterUri={item.poster}
        title={item.title}
        subtitle={posterSubtitle(item)}
        selected={isPicked(item)}
        onPress={() => togglePick(item)}
      />
    ),
    [isPicked, togglePick],
  );

  return (
    <InnerScreen
      title={"Your taste"}
      fullWidth
      rightTopComponent={
        <Button variant={"ghost"} size={"md"} onPress={skipTaste}>
          Skip
        </Button>
      }
    >
      <View className={"flex-1"}>
        <PostersGrid
          data={journey?.titles ?? []}
          keyExtractor={pickKey}
          extraData={picks}
          renderPoster={renderPoster}
          isLoading={isLoading}
          error={error}
          refetch={refetch}
          ListHeaderComponent={
            <View className={"flex flex-col gap-2 px-4 pb-4"}>
              {journey ? (
                <>
                  <Text className={"title-t1-strong text-neutral-10-default"}>
                    {`Pick ${journey.minPicks} or more you like`}
                  </Text>
                  <Text className={"body-b2 text-neutral-5-default"}>
                    Tap to pick the movies or series you enjoyed.
                  </Text>
                </>
              ) : isLoading ? (
                <>
                  <SkeletonItem className={"h-8"} />
                  <SkeletonItem className={"h-5"} />
                </>
              ) : null}
            </View>
          }
          ListEmptyComponent={<EmptyState />}
        />
      </View>

      {!error && (
        <View className={"border-t border-neutral-2-default px-4 pt-3"}>
          <Button
            variant={"primary"}
            size={"lg"}
            disabled={!journey || picks.length < journey.minPicks}
            onPress={() => router.push("/taste/result")}
          >
            {journey
              ? continueLabel(picks.length, journey.minPicks)
              : "Continue"}
          </Button>
        </View>
      )}
    </InnerScreen>
  );
};
