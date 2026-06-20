import { MultiSearchResults } from "@/features/search/data/models/search-result";
import { SearchResultCard } from "@/features/search/elements/card";
import { View } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { FlashList } from "@shopify/flash-list";
import { ErrorState } from "@/features/general/error-state";
import { SearchEmptyState } from "@/features/search/elements/empty-state";
import { RecentSearches } from "@/features/search/elements/recent-searches";
import { useRecentSearches } from "@/features/search/data/use-recent-searches";
import { useCallback } from "react";

type Props = {
  debouncedQuery: string;
  data: MultiSearchResults[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

export const SearchResultList = ({
  debouncedQuery,
  data,
  isLoading,
  error,
  refetch,
}: Props) => {
  const { add } = useRecentSearches();

  const renderItem = useCallback(
    ({ item }: { item: MultiSearchResults }) => (
      <SearchResultCard item={item} onPress={() => add(item)} />
    ),
    [add],
  );

  // Empty query → show recent searches instead of results.
  const listData = debouncedQuery ? data : undefined;

  return (
    <View className={"flex flex-1"}>
      <FlashList
        data={listData}
        keyExtractor={(item) => `${item.mediaType}-${item.id}`}
        renderItem={renderItem}
        contentContainerClassName={"grow pt-4"}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          error ? (
            <View className="mt-32">
              <ErrorState tryAgain={refetch} error={error} />
            </View>
          ) : isLoading ? (
            <SearchResultSkeleton />
          ) : !debouncedQuery ? (
            <RecentSearches />
          ) : (
            <View className="mt-32">
              <SearchEmptyState />
            </View>
          )
        }
      />
    </View>
  );
};

const SearchResultSkeleton = () => {
  return (
    <View className={"flex w-full flex-1 flex-col gap-4"}>
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonItem key={index} className={"h-20"} />
      ))}
    </View>
  );
};
