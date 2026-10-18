import { useFetchCollections } from "./use-fetch-collections";
import { CollectionCard } from "./collection-card";
import { memo, useCallback, useMemo } from "react";
import { CollectionListSkeleton } from "@/features/explore/collections/collection-list-skeleton";
import { FlashList } from "@shopify/flash-list";
import { ScrollViewProps, StyleProp, View, ViewStyle } from "react-native";
import { CollectionResDto } from "@/features/explore/collections/collection.dto";
import { MediaType } from "@/features/common/data/models/media-type";
import { ErrorState } from "@/features/general/error-state";
import { EmptyState } from "@/features/general/empty-state";
import Animated, { ScrollHandlerProcessed } from "react-native-reanimated";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList<CollectionResDto>,
);

type Props = {
  parentId?: number;
  mediaType?: MediaType;
  scrollHandler?: ScrollHandlerProcessed;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentInsetAdjustmentBehavior?: ScrollViewProps["contentInsetAdjustmentBehavior"];
};

export const CollectionsList = memo(
  ({
    parentId,
    mediaType,
    scrollHandler,
    contentContainerStyle,
    contentInsetAdjustmentBehavior = "automatic",
  }: Props) => {
    const {
      data: collections,
      isLoading,
      error,
      refetch,
    } = useFetchCollections(parentId);
    const data = useMemo(
      () =>
        mediaType
          ? collections?.filter(
              (collection) =>
                collection.mediaType === mediaType ||
                collection.mediaType === "mixed",
            )
          : collections,
      [collections, mediaType],
    );

    const renderItem = useCallback(({ item }: { item: CollectionResDto }) => {
      return <CollectionCard collection={item} />;
    }, []);

    return (
      <View className={"flex flex-1"}>
        <AnimatedFlashList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerClassName={"grow"}
          contentContainerStyle={contentContainerStyle}
          contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View className="h-4" />}
          ListEmptyComponent={
            error ? (
              <ErrorState error={error} tryAgain={refetch} />
            ) : isLoading ? (
              <CollectionListSkeleton />
            ) : (
              <EmptyState />
            )
          }
        />
      </View>
    );
  },
);

CollectionsList.displayName = "CollectionsList";
