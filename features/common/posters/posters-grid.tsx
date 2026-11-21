import { Ref, ReactElement, RefObject } from "react";
import { ScrollViewProps, StyleProp, View, ViewStyle } from "react-native";
import Animated, { ScrollHandlerProcessed } from "react-native-reanimated";
import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list";
import { ErrorState } from "@/features/general/error-state";
import { PostersSkeletons } from "@/features/common/posters/poster-skeletons";
import { DEFAULT_NUM_COLUMNS } from "@/features/common/posters/posters.constants";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export type GridPoster<Item> = {
  item: Item;
  index: number;
};

type Props<Item> = {
  data: Item[];
  numColumns?: number;
  keyExtractor: (item: Item) => string;
  renderPoster: (poster: GridPoster<Item>) => ReactElement;
  // Anything outside `data` that the posters show, like which ones are selected.
  extraData?: unknown;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  onEndReached?: () => void;
  scrollHandler?: ScrollHandlerProcessed;
  listRef?: RefObject<FlashListRef<Item> | null>;
  ListHeaderComponent?: ReactElement;
  ListEmptyComponent?: ReactElement;
  ListFooterComponent?: ReactElement | null;
  contentContainerStyle?: StyleProp<ViewStyle>;
  contentInsetAdjustmentBehavior?: ScrollViewProps["contentInsetAdjustmentBehavior"];
  refreshControl?: ScrollViewProps["refreshControl"];
  maintainVisibleContentPosition?: FlashListProps<Item>["maintainVisibleContentPosition"];
};

export const PostersGrid = <Item,>({
  data,
  numColumns = DEFAULT_NUM_COLUMNS,
  keyExtractor,
  renderPoster,
  extraData,
  isLoading,
  error,
  refetch,
  onEndReached,
  scrollHandler,
  listRef,
  ListHeaderComponent,
  ListEmptyComponent,
  ListFooterComponent,
  contentContainerStyle,
  contentInsetAdjustmentBehavior = "automatic",
  refreshControl,
  maintainVisibleContentPosition,
}: Props<Item>) => {
  const listProps: FlashListProps<Item> = {
    data,
    numColumns,
    keyExtractor,
    extraData,
    renderItem: ({ item, index }) => (
      <View className={"px-1"}>{renderPoster({ item, index })}</View>
    ),
    onEndReached,
    onEndReachedThreshold: 0.5,
    showsVerticalScrollIndicator: false,
    contentInsetAdjustmentBehavior,
    refreshControl,
    maintainVisibleContentPosition,
    contentContainerStyle,
    ItemSeparatorComponent: () => <View className={"h-2"} />,
    ListHeaderComponent,
    ListFooterComponent,
    ListEmptyComponent: error ? (
      <ErrorState tryAgain={refetch} error={error} />
    ) : isLoading ? (
      <PostersSkeletons numColumns={numColumns} />
    ) : (
      ListEmptyComponent
    ),
  };

  // createAnimatedComponent drops FlashList's item type, so the props and ref are typed for Item above.
  const typedForAnimatedList = {
    ...listProps,
    ref: listRef,
  } as FlashListProps<unknown> & {
    ref?: Ref<FlashListRef<unknown>>;
  };

  return (
    <AnimatedFlashList
      {...typedForAnimatedList}
      contentContainerClassName={"grow px-1"}
      onScroll={scrollHandler}
    />
  );
};
