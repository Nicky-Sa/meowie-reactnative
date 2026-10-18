import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Platform, RefreshControl } from "react-native";
import { SharedValue } from "react-native-reanimated";
import { MediaType } from "@/features/common/data/models/media-type";
import { useMainScreenContentStyle } from "@/features/common/hooks/use-main-screen-content-style";
import { usePullToRefresh } from "@/features/common/hooks/list/use-pull-to-refresh";
import { useListRef } from "@/features/common/hooks/list/use-list-ref";
import { PosterInfo } from "@/features/common/data/models/poster";
import { RefreshIndicator } from "@/features/common/ui/refresh-indicator";
import { PostersList } from "@/features/common/posters/posters-list";
import { useFetchPosters } from "@/features/common/posters/use-fetch-posters";
import { ExploreTabResDto } from "@/features/explore/data/dto/explore-tab.dto";
import { EmptyState } from "@/features/general/empty-state";
import { TabChildProps } from "@/features/common/tab/tab-bar";
import { tailwind } from "@/lib/tailwind";

type Props = TabChildProps & {
  mediaType: MediaType;
  tab: ExploreTabResDto;
  scrollY: SharedValue<number>;
  isDragging: SharedValue<boolean>;
  headerHeight: number;
};

export const ExplorePosters = ({
  mediaType,
  tab,
  scrollHandler,
  scrollY,
  isDragging,
  headerHeight,
}: Props) => {
  const endpoint =
    `/explore/${mediaType}/tabs/${encodeURIComponent(tab.slug)}` as const;
  const posterData = useFetchPosters(endpoint);
  const { onRefresh, isRefreshing } = posterData;
  const { isReadyToRefresh } = usePullToRefresh({
    scrollY,
    isDragging,
    onRefresh,
    isRefreshing,
    isActive: true,
  });
  const listRef = useListRef<PosterInfo>();
  const { paddingBottom } = useMainScreenContentStyle();
  const router = useRouter();

  const onPosterPress = useCallback(
    (index: number) => {
      router.push({
        pathname: "/discover/media-list",
        params: { title: tab.title, endpoint, initialIndex: index },
      });
    },
    [endpoint, router, tab.title],
  );

  return (
    <>
      <PostersList
        numColumns={3}
        posterData={posterData}
        listRef={listRef}
        onPosterPress={onPosterPress}
        ListEmptyComponent={posterData.hasNextPage ? undefined : <EmptyState />}
        scrollHandler={scrollHandler}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={{
          paddingTop: headerHeight + Number(tailwind.theme.spacing["2"]),
          paddingBottom,
        }}
        // A refresh can bring back the same titles in a new order, and following one of them jumps the list
        maintainVisibleContentPosition={{ disabled: true }}
        refreshControl={
          // hiding Android's default loading indicator
          Platform.OS === "android" ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={["transparent"]}
              progressBackgroundColor="transparent"
            />
          ) : undefined
        }
      />
      {(isReadyToRefresh || isRefreshing) && (
        <RefreshIndicator top={headerHeight} />
      )}
    </>
  );
};
