import { MultiSearchResults } from "@/features/search/data/models/search-result";
import { SearchResultCard } from "@/features/search/elements/card";
import { View, Text, Platform } from "react-native";
import { SkeletonItem } from "@/features/common/ui/skeleton-item";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NoMatchSearch from "@/assets/images/errors/no-match-search.svg";
import { ErrorState } from "@/features/general/error-state";

type Props = {
  debouncedQuery: string;
  data: MultiSearchResults[] | undefined;
  isLoading: boolean;
  error: Error | undefined;
  mutate: () => void;
};

export const SearchResultList = ({
  debouncedQuery,
  data,
  isLoading,
  error,
  mutate,
}: Props) => {
  // If I use SafeAreaView, it won't feel like a full screen list and it will add margins
  const { bottom } = useSafeAreaInsets();

  return (
    <View className={"flex flex-1"}>
      <FlashList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <SearchResultCard item={item} />}
        contentContainerClassName={"grow pt-4"}
        contentContainerStyle={{
          paddingBottom: bottom,
        }}
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          error ? (
            <ErrorState tryAgain={mutate} error={error} />
          ) : debouncedQuery && !isLoading ? (
            <EmptyState />
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

const EmptyState = () => {
  return (
    <View className={"flex-1 flex-col items-center justify-center gap-8"}>
      <NoMatchSearch />
      <Text className={"body-b1 text-center text-neutral-5-default"}>
        Nothing matched your input! {"\n"}
        Please try something else.
      </Text>
    </View>
  );
};
