import { MultiSearchResults } from "@/features/search/data/models/search-result";
import { SearchResultCard } from "@/features/search/elements/card";
import { View, Platform } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { FlashList } from "@shopify/flash-list";
import { ErrorState } from "@/features/general/error-state";
import { SearchEmptyState } from "@/features/search/elements/empty-state";
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
  const renderItem = useCallback(
    ({ item }: { item: MultiSearchResults }) => (
      <SearchResultCard item={item} />
    ),
    [],
  );

  return (
    <View className={"flex flex-1"}>
      <FlashList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerClassName={"grow pt-4"}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="always"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          error || (!isLoading && debouncedQuery) ? (
            <View className="mt-32">
              {error ? (
                <ErrorState tryAgain={refetch} error={error} />
              ) : (
                <SearchEmptyState />
              )}
            </View>
          ) : isLoading ? (
            <SearchResultSkeleton />
          ) : null
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
