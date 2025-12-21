import { MultiSearchResults } from "@/features/search/data/models/search-result";
import { SearchResult } from "@/features/search/elements/result/search-result";
import { View, Text } from "react-native";
import { SkeletonItem } from "@/features/common/skeleton-item";
import { FlashList } from "@shopify/flash-list";
import { useMainScreenContentStyle } from "@/features/common/hooks/useMainScreenContentStyle";

type Props = {
  debouncedQuery: string;
  hasEnteredInput: boolean;
  data: MultiSearchResults[] | undefined;
  isLoading: boolean;
};

export const SearchResultList = ({
  debouncedQuery,
  hasEnteredInput,
  data,
  isLoading,
}: Props) => {
  const contentStyle = useMainScreenContentStyle();
  return (
    <View className={"flex flex-1"}>
      <FlashList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <SearchResult item={item} />}
        className={"pt-4"}
        contentContainerStyle={{
          paddingBottom: contentStyle.paddingBottom,
        }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          debouncedQuery && !isLoading ? (
            <EmptyState />
          ) : isLoading || hasEnteredInput ? (
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
      <SkeletonItem className={"h-20"} />
      <SkeletonItem className={"h-20"} />
      <SkeletonItem className={"h-20"} />
      <SkeletonItem className={"h-20"} />
    </View>
  );
};

const EmptyState = () => {
  return (
    <View className={"flex w-full flex-1 flex-col items-center justify-center"}>
      <Text className={"body-b1 text-neutral-10-default"}>No results</Text>
    </View>
  );
};
